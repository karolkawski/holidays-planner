/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { server as WebSocketServer } from 'websocket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const connections: any[] = [];

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const wsServer = new WebSocketServer({
    httpServer,
    autoAcceptConnections: false,
  });

  wsServer.on('request', (request) => {
    const { url } = request.httpRequest;

    if (url !== '/progress') {
      console.log(`Connection WebSocket ignore: ${url}`);
      return;
    }

    const connection = request.accept(undefined, request.origin);
    console.log('New connection WebSocket on:', url);
    connections.push(connection);

    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        console.log('Message income:', message.utf8Data);
        connection.sendUTF(`Echo: ${message.utf8Data}`);
      }
    });

    connection.on('close', () => {
      console.log('Connection closed');
      const index = connections.indexOf(connection);
      if (index !== -1) {
        connections.splice(index, 1);
      }
    });

    const sendLogs = () => {
      if (connection.connected) {
        const log = { log: `Server log: ${new Date().toISOString()}`, level: 'info' };
        connection.sendUTF(JSON.stringify(log));
      }
    };

    sendLogs();
  });

  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  let isLogging = false;

  console.info = (...args: any[]) => {
    if (isLogging) return;
    const logMessage = args.join(' ');

    if (logMessage.includes('[Scraper]')) {
      handleLog(logMessage, 'info');
    }

    originalInfo(...args);
  };

  console.warn = (...args: any[]) => {
    if (isLogging) return;
    const logMessage = args.join(' ');

    if (logMessage.includes('[Scraper]')) {
      handleLog(logMessage, 'warn');
    }

    originalWarn(...args);
  };

  console.error = (...args: any[]) => {
    if (isLogging) return;
    const logMessage = args.join(' ');

    if (logMessage.includes('[Scraper]')) {
      handleLog(logMessage, 'error');
    }

    originalError(...args);
  };

  const handleLog = (logMessage: string, level: 'info' | 'warn' | 'error') => {
    const levels = ['info', 'warn', 'error'];
    if (levels.includes(level)) {
      isLogging = true;
      connections.forEach((conn) => {
        if (conn.connected) {
          const { cleanedString, url } = extractUrl(logMessage, level);
          conn.sendUTF(JSON.stringify({ log: `${cleanedString}`, url, level }));
        }
      });
      isLogging = false;
    }
  };

  httpServer.listen(3000, () => {
    console.log('> Server works on http://localhost:3000');
    console.log('> Server WebSocket works on ws://localhost:3000/progress');
  });
});

function extractUrl(str: string, level: 'info' | 'warn' | 'error') {
  const urlRegex = /https?:\/\/[^\s]+/;
  const match = str.match(urlRegex);

  if (match) {
    const url = match[0];
    const cleanedString = level === 'info' ? str : str.replace(urlRegex, '').trim();
    return { cleanedString, url };
  }

  return { cleanedString: str, url: null };
}

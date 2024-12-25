import { Chip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

type Log = { log: string; level: 'info' | 'warn' | 'error'; url?: string };

const colors: Record<Log['level'], string> = {
  info: 'bg-blue-500',
  warn: 'bg-yellow-500',
  error: 'bg-red-500',
};

const LogComponent = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/progress');

    ws.onmessage = (event) => {
      try {
        const newLog: Log = JSON.parse(event.data);
        setLogs((prevLogs) => [newLog, ...prevLogs]);
      } catch {
        console.error('Invalid WebSocket message:', event.data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {logs.length > 0 ? (
        <ul>
          {logs.map((logObj, index) => (
            <li key={index} className="border-b border-white py-2">
              <Chip className={`${colors[logObj.level]} mr-2`}>{logObj.level}</Chip>
              {logObj.log}
              {logObj.url && (
                <a href={logObj.url} className="pl-2 text-blue-400 whitespace-nowrap">
                  Link
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No logs</p>
      )}
    </div>
  );
};

export default LogComponent;

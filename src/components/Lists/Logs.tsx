import {Log} from '@/src/interfaces/ILog';
import {Chip, Link} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';

const colors: Record<Log['level'], string> = {
  info: 'bg-blue-500 text-white',
  warn: 'bg-yellow-500 text-black',
  error: 'bg-red-500 text-white',
};

const Logs = () => {
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
              <Chip
                classNames={{
                  base: `${colors[logObj.level]} border-small border-white/50 mr-2`,
                  content: 'drop-shadow shadow-black text-black',
                }}
                variant="solid"
              >
                {logObj.level}
              </Chip>
              {logObj.log}
              {logObj.url && (
                <Link href={logObj.url} className="p-2 text-blue-400 whitespace-nowrap">
                  Link
                </Link>
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

export default Logs;

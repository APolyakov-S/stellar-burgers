import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from '../store';

type TWebSocketEvent = {
  type: string;
  payload?: unknown;
};

type TUseWebSocketOptions = {
  url: string;
  onMessage: (data: TWebSocketEvent) => void;
  shouldConnect?: boolean;
};

export const useWebSocket = ({
  url,
  onMessage,
  shouldConnect = true
}: TUseWebSocketOptions) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const handleOpen = useCallback(() => {}, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const parsedData = JSON.parse(event.data) as TWebSocketEvent;
      onMessageRef.current(parsedData);
    } catch (err) {
      console.error('Ошибка обработки сообщения WebSocket:', err);
    }
  }, []);

  const handleClose = useCallback(() => {}, []);

  useEffect(() => {
    if (!shouldConnect) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', handleClose);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('close', handleClose);
      socket.close();
    };
  }, [url, shouldConnect, handleOpen, handleMessage, handleClose]);

  return {
    send: useCallback((data: string) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(data);
      }
    }, [])
  };
};

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { getApiUrl } from '@/utils/helpers';
import tokenService from '@/services/TokenService';
import { ISchedule, ScheduleDeletedEvent } from '@/utils/types';
import {
  setAddSchedule,
  setFilterSchedules,
  setUpdateSchedule,
} from '@/store/schedules';
import { setFilterFavorites, setUpdateFavorite } from '@/store/favorites';

const serverUrl = getApiUrl();

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const connectSocket = async () => {
      const token = await tokenService.getToken('accessToken');

      if (!token) return;

      socketRef.current = io(serverUrl, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      socketRef.current.on('schedule_created', (data: ISchedule) => {
        dispatch(setAddSchedule(data));
      });

      socketRef.current.on('schedule_updated', (data: ISchedule) => {
        dispatch(setUpdateSchedule(data));
        dispatch(setUpdateFavorite(data));
      });

      socketRef.current.on('schedule_deleted', (data: ScheduleDeletedEvent) => {
        dispatch(setFilterSchedules(data.id));
        dispatch(setFilterFavorites(data.id));
      });
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [dispatch]);

  const reconnectWithNewToken = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = await tokenService.getToken('accessToken');
    if (token) {
      socketRef.current = io(serverUrl, {
        auth: { token },
        transports: ['websocket'],
      });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    reconnectWithNewToken,
  };
};

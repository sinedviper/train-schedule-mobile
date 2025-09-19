import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { getApiUrl } from '@/utils/helpers';
import { ISchedule, ScheduleDeletedEvent } from '@/utils/types';
import {
  setAddSchedule,
  setFilterSchedules,
  setUpdateSchedule,
} from '@/store/schedules';
import { setFilterFavorites, setUpdateFavorite } from '@/store/favorites';
import { useAppSelector } from '@/hooks/useRedux';
import { getToken } from '@/store/token/select';

const serverUrl = getApiUrl();

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();
  const { access } = useAppSelector(getToken);

  useEffect(() => {
    const connectSocket = async () => {
      if (!access) return;

      socketRef.current = io(serverUrl, {
        auth: { token: access },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.debug('Socket connected');
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.debug('Socket disconnected');
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
  }, [access, dispatch]);

  const reconnectWithNewToken = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    if (access) {
      socketRef.current = io(serverUrl, {
        auth: { token: access },
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

export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString();
};

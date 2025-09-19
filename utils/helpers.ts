import { Platform } from 'react-native';

interface ApiUrls {
  development: {
    physical: string;
    simulator: string;
  };
  production: string;
}

const API_URLS: ApiUrls = {
  development: {
    physical:
      Platform.OS === 'ios'
        ? 'http://localhost:4000'
        : 'http://192.168.0.227:4000',
    simulator:
      Platform.OS === 'ios'
        ? 'http://localhost:4000'
        : 'http://192.168.0.227:4000',
  },
  production: '',
};

export const getApiUrl = (): string => {
  if (__DEV__) {
    const isPhysicalDevice = Platform.OS === 'android' || Platform.OS === 'ios';
    return isPhysicalDevice
      ? API_URLS.development.physical
      : API_URLS.development.simulator;
  }
  return API_URLS.production;
};

import { persistor, store } from '@/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { AppContent } from '@/components/App';

export default function Layout() {
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

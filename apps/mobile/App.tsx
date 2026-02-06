import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AuthGate } from './src/components/AuthGate';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthGate />
      </ThemeProvider>
    </Provider>
  );
}

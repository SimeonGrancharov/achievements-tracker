import { Provider } from 'react-redux';
import { store } from './src/store';
import { AuthGate } from './src/components/AuthGate';

export default function App() {
  return (
    <Provider store={store}>
      <AuthGate />
    </Provider>
  );
}

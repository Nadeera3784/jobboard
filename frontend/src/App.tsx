import { Toaster } from 'sonner';

import { AppRouter } from './router/AppRouter';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster position="top-right" closeButton />
    </AppProvider>
  );
}

export default App;

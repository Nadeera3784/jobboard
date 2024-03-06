import { Toaster } from 'sonner';
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton/>
    </>
  )
}

export default App

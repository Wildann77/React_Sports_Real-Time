import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Providers } from './app/providers';
import { router } from './app/router';

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster 
        theme="dark" 
        richColors={true} 
        position="top-right" 
        toastOptions={{ 
          className: 'font-sans rounded-lg border border-border/80 bg-card text-foreground shadow-lg' 
        }} 
      />
    </Providers>
  );
}

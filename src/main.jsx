import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Toaster} from 'sonner'
import '@fontsource/inter';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <App />
    <Toaster position="top-right" richColors/>
    <ToastContainer
      position="top-right"    
      autoClose={2000}        
      hideProgressBar={false} 
      newestOnTop={true}      
      closeOnClick={true}     
      pauseOnHover={true}     
      draggable={true}        
      pauseOnFocusLoss={true} 
      rtl={false}             
    />
  </Provider>
  </QueryClientProvider>
  
)
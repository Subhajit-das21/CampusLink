import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Points to the theme-aware class in your index.css
        className: 'luminous-toast',
        duration: 3000,
        style: {
          /* Typography & Layout remain constant */
          padding: '16px 24px',
          borderRadius: '24px',
          fontSize: '12px', // Slightly smaller for better balance
          fontWeight: '800',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        success: {
          // Success keeps its vibrant mint branding in both modes
          iconTheme: {
            primary: '#fff',
            secondary: '#45DFB1',
          },
          style: {
            background: 'linear-gradient(135deg, #45DFB1 0%, #0AD1C8 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 20px 40px rgba(69, 223, 177, 0.2)',
          },
        },
        error: {
          // Error keeps its high-visibility red
          iconTheme: {
            primary: '#fff',
            secondary: '#ff4b4b',
          },
          style: {
            background: 'linear-gradient(135deg, #ff4b4b 0%, #dc2626 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)',
          },
        },
        loading: {
          // Loading uses the brand Teal
          style: {
            background: 'linear-gradient(135deg, #0AD1C8 0%, #429EBD 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 20px 40px rgba(10, 209, 200, 0.2)',
          },
        },
      }}
    />
  );
}
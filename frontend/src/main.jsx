import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const invalidKey = !publishableKey || publishableKey === 'pk_test_REPLACE_WITH_YOUR_KEY' || publishableKey.includes('REPLACE_WITH_YOUR_KEY');

const Root = () => {
  if (invalidKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content px-4 text-center">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Clerk configuration missing</h1>
          <p className="text-base-content/70 mb-3">Your app needs a valid Clerk publishable key to start.</p>
          <p className="text-sm text-base-content/50">Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in Vercel with the key from your Clerk dashboard, then redeploy.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

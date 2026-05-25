import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthToken } from '../utils/api';

export default function useClerkToken() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const updateToken = async () => {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setAuthToken(null);
        return;
      }

      try {
        const token = await getToken();
        setAuthToken(token);
      } catch {
        setAuthToken(null);
      }
    };

    updateToken();
  }, [getToken, isSignedIn, isLoaded]);
}

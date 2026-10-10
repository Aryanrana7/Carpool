import { useEffect, useRef, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const GoogleSignInButton = ({ onSuccess, onError, disabled = false, text = 'Continue with Google' }) => {
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef(null);
  const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const clientId = typeof rawClientId === 'string' ? rawClientId.trim().replace(/^["']|["']$/g, '') : '';
  const isConfigured = Boolean(clientId && !clientId.includes('your_google_oauth_client_id'));

  const handleGoogleResponse = useCallback(async (response) => {
    if (!response || !response.credential) {
      const msg = 'No credential returned by Google Sign-In';
      if (onError) onError(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/users/google', { credential: response.credential });
      toast.success(`Welcome, ${data.name}!`);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Google authentication failed';
      if (onError) onError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    if (!isConfigured) return;

    let isMounted = true;

    const initializeGoogle = () => {
      if (!isMounted || !window.google?.accounts?.id || !buttonRef.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (buttonRef.current) {
          buttonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 360,
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      } catch (err) {
        console.warn('Google Identity initialization notice:', err.message);
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initializeGoogle();
        }
      }, 300);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [clientId, handleGoogleResponse, isConfigured]);

  const handleCustomClick = () => {
    if (!isConfigured) {
      toast('Google Sign-In requires VITE_GOOGLE_CLIENT_ID configuration in environment', {
        duration: 4000,
      });
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('Google One Tap notification:', notification.getNotDisplayedReason?.());
        }
      });
    } else {
      toast.error('Google Sign-In SDK is loading. Please try again in a moment.');
    }
  };

  return (
    <div className="w-full">
      {isConfigured ? (
        <div className="w-full flex justify-center min-h-[44px]">
          <div ref={buttonRef} className="w-full max-w-full flex justify-center" />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={disabled || loading}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-md border border-border bg-surface hover:bg-background text-text-primary text-sm font-medium flex items-center justify-center gap-2.5 transition-colors shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span>{loading ? 'Authenticating with Google…' : text}</span>
        </button>
      )}
    </div>
  );
};

export default GoogleSignInButton;

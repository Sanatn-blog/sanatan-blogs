import { useState } from 'react';

interface SubscriptionResponse {
  message: string;
  success?: boolean;
  alreadySubscribed?: boolean;
  resubscribed?: boolean;
  error?: string;
}

interface UseSubscriptionReturn {
  subscribe: (email: string, source?: string) => Promise<SubscriptionResponse>;
  unsubscribe: (email: string) => Promise<SubscriptionResponse>;
  isSubmitting: boolean;
  message: string;
  clearMessage: () => void;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const clearMessage = () => setMessage('');

  const subscribe = async (email: string, source: string = 'default'): Promise<SubscriptionResponse> => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        return data;
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        return { message: data.error || 'Something went wrong. Please try again.', error: data.error };
      }
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = 'Failed to subscribe. Please try again later.';
      setMessage(errorMessage);
      return { message: errorMessage, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const unsubscribe = async (email: string): Promise<SubscriptionResponse> => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        return data;
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        return { message: data.error || 'Something went wrong. Please try again.', error: data.error };
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      const errorMessage = 'Failed to unsubscribe. Please try again later.';
      setMessage(errorMessage);
      return { message: errorMessage, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    subscribe,
    unsubscribe,
    isSubmitting,
    message,
    clearMessage,
  };
}; 
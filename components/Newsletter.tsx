import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  source?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'card';
}

export default function Newsletter({
  title = "Stay Connected",
  description = "Subscribe to our newsletter for the latest updates and insights.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  source = "newsletter",
  className = "",
  variant = "default"
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const { subscribe, isSubmitting, message } = useSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    const result = await subscribe(email, source);
    if (result.success || result.alreadySubscribed || result.resubscribed) {
      setEmail('');
    }
  };

  const baseClasses = "w-full";
  const variantClasses = {
    default: "bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 text-white p-8 rounded-2xl",
    minimal: "bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700",
    card: "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
  };

  const textClasses = {
    default: "text-white",
    minimal: "text-gray-900 dark:text-white",
    card: "text-gray-900 dark:text-white"
  };

  const inputClasses = {
    default: "bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-yellow-400",
    minimal: "bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-400",
    card: "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
  };

  const buttonClasses = {
    default: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-300 hover:to-yellow-400",
    minimal: "bg-orange-500 text-white hover:bg-orange-600",
    card: "bg-orange-500 text-white hover:bg-orange-600"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="text-center mb-6">
        <h3 className={`text-2xl md:text-3xl font-bold mb-3 ${textClasses[variant]}`}>
          {title}
        </h3>
        <p className={`text-lg ${textClasses[variant]} opacity-90`}>
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              variant === 'default' ? 'text-orange-200' : 'text-gray-400'
            }`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none transition-all duration-300 disabled:opacity-50 ${inputClasses[variant]}`}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses[variant]}`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
          message.includes('already subscribed') || message.includes('Thank you') || message.includes('Welcome back')
            ? 'bg-green-500/20 text-green-100 border border-green-400/30'
            : 'bg-red-500/20 text-red-100 border border-red-400/30'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
} 
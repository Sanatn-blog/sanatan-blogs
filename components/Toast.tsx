"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export default function Toast({
  isOpen,
  onClose,
  message,
  type = "info",
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-600",
      iconColor: "text-white",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-600",
      iconColor: "text-white",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-600",
      iconColor: "text-white",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-600",
      iconColor: "text-white",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div
        className={`${config.bgColor} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md`}
      >
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';

interface UseToastReturn {
  message: string | null;
  showToast: (msg: string) => void;
}

export function useToast(durationMs = 3000): UseToastReturn {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      setMessage(msg);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setMessage(null), durationMs);
    },
    [durationMs],
  );

  return { message, showToast };
}

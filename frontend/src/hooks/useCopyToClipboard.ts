// src/hooks/useCopyToClipboard.ts
import { useState, useCallback } from 'react';

export const useCopyToClipboard = (duration = 2000) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), duration);
      });
    },
    [duration]
  );

  return { copiedText, copy };
};
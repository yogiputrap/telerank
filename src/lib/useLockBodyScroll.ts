'use client';

import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow = '';
let originalDocOverflow = '';
let originalPaddingRight = '';

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof window === 'undefined' || typeof document === 'undefined') return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalDocOverflow = document.documentElement.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      // Prevent layout shift from scrollbar disappearing on desktop
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [locked]);
}

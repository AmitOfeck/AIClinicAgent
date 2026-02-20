import { useState, useCallback } from 'react';

export interface UseChatWidgetReturn {
  isOpen: boolean;
  isMinimized: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  minimize: () => void;
  expand: () => void;
  toggleMinimize: () => void;
}

export function useChatWidget(): UseChatWidgetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const minimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const expand = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  return {
    isOpen,
    isMinimized,
    open,
    close,
    toggle,
    minimize,
    expand,
    toggleMinimize,
  };
}

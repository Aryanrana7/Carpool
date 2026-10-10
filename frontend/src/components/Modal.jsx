import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import IconButton from './ui/IconButton';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 14 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-surface rounded-2xl shadow-overlay max-w-lg w-full overflow-hidden pointer-events-auto border border-border"
              role="dialog"
              aria-modal="true"
              aria-label={title}
            >
              <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-surface">
                <h3 className="text-base font-bold text-text-primary tracking-tight">
                  {title}
                </h3>
                <IconButton
                  icon={X}
                  variant="ghost"
                  size="sm"
                  ariaLabel="Close modal"
                  onClick={onClose}
                />
              </div>
              <div className="p-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

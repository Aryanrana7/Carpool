import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  maxHeight = 'max-h-[85vh]',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Bottom Sheet'}
            className={`
              absolute bottom-0 left-0 right-0 bg-surface border-t border-border rounded-t-2xl
              flex flex-col shadow-overlay overflow-hidden ${maxHeight} ${className}
            `}
          >
            {/* Drag handle */}
            <div className="w-full flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header if title exists */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-5 py-2.5 border-b border-border shrink-0">
                <h2 className="text-base font-semibold text-text-primary">
                  {title}
                </h2>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-border-subtle"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Content body */}
            <div className="p-5 overflow-y-auto flex-1 safe-area-bottom">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;

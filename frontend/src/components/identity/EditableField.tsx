// src/components/identity/EditableField.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Save, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isEditing?: boolean;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  isEditing = false,
  icon,
  type = 'text',
  placeholder = 'Enter value...',
  className,
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external editing state (if provided)
  useEffect(() => {
    if (!isEditing) setIsEditingLocal(false);
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditingLocal(true);
    setInternalValue(value);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSave = () => {
    if (internalValue.trim() === value) {
      setIsEditingLocal(false);
      return;
    }
    onSave(internalValue.trim());
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsEditingLocal(false);
    }, 1500);
  };

  const handleCancel = () => {
    setInternalValue(value);
    setIsEditingLocal(false);
  };

  return (
    <div className={cn('flex items-center justify-between py-3 border-b border-white/5 last:border-0', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && <span className="text-neutral-400">{icon}</span>}
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wider">{label}</p>
          <AnimatePresence mode="wait">
            {isEditingLocal ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1"
              >
                <Input
                  ref={inputRef}
                  type={type}
                  value={internalValue}
                  onChange={(e) => setInternalValue(e.target.value)}
                  placeholder={placeholder}
                  className="bg-white/5 border-white/10 text-white placeholder-neutral-500 focus:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
              </motion.div>
            ) : (
              <motion.p
                key="value"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-white truncate"
              >
                {value || <span className="text-neutral-500">{placeholder}</span>}
                {isSuccess && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 inline ml-2" />
                )}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isEditingLocal ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
              onClick={handleCancel}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
            onClick={handleEdit}
            disabled={!isEditing}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, Edit2 } from "lucide-react"

interface InlineEditProps {
  value: string;
  onSave: (value: string) => Promise<boolean>;
  textClass?: string;
  inputClass?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function InlineEdit({ value, onSave, textClass, inputClass, multiline, placeholder }: InlineEditProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 커서를 맨 뒤로 이동 (타입 단언)
      const el = inputRef.current as any;
      if (typeof el.setSelectionRange === 'function') {
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = currentValue.trim();
    if (trimmed === value) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    const success = await onSave(trimmed);
    setIsLoading(false);
    if (success) {
      setIsEditing(false);
    } else {
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      if (!multiline || (multiline && !e.shiftKey)) {
        e.preventDefault();
        handleSave();
      }
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonProps = {
      value: currentValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      disabled: isLoading,
      placeholder,
      className: cn("bg-transparent border-b-2 border-black focus:outline-none placeholder:text-black/30", inputClass),
    };

    return (
      <div className={cn("relative inline-flex items-center", multiline ? "w-full justify-center" : "")}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            {...commonProps}
            className={cn(commonProps.className, "resize-none overflow-hidden min-h-[60px]")}
            rows={2}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            {...commonProps}
          />
        )}
        {isLoading && <Loader2 className="absolute -right-6 w-4 h-4 animate-spin text-black" />}
      </div>
    );
  }

  return (
    <div 
      className={cn("group relative cursor-text inline-flex items-center", multiline ? "w-full justify-center" : "")} 
      onClick={() => setIsEditing(true)}
      title="클릭하여 수정"
    >
      <span className={cn("px-2 py-0.5 rounded-md hover:bg-black/5 transition-colors border-b-2 border-transparent text-center", textClass, value ? "" : "text-black/30 italic")}>{value || placeholder}</span>
      <Edit2 className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-black/30 absolute -right-4 pointer-events-none" />
    </div>
  );
}

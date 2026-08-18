"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  autoComplete?: string;
}

/** Password input with a show/hide eye toggle, used across the portal
 * (account settings, add-user forms, etc.) so entered passwords are
 * never permanently hidden from the person typing them. */
export function PasswordInput({
  value,
  onChange,
  className,
  placeholder,
  autoComplete = "new-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className, "pr-10")}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

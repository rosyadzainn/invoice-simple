"use client";

import { useState, useEffect, InputHTMLAttributes } from "react";

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value: number;
  onChange: (value: number) => void;
}

/**
 * Controlled number input that keeps a local string for display.
 * This decouples what the user sees (e.g. "0.", "1.5") from the
 * numeric value stored in parent state, eliminating the "stuck at 0"
 * problem caused by parseFloat("") || 0 looping back to 0.
 */
export default function NumberInput({
  value,
  onChange,
  className = "",
  onBlur,
  ...props
}: NumberInputProps) {
  // Local string drives what the <input> shows.
  // When value is 0 we show "" so the field appears blank (ready to type).
  const [display, setDisplay] = useState<string>(value === 0 ? "" : String(value));

  // If the parent changes value externally (e.g. item removed, reset),
  // sync the display — but only when the stored number actually differs.
  useEffect(() => {
    const parsed = display === "" ? 0 : parseFloat(display) || 0;
    if (parsed !== value) {
      setDisplay(value === 0 ? "" : String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only allow digits and a single decimal point (no negative, no e-notation)
    if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
    setDisplay(raw);
    const parsed = parseFloat(raw);
    // Push numeric value to parent; treat empty/NaN as 0
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Normalise trailing dots ("5." → "5") and leading dots (".5" → "0.5")
    const parsed = parseFloat(display) || 0;
    setDisplay(parsed === 0 ? "" : String(parsed));
    onChange(parsed);
    onBlur?.(e);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      {...props}
    />
  );
}

"use client";

import { useState } from "react";
import { formatTokenAmount } from "@/lib/utils/formatters";
import { formatUnits } from "viem";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  maxValue?: bigint;
  maxLabel?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const AmountInput = ({
  value,
  onChange,
  placeholder = "0.00",
  label = "Amount (USDC)",
  maxValue,
  maxLabel = "Max",
  disabled = false,
  error,
  className = "",
}: AmountInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string
    if (inputValue === "") {
      onChange("");
      return;
    }

    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      return;
    }

    // Limit decimal places to 6 (USDC decimals)
    const parts = inputValue.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 6) return;

    onChange(inputValue);
  };

  const handleMaxClick = () => {
    if (maxValue && !disabled) {
      const maxFormatted = formatUnits(maxValue, 6);
      onChange(maxFormatted);
    }
  };

  const inputClasses = `
    w-full bg-[#1E1E1E] border border-cyan-500/15 rounded-lg px-4 py-3 text-white placeholder-[#A3A3A3]
    focus:outline-none focus:border-[#06b6d4]
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
    ${
      error
        ? "border-red-500"
        : isFocused
        ? "border-[#06b6d4]"
        : "border-cyan-500/15"
    }
    ${className}
  `;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label
          className="block text-sm font-normal text-[#A3A3A3]"
          style={{ fontFamily: "Space Grotesk" }}>
          {label}
        </label>
        {maxValue && (
          <button
            type="button"
            onClick={handleMaxClick}
            disabled={disabled}
            className="text-sm text-[#06b6d4] hover:text-[#06b6d4]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            {maxLabel}: {formatTokenAmount(maxValue, 6, 2)} USDC
          </button>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={inputClasses}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span
            className="text-sm text-[#A3A3A3] font-normal"
            style={{ fontFamily: "Space Grotesk" }}>
            USDC
          </span>
        </div>
      </div>

      {error && (
        <p
          className="text-sm text-red-400 mt-1 font-normal"
          style={{ fontFamily: "Space Grotesk" }}>
          {error}
        </p>
      )}
    </div>
  );
};

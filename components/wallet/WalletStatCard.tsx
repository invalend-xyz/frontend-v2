import React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface WalletStatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  loading?: boolean;
  className?: string;
}

export const WalletStatCard: React.FC<WalletStatCardProps> = ({
  label,
  value,
  subValue,
  loading,
  className = "",
}) => {
  return (
    <div
      className={`bg-[#1E1E1E] rounded-lg p-6 border border-cyan-500/15 ${className}`}>
      <div
        className="text-[#A3A3A3] text-sm mb-2 font-normal"
        style={{ fontFamily: "Space Grotesk" }}>
        {label}
      </div>
      <div
        className="text-2xl font-normal mb-1 text-white"
        style={{
          fontFamily: "Space Grotesk",
          letterSpacing: "-0.5px",
        }}>
        {loading ? <LoadingSpinner size="sm" /> : value}
      </div>
      {subValue && (
        <div
          className="text-[#06b6d4] text-xs font-normal"
          style={{ fontFamily: "Space Grotesk" }}>
          {subValue}
        </div>
      )}
    </div>
  );
};

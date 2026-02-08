import React from "react";
import { ExplorerLink } from "@/components/ui/ExplorerLink";

interface WalletHeaderProps {
    address: string;
    isActive: boolean; // Loan Active Status
}

export const WalletHeader: React.FC<WalletHeaderProps> = ({ address, isActive }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-cyan-500/15 rounded-lg p-6">
            <div>
                 <h1
                    className="text-2xl font-normal text-white mb-2"
                    style={{
                        fontFamily: "Space Grotesk",
                        letterSpacing: "-0.5px",
                    }}>
                    Restricted Wallet
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#A3A3A3]" style={{ fontFamily: "Space Grotesk" }}>
                    <span>Address:</span>
                    <ExplorerLink address={address} showIcon={true} className="text-[#06b6d4] hover:text-[#06b6d4]/80">
                         {address}
                    </ExplorerLink>
                </div>
            </div>
            
            <div className={`px-4 py-1.5 rounded-full border text-sm font-medium ${
                isActive 
                ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400"
                : "bg-green-500/10 border-green-500/30 text-green-500"
            }`} style={{ fontFamily: "Space Grotesk" }}>
                {isActive ? "Active Loan • Limited Withdrawals" : "No Active Loan • Unrestricted"}
            </div>
        </div>
    );
};

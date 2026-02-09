"use client";

import { useState } from "react";
import { BorrowForm, RepayForm } from "./Loanform";
import { LoanStatusWidget } from "./LoanStatusWidget";
import { LoanInfoCard } from "./LoanInfoCard";

type TabType = "borrow" | "repay";

export const LoanPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("borrow");

  const tabs = [
    { id: "borrow", label: "Borrow", description: "Open new position" },
    { id: "repay", label: "Repay", description: "Close position" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="w-full bg-[#0A0A0A] p-4 rounded-lg border border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Borrow & Leverage
            </h1>
            <p className="text-gray-400">
              Open leveraged positions by borrowing against your collateral
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation */}
              <div className="bg-black rounded-lg border border-cyan-500/15 p-1">
                <div className="flex space-x-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-cyan-400 text-black"
                          : "text-gray-400 hover:text-white hover:bg-[#1E1E1E]"
                      }`}>
                      <div className="text-center">
                        <div className="font-semibold">{tab.label}</div>
                        <div
                          className={`text-xs mt-1 ${
                            activeTab === tab.id
                              ? "text-black/70"
                              : "text-gray-500"
                          }`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="transition-all duration-300">
                {activeTab === "borrow" && <BorrowForm />}
                {activeTab === "repay" && <RepayForm />}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Loan Status */}
              <LoanStatusWidget />

              {/* Information Card */}
              <LoanInfoCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

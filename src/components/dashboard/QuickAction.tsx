"use client";
import React from "react";
import { FaPlus, FaDollarSign, FaRecycle, FaUserPlus } from "react-icons/fa";
import Button  from "@/components/ui/button/Button";

export default function QuickActionsWithESGCard() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 w-full">
      {/* Left Section: Quick Actions */}
      <div className="rounded-2xl bg-gray-100 dark:bg-white/[0.03] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-black text-lg font-semibold">Quick Actions</h3>
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              🔍
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              ⬇️
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <ActionItem icon={<FaPlus />} label="Add Project" />
          <ActionItem icon={<FaDollarSign />} label="Log Revenue" />
          <ActionItem icon={<FaRecycle />} label="Create Buyback" />
          <ActionItem icon={<FaUserPlus />} label="Add Provider" />
        </div>
      </div>

      {/* Right Section: ESG Card */}
      <div className="rounded-2xl bg-gray-100 dark:bg-white/[0.03] p-5 flex flex-col items-center justify-center">
        <h4 className="text-black text-base font-semibold mb-2">ESG Reports</h4>

        <div className="relative w-[120px] h-[120px] mb-4">
          <svg className="absolute inset-0" viewBox="0 0 36 36">
            <path
              className="text-gray-700 stroke-current"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-teal-400 stroke-current"
              strokeDasharray="82, 100"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-black">82</span>
          </div>
        </div>

        <p className="text-black text-sm">Action required</p>
        <Button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
          View Reports
        </Button>
      </div>
    </div>
  );
}

function ActionItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-black transition">
      <div className="text-lg">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

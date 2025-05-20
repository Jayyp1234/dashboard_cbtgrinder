import type { Metadata } from "next";
import { CBTGrinderMetrics, CBTGrinderMetrics2 } from "@/components/dashboard/EcommerceMetrics";
import React from "react";
// import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
// import QuickActionsWithESGCard from "@/components/dashboard/QuickAction";
// import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
// import StatisticsChart from "@/components/dashboard/StatisticsChart";
// import RecentOrders from "@/components/dashboard/RecentOrders";
// import DemographicCard from "@/components/dashboard/DemographicCard";
// import Alert from "@/components/ui/alert/Alert";

export const metadata: Metadata = {
  title: "CBT Grinder | Admin Dashboard",
  description: "Manage questions, subjects, and performance analytics with CBT Grinder's powerful admin dashboard.",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
      {/* <Alert
        variant="error"
        title="Action Required"
        message="You must complete your onboarding and verification before accessing core platform features. Please verify your details to proceed."
        showButton={true}
        buttonText="Verify Now"
        buttonHref="/onboarding/verify"
      /> */}

        <h1 className="text-2xl font-medium">Welcome to your dashboard {""} 👋</h1>

      </div>

      <div className="col-span-12 space-y-6 xl:col-span-12">
        <CBTGrinderMetrics />
        <CBTGrinderMetrics2 />
        {/* <MonthlySalesChart /> */}
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <QuickActionsWithESGCard />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-7">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}

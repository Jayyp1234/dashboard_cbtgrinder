import React from "react";
import { useRouter } from "next/navigation";

export default function SidebarWidget() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/dashboard"); // Change to actual investor dashboard route
  };

  return (
    <div
      className="mx-auto hidden mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Want to Invest Too?
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Switch to the main investor dashboard to explore and fund energy projects.
      </p>
      <button
        onClick={handleNavigation}
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Go to Investor Dashboard
      </button>
    </div>
  );
}

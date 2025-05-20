"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToLogin() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // ✅ Redirects immediately to /login
  }, [router]);

  return null; // No UI needed
}

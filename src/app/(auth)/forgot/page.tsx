import ForgotForm from "@/components/auth/ForgotForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CBT GRINDER",
  description: "Sign in to admin dashboard.",
};

export default function Forgot() {
  return <ForgotForm />;
}

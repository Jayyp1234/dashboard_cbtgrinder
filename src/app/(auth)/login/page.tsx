import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CBT GRINDER",
  description: "Sign in to admin dashboard.",
};

export default function SignIn() {
  return <SignInForm />;
}

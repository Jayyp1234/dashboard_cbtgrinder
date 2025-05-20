import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | CBT GRINDER",
  description: "Sign up to admin dashboard.",
};

export default function SignUp() {
  return <SignUpForm />;
}

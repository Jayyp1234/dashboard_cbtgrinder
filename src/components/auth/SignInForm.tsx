// "use client";
// import { toast } from "react-hot-toast";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import Button from "@/components/ui/button/Button";
// import { EyeCloseIcon, EyeIcon } from "@/icons";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import React, { useState } from "react";
// import { z } from "zod";
// import { useLoginUserMutation } from "@/lib/services/api"; // ✅ RTK Query
// import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
// import type { SerializedError } from '@reduxjs/toolkit';
// import Checkbox from "../form/input/Checkbox";

// export default function SignInForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   return (
//     <div className="flex flex-col flex-1 w-full">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//         <div>
//           <Link href="/" className="block mb-2">
//             <Image
//               width={231}
//               height={48}
//               style={{ margin: "0 auto" }}
//               src="/images/logo/Logo copy.png"
//               alt="Logo"
//               priority
//             />
//           </Link>

//           <div className="mb-5 text-center sm:mb-8">
//             <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//               Welcome Back.
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Enter your email and password to sign in!
//             </p>
//           </div>

//           <div className="">
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-4 sm:gap-5">
//               <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
//                     fill="#EB4335"
//                   />
//                 </svg>
//               </button>
//               <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
//                 <svg
//                   width="21"
//                   className="fill-current"
//                   height="20"
//                   viewBox="0 0 21 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
//                 </svg>
//               </button>
//               <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
//                   <path fill="#1877f2" d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445" />
//                   <path fill="#fff" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z" />
//                 </svg>
//               </button>
//               <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
//                   <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25" />
//                 </svg>
//               </button>
//             </div>
//             <div className="relative py-3 sm:py-5">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
//                   Or
//                 </span>
//               </div>
//             </div>
//             <form>
//               <div className="space-y-6">
  
//                 <div>
//                   <Label>Email <span className="text-error-500">*</span></Label>
//                   <Input
//                     type="email"
//                     placeholder="Enter your email"
//                   />
//                 </div>
  
//                 <div>
//                   <Label>Password <span className="text-error-500">*</span></Label>
//                   <div className="relative">
//                     <Input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                     />
//                     <span
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//                     >
//                       {showPassword ? (
//                         <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
//                       ) : (
//                         <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
//                       )}
//                     </span>
//                   </div>
//                 </div>

                // <div className="flex items-center justify-between">
                //   <div className="flex items-center gap-3">
                //     <Checkbox checked={isChecked} onChange={setIsChecked} />
                //     <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                //       Keep me logged in
                //     </span>
                //   </div>
                //   <Link
                //     href="/forgot"
                //     className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                //   >
                //     Forgot password?
                //   </Link>
                // </div>
  
//                 <div>
//                   <Button className="w-full" size="md">
//                     Sign in
//                   </Button>
//                 </div>
//               </div>
//             </form>
            // <div className="mt-5">
            //   <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
            //     Don&apos;t have an account? {""}
            //     <Link
            //       href="/register"
            //       className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            //     >
            //       Sign Up
            //     </Link>
            //   </p>
            // </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { toast } from "react-hot-toast";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { z } from "zod";
import { useLoginUserMutation } from "@/lib/services/api"; // ✅ RTK Query
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import Checkbox from "../form/input/Checkbox";


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const formDataObj: LoginFormData = { email, password };

    const validation = loginSchema.safeParse(formDataObj);

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message;
      setFormError(firstError || "Invalid form input.");
      return;
    }

    // 🔥 Create FormData manually
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await loginUser(formData).unwrap();

      const token = response.data.token;
      const user = {
        ...response.data.data,
        role: response.data.data.role || "user", // Default role if not provided
        date_created: response.data.data.date_created || new Date().toISOString(), // Default date if not provided
      };
      
      login(token, user);

      toast.success("Login successful!"); // ✅ Toast success here
  
      router.push("/dashboard");
    } catch (error) {
      const err = error as FetchBaseQueryError | SerializedError;
      const apiError =
        "data" in err && typeof err.data === "object" && err.data !== null
          ? (err.data as { message?: string })
          : null;
    
      setFormError(apiError?.message || "Login failed. Please try again.");
    }
    
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <Link href="/" className="block mb-2">
            <Image
              width={231}
              height={48}
              style={{ margin: "0 auto" }}
              src="/images/logo/Logo copy.png"
              alt="Logo"
              priority // Important for performance
            />
          </Link>

          <div className="mb-5 text-center sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Welcome Back.
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {formError && (
                <div className="p-3 text-sm text-white bg-red-500 rounded">
                  {formError}
                </div>
              )}

              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/forgot"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>

              <div>
                <Button className="w-full" size="md">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                Don&apos;t have an account? {""}
                <Link
                  href="/register"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
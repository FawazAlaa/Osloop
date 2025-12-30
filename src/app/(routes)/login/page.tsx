"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema } from "@/lib/services/signUpInSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSnackbar from "@/myComponents/ui/snackbar";
import { useAuth } from "@/lib/providers/authenticationProvider"; 
// import { toast } from "react-toastify";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginComponent() {
  // lw gy mn el layout param
  const params = useSearchParams();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    const reason = params.get("reason");
    if (reason === "unauthorized") {
      setSnackbarMsg("Please login first");
      setSnackbarOpen(true);
    }
  }, [params]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [imgVisible, setImgVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setImgVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const router = useRouter();
  const { loginSuccess } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const result = await res.json();
      loginSuccess(result.user);
      setSnackbarMsg(`Succesful Login` );
      setSnackbarOpen(true);
      console.log(result);
       setTimeout(() => {
      router.push("/");
    }, 1200);      //3ldhan bas azhar el toaster
    } catch (err: any) {
      console.error("Login error:", err.message);
       // replace with snackbar/toast later
      setSnackbarMsg("Invalid email or password");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      />
      <div className="flex md:flex-row flex-col md:mt-0 min-h-screen font-sans sm:">
        {/* Left Section (Image, smaller width) */}
        <div className="hidden md:block relative md:w-4/10">
          <div
            className={`absolute inset-0 transform transition-all duration-700 ease-out ${
              imgVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Image
              src="/tasks2.avif"
              fill
              alt="Doctor and patient"
              className="w-full h-full object-cover"
            />

            {/* <h2 className="absolute inset-0 flex justify-center items-center drop-shadow-lg px-6 font-extrabold text-white text-3xl md:text-4xl text-center leading-tight">
            Connecting Doctors and Patients Seamlessly.
          </h2> */}
          </div>
        </div>

        {/* Right Section (Form, larger width) */}
        <div className="flex flex-col justify-center items-center p-8 md:p-16 w-full md:w-6/10 h-screen">
          <h1 className="mb-2 font-bold -800 text-3xl md:text-4xl">Sign In</h1>
          <p className="mb-8 font-normal -500 text-base">
            Please enter your credentials to log in.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-md"
          >
            {/* Email */}
            <div>
              <label
                className="block mb-1 font-medium -700 text-sm"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full -800 text-sm"
              />

              {errors.email && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                className="block mb-1 font-medium -700 text-sm"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Password"
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full -800 text-sm"
              />

              {errors.password && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-6 py-3 rounded-lg w-full font-semibold text-white text-sm transition"
              >
                {isSubmitting ? "Logging in..." : "Login"}
           
              </button>
            </div>
          </form>

          <p className="mt-6 -500 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

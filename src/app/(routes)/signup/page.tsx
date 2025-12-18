"use client";
// import { user } from "@/lib/interfaces/user";
import { Button } from "@/myComponents/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useState } from "react";
import { useForm} from "react-hook-form";
import { signUpSchema } from "@/lib/services/signUpInSchema";
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// type Option = { id: number; name: string };
// const cities: Option[] = [
//   { id: 1, name: "Cairo" },
//   { id: 2, name: "Alexandria" },
//   { id: 3, name: "Giza" },
// ];

export default function SignUp() {
  //   const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [imgVisible, setImgVisible] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setImgVisible(true), 200);
      return () => clearTimeout(timer);
    }, []);
 type signUpForm=z.infer<typeof signUpSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signUpForm>(
    {
      resolver: zodResolver(signUpSchema)
    }
  );



  async function onSubmit(data:signUpForm) {
    console.log(data)
    const response = await fetch("myapi here", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.message);
      return;
    }
    console.log('hna?')
    router.push("/login");
  }
  /*

    will implement it later on >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    try {
    //   const created = await dispatch(registerDoctor(payload)).unwrap();
    //   dispatch(clearAuth());
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    //   toast.success(`Welcome Dr. ${created.name}! Your code is ${created.code}`);
    //   router.push("/login");
    } catch (err: any) {
      toast.error("Registration failed");
    }
  };
  */

  return (
    <div className="flex md:flex-row flex-col min-h-screen">
      {/* Left Side */}
      <div className="relative hidden md:block basis-2/5  text-white">
        <div
          className={`absolute inset-0 transform transition-all duration-700 ease-out ${
            imgVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
        <Image
          src="/tasks1.avif"
          alt="Task picture"
          fill
          priority
          className="object-cover object-[20%_35%]"
        />
        <div className="absolute inset-0 bg-black/30" />
        <h2 className="absolute top-28 left-6 right-6 mt-24 drop-shadow-lg px-6 font-bold  text-3xl md:text-4xl leading-tight">
          Helping You organize, Achieve, <br /> and reach Your Goals
        </h2>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 justify-center items-center p-6 sm:p-10 md:w-6/10">
        <div className="p-8 rounded-2xl w-full max-w-2xl">
          <h2 className="mb-6 font-bold text-3xl animate-pulse">Join Us Now</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border-" noValidate>
            {/* Full Name */}
            <div>
              <label className="block font-medium  text-sm">Full Name</label>
              <input
                {...register("name")}
                placeholder="Enter your Name"
                className="block shadow-sm mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            {/* Age */}
            <div>
              <label className="block font-medium  text-sm">Age</label>
              <input
                {...register("age",{ valueAsNumber: true })}
                placeholder="Enter your Age"
                className="block shadow-sm mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                type="number"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium  text-sm">Email</label>
              <input
                {...register("email")}
                placeholder="Enter your email"
                className="block shadow-sm mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                type="email"
              />

              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password + Confirm */}

            <label className="block font-medium  text-sm">Password</label>
            <input
              {...register("password")}
              placeholder="********"
              className="block shadow-sm mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              type='password'
            />
            
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <label className="block font-medium  text-sm">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              placeholder="********"
              className="block shadow-sm mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              type="password"
            />

            {/* Phone */}
            <label className="block font-medium  text-sm">Phone</label>
            <input
            {...register('phone')}
              placeholder="Enter your phone number"
              className="block shadow-sm mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            <Button
              type="submit"
              className="cursor-pointer"
              label="Register"
              isSubmitting={isSubmitting}
            />
            <p className="mt-6 text-sm text-center">
              Have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

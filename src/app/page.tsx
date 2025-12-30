"use client";
import { useAuth } from "@/lib/providers/authenticationProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router=useRouter()
  return (
    <div>
      <main>
        <div className="flex flex-col items-center gap-4 mb-4 text-center overflow-x-hidden">
          <h1
            style={{ ["--n" as string]: "32ch" }}
            className="inline-block pt-5 overflow-hidden font-mono font-semibold text-[48px] md:text-[74px]
               align-baseline leading-tight whitespace-normal md:whitespace-nowrap animate-[type-hold_23s_steps(32,end)_infinite] /* 23s total = ~3s typing + 20s hold; no caret/border */"
          >
            Welcome To my <br /> Project Assesment
          </h1>
          {!user ? (
            <p className="inline-block mb-6 w-2/3 text-2xl animate-enter-pulse-3_5s">
              Get Started By logging in or signing up <br />
            </p>
          ) : (
            <p className="inline-block mb-6 w-2/3 text-2xl">Welcome back {user.name}</p>
          )}

          <div className="flex justify-between ">
            <button
              className="inline-block bg-transparent mt-2 mb-2 px-14 py-4 border-2 border-blue-200 hover:cursor-pointer 
            rounded-full font-semibold animate-enter-pulse-3_5s  mr-1 hover:text-gray-700 hover:border-blue-500"
            onClick={()=>router.push("/about")}
            >
              Learn more
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

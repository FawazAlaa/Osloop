"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./darkModeToggle";
import HomeIcon from '@mui/icons-material/Home';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [hash, setHash] = useState("");

//   const pathName = usePathname();
  const router = useRouter();
//   const navItems = [
//     { label: "Home", path: "/" },
//     { label: "Features", path: "/#features" },
//     { label: "Contact Us", path: "/about" },
//   ];

  // const {
  // 	role: roleRedux,
  // 	status: statusRedux,
  // 	userDetails: userRedux,
  // 	isLoggedIn: isLoggedRedux,
  // } = useSelector((s: RootState) => s.auth);

  // const dispatch = useDispatch();
  // const [authLS, setAuthLS] = useState<SavedAuth | null>(null);

//   useEffect(() => {
//     const update = () => setHash(window.location.hash || "");
//     update();

//     window.addEventListener("hashchange", update);
//     return () => window.removeEventListener("hashchange", update);
//   }, [pathName]);

//   const activeItem = useMemo(() => {
//     if (pathName === "/about") return "Contact Us";

//     if (pathName === "/") {
//       if (hash === "#features") return "Features";
//       if (hash === "#faq") return "FAQ";
//       return "Home";
//     }
//     return "";
//   }, [pathName, hash]);

  const handleLogout = () => {
    // nemsa7 el storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }

    // 2) nemsa7 Redux
    // dispatch(clearAuth());

    // clear local navbar snapshot/UI
    // setAuthLS(null);
    setProfileOpen(false);
    setMenuOpen(false);

    router.replace("/");
    router.refresh();
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="top-0 left-0 z-20 fixed bg-[#000D44] shadow-md py-2 w-full">
      <div className="flex justify-between items-center mx-auto px-4 sm:px-6 md:px-8 py-3 md:py-0 max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-2 -mt-2  font-bold"
        >
          <Image
            className=" h-auto cursor-pointer"
            src="/osloop_logo.png"
            alt="osloop_logo"
            width={100}
            height={100}
            priority
          />
        </Link>


        {/* RIGHT SIDE (desktop) */}
        <div className="hidden md:flex justify-end items-center gap-3 w-48 lg:w-56">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="flex-1 bg-white hover:bg-gray-300 px-3 lg:px-4 py-2 lg:py-2 border border-gray-200 rounded-xl font-semibold text-[#000D44] text-sm lg:text-base text-center transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md px-3 lg:px-4 py-2 lg:py-2 rounded-xl font-medium text-white text-sm lg:text-base text-center transition"
              >
                SignUp
              </Link>
              <DarkModeToggle/>
            </>
            
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 focus:outline-none text-white"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <Image
                  src="/profileimg.svg"
                  alt="Profile"
                  width={36}
                  height={36}
                  className="bg-white border border-gray-300 rounded-full"
                />
                <span className="hidden sm:inline font-medium">Name here</span>
              </button>

              {profileOpen && (
                <div className="right-0 z-30 absolute bg-white shadow-lg mt-2 py-2 rounded-lg w-48">
                  <Link
                    href="/profile"
                    className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* {effectiveRole === "medical" && ( */}
                  <Link
                    href="/dashboard"
                    className="block hover:bg-gray-100 px-4 py-2 text-gray-700 text-sm"
                    onClick={() => setProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {/* )} */}

                  <button
                    onClick={handleLogout}
                    className="hover:bg-gray-100 px-4 py-2 w-full text-red-600 text-sm text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* burger button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
            <HomeIcon className="h-7 w-7"/>
        </button>
      </div>

      {/* MOBILE PANEL */}
      <div
        className={`md:hidden bg-[#000D44] text-white px-6  transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-3 mt-4 w-full">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                onClick={() => {
                  setMenuOpen(false);
                }}
                className="bg-white hover:bg-gray-100 px-4 py-2 border border-gray-200 rounded-xl w-full font-semibold text-[#000D44] text-center transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => {
                  setMenuOpen(false);
                }}
                className="bg-[#4B4EFC] hover:bg-[#3737e8] px-4 py-2 border border-[#4B4EFC] rounded-xl w-full font-semibold text-white text-center transition"
              >
                SignUp
              </Link>
              <DarkModeToggle/>
            </>
          ) : (
            <div className="pt-4 border-gray-600 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/profileimg.svg"
                  alt="Profile"
                  width={36}
                  height={36}
                  className="bg-white border border-gray-300 rounded-full"
                />
                <span className="font-medium">name here</span>
              </div>

              <Link
                href="/profile"
                className="block py-2 text-sm hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              {/* {effectiveRole === "medical" && ( */}
              <Link
                href="/dashboard"
                className="block py-2 text-sm hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              {/* )} */}

              <button
                className="py-2 w-full text-red-400 text-sm text-left hover:underline"
                onClick={handleLogout}
              >
                Logout
              </button>
              <DarkModeToggle/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

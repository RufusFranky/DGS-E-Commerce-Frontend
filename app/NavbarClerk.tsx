"use client";

import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PackageIcon } from "lucide-react";
import { useEffect } from "react";
import { toastSuccess } from "@/utils/toast";

export default function NavbarClerk() {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const firstName = user?.firstName;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if toast was already shown this session
    const alreadyWelcomed = sessionStorage.getItem("welcome_shown");

    if (isSignedIn && !alreadyWelcomed) {
      toastSuccess(`Welcome back${firstName ? ", " + firstName : "!"}`);
      sessionStorage.setItem("welcome_shown", "yes");
    }
  }, [isSignedIn, firstName]);

  if (!isSignedIn) {
    return (
      <button
        onClick={() => openSignIn()}
        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition login-btn"
      >
        Login
      </button>
    );
  }

  return (
    <UserButton afterSignOutUrl="/">
      <UserButton.MenuItems>
        <UserButton.Action
          labelIcon={<PackageIcon size={16} />}
          label="My Orders"
          onClick={() => router.push("/orders")}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

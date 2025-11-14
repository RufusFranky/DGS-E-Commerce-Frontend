"use client";

import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PackageIcon } from "lucide-react";

export default function NavbarClerk() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  if (!user) {
    return (
      <button
        onClick={() => openSignIn()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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

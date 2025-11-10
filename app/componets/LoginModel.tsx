"use client";
import { useState } from "react";
import Image from "next/image";
 
export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
 
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-[1000]">
      <div className="bg-white rounded-2xl p-8 w-[400px] relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-xl hover:text-gray-800"
        >
          ✕
        </button>
 
        {/* Heading */}
        <h2 className="text-2xl text-gray-500 font-bold text-center mb-1">Sign in to DGSTECH</h2>
        <p className="text-gray-500 text-center mb-6">
          Welcome back! Please sign in to continue
        </p>
 
        {/* Continue with Google */}
        <button className="flex items-center justify-center w-full border rounded-md py-2 hover:bg-gray-100 mb-4">
            <div className="flex items-center space-x-2">
                <Image src="/google-icon-logo-svgrepo-com.svg" alt="Google" width={100} height={100} className="w-5 h-5 mr-3"/>
                <span className="text-gray-700 font-medium ml-2">Continue with Google</span>
            </div>
        </button>
 
 
        {/* Divider */}
        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
 
        {/* Email Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
 
        {/* Continue Button */}
        <button className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition">
          Continue
        </button>
 
        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
 
'use client'
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">PrepAi</h1>
          <p className="text-gray-600">AI-Powered Mock Interview Platform</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h2>
          <p className="text-sm text-blue-800">
            Practice and ace your interviews with AI-generated questions and real-time feedback.
          </p>
        </div>

        <div className="space-y-4">
          <SignInButton>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2">
              Sign Up
            </Button>
          </SignUpButton>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
          <p>Start preparing for your next interview today!</p>
        </div>
      </div>
    </div>
  );
}

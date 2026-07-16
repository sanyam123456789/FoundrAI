import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}

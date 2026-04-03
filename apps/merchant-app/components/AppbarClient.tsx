"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/Appbar";

export const AppbarClient = () => {
  const session = useSession();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
      <Appbar 
        user={session.data?.user} 
        onSignin={() => signIn('google')} 
        onSignout={signOut} 
      />
    </div>
  );
};

// components/shared/Navbar.jsx
"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 md:gap-0">
        {/* Mobile Toggle can be inserted here if needed */}
        <h2 className="text-sm font-medium text-muted-foreground hidden md:block">
          Welcome back to your workspace
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {!isPending && session?.user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium leading-none">{session.user.name}</span>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
            </div>
            
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name} 
                className="h-8 w-8 rounded-full border bg-muted"
              />
            ) : (
              <div className="h-8 w-8 rounded-full border bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
              <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
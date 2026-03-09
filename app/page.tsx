"use client"

import { useState, useEffect ,useActionState} from "react";
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm";
import { Sign } from "crypto";
import SignupForm from "@/components/auth/SignupForm";
import { loginUser } from "@/actions/auth"
import { toast } from "sonner"


export default function Home() {

  const [mode, setMode] = useState<"login" | "signup">("login")
  const [state, action, isPending] = useActionState(loginUser, {})

  const router = useRouter()


  useEffect(() => {
    if (state?.success) {
      toast.success("Logged in successfully!")
      router.push("/dashboard")
    }
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md border rounded-lg bg-card p-6 shadow">
            {mode === "login" ? (
              <LoginForm onSignupClick={() => setMode("signup")} />
            ) : (
              <SignupForm onLoginClick={() => setMode("login")} />
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/login-2.jpg"
          alt="Image"
          width={800} height={500}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
        />
      </div>
    </div>
  );
}

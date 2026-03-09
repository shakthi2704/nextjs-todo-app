"use client"

import * as React from "react"
import { useActionState } from "react"
import { signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/actions/auth"
import { toast } from "sonner"

type SignupFormProps = React.ComponentProps<"form"> & {
  onLoginClick?: () => void
}

export default function SignupForm({ className, onLoginClick, ...props }: SignupFormProps) {
  const [state, action, isPending] = useActionState(registerUser, {})

  return (
    <form className={cn("flex flex-col gap-6", className)} action={action} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your information to create your account
          </p>
        </div>

        {/* 
        {state?.error && (
  toast.success("Todo created!")
        )} */}

        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" name="name" type="text" placeholder="John Doe" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </Field>

        <FieldSeparator>Or signup with</FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mr-2">
              <path d="M21.805 10.023h-9.18v3.955h5.278c-.228 1.23-1.406 3.61-5.278 3.61-3.176 0-5.764-2.63-5.764-5.875s2.588-5.875 5.764-5.875c1.809 0 3.023.772 3.72 1.437l2.54-2.46C17.29 3.36 15.24 2.5 12.625 2.5 6.95 2.5 2.5 6.95 2.5 12.625S6.95 22.75 12.625 22.75c5.9 0 9.79-4.15 9.79-9.995 0-.67-.073-1.177-.16-1.732z" />
            </svg>
            Signup with Google
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <button type="button" onClick={onLoginClick} className="underline underline-offset-4">
            Login
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
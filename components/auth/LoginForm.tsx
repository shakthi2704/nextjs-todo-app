"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
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
import { loginUser } from "@/actions/auth"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

type LoginFormProps = React.ComponentProps<"form"> & {
    onSignupClick?: () => void
}
export default function LoginForm({
    className,
    onSignupClick,
    ...props
}: LoginFormProps) {

    const [state, action, isPending] = useActionState(loginUser, {})

    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            toast.success("Logged in successfully!")
            router.push("/dashboard")
        }
        if (state?.error) toast.error(state.error)
    }, [state, router])


    return (
        <form className={cn("flex flex-col gap-6", className)} action={action} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>

                {/* {state.error && (<p className="text-sm text-red-500 text-center">{state.error}</p>
                )} */}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </Field>

                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <button
                            type="button"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </button>
                    </div>
                    <Input id="password" name="password" type="password" required />
                </Field>

                <Field>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>

                <Field>
                    <Button variant="outline" type="button" className="w-full" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="currentColor"

                            className="mr-2"
                        >
                            <path d="M21.805 10.023h-9.18v3.955h5.278c-.228 1.23-1.406 3.61-5.278 3.61-3.176 0-5.764-2.63-5.764-5.875s2.588-5.875 5.764-5.875c1.809 0 3.023.772 3.72 1.437l2.54-2.46C17.29 3.36 15.24 2.5 12.625 2.5 6.95 2.5 2.5 6.95 2.5 12.625S6.95 22.75 12.625 22.75c5.9 0 9.79-4.15 9.79-9.995 0-.67-.073-1.177-.16-1.732z" />

                        </svg>
                        Login with Google
                    </Button>

                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <button
                            type="button"
                            onClick={onSignupClick}
                            className="underline underline-offset-4"
                        >
                            Sign up
                        </button>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}

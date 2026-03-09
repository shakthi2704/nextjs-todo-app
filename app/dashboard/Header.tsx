"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut, Moon, Sun } from "lucide-react"
import { logoutUser } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"


export default function Header() {
    const { theme, setTheme } = useTheme()

    const router = useRouter()

    async function handleLogout() {
        await logoutUser()
        toast.success("Logged out successfully!")
        setTimeout(() => router.push("/"), 1500)
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }



    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Todo</h1>
                <div className="ml-auto flex items-center gap-2">
                    
                    <Button variant="secondary" size="icon" onClick={toggleTheme}>
                        <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
                  
                    </Button>
                    <Button className="hidden sm:flex items-center gap-2" onClick={handleLogout}>
                        <LogOut />
                        <span className="sr-only sm:not-sr-only">Logout</span>
                    </Button>
                </div>
            </div>
        </header>

    )
}

"use client"
import { logoutUser } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Header from "./Header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/dashboard/AppSidebar"
export default function Home() {
  const router = useRouter()

  async function handleLogout() {
    await logoutUser()
    toast.success("Logged out successfully!")
    setTimeout(() => router.push("/"), 1500)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Header />
      </SidebarInset>
    </SidebarProvider>
  )
}

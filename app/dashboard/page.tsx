"use client"
import { logoutUser } from "@/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
export default function Home() {

  const router = useRouter()

  async function handleLogout() {
    await logoutUser()
    toast.success("Logged out successfully!")
    setTimeout(() => router.push("/"), 1500)
  }

    return (

        <>
              <button onClick={handleLogout}>Logout</button>


            <button onClick={() => toast.success("Toast is working!")}>
                Test Toast
            </button>
        </>

    )
}
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logoutAction() {
  // Remove o cookie
  (await cookies()).delete("authToken")

  // Redireciona para a página de login
  redirect("/login")
}

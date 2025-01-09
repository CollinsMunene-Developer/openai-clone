import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - chatgpt-clone",
  description: "Authentication Login for chatgpt clone .",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 
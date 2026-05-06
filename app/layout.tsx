import { Geist, Geist_Mono, DM_Sans } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { cn } from "@/lib/utils";

const geistMonoHeading = Geist_Mono({subsets:['latin'],variable:'--font-heading'});

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", dmSans.variable, geistMonoHeading.variable)}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster 
              position="top-center" 
              toastOptions={{
                className: "font-sans border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] font-bold",
                style: {
                  background: "white",
                  color: "black",
                }
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

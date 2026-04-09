import { links } from "@/data/links"
import { Card } from "@/components/ui/card"

export default function Page() {
  const colors = [
    "bg-[#FFD7E8]", // Soft Pink
    "bg-[#D1FFD7]", // Soft Green
    "bg-[#D7E8FF]", // Soft Blue
    "bg-[#FFF2D7]", // Soft Yellow
    "bg-[#E8D7FF]", // Soft Purple
  ]

  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-[#F9F9F9] p-6 pt-16">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">My Links</h1>
          <p className="text-muted-foreground mt-2">나의 모든 링크를 한 곳에서 확인하세요.</p>
        </header>

        <main className="flex flex-col gap-4">
          {links.map((link, index) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline"
            >
              <Card
                className={`flex flex-row items-center gap-4 border-2 border-black p-4 transition-all shadow-neo hover:shadow-neo-hover active:translate-x-[2px] active:translate-y-[2px] ${
                  colors[index % colors.length]
                }`}
              >
                {link.icon && (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <img
                      src={link.icon}
                      alt={link.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <span className="text-lg font-bold text-black">{link.title}</span>
              </Card>
            </a>
          ))}
        </main>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MyLink. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

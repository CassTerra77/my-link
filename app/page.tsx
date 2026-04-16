"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { links as initialLinks, Link } from "@/data/links"
import { Card } from "@/components/ui/card"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc, getDocs, query, orderBy } from "firebase/firestore"

export default function Page() {
  const [links, setLinks] = React.useState<Link[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)

  const colors = [
    "bg-[#FFD7E8]", // Soft Pink
    "bg-[#D1FFD7]", // Soft Green
    "bg-[#D7E8FF]", // Soft Blue
    "bg-[#FFF2D7]", // Soft Yellow
    "bg-[#E8D7FF]", // Soft Purple
  ]

  const fetchLinks = async () => {
    try {
      const linksRef = collection(db, "users/anonymous/links")
      const q = query(linksRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        const promises = initialLinks.map((link, index) => {
          return setDoc(doc(linksRef, link.id), {
            ...link,
            createdAt: Date.now() - index * 1000,
          })
        })
        await Promise.all(promises)
        
        // 시딩 후 다시 데이터 가져오기
        const newSnapshot = await getDocs(q)
        const fetchedLinks: Link[] = []
        newSnapshot.forEach((docSnap) => {
          fetchedLinks.push(docSnap.data() as Link)
        })
        setLinks(fetchedLinks)
      } else {
        const fetchedLinks: Link[] = []
        querySnapshot.forEach((docSnap) => {
          fetchedLinks.push(docSnap.data() as Link)
        })
        setLinks(fetchedLinks)
      }
    } catch (error) {
      console.error("Error fetching links from Firestore", error)
    } finally {
      setIsLoaded(true)
    }
  }

  // 초기 데이터 로드 (Firestore 연동, 1회성)
  React.useEffect(() => {
    fetchLinks()
  }, [])

  // 링크 추가 핸들러
  const handleAddLink = async (newLink: Link) => {
    try {
      await setDoc(doc(db, "users/anonymous/links", newLink.id), newLink)
      // 데이터베이스 저장 후 목록을 다시 불러오거나 로컬 상태에 즉시 반영
      setLinks((prev) => [newLink, ...prev])
    } catch (e) {
      console.error("Failed to add new link to Firestore", e)
    }
  }

  // 하이드레이션 오류 방지를 위해 로드된 후에만 렌더링
  if (!isLoaded) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-[#F9F9F9] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
        <p className="mt-4 font-bold text-black drop-shadow-[1px_1px_0_rgba(0,0,0,1)] text-[#FFD7E8] text-xl stroke-black stroke-2" style={{ WebkitTextStroke: '1px black' }}>데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-[#F9F9F9] p-6 pt-16">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="mb-4 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            My Links
          </h1>
          <p className="text-black font-bold mt-2">나의 모든 링크를 한 곳에서 확인하세요.</p>
        </header>

        <main className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline"
              >
                <Card
                  className={`flex flex-row items-center gap-4 border-2 border-black p-4 transition-all shadow-neo hover:shadow-neo-hover active:translate-x-[2px] active:translate-y-[2px] ${colors[index % colors.length]
                    }`}
                >
                  {link.icon && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={link.icon}
                        alt={link.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <span className="text-xl font-black text-black">{link.title}</span>
                </Card>
              </a>
            ))}
          </div>

          <div className="mt-8">
            <LinkAddDialog onAdd={handleAddLink} />
          </div>
        </main>

        <footer className="mt-12 text-center text-xs font-bold text-black border-t-2 border-black pt-4">
          © {new Date().getFullYear()} MyLink. All rights reserved.
        </footer>
      </div>
    </div>
  )
}


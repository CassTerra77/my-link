"use client"

import * as React from "react"
import { useParams, notFound } from "next/navigation"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"
import { Link as LinkType } from "@/data/links"
import { LinkCard } from "@/components/link-card"

export default function UserPage() {
  const params = useParams()
  const displayName = params.displayName as string
  const [profile, setProfile] = React.useState<any>(null)
  const [links, setLinks] = React.useState<LinkType[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isUserNotFound, setIsUserNotFound] = React.useState(false)

  React.useEffect(() => {
    async function fetchData() {
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("display_name", "==", displayName))
        const snapshot = await getDocs(q)
        
        if (snapshot.empty) {
          setIsUserNotFound(true)
          return
        }

        const userData = snapshot.docs[0].data()
        const uid = snapshot.docs[0].id
        setProfile(userData)

        // Fetch links
        const linksRef = collection(db, `users/${uid}/links`)
        const linksQ = query(linksRef, orderBy("createdAt", "desc"))
        const linksSnapshot = await getDocs(linksQ)
        
        const fetchedLinks: LinkType[] = []
        linksSnapshot.forEach(docSnap => {
          fetchedLinks.push(docSnap.data() as LinkType)
        })
        setLinks(fetchedLinks)
      } catch (error) {
        console.error("Error fetching user data", error)
        setIsUserNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [displayName])

  if (isUserNotFound) {
    notFound()
  }

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-[#F9F9F9] p-6">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-[#F9F9F9]">
      <div className="w-full flex justify-center items-center bg-black text-white px-6 py-4 sticky top-0 z-50 shadow-[0_2px_0_0_rgba(0,0,0,1)]">
        <div className="font-black text-xl italic uppercase tracking-tighter">MyLink</div>
      </div>

      <div className="flex w-full flex-col items-center gap-6 p-6 mt-8 mb-20 max-w-md">
        <header className="mb-4 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-[3px] border-black overflow-hidden shadow-[4px_4px_0_0_#000] mb-4 bg-[#D7E8FF] flex items-center justify-center">
            <span className="text-4xl font-black">{profile.username?.charAt(0).toUpperCase() || "U"}</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-black">{profile.username}</h1>
          <div className="mt-1 font-medium text-sm text-black/50">@{profile.display_name}</div>
          <p className="mt-4 font-medium text-black text-base text-center max-w-[300px]">
            {profile.bio || "나의 모든 링크를 한 눈에 확인하세요."}
          </p>
        </header>

        <main className="flex flex-col gap-4 w-full">
          {links.length === 0 ? (
            <div className="text-center text-black/50 mt-10">등록된 링크가 없습니다.</div>
          ) : (
            links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                colorClass="bg-white"
                readonly
              />
            ))
          )}
        </main>

        <footer className="mt-12 text-center text-xs font-bold text-black border-t-2 border-black pt-4 mb-4 w-full">
          © {new Date().getFullYear()} MyLink. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

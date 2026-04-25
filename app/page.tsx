"use client"

import * as React from "react"
import { Loader2, LogOut } from "lucide-react"
import { links as initialLinks, Link } from "@/data/links"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkCard } from "@/components/link-card"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { db, auth, googleProvider } from "@/lib/firebase"
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, deleteDoc } from "firebase/firestore"
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"
import { cn } from "@/lib/utils"

export interface UserProfile {
  id: string;
  display_name: string;
  username: string;
  bio: string;
}

export default function Page() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [links, setLinks] = React.useState<Link[]>([])
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoggingIn, setIsLoggingIn] = React.useState(false)

  const colors = [
    "bg-[#FFD7E8]", // Soft Pink
    "bg-[#D1FFD7]", // Soft Green
    "bg-[#D7E8FF]", // Soft Blue
    "bg-[#FFF2D7]", // Soft Yellow
    "bg-[#E8D7FF]", // Soft Purple
  ]

  const fetchLinks = async (uid: string) => {
    setIsLoaded(false)
    try {
      const linksRef = collection(db, `users/${uid}/links`)
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

  const ensureUserProfile = async (currentUser: User) => {
    try {
      const userRef = doc(db, "users", currentUser.uid)
      const userSnap = await getDoc(userRef)
      const email = currentUser.email || ""
      const defaultDisplayName = email.split("@")[0] || currentUser.uid.substring(0, 8)

      if (!userSnap.exists() || !userSnap.data()?.display_name) {
        console.log("프로필 정보 세팅 중...", currentUser.uid);
        const newData = {
          id: currentUser.uid,
          display_name: userSnap.data()?.display_name || defaultDisplayName,
          username: userSnap.data()?.username || currentUser.displayName || "",
          bio: userSnap.data()?.bio || "나의 모든 링크를 한 눈에 확인하세요.",
          updated_at: userSnap.data()?.updated_at || Date.now()
        }

        await setDoc(userRef, newData, { merge: true })
        setProfile(newData as UserProfile)
        console.log("✅ 프로필 필수 필드 업데이트 완료");
      } else {
        setProfile(userSnap.data() as UserProfile)
      }
    } catch (error: any) {
      console.error("Failed to ensure user profile:", error)
      alert("Firestore 권한 또는 저장 에러가 발생했습니다: " + error.message)
    }
  }

  // 인증 상태 감지
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        ensureUserProfile(currentUser)
        fetchLinks(currentUser.uid)
      } else {
        setLinks([])
        setIsLoaded(true)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.log("로그인 팝업이 닫혔습니다.")
      } else {
        console.error("로그인 실패", error)
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("로그아웃 실패", error)
    }
  }

  // 링크 추가 핸들러
  const handleAddLink = async (newLink: Link) => {
    if (!user) return
    try {
      await setDoc(doc(db, `users/${user.uid}/links`, newLink.id), newLink)
      setLinks((prev) => [newLink, ...prev])
    } catch (e) {
      console.error("Failed to add new link to Firestore", e)
    }
  }

  // 링크 수정 핸들러
  const handleUpdateLink = async (id: string, updatedFields: Partial<Link>) => {
    if (!user) return
    try {
      const linkRef = doc(db, `users/${user.uid}/links`, id)
      const updateData = { ...updatedFields, updatedAt: Date.now() }
      await setDoc(linkRef, updateData, { merge: true })
      setLinks((prev) =>
        prev.map((link) => (link.id === id ? { ...link, ...updateData } : link))
      )
    } catch (e) {
      console.error("Failed to update link in Firestore", e)
    }
  }

  // 링크 삭제 핸들러
  const handleDeleteLink = async (id: string) => {
    if (!user) return
    try {
      const linkRef = doc(db, `users/${user.uid}/links`, id)
      await deleteDoc(linkRef)
      setLinks((prev) => prev.filter((link) => link.id !== id))
    } catch (e) {
      console.error("Failed to delete link in Firestore", e)
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
    <div className="flex min-h-svh flex-col items-center justify-start bg-[#F9F9F9]">
      {/* Top Bar Header */}
      <div className="w-full flex justify-between items-center bg-black text-white px-6 py-4 sticky top-0 z-50 shadow-[0_2px_0_0_rgba(0,0,0,1)]">
        <div className="font-black text-xl italic uppercase tracking-tighter">MyLink</div>
        {user ? (
          <ProfileDropdown
            username={profile?.username || user.displayName || "관리자"}
            displayName={profile?.display_name || ""}
            photoURL={user.photoURL}
            onLogout={handleLogout}
          />
        ) : (
          <div className="font-bold text-sm text-white/50">Admin</div>
        )}
      </div>

      <div className={cn("flex w-full flex-col items-center gap-6 p-6 mt-8 mb-20", user ? "max-w-md" : "max-w-5xl")}>
        {!user ? (
          <div className="flex flex-col items-center w-full text-center">
            {/* Hero Section */}
            <h1
              className="text-5xl md:text-7xl font-black tracking-normal leading-[1.2] mb-16 px-4 font-sans uppercase"
              style={{
                color: '#D7E8FF',
                WebkitTextStroke: '4px black',
                paintOrder: 'stroke fill',
                textShadow: '6px 6px 0px black'
              }}
            >
              Develop Your<br />Own Links
            </h1>

            <Button
              disabled={isLoggingIn}
              onClick={handleLogin}
              className="px-10 h-16 text-lg font-bold bg-white text-black border-2 border-black rounded-2xl shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3 hover:bg-[#D7E8FF]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 시작하기
            </Button>

            {/* Visual Mockup Card */}
            <div className="mt-24 relative w-full max-w-2xl h-80 bg-white border-4 border-black rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.1)] p-8 overflow-hidden pointer-events-none">
              {/* Profile Skeleton */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200" />
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-100 rounded-full" />
                  <div className="w-24 h-3 bg-gray-50 rounded-full" />
                </div>
              </div>

              {/* Link Items Skeleton */}
              <div className="space-y-4">
                <div className="w-full h-16 bg-[#eef4ff] rounded-2xl border-2 border-transparent flex items-center px-4 gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#dbeafe]" />
                  <div className="w-48 h-3 bg-[#dbeafe] rounded-full opacity-50" />
                </div>
                <div className="w-full h-16 bg-gray-50 rounded-2xl border-2 border-transparent flex items-center px-4 gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="w-40 h-3 bg-gray-200 rounded-full opacity-50" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <header className="mb-4 text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-[3px] border-black overflow-hidden shadow-[4px_4px_0_0_#000] mb-4 bg-[#D7E8FF] flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black">{profile?.username?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-black">
                {profile?.username || "사용자"}
              </h1>
              <p className="font-medium text-black/50 text-sm mt-1">@{profile?.display_name || "id"}</p>
              <p className="font-medium text-black mt-4 text-base">
                {profile?.bio || "나의 모든 링크를 한 눈에 확인하세요."}
              </p>
            </header>

            <main className="flex flex-col gap-4 w-full">
              <div className="mb-2 w-full">
                <LinkAddDialog onAdd={handleAddLink} />
              </div>

              <div className="flex flex-col gap-4 w-full">
                {links.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    colorClass="bg-white"
                    onUpdate={handleUpdateLink}
                    onDelete={handleDeleteLink}
                  />
                ))}
              </div>
            </main>
          </>
        )}

        <footer className="mt-12 text-center text-xs font-bold text-black border-t-2 border-black pt-4 mb-4">
          © {new Date().getFullYear()} MyLink. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

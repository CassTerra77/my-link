"use client"

import * as React from "react"
import { Loader2, LogOut } from "lucide-react"
import { links as initialLinks, Link } from "@/data/links"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkAddDialog } from "@/components/link-add-dialog"
import { LinkCard } from "@/components/link-card"
import { db, auth, googleProvider } from "@/lib/firebase"
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, deleteDoc } from "firebase/firestore"
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth"

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
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm hidden sm:inline-block">
              {user.displayName} 님
            </span>
            <Button
              size="sm"
              onClick={handleLogout}
              className="bg-white text-black border-2 border-white font-bold shadow-[2px_2px_0_0_rgba(255,255,255,0.7)] hover:bg-gray-200 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline-block">로그아웃</span>
            </Button>
          </div>
        ) : (
          <div className="font-bold text-sm text-white/50">Admin</div>
        )}
      </div>

      <div className="flex w-full max-w-md flex-col gap-6 p-6 mt-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center text-center mt-12 p-8 border-2 border-black bg-white shadow-[6px_6px_0_0_#000] rounded-xl">
            <div className="bg-[#D1FFD7] w-16 h-16 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center mb-6">
              <span className="text-2xl">👋</span>
            </div>
            <h2 className="text-2xl font-black mb-4 tracking-tight drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">서비스 시작하기</h2>
            <p className="font-bold text-sm mb-8 text-black/70 leading-relaxed">
              구글 계정으로 로그인하고<br />나만의 쉽고 개성 있는 링크 페이지를<br />만들어 보세요!
            </p>
            <Button
              disabled={isLoggingIn}
              onClick={handleLogin}
              className="w-full font-black text-base h-14 bg-[#FFD7E8] text-black border-2 border-black shadow-[4px_4px_0_0_#000] hover:bg-[#FFD7E8] hover:translate-y-[4px] hover:translate-x-[4px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {isLoggingIn ? "로그인 중..." : "Google로 시작하기"}
            </Button>
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

            <main className="flex flex-col gap-4">
              <div className="mb-2">
                <LinkAddDialog onAdd={handleAddLink} />
              </div>

              <div className="flex flex-col gap-4">
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

"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserProfile } from "@/types"
import { toast } from "sonner"
import { User } from "firebase/auth"

export function useProfile(user: User | null) {
  const queryClient = useQueryClient()
  const uid = user?.uid

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', uid],
    queryFn: async () => {
      if (!uid || !user) return null
      
      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists() || !userSnap.data()?.display_name) {
        console.log("프로필 정보 세팅 중...", uid);
        const email = user.email || ""
        const defaultDisplayName = email.split("@")[0] || uid.substring(0, 8)
        
        const newData = {
          id: uid,
          display_name: userSnap.data()?.display_name || defaultDisplayName,
          username: userSnap.data()?.username || user.displayName || "",
          bio: userSnap.data()?.bio || "나의 모든 링크를 한 눈에 확인하세요.",
          updated_at: userSnap.data()?.updated_at || Date.now()
        }

        await setDoc(userRef, newData, { merge: true })
        return newData as UserProfile
      }
      
      return userSnap.data() as UserProfile
    },
    enabled: !!uid && !!user,
  })

  const updateProfile = useMutation({
    mutationFn: async ({ field, value }: { field: keyof UserProfile, value: string }) => {
      if (!uid) throw new Error("No user")
      
      if (field === 'username' || field === 'display_name') {
        if (value.length < 2) {
          throw new Error("최소 2글자 이상 입력해주세요.")
        }
        
        const usersRef = collection(db, "users")
        const q = query(usersRef, where(field, "==", value))
        const snapshot = await getDocs(q)
        const others = snapshot.docs.filter(docSnap => docSnap.id !== uid)
        
        if (others.length > 0) {
          throw new Error(`이미 사용중인 ${field === 'username' ? '유저네임' : '디스플레이 네임'}입니다.`)
        }
      }

      const userRef = doc(db, "users", uid)
      await setDoc(userRef, { [field]: value, updated_at: Date.now() }, { merge: true })
      return { field, value }
    },
    onMutate: async ({ field, value }) => {
      // 낙관적 업데이트 로직 (Optimistic Update)
      await queryClient.cancelQueries({ queryKey: ['profile', uid] })
      
      const previousProfile = queryClient.getQueryData<UserProfile>(['profile', uid])
      
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(['profile', uid], {
          ...previousProfile,
          [field]: value
        })
      }
      
      return { previousProfile }
    },
    onError: (err: any, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', uid], context.previousProfile)
      }
      toast.error(err.message || "업데이트에 실패했습니다.", { duration: 5000 })
    },
    onSuccess: () => {
      toast.success("프로필이 업데이트되었습니다.", { duration: 5000 })
    },
    onSettled: () => {
      // 무효화를 통해 최신 데이터 보장
      queryClient.invalidateQueries({ queryKey: ['profile', uid] })
    }
  })

  return {
    profile,
    isLoading,
    updateProfile: updateProfile.mutateAsync
  }
}

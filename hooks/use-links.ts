"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Link, links as initialLinks } from "@/data/links"

export function useLinks(uid?: string) {
  const queryClient = useQueryClient()

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links', uid],
    queryFn: async () => {
      if (!uid) return []
      
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
        
        const newSnapshot = await getDocs(q)
        const fetchedLinks: Link[] = []
        newSnapshot.forEach((docSnap) => {
          fetchedLinks.push(docSnap.data() as Link)
        })
        return fetchedLinks
      } else {
        const fetchedLinks: Link[] = []
        querySnapshot.forEach((docSnap) => {
          fetchedLinks.push(docSnap.data() as Link)
        })
        return fetchedLinks
      }
    },
    enabled: !!uid,
  })

  const addLink = useMutation({
    mutationFn: async (newLink: Link) => {
      if (!uid) throw new Error("No user")
      await setDoc(doc(db, `users/${uid}/links`, newLink.id), newLink)
      return newLink
    },
    onMutate: async (newLink) => {
      await queryClient.cancelQueries({ queryKey: ['links', uid] })
      const previousLinks = queryClient.getQueryData<Link[]>(['links', uid])
      if (previousLinks) {
        queryClient.setQueryData<Link[]>(['links', uid], [newLink, ...previousLinks])
      }
      return { previousLinks }
    },
    onError: (err, newLink, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['links', uid], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] })
    }
  })

  const updateLink = useMutation({
    mutationFn: async ({ id, updatedFields }: { id: string, updatedFields: Partial<Link> }) => {
      if (!uid) throw new Error("No user")
      const linkRef = doc(db, `users/${uid}/links`, id)
      const updateData = { ...updatedFields, updatedAt: Date.now() }
      await setDoc(linkRef, updateData, { merge: true })
      return { id, updateData }
    },
    onMutate: async ({ id, updatedFields }) => {
      await queryClient.cancelQueries({ queryKey: ['links', uid] })
      const previousLinks = queryClient.getQueryData<Link[]>(['links', uid])
      if (previousLinks) {
        queryClient.setQueryData<Link[]>(['links', uid], 
          previousLinks.map(link => link.id === id ? { ...link, ...updatedFields } : link)
        )
      }
      return { previousLinks }
    },
    onError: (err, variables, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['links', uid], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] })
    }
  })

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      if (!uid) throw new Error("No user")
      const linkRef = doc(db, `users/${uid}/links`, id)
      await deleteDoc(linkRef)
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['links', uid] })
      const previousLinks = queryClient.getQueryData<Link[]>(['links', uid])
      if (previousLinks) {
        queryClient.setQueryData<Link[]>(['links', uid], previousLinks.filter(link => link.id !== id))
      }
      return { previousLinks }
    },
    onError: (err, id, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['links', uid], context.previousLinks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['links', uid] })
    }
  })

  return {
    links,
    isLoading,
    addLink: addLink.mutateAsync,
    updateLink: updateLink.mutateAsync,
    deleteLink: deleteLink.mutateAsync
  }
}

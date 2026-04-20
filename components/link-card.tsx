"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pencil, Trash2, Loader2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/data/links"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "제목은 최소 2글자 이상이어야 합니다.")
    .max(20, "제목은 최대 20글자까지 가능합니다."),
  url: z
    .string()
    .trim()
    .min(1, "URL을 입력해주세요.")
    .url("올바른 URL 형식이 아닙니다. (예: https://...)"),
})

type FormValues = z.infer<typeof formSchema>

interface LinkCardProps {
  link: Link
  colorClass: string
  onUpdate: (id: string, newLink: Partial<Link>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function LinkCard({ link, colorClass, onUpdate, onDelete }: LinkCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  // Edit cancel handle
  const handleCancelEdit = () => {
    reset({
      title: link.title,
      url: link.url,
    })
    setIsEditing(false)
  }

  const onSubmit = async (data: FormValues) => {
    // 도메인 추출하여 파비콘 URL 생성
    const domain = new URL(data.url).hostname
    const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

    await onUpdate(link.id, {
      title: data.title,
      url: data.url,
      icon,
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(link.id)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (isEditing) {
    return (
      <Card
        className={`p-4 border-2 border-black transition-all shadow-neo flex flex-col gap-4 bg-[#F9F9F9]`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <div className="grid gap-2">
            <Label htmlFor={`title-${link.id}`} className="text-base font-bold">제목</Label>
            <Input
              id={`title-${link.id}`}
              placeholder="예: 나의 블로그"
              {...register("title")}
              className={errors.title ? "border-red-500 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]" : "border-black"}
            />
            {errors.title && (
              <p className="text-sm font-black text-red-500 italic uppercase tracking-tight">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`url-${link.id}`} className="text-base font-bold">URL</Label>
            <Input
              id={`url-${link.id}`}
              placeholder="https://example.com"
              {...register("url")}
              className={errors.url ? "border-red-500 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]" : "border-black"}
            />
            {errors.url && (
              <p className="text-sm font-black text-red-500 italic uppercase tracking-tight">{errors.url.message}</p>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              onClick={handleCancelEdit}
              className="border-2 border-black hover:bg-gray-200 transition-all shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-white text-black"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`border-2 border-black transition-all flex items-center justify-center ${
                isValid && !isSubmitting
                ? "shadow-neo bg-[#D1FFD7] text-black hover:bg-[#86efac] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" 
                : "opacity-50 bg-gray-200 cursor-not-allowed shadow-none text-black"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              저장
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <>
      <Card
        className={`flex flex-row items-center justify-between border-2 border-black p-4 transition-all shadow-neo hover:shadow-neo-hover active:translate-x-[2px] active:translate-y-[2px] ${colorClass}`}
      >
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center gap-4 flex-1 min-w-0 mr-4 no-underline"
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
          <span className="text-xl font-black text-black truncate">{link.title}</span>
        </a>

        <div className="flex gap-2 shrink-0">
          <Button
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              setIsEditing(true)
            }}
            className="w-10 h-10 border-2 border-black bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            aria-label="편집"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              setIsDeleteDialogOpen(true)
            }}
            className="w-10 h-10 border-2 border-black bg-[#FFD7E8] text-red-600 hover:bg-[#ffb6d9] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            aria-label="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] border-4 border-black shadow-neo bg-[#F9F9F9] rounded-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic">정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription className="text-black font-medium mt-2">
              <span className="inline-block px-2 py-1 bg-white border-2 border-black font-bold mr-1 rounded-lg">
                {link.title}
              </span>
              링크를 삭제합니다.
              <br />
              <span className="text-red-500 font-bold block mt-2">이 작업은 되돌릴 수 없습니다.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end pt-4">
            <Button
              type="button"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="border-2 border-black bg-white text-black hover:bg-gray-100 shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-bold"
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="border-2 border-black bg-[#ff4a4a] text-white hover:bg-red-600 shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-bold"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

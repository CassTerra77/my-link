"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@/data/links"

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

interface LinkAddDialogProps {
  onAdd: (link: Link) => Promise<void> | void
}

export function LinkAddDialog({ onAdd }: LinkAddDialogProps) {
  const [open, setOpen] = React.useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      url: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    // 도메인 추출하여 파비콘 URL 생성
    const domain = new URL(data.url).hostname
    const icon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

    const newLink: Link = {
      id: crypto.randomUUID(),
      title: data.title,
      url: data.url,
      icon,
      createdAt: Date.now(),
    }

    await onAdd(newLink)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button 
            className="w-full h-14 text-lg font-bold border-2 border-black shadow-neo hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-[#D7E8FF] text-black"
          >
            <Plus className="mr-2 h-5 w-5" />
            새 링크 추가하기
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] border-4 border-black shadow-neo bg-[#F9F9F9] rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic">새 링크 추가</DialogTitle>
          <DialogDescription className="text-black font-medium">
            공유하고 싶은 새로운 링크 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-base font-bold">제목</Label>
            <Input
              id="title"
              placeholder="예: 나의 블로그"
              {...register("title")}
              className={errors.title ? "border-red-500 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]" : "border-black"}
            />
            {errors.title && (
              <p className="text-sm font-black text-red-500 italic uppercase tracking-tight">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-base font-bold">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              {...register("url")}
              className={errors.url ? "border-red-500 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]" : "border-black"}
            />
            {errors.url && (
              <p className="text-sm font-black text-red-500 italic uppercase tracking-tight">{errors.url.message}</p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting}
              className={`w-full h-12 text-lg font-bold border-2 border-black transition-all flex items-center justify-center ${
                isValid && !isSubmitting
                ? "shadow-neo bg-[#FFD7E8] text-black hover:bg-[#FFB6D9] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" 
                : "opacity-50 bg-gray-200 cursor-not-allowed shadow-none"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  추가 중...
                </>
              ) : (
                "추가 완료"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

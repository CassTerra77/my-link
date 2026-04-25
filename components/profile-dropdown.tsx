"use client"

import * as React from "react"
import { Menu } from "@base-ui/react"
import { LogOut, Settings, Eye, BarChart, ChevronDown, HelpCircle, Copy } from "lucide-react"
import { toast } from "sonner"

export interface ProfileDropdownProps {
  username?: string
  displayName?: string
  photoURL?: string | null
  onLogout: () => void
}

export function ProfileDropdown({
  username,
  displayName,
  photoURL,
  onLogout
}: ProfileDropdownProps) {
  const copyToClipboard = () => {
    const url = `${window.location.origin}/${displayName}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success("링크가 클립보드에 복사되었습니다!")
    }).catch(() => {
      toast.error("링크 복사에 실패했습니다.")
    })
  }

  return (
    <Menu.Root>
      <Menu.Trigger className="group flex items-center justify-center w-10 h-10 bg-white border-[2.5px] border-black overflow-hidden rounded-full hover:translate-y-[2px] transition-all outline-none cursor-pointer p-0">
        {photoURL ? (
          <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-black">{username?.charAt(0).toUpperCase() || "U"}</span>
        )}
      </Menu.Trigger>
      
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8}>
          <Menu.Popup className="z-50 w-56 bg-white border-[3px] border-black p-2 text-black rounded-xl flex flex-col gap-1 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
            
            <Menu.Item 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold cursor-pointer hover:bg-[#D7E8FF] focus:bg-[#D7E8FF] focus:outline-none select-none transition-colors rounded-lg border-2 border-transparent hover:border-black" 
              onClick={() => {
                if (displayName) {
                  window.open(`/${displayName}`, '_blank')
                } else {
                  toast.error('프로필 ID가 설정되지 않았습니다.')
                }
              }}
            >
              <Eye className="w-4 h-4" />
              내 페이지 보기
            </Menu.Item>

            <Menu.Item 
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold cursor-pointer hover:bg-[#FFF2D7] focus:bg-[#FFF2D7] focus:outline-none select-none transition-colors rounded-lg border-2 border-transparent hover:border-black" 
              onClick={copyToClipboard}
            >
              <Copy className="w-4 h-4" />
              링크 복사
            </Menu.Item>

            <Menu.Item className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold cursor-pointer hover:bg-[#FFD7E8] focus:bg-[#FFD7E8] focus:outline-none select-none transition-colors rounded-lg border-2 border-transparent hover:border-black">
              <Settings className="w-4 h-4" />
              프로필 설정
            </Menu.Item>

            <Menu.Item className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold cursor-pointer hover:bg-[#D1FFD7] focus:bg-[#D1FFD7] focus:outline-none select-none transition-colors rounded-lg border-2 border-transparent hover:border-black" onClick={() => toast.info("방문자 통계 기능은 준비 중입니다!")}>
              <BarChart className="w-4 h-4" />
              방문자 통계 (준비중)
            </Menu.Item>

            <Menu.Item className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold cursor-pointer hover:bg-[#E8D7FF] focus:bg-[#E8D7FF] focus:outline-none select-none transition-colors rounded-lg border-2 border-transparent hover:border-black" onClick={() => toast.info("고객센터 준비 중입니다.")}>
              <HelpCircle className="w-4 h-4" />
              고객 피드백
            </Menu.Item>

            <div className="h-px bg-black my-1" />

            <Menu.Item className="flex items-center gap-3 px-3 py-2.5 text-sm font-black text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:outline-none select-none transition-colors rounded-lg border-2 border-transparent hover:border-red-600" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              로그아웃
            </Menu.Item>

          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

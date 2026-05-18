"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLinks } from "@/hooks/use-links"
import { Loader2, ArrowLeft, MousePointerClick, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  clicks: {
    label: "클릭 수",
    color: "#D1FFD7", // Soft Green (Neobrutalism style)
  },
} satisfies ChartConfig

export default function StatsPage() {
  const [user, setUser] = React.useState<User | null>(null)
  const [isAuthLoaded, setIsAuthLoaded] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // 비로그인 시 메인 페이지로 리다이렉트
        router.push("/")
      } else {
        setUser(currentUser)
      }
      setIsAuthLoaded(true)
    })
    return () => unsubscribe()
  }, [router])

  const { links, isLoading } = useLinks(user?.uid)

  if (!isAuthLoaded || isLoading || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#F9F9F9]">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    )
  }

  // 총 클릭수 계산
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)

  // 차트 데이터 (조회수 기준 내림차순 정렬)
  const chartData = [...links]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .map(link => ({
      title: link.title.length > 8 ? link.title.slice(0, 8) + "..." : link.title,
      clicks: link.clicks || 0,
    }))

  return (
    <div className="flex min-h-svh flex-col items-center justify-start bg-[#F9F9F9]">
      <div className="w-full h-[72px] flex justify-between items-center bg-black text-white px-6 sticky top-0 z-50 shadow-[0_2px_0_0_rgba(0,0,0,1)]">
        <div 
          className="font-black text-xl italic uppercase tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/")}
        >
          MyLink
        </div>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/20 font-bold"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
      </div>

      <main className="flex w-full flex-col items-center gap-6 p-6 mt-8 mb-20 max-w-4xl">
        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <Card className="border-4 border-black bg-[#FFD7E8] shadow-neo rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black uppercase flex items-center gap-2 text-black">
                <MousePointerClick className="w-6 h-6" />
                Total Clicks
              </CardTitle>
              <CardDescription className="text-black/70 font-bold">
                모든 링크의 총 클릭 수 합산
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black tracking-tighter drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white" style={{ WebkitTextStroke: '2px black' }}>
                {totalClicks.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-black bg-[#D7E8FF] shadow-neo rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black uppercase flex items-center gap-2 text-black">
                <TrendingUp className="w-6 h-6" />
                Active Links
              </CardTitle>
              <CardDescription className="text-black/70 font-bold">
                등록된 활성 링크 개수
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black tracking-tighter drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-white" style={{ WebkitTextStroke: '2px black' }}>
                {links.length.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 차트 영역 */}
        <Card className="w-full border-4 border-black bg-white shadow-neo rounded-2xl overflow-hidden mt-4">
          <CardHeader className="border-b-4 border-black bg-[#FFF2D7] p-6">
            <CardTitle className="text-2xl font-black uppercase text-black">Click Distribution</CardTitle>
            <CardDescription className="text-black font-bold">
              각 링크별 조회수 상세 통계
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-10">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart data={chartData} accessibilityLayer margin={{ top: 20, left: -20, right: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#000" strokeDasharray="4 4" opacity={0.2} />
                  <XAxis 
                    dataKey="title" 
                    tickLine={false}
                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                    tick={{ fill: '#000', fontWeight: 'bold' }}
                    tickMargin={12}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                    tick={{ fill: '#000', fontWeight: 'bold' }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                    content={<ChartTooltipContent className="border-2 border-black shadow-neo font-bold" />} 
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="var(--color-clicks)" 
                    radius={[4, 4, 0, 0]} 
                    stroke="#000"
                    strokeWidth={2}
                    maxBarSize={48}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-black/50 font-bold">
                등록된 링크가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

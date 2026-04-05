import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4 selection:bg-purple-500/30 dark:bg-black/90">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-[blob_7s_infinite] dark:opacity-30"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-[blob_7s_infinite_2s] dark:opacity-30"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-[blob_7s_infinite_4s] dark:opacity-30"></div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white/50 dark:bg-black/40 p-8 shadow-2xl backdrop-blur-xl border border-white/40 dark:border-white/10 transform transition-all duration-500 hover:-translate-y-1">
        
        {/* Profile Image Section */}
        <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white/60 dark:border-white/10 shadow-lg group">
          <Image
            src="/profile.png"
            alt="송민진 프로필 이미지"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h1 className="mb-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-fuchsia-500 drop-shadow-sm dark:from-blue-400 dark:via-purple-500 dark:to-fuchsia-400">
            송민진
          </h1>
          <h2 className="mb-6 text-lg font-medium text-gray-700 dark:text-gray-300">
            Vibe Coding Student
          </h2>
          <p className="mb-8 text-base text-gray-700 dark:text-gray-400 leading-relaxed font-medium">
            안녕하세요! 트렌디한 기술로 세상을 바꾸고 싶은 대학생입니다. 
            주로 <span className="font-semibold text-purple-600 dark:text-purple-400">Next.js</span>와 <span className="font-semibold text-blue-600 dark:text-blue-400">Tailwind CSS</span>를 활용한 직관적이고 아름다운 UI/UX 구현에 관심이 많습니다. 요즘은 <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">바이브 코딩</span>에 푹 빠져 있어요!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:contact@example.com"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1 hover:shadow-purple-500/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Contact Me
            </a>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://github.com/CassTerra77" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/80 dark:bg-white/5 p-3 text-gray-800 dark:text-gray-200 transition-all hover:-translate-y-1 hover:bg-white dark:hover:bg-white/10 shadow-sm border border-black/5 dark:border-white/5">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.698-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.528 2.341 1.087 2.91.83.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </a>
              <a href="#" className="rounded-full bg-white/80 dark:bg-white/5 p-3 text-gray-800 dark:text-gray-200 transition-all hover:-translate-y-1 hover:bg-white dark:hover:bg-white/10 shadow-sm border border-black/5 dark:border-white/5">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="rounded-full bg-white/80 dark:bg-white/5 p-3 text-gray-800 dark:text-gray-200 transition-all hover:-translate-y-1 hover:bg-white dark:hover:bg-white/10 shadow-sm border border-black/5 dark:border-white/5">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

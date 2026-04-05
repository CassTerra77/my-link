import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-pink-400 selection:text-black">
      {/* Navigation */}
      <nav className="border-b-4 border-foreground p-4 lg:px-8 flex justify-between items-center bg-yellow-400 overflow-hidden">
        <div className="text-2xl sm:text-3xl font-black tracking-tighter uppercase whitespace-nowrap">Minjin Song</div>
        <div className="space-x-6 hidden sm:block font-bold text-lg">
          <Link href="#about" className="hover:underline decoration-4">About</Link>
          <Link href="#skills" className="hover:underline decoration-4">Skills</Link>
          <Link href="#contact" className="hover:underline decoration-4">Contact</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 lg:p-12 pb-24 space-y-24 sm:space-y-32">
        
        {/* HERO SECTION */}
        <section id="about" className="pt-12 sm:pt-24 flex flex-col items-start gap-8 relative">
          <div className="inline-block bg-pink-400 border-4 border-foreground px-4 py-2 font-black text-xl md:text-2xl uppercase transform -rotate-2 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            Hello, World!
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black leading-none tracking-tighter uppercase">
            I build <br className="hidden sm:block" /> 
            <span className="inline-block bg-blue-400 px-2 sm:px-4 mt-2 sm:mt-4 border-4 sm:border-y-8 sm:border-x-4 border-foreground shadow-[8px_8px_0px_rgba(0,0,0,1)]">Digital</span> 
            <br className="hidden lg:block"/> Experiences
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold max-w-3xl mt-4 leading-tight border-l-8 border-foreground pl-6 py-2">
            안녕하세요! 송민진입니다. 트렌디한 기술로 세상을 바꾸고 싶은 Vibe Coding Student. Next.js와 Tailwind CSS를 활용한 직관적이고 강렬한 UI/UX를 구현합니다.
          </p>
          
          {/* Decorative element */}
          <div className="absolute right-0 top-10 hidden lg:block select-none pointer-events-none">
            <div className="w-48 h-48 bg-yellow-400 border-4 border-foreground rounded-full shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-bounce"></div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-8 sm:space-y-12">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight border-b-8 border-foreground pb-4 inline-block">
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Skill Card 1 */}
            <div className="bg-emerald-400 border-4 border-foreground p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all cursor-crosshair">
              <div className="w-12 h-12 bg-black text-white border-4 border-foreground mb-6 rounded-full flex items-center justify-center">
                 <span className="font-black">1</span>
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase">Frontend</h3>
              <ul className="text-lg font-bold space-y-3">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> React 19</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Next.js (App Router)</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> TypeScript</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Tailwind CSS 4</li>
              </ul>
            </div>
            {/* Skill Card 2 */}
            <div className="bg-yellow-400 border-4 border-foreground p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all cursor-crosshair">
              <div className="w-12 h-12 bg-black text-white border-4 border-foreground mb-6 flex items-center justify-center">
                 <span className="font-black transform rotate-45">2</span>
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase">Design</h3>
              <ul className="text-lg font-bold space-y-3">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Figma</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> UI/UX Prototyping</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Neobrutalism</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Responsive Web</li>
              </ul>
            </div>
            {/* Skill Card 3 */}
            <div className="bg-red-400 border-4 border-foreground p-6 sm:p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all cursor-crosshair">
              <div className="w-12 h-12 bg-black text-white border-4 border-foreground mb-6 clip-path-polygon-[50%_0%,_0%_100%,_100%_100%] flex items-center justify-center">
                 <span className="font-black">3</span>
              </div>
              <h3 className="text-3xl font-black mb-4 uppercase">Workflow</h3>
              <ul className="text-lg font-bold space-y-3">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Vibe Coding</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Git / GitHub</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Vercel Deployment</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-foreground inline-block"></span> Agile Methods</li>
              </ul>
            </div>
          </div>
        </section>

        {/* MOCK PROJECTS SECTION */}
        <section id="projects" className="space-y-8 sm:space-y-12">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight border-b-8 border-foreground pb-4 inline-block">
            Projects
          </h2>
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row border-4 border-foreground bg-white shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden group">
              <div className="w-full lg:w-2/5 bg-purple-400 border-b-4 lg:border-b-0 lg:border-r-4 border-foreground p-8 flex items-center justify-center transition-colors group-hover:bg-purple-500">
                <span className="text-5xl sm:text-6xl font-black text-center transform -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110">PROJECT<br/>ALPHA</span>
              </div>
              <div className="p-8 lg:p-12 w-full lg:w-3/5 flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl font-black mb-4 uppercase">My Web Portfolio</h3>
                <p className="text-xl font-bold mb-8 leading-relaxed">개인 브랜드 강화를 위한 네오브루탈리즘 스타일 랜딩 페이지 구축. 심플하면서도 강렬한 인상을 남기도록 디자인되었습니다.</p>
                <div className="flex flex-wrap gap-4 font-bold">
                  <span className="bg-foreground text-background px-4 py-2 text-sm uppercase">Next.js</span>
                  <span className="bg-foreground text-background px-4 py-2 text-sm uppercase">Tailwind css</span>
                </div>
              </div>
            </div>
            
             <div className="flex flex-col lg:flex-row-reverse border-4 border-foreground bg-white shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden group">
              <div className="w-full lg:w-2/5 bg-blue-400 border-b-4 lg:border-b-0 lg:border-l-4 border-foreground p-8 flex items-center justify-center transition-colors group-hover:bg-blue-500">
                <span className="text-5xl sm:text-6xl font-black text-center transform rotate-6 transition-transform group-hover:rotate-0 group-hover:scale-110">CLONE<br/>APP</span>
              </div>
              <div className="p-8 lg:p-12 w-full lg:w-3/5 flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl font-black mb-4 uppercase">Social Media Dashboard</h3>
                <p className="text-xl font-bold mb-8 leading-relaxed">다양한 차트와 데이터를 한눈에 볼 수 있는 대시보드 애플리케이션 시안입니다. 컴포넌트 재사용성을 고려하여 설계되었습니다.</p>
                <div className="flex flex-wrap gap-4 font-bold">
                  <span className="bg-foreground text-background px-4 py-2 text-sm uppercase">React</span>
                  <span className="bg-foreground text-background px-4 py-2 text-sm uppercase">Framer Motion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="pt-16 sm:pt-24 pb-32 flex flex-col items-center text-center">
          <h2 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase mb-12 transform rotate-1 border-b-8 border-foreground">Let's Talk!</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 w-full max-w-4xl px-4">
            <a href="mailto:contact@example.com" className="w-full sm:w-1/2 bg-blue-500 text-white text-3xl sm:text-4xl font-black px-8 py-8 border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-3 active:translate-y-3 active:shadow-none transition-all uppercase flex justify-center items-center gap-4">
               Email Me
            </a>
            <a href="https://github.com/CassTerra77" target="_blank" rel="noopener noreferrer" className="w-full sm:w-1/2 bg-black text-white text-3xl sm:text-4xl font-black px-8 py-8 border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-3 active:translate-y-3 active:shadow-none transition-all uppercase flex justify-center items-center gap-4">
               GitHub
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}

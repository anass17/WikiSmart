import React from 'react';

const HomePage = () => {
  const logoFont = { fontFamily: "'Righteous', sans-serif" };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');`}
      </style>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-black text-blue-600 tracking-wider" style={logoFont}>
            Wiki<span className="text-slate-900">Smart</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="/login" className="hover:text-blue-600 transition-colors">Log In</a>
            <a href="/register" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            The Future of Learning
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Don't just read. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Master the subject.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
            WikiSmart transforms any Wikipedia article or PDF into structured summaries, 
            fluent translations, and interactive quizzes.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="\login" className="inline-block cursor-pointer px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
              Try for Free
            </a>
            <button className="px-10 py-4 bg-white cursor-pointer text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section id="features" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4 text-slate-800">Everything you need to learn faster</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Instant Ingestion</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Seamlessly pull content from Wikipedia URLs or PDFs. We clean the text so you can focus on the knowledge.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 8 6 6M15 8l-6 6M2 5h20M7 2v3M17 2v3"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Smart Translation</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Language shouldn't be a barrier. Translate any article into English, Arabic, Spanish, or French instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">AI-Powered Quiz</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Test your retention with quizzes generated specifically from your content. Track your scores and progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-6 text-slate-800">Start learning smarter today.</h2>
          <a href="/register" className="inline-block px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-2xl">
            Create Your Account
          </a>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-black text-slate-400" style={logoFont}>
            Wiki<span className="text-slate-300">Smart</span>
          </div>

          <p className="text-xs font-medium text-slate-400">
            © 2026 WikiSmart
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
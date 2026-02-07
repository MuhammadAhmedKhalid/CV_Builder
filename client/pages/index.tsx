"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 text-center sm:py-24 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="mx-auto max-w-4xl px-4 relative">
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Beautiful Resume Templates<br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100/70">
            We're working on bringing you professionally designed CV templates. Each template will be crafted for 
            different industries and styles, fully customizable to match your personal brand.
          </p>
          
          {/* Scroll indicator */}
          <div className="mt-12 flex justify-center">
            <div className="w-6 h-10 rounded-full border-2 border-emerald-500/30 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section - No Templates Available */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Choose Your Template</h3>
              <p className="text-emerald-400/70 mt-1">Our templates are coming soon</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-5 py-2 text-sm font-medium text-emerald-300 shadow-lg shadow-black/10">
              0 Templates
            </span>
          </div>
          
          {/* No Templates Message */}
          <div className="text-center py-20 rounded-2xl bg-white/8 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-400 shadow-lg mb-6">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">No templates available now</h4>
            <p className="text-emerald-300/60 max-w-md mx-auto">
              We're currently working on creating beautiful, professional CV templates for you. Check back soon to choose from our collection!
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-2.5 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/60">
                Get Notified
              </button>
              <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-green-400 hover:shadow-emerald-500/40">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-emerald-500/10 bg-gradient-to-b from-gray-950 to-black py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-3">Why Choose Our Templates?</h3>
            <p className="text-emerald-300/60">Everything you need to create a standout resume</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-800/30 to-emerald-900/40 border border-emerald-500/30 hover:border-emerald-400/50 hover:from-emerald-800/40 hover:to-emerald-900/50 transition-all shadow-xl shadow-black/30 backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 to-green-400/40 text-emerald-300 shadow-xl shadow-emerald-500/20 border border-emerald-400/20">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="mb-3 text-lg font-semibold text-white">Easy to Customize</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                All templates feature clean, minimal CSS that's easy to modify and personalize to your style.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-800/30 to-emerald-900/40 border border-emerald-500/30 hover:border-emerald-400/50 hover:from-emerald-800/40 hover:to-emerald-900/50 transition-all shadow-xl shadow-black/30 backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 to-green-400/40 text-emerald-300 shadow-xl shadow-emerald-500/20 border border-emerald-400/20">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="mb-3 text-lg font-semibold text-white">Mobile Responsive</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every template is fully responsive and looks great on any device or screen size.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-800/30 to-emerald-900/40 border border-emerald-500/30 hover:border-emerald-400/50 hover:from-emerald-800/40 hover:to-emerald-900/50 transition-all shadow-xl shadow-black/30 backdrop-blur-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/30 to-green-400/40 text-emerald-300 shadow-xl shadow-emerald-500/20 border border-emerald-400/20">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h4 className="mb-3 text-lg font-semibold text-white">Download & Print</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Export your finished CV as PDF or print directly from your browser in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
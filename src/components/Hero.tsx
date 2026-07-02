import { ChevronRight, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenProposal: () => void;
}

export default function Hero({ onExplore, onOpenProposal }: HeroProps) {
  return (
    <div className="relative bg-stone-900 text-white overflow-hidden py-16 sm:py-24" id="hero-banner">
      {/* Visual background overlay pattern */}
      <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop')` }}></div>
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/45 via-stone-950 to-stone-950"></div>
      
      {/* Islamic geometric background accent decoration */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 hidden lg:block pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 10 M 0 0 L 10 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Eid Al-Adha Collection Now Live
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight">
              Wear Your Faith.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500">
                Aesthetic & Spiritual.
              </span>
            </h1>
            
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Discover Bangladesh's premium Islamic lifestyle apparel brand. Elegant Arabic calligraphy, high-density prints, semi-fit luxury Panjabis, and 3D wooden wall calligraphy. Crafted meticulously with premium textiles and organic linen.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplore}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 cursor-pointer group"
              >
                Shop Eid Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenProposal}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs px-6 py-3.5 rounded-full transition-all flex items-center gap-2 cursor-pointer"
              >
                View 50k TK Project Scope
              </button>
            </div>

            {/* Quick trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800/80 max-w-lg">
              {[
                { title: '100% Premium Cotton', desc: '400+ GSM Fleece & Slub' },
                { title: 'Elegant Calligraphy', desc: 'By award-winning artists' },
                { title: 'Cash on Delivery', desc: 'Secure payment on arrival' }
              ].map((badge, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="block text-xs font-bold text-white font-serif">{badge.title}</span>
                  <span className="block text-[10px] text-stone-400">{badge.desc}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Featured Hero Product Card */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative group mx-auto max-w-sm">
              {/* Decorative behind glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative bg-stone-950 border border-stone-800 rounded-2xl p-4 overflow-hidden shadow-2xl">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-900 relative">
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
                    alt="Sabr Oversized Tee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    BESTSELLER
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Sabr (Patience) Premium Oversized Tee</h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">Heavyweight 100% Organic Cotton</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-serif font-black text-amber-400 block">৳990</span>
                    <span className="text-[10px] text-stone-500 line-through">৳1,250</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

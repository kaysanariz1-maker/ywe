import React, { useState } from 'react';
import { ShoppingBag, Search, Settings, FileText, Sparkles, LogOut, Check, Shield, User, X, Lock, Phone } from 'lucide-react';
import { AuthenticatedAdmin } from '../types';

interface HeaderProps {
  activeView: 'store' | 'admin' | 'proposal' | 'admin-initiation';
  setActiveView: (view: 'store' | 'admin' | 'proposal' | 'admin-initiation') => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentAdmin?: AuthenticatedAdmin | null;
  onLogout?: () => void;
  customerSession?: { name: string; phone: string; email?: string; provider?: string; photoURL?: string } | null;
  onCustomerSignOut?: () => void;
  onOpenCustomerModal: () => void;
}

export default function Header({
  activeView,
  setActiveView,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  currentAdmin,
  onLogout,
  customerSession,
  onCustomerSignOut,
  onOpenCustomerModal
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs" id="main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Slogan */}
          <div className="flex flex-col cursor-pointer shrink-0" onClick={() => setActiveView('store')}>
            <h1 className="text-xl sm:text-2xl font-serif font-black tracking-[0.22em] text-stone-900 leading-none">
              BELIEVER<span className="text-emerald-700 font-normal">SIGN</span>
            </h1>
            <span className="text-[9px] uppercase tracking-[0.38em] text-stone-500 mt-1 font-sans">
              PREMIUM ISLAMIC WEAR
            </span>
          </div>

          {/* Search bar - hidden in proposal/admin views to keep it clean */}
          {activeView === 'store' && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
              <input
                type="text"
                placeholder="Search premium Panjabi, Sabr Tee, Wall Calligraphy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-full py-2 pl-4 pr-10 text-xs focus:outline-hidden focus:border-emerald-700 focus:bg-white transition-all text-stone-800"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
            </div>
          )}

          {/* Nav Links / Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Selection Toggle */}
            <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-full text-xs">
              <button
                onClick={() => setActiveView('store')}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  activeView === 'store'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Store
              </button>
              <button
                onClick={() => setActiveView('proposal')}
                className={`px-3 sm:px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'proposal'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Proposal</span> Deck
              </button>
              {currentAdmin && (
                <>
                  <button
                    onClick={() => setActiveView('admin')}
                    className={`px-3 sm:px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'admin'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin</span> Panel
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="px-2 py-1.5 text-stone-500 hover:text-rose-600 rounded-full transition-all cursor-pointer"
                      title={`Sign Out (${currentAdmin.name})`}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </nav>

            {/* Customer Session / Sign-In Button */}
            {customerSession ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 py-1.5 px-3 rounded-full text-xs text-emerald-950 shadow-2xs">
                {customerSession.photoURL ? (
                  <img 
                    src={customerSession.photoURL} 
                    alt={customerSession.name} 
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 bg-emerald-800 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                    {customerSession.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline font-semibold text-stone-900">{customerSession.name}</span>
                <button
                  onClick={onCustomerSignOut}
                  className="text-emerald-700 hover:text-rose-600 transition-colors cursor-pointer pl-1"
                  title="Sign Out Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenCustomerModal}
                className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-[11px] px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-amber-100" />
                <span>Customer Sign-In</span>
              </button>
            )}

            {/* Shopping Cart button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search - only shown in store view */}
        {activeView === 'store' && (
          <div className="md:hidden pb-4 relative">
            <input
              type="text"
              placeholder="Search clothing, attar, wall signs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-[13px] pointer-events-none" />
          </div>
        )}
      </div>
    </header>
  );
}

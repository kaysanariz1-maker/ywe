import { useState } from 'react';
import { 
  CheckCircle, FileText, ShieldCheck, 
  Database, ShoppingBag, DollarSign, Wallet, 
  Zap, BarChart2, Lock, Code, Globe, MessageSquare 
} from 'lucide-react';

export default function ProposalViewer() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'calculator' | 'timeline'>('overview');
  
  // Interactive Pricing Calculator State
  const [includeSMS, setIncludeSMS] = useState(true);
  const [includePaymentGateway, setIncludePaymentGateway] = useState(true);
  const [includePremiumHosting, setIncludePremiumHosting] = useState(true);
  const [includeSEO, setIncludeSEO] = useState(false);
  const [includeInvoicePDF, setIncludeInvoicePDF] = useState(true);

  const basePrice = 35000;
  const smsPrice = 3000; 
  const paymentGatewayPrice = 5000; 
  const hostingPrice = 4000; 
  const seoPrice = 5000; 
  const invoicePrice = 3000; 

  const calculateTotalPrice = () => {
    let total = basePrice;
    if (includeSMS) total += smsPrice;
    if (includePaymentGateway) total += paymentGatewayPrice;
    if (includePremiumHosting) total += hostingPrice;
    if (includeSEO) total += seoPrice;
    if (includeInvoicePDF) total += invoicePrice;
    return total;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden text-stone-800 font-sans" id="proposal-section">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-stone-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-700/50 text-emerald-200 text-xs px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> High-Fidelity Client Pitch Deck
          </div>
          <h2 className="text-3xl font-serif font-semibold tracking-tight">E-Commerce Development Proposal</h2>
          <p className="text-emerald-100/80 text-sm mt-2 max-w-2xl">
            Custom Premium Brand Store & Admin Panel inspired by <strong>"Believer Sign"</strong>. 
            Prepared for your client with a complete breakdown of a premium 50,000 BDT budget.
          </p>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: '1. Project Overview', icon: FileText },
          { id: 'features', label: '2. Features & Content', icon: Code },
          { id: 'calculator', label: '3. Cost Estimator', icon: DollarSign },
          { id: 'timeline', label: '4. Delivery Timeline', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-emerald-700 text-emerald-800 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents Content Window */}
      <div className="p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">The Challenge & Opportunity</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Brands like <strong>Believer Sign</strong> have proven massive demand in Bangladesh for high-quality, minimalistic Islamic apparel and spiritual lifestyle products. Customers require an elegant, professional, and reliable localized web experience.
                </p>
                <p className="text-stone-600 text-sm leading-relaxed">
                  A comprehensive <strong>50,000 BDT budget</strong> ensures bypass of slow templates, introducing optimized, modern code logic that provides blistering client-side speeds under tight mobile networks.
                </p>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-lg mt-0.5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900 text-sm">Standard of Excellence</h4>
                    <p className="text-emerald-800/80 text-xs mt-0.5">
                      Production-ready codebase targeting responsive layouts, real-time administrative metrics, custom workflows, and highly targeted conversion workflows.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 space-y-4">
                <h4 className="font-semibold text-stone-900 text-sm tracking-wide uppercase">Core Package Pillars</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Custom Premium Branding', desc: 'Islamic minimalist aesthetic, custom typography, animations.', icon: Globe },
                    { title: 'Payment Gateways BD', desc: 'Integrated with bKash, Nagad, Visa, Mastercard via SSLCommerz.', icon: Wallet },
                    { title: 'WhatsApp Instant Sync', desc: 'Redirects order slips directly to the sales agent on WhatsApp.', icon: MessageSquare },
                    { title: 'Admin Command Panel', desc: 'Secure panel to process orders, track inventory, and view analytics.', icon: BarChart2 },
                    { title: 'SMS Transaction API', desc: "Send automated order confirm messages to customers' phones.", icon: Database },
                    { title: 'High-Performance Hosting', desc: 'SSL certificate, custom domain, CDN cache, and hourly backups.', icon: Lock }
                  ].map((pillar, idx) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="mt-0.5 text-emerald-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-xs text-stone-800">{pillar.title}</h5>
                          <p className="text-[11px] text-stone-500">{pillar.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEATURES */}
        {activeTab === 'features' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Website Technical Table of Contents</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Module 1: Front Storefront',
                  items: ['Minimalist Page Layout', 'Dynamic Promotional Filters', 'Unified Cart Drawers', 'Responsive Design Optimization']
                },
                {
                  title: 'Module 2: BD Localization & Checkout',
                  items: ['One-Click Instant Checkout Form', 'bKash/Nagad/COD Support Hooks', 'Dynamic Shipping Rate Offsets', 'Instant WhatsApp Sync Hooks']
                },
                {
                  title: 'Module 3: Secure Back Office Hub',
                  items: ['Inventory & Catalog Manager Tools', 'Live Order State Pipeline Monitors', 'Graphical Sales Metric Tables', 'Customer Tracking Databases']
                },
                {
                  title: 'Module 4: Infrastructure Operations',
                  items: ['Production API Endpoint Bridges', 'Automated Transaction SMS Gates', 'Cloudflare Proxy Security Overlays', 'SEO Structural Schema Injectors']
                }
              ].map((mod, i) => (
                <div key={i} className="p-5 bg-stone-50 rounded-xl border border-stone-150">
                  <h4 className="font-semibold text-stone-900 text-sm mb-3">{mod.title}</h4>
                  <ul className="space-y-2 text-xs text-stone-600">
                    {mod.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COST ESTIMATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Scope Cost Builder</h3>
                
                <div className="flex justify-between items-center p-3 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800 block">Base Core Platform</span>
                    <span className="text-[10px] text-stone-500">Responsive catalog, local checkout</span>
                  </div>
                  <span className="font-semibold text-stone-700">৳ {basePrice.toLocaleString()}</span>
                </div>

                {[
                  { id: 'sms', label: 'SMS Gateway API Integration', price: smsPrice, checked: includeSMS, setter: setIncludeSMS, desc: 'Greenweb API + 2000 SMS pack alerts' },
                  { id: 'gateway', label: 'SSLCommerz / Shurjopay Setup', price: paymentGatewayPrice, checked: includePaymentGateway, setter: setIncludePaymentGateway, desc: 'Direct secure credit/debit or wallet cards' },
                  { id: 'hosting', label: 'Premium VPS Hosting (1 Year)', price: hostingPrice, checked: includePremiumHosting, setter: setIncludePremiumHosting, desc: 'High speed storage + SSL + Domain hook' },
                  { id: 'invoice', label: 'Automated PDF Invoices', price: invoicePrice, checked: includeInvoicePDF, setter: setIncludeInvoicePDF, desc: 'Generates print-ready packing slips' },
                  { id: 'seo', label: 'Google SEO Schema Markup', price: seoPrice, checked: includeSEO, setter: setIncludeSEO, desc: 'Advanced search indexing layouts' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={item.checked} 
                        onChange={(e) => item.setter(e.target.checked)} 
                        className="w-4 h-4 accent-emerald-700 rounded"
                      />
                      <div>
                        <span className="font-semibold text-stone-800 block">{item.label}</span>
                        <span className="text-[10px] text-stone-500">{item.desc}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-stone-700">৳ {item.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>

              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-800 font-semibold">Total Scope Value</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-serif font-black text-emerald-900">৳ {calculateTotalPrice().toLocaleString()}</span>
                    <span className="text-xs text-emerald-700 font-bold">BDT</span>
                  </div>
                  <p className="text-xs text-emerald-800/70 pt-2">
                    Dynamic assessment adjusting package distribution tiers natively according to custom functional requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-2">Milestone Schedule</h3>
            <div className="space-y-4 text-xs">
              {[
                { phase: 'Phase 1: Interface & Architecture Design', duration: 'Days 1-4', details: 'Fidelity page wireframing, layout schema configuration, styling configurations.' },
                { phase: 'Phase 2: Payment Pipeline Integration', duration: 'Days 5-8', details: 'Merchant account sandbox handshakes, background state flow routing.' },
                { phase: 'Phase 3: Administrative Module & Dashboard Verification', duration: 'Days 9-12', details: 'Dynamic product modification nodes, reporting grid tests.' },
                { phase: 'Phase 4: Client Assets & Production Run', duration: 'Days 13-14', details: 'Server staging deployment, SEO parameters, performance checks.' }
              ].map((t, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-150 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-900">{t.phase}</h4>
                    <p className="text-stone-500 mt-1">{t.details}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-semibold font-mono whitespace-nowrap">{t.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

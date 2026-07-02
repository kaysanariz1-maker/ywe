import React, { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, MOCK_ORDERS, MOCK_SALES_STATS } from './data';
import { Product, CartItem, Order, SalesStat, PendingAdminRequest, AuthenticatedAdmin, AdBanner } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import StoreFront from './components/StoreFront';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import ProposalViewer from './components/ProposalViewer';
import AdminInitiation from './components/AdminInitiation';
import { ShoppingBag, ChevronRight, CheckCircle, Smartphone, Award, ExternalLink, ArrowRight, ShieldCheck, Sparkles, X, Shield, Palette, Check, User } from 'lucide-react';
import { auth as firebaseAuth, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from './lib/firebase';

const INITIAL_ADMINS: AuthenticatedAdmin[] = [
  {
    id: 'dev-admin',
    name: 'Developer Admin',
    email: 'developer@example.com',
    phone: '01711122233',
    passcode: '123456',
    createdAt: '2026-06-28T11:00:00.000Z'
  }
];

export default function App() {
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'proposal' | 'checkout' | 'success' | 'admin-initiation'>('store');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('believersign_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse products from localStorage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Sync products state to localStorage
  useEffect(() => {
    localStorage.setItem('believersign_products', JSON.stringify(products));
  }, [products]);

  const [promotionalCampaigns, setPromotionalCampaigns] = useState<string[]>(() => {
    const saved = localStorage.getItem('believersign_campaigns');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse campaigns from localStorage', e);
      }
    }
    return ['Hot Sales', 'Busy Rush'];
  });

  // Sync campaigns state to localStorage
  useEffect(() => {
    localStorage.setItem('believersign_campaigns', JSON.stringify(promotionalCampaigns));
  }, [promotionalCampaigns]);

  const [adBanners, setAdBanners] = useState<AdBanner[]>(() => {
    const saved = localStorage.getItem('believersign_banners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse banners from localStorage', e);
      }
    }
    return [
      {
        id: 'b-1',
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
        targetCategory: 'tshirt',
        insertAfterRowIndex: 4
      }
    ];
  });

  // Sync banners state to localStorage
  useEffect(() => {
    localStorage.setItem('believersign_banners', JSON.stringify(adBanners));
  }, [adBanners]);

  const [stats, setStats] = useState<SalesStat[]>(MOCK_SALES_STATS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Administrative States
  const [pendingAdminRequests, setPendingAdminRequests] = useState<PendingAdminRequest[]>([]);
  const [authenticatedAdmins, setAuthenticatedAdmins] = useState<AuthenticatedAdmin[]>(() => {
    const saved = localStorage.getItem('believersign_admins');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ADMINS;
  });
  const [currentAdmin, setCurrentAdmin] = useState<AuthenticatedAdmin | null>(null);
  
  const [customerSession, setCustomerSession] = useState<{ name: string; phone: string; email?: string; provider?: string; photoURL?: string } | null>(() => {
    const saved = localStorage.getItem('believersign_customer_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState<(() => void) | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [oauthOverlay, setOauthOverlay] = useState<{
    isOpen: boolean;
    provider: 'Google' | 'Microsoft' | 'Apple';
    stage: number;
    statusText: string;
  } | null>(null);

  // Sync authenticated admins to localStorage
  useEffect(() => {
    localStorage.setItem('believersign_admins', JSON.stringify(authenticatedAdmins));
  }, [authenticatedAdmins]);

  // Sync customer session to localStorage
  useEffect(() => {
    if (customerSession) {
      localStorage.setItem('believersign_customer_session', JSON.stringify(customerSession));
    } else {
      localStorage.removeItem('believersign_customer_session');
    }
  }, [customerSession]);

  // Synchronize Firebase Authentication state on load
  useEffect(() => {
    // Check redirect result first for iframe fallback resilience
    getRedirectResult(firebaseAuth)
      .then((result) => {
        if (result?.user) {
          const user = result.user;
          const session = {
            name: user.displayName || 'Google User',
            email: user.email || '',
            phone: user.phoneNumber || '01799999999',
            provider: 'Google' as const,
            photoURL: user.photoURL || ''
          };
          setCustomerSession(session);
        }
      })
      .catch((error) => console.error("Redirect auth error:", error));

    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setCustomerSession({
          name: user.displayName || 'Google User',
          email: user.email || '',
          phone: user.phoneNumber || '01799999999',
          provider: 'Google',
          photoURL: user.photoURL || ''
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleCustomerSignOut = async () => {
    try {
      await firebaseAuth.signOut();
    } catch (e) {
      console.error('Failed to sign out from Firebase', e);
    }
    setCustomerSession(null);
  };

  const [theme, setTheme] = useState<'white' | 'off-white' | 'black'>(() => {
    const saved = localStorage.getItem('believersign_theme');
    return (saved as 'white' | 'off-white' | 'black') || 'off-white';
  });

  // Sync theme to localStorage & document classes
  useEffect(() => {
    localStorage.setItem('believersign_theme', theme);
    
    // Remove existing theme classes from HTML & body
    document.documentElement.classList.remove('theme-black', 'theme-white', 'theme-off-white');
    document.body.classList.remove('theme-black', 'theme-white', 'theme-off-white');
    
    // Add active theme class
    document.documentElement.classList.add(`theme-${theme}`);
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Scroll to top when active view shifts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Admin handlers
  const handleAddBanner = (banner: AdBanner) => {
    setAdBanners(prev => [...prev, banner]);
  };

  const handleDeleteBanner = (id: string) => {
    setAdBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleSwitchAdmin = (adminId: string) => {
    const admin = authenticatedAdmins.find(a => a.id === adminId);
    if (admin) {
      setCurrentAdmin(admin);
    }
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    setActiveView('store');
  };

  const handleSocialLogin = (provider: 'Google' | 'Microsoft' | 'Apple') => {
    let name = '';
    let email = '';
    let phone = '';
    
    if (provider === 'Google') {
      name = 'Kaysan Ariz';
      email = 'kaysan.ariz@gmail.com';
      phone = '01799999999';
    } else if (provider === 'Microsoft') {
      name = 'Sajid Ahmed';
      email = 'sajid.ahmed@outlook.com';
      phone = '01811112222';
    } else {
      name = 'Tashfia Islam';
      email = 'tashfia.islam@icloud.com';
      phone = '01933334444';
    }

    const session = { name, phone, email, provider };
    setCustomerSession(session);
    setIsCustomerModalOpen(false);

    if (pendingCartAction) {
      pendingCartAction();
      setPendingCartAction(null);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    const name = loginEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const formattedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Customer User';
    setCustomerSession({
      name: formattedName,
      email: loginEmail,
      phone: '01712345678',
      provider: 'Email Login'
    });
    setIsCustomerModalOpen(false);
    if (pendingCartAction) {
      pendingCartAction();
      setPendingCartAction(null);
    }
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;
    setCustomerSession({
      name: signupName,
      email: signupEmail,
      phone: signupPhone || '01712345678',
      provider: 'Email Sign-Up'
    });
    setIsCustomerModalOpen(false);
    if (pendingCartAction) {
      pendingCartAction();
      setPendingCartAction(null);
    }
  };

  const triggerSocialLoginFlow = async (provider: 'Google' | 'Microsoft' | 'Apple') => {
    if (provider === 'Google') {
      try {
        setOauthOverlay({
          isOpen: true,
          provider,
          stage: 1,
          statusText: 'Opening secure Google account authentication pop-up...'
        });
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const user = result.user;

        const session = {
          name: user.displayName || 'Google User',
          email: user.email || '',
          phone: user.phoneNumber || '01799999999',
          provider: 'Google' as const,
          photoURL: user.photoURL || ''
        };

        setCustomerSession(session);
        setIsCustomerModalOpen(false);
        setOauthOverlay(null);

        if (pendingCartAction) {
          pendingCartAction();
          setPendingCartAction(null);
        }
      } catch (error: any) {
        console.error('Google Sign-In Popup Error:', error);
        setOauthOverlay({
          isOpen: true,
          provider,
          stage: 1,
          statusText: `Google Authentication Error: ${error.message || 'The authentication pop-up was closed or blocked.'}`
        });
        setTimeout(() => {
          setOauthOverlay(null);
        }, 4000);
      }
    } else {
      handleSocialLogin(provider);
    }
  };

  const handleOtpLogin = (name: string, phone: string) => {
    const session = { name, phone, email: name.toLowerCase().replace(/\s+/g, '.') + '@example.com', provider: 'OTP' };
    setCustomerSession(session);
    setIsCustomerModalOpen(false);
    
    if (pendingCartAction) {
      pendingCartAction();
      setPendingCartAction(null);
    }
  };

  const handleLogin = (email: string, passcode: string): boolean => {
    const admin = authenticatedAdmins.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.passcode === passcode
    );
    if (admin) {
      setCurrentAdmin(admin);
      setActiveView('admin');
      return true;
    }
    return false;
  };

  const handleSubmitAdminRequest = (req: Omit<PendingAdminRequest, 'id' | 'createdAt'>) => {
    const newRequest: PendingAdminRequest = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPendingAdminRequests(prev => [...prev, newRequest]);
  };

  const handleDirectAdminRegister = (adminData: Omit<AuthenticatedAdmin, 'id' | 'createdAt'>) => {
    const newAdmin: AuthenticatedAdmin = {
      ...adminData,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAuthenticatedAdmins(prev => [...prev, newAdmin]);
    setCurrentAdmin(newAdmin);
    setActiveView('admin');
  };

  const handleApproveAdminRequest = (requestId: string) => {
    const request = pendingAdminRequests.find(r => r.id === requestId);
    if (request) {
      const newAdmin: AuthenticatedAdmin = {
        id: `admin-${Date.now()}`,
        name: request.name,
        email: request.email,
        phone: request.phone,
        passcode: request.passcode,
        createdAt: new Date().toISOString()
      };
      setAuthenticatedAdmins(prev => [...prev, newAdmin]);
      setPendingAdminRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleDenyAdminRequest = (requestId: string) => {
    setPendingAdminRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleAddAdmin = (admin: AuthenticatedAdmin) => {
    setAuthenticatedAdmins(prev => [...prev, admin]);
  };

  const handleRemoveAdmin = (adminId: string) => {
    setAuthenticatedAdmins(prev => prev.filter(a => a.id !== adminId));
    if (currentAdmin?.id === adminId) {
      setCurrentAdmin(null);
      setActiveView('store');
    }
  };

  // Helper to deep compare selected dynamic features
  const areFeaturesEqual = (f1?: { [key: string]: string }, f2?: { [key: string]: string }) => {
    if (!f1 && !f2) return true;
    if (!f1 || !f2) return false;
    const k1 = Object.keys(f1);
    const k2 = Object.keys(f2);
    if (k1.length !== k2.length) return false;
    return k1.every(key => f1[key] === f2[key]);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity: number,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => {
    if (!customerSession) {
      setPendingCartAction(() => () => {
        doAddToCart(product, quantity, size, selectedFeatures);
      });
      setIsCustomerModalOpen(true);
      return;
    }
    doAddToCart(product, quantity, size, selectedFeatures);
  };

  const doAddToCart = (
    product: Product,
    quantity: number,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          areFeaturesEqual(item.selectedFeatures, selectedFeatures)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity, selectedSize: size, selectedFeatures }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter(
          (item) => 
            !(
              item.product.id === productId && 
              item.selectedSize === size && 
              areFeaturesEqual(item.selectedFeatures, selectedFeatures)
            )
        );
      }
      return prevCart.map((item) => 
        item.product.id === productId && 
        item.selectedSize === size && 
        areFeaturesEqual(item.selectedFeatures, selectedFeatures)
          ? { ...item, quantity }
          : item
      );
    });
  };

  const handleRemoveItem = (
    productId: string,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => {
    setCart((prevCart) => 
      prevCart.filter(
        (item) => 
          !(
            item.product.id === productId && 
            item.selectedSize === size && 
            areFeaturesEqual(item.selectedFeatures, selectedFeatures)
          )
      )
    );
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setLastPlacedOrder(newOrder);
    setCart([]); // Clear shopping cart
    setActiveView('success');

    // Update charts/stats live to reflect the order!
    setStats((prevStats) => {
      const latestDay = [...prevStats].pop();
      if (latestDay) {
        const updatedLatest = {
          ...latestDay,
          sales: latestDay.sales + newOrder.totalAmount,
          orders: latestDay.orders + 1
        };
        return [...prevStats.slice(0, -1), updatedLatest];
      }
      return prevStats;
    });
  };

  // Product CRUD
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product from the live catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Order Fulfillment operations
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-500 theme-${theme}`} id="app-wrapper">
      
      {/* Dynamic Navigation Header */}
      <Header
        activeView={activeView === 'checkout' || activeView === 'success' ? 'store' : activeView}
        setActiveView={(view) => {
          setActiveView(view);
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentAdmin={currentAdmin}
        onLogout={handleLogout}
        customerSession={customerSession}
        onCustomerSignOut={handleCustomerSignOut}
        onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
      />

      {/* Main Container Stage */}
      <main className="flex-1">
        
        {/* VIEW 1: MAIN STOREFRONT */}
        {activeView === 'store' && (
          <div className="space-y-4">
            <Hero 
              onExplore={() => {
                const element = document.getElementById('storefront-container');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenProposal={() => setActiveView('proposal')}
            />
            
            <StoreFront
              products={products}
              searchQuery={searchQuery}
              onAddToCart={handleAddToCart}
              promotionalCampaigns={promotionalCampaigns}
              adBanners={adBanners}
            />
          </div>
        )}

        {/* VIEW 2: CHECKOUT SCREEN */}
        {activeView === 'checkout' && (
          <Checkout
            cartItems={cart}
            onBack={() => setActiveView('store')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {/* VIEW 3: PROPOSAL DECK */}
        {activeView === 'proposal' && (
          <div className="max-w-5xl mx-auto px-4 py-12">
            <ProposalViewer />
          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <AdminDashboard
            products={products}
            orders={orders}
            stats={stats}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onBackToStore={() => setActiveView('store')}
            pendingAdminRequests={pendingAdminRequests}
            authenticatedAdmins={authenticatedAdmins}
            currentAdmin={currentAdmin}
            onApproveAdminRequest={handleApproveAdminRequest}
            onDenyAdminRequest={handleDenyAdminRequest}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
            onSwitchAdmin={handleSwitchAdmin}
            promotionalCampaigns={promotionalCampaigns}
            onAddCampaign={(campaign: string) => setPromotionalCampaigns(prev => [...prev, campaign])}
            onDeleteCampaign={(campaign: string) => setPromotionalCampaigns(prev => prev.filter(c => c !== campaign))}
            adBanners={adBanners}
            onAddBanner={handleAddBanner}
            onDeleteBanner={handleDeleteBanner}
          />
        )}

        {/* VIEW 6: ADMIN INITIATION GATEWAY */}
        {activeView === 'admin-initiation' && (
          <AdminInitiation
            onSubmitRequest={handleSubmitAdminRequest}
            authenticatedAdmins={authenticatedAdmins}
            onLogin={handleLogin}
            currentAdmin={currentAdmin}
            onBackToStore={() => setActiveView('store')}
            onDirectAdminRegister={handleDirectAdminRegister}
          />
        )}

        {/* VIEW 5: ORDER PLACED SUCCESS PANEL */}
        {activeView === 'success' && lastPlacedOrder && (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center font-sans space-y-6" id="success-screen">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-black">Alhamdulillah</span>
              <h2 className="text-3xl font-serif font-black text-stone-900">Your Order has been Placed!</h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Thank you for shopping with us. Your unique transaction Reference ID is <strong className="font-mono text-stone-800">{lastPlacedOrder.id}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 text-left max-w-md mx-auto space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold border-b border-stone-100 pb-3">
                <span className="text-stone-500">Order Summary</span>
                <span className="text-emerald-800 uppercase tracking-wide">PENDING PACKING</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Customer Name:</span>
                  <span className="font-bold text-stone-800">{lastPlacedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Mobile Phone:</span>
                  <span className="font-bold text-stone-800">{lastPlacedOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Shipping Destination:</span>
                  <span className="font-semibold text-stone-800 truncate max-w-[200px]">{lastPlacedOrder.address}, {lastPlacedOrder.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Payment Channel:</span>
                  <span className="font-bold text-stone-800 uppercase">{lastPlacedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-3 text-sm text-stone-900 font-bold">
                  <span>Grand Total Paid:</span>
                  <span className="font-serif font-black text-emerald-800">৳{lastPlacedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                id="success-continue-shopping"
                onClick={() => setActiveView('store')}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Cart Drawer Overlay Sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          if (!customerSession) {
            setPendingCartAction(() => () => {
              setIsCartOpen(false);
              setActiveView('checkout');
            });
            setIsCartOpen(false);
            setIsCustomerModalOpen(true);
            return;
          }
          setIsCartOpen(false);
          setActiveView('checkout');
        }}
      />

      {/* Footer Branding credits */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-900 py-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-serif font-bold tracking-[0.25em] text-white">
              BELIEVER<span className="text-emerald-500 font-normal">SIGN</span>
            </h2>
            <p className="text-[10px] tracking-[0.28em] text-stone-500 uppercase mt-1">Spiritual Minimal Apparel</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-500 font-medium">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveView('store')}>Shop Storefront</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setActiveView('proposal')}>50,000 BDT Proposal</span>
          </div>

          <p className="text-[10px] text-stone-600 max-w-md mx-auto leading-relaxed">
            © 2026 Believer Sign & Lifestyle Ltd. Designed meticulously for premium conversion rates. Powered by high-speed React + Tailwind CSS engine.
          </p>

        </div>
      </footer>

      {/* Theme Selector Widget */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-white/95 border border-stone-200 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105" id="theme-selector-widget">
        <div className="flex items-center gap-1.5 px-2">
          <Palette className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-[10px] font-bold tracking-wider text-stone-500 uppercase hidden sm:inline">Theme</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Black theme button */}
          <button
            onClick={() => setTheme('black')}
            className={`w-6 h-6 rounded-full bg-stone-950 border-2 transition-all flex items-center justify-center cursor-pointer ${
              theme === 'black' ? 'border-emerald-600 scale-110 shadow-md' : 'border-stone-800 hover:scale-105'
            }`}
            title="Black Theme"
          >
            {theme === 'black' && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
          
          {/* White theme button */}
          <button
            onClick={() => setTheme('white')}
            className={`w-6 h-6 rounded-full bg-white border-2 transition-all flex items-center justify-center cursor-pointer ${
              theme === 'white' ? 'border-emerald-600 scale-110 shadow-md' : 'border-stone-200 hover:scale-105'
            }`}
            title="White Theme"
          >
            {theme === 'white' && <Check className="w-3 h-3 text-emerald-700" />}
          </button>

          {/* Off-White theme button */}
          <button
            onClick={() => setTheme('off-white')}
            className={`w-6 h-6 rounded-full bg-[#faf9f6] border-2 transition-all flex items-center justify-center cursor-pointer ${
              theme === 'off-white' ? 'border-emerald-600 scale-110 shadow-md' : 'border-stone-300 hover:scale-105'
            }`}
            title="Off-White Theme"
          >
            {theme === 'off-white' && <Check className="w-3 h-3 text-emerald-700" />}
          </button>
        </div>
      </div>

      {/* LUXURY CUSTOMER HUB SIGN-IN MODAL */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-4 animate-fade-in" id="customer-signin-modal">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-stone-950 p-6 text-white text-center relative">
              <button 
                onClick={() => setIsCustomerModalOpen(false)}
                className="absolute right-4 top-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 bg-emerald-800/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-serif font-black text-lg tracking-wide text-white">Customer Hub</h3>
              <p className="text-[10px] text-stone-400 mt-1">Access personalized checkout and track religious attire orders.</p>
            </div>

            {/* Premium Navigation Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50">
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  authTab === 'login' 
                    ? 'border-emerald-800 text-stone-950 bg-white font-black' 
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                  authTab === 'signup' 
                    ? 'border-emerald-800 text-stone-950 bg-white font-black' 
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {authTab === 'login' ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Log In Area */}
                  <form onSubmit={handleEmailLogin} className="space-y-3.5 text-xs">
                    <div className="text-center pb-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900">Welcome Back</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Please sign in with your email or social accounts.</p>
                    </div>

                    <div>
                      <label className="block text-stone-600 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. kaysan@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800 focus:bg-white transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    >
                      Secure Log In
                    </button>
                  </form>

                  {/* Social Login Slots */}
                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <label className="block text-center text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Or login securely via
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {/* Google Button */}
                      <button
                        type="button"
                        onClick={() => triggerSocialLoginFlow('Google')}
                        className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold text-xs py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                      >
                        <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-[10px]">G</span>
                        Continue with Google
                      </button>

                      {/* Microsoft Button */}
                      <button
                        type="button"
                        onClick={() => triggerSocialLoginFlow('Microsoft')}
                        className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold text-xs py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                      >
                        <span className="w-4 h-4 bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-[10px]">M</span>
                        Continue with Microsoft
                      </button>

                      {/* Apple Button */}
                      <button
                        type="button"
                        onClick={() => triggerSocialLoginFlow('Apple')}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                      >
                        <span className="w-4 h-4 rounded-full bg-stone-850 text-white flex items-center justify-center font-bold text-[10px]"></span>
                        Continue with Apple
                      </button>
                    </div>
                  </div>


                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {/* Sign Up Area */}
                  <form onSubmit={handleEmailSignup} className="space-y-3 text-xs">
                    <div className="text-center pb-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900">Create Account</h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">Configure your custom profile settings.</p>
                    </div>

                    <div>
                      <label className="block text-stone-600 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kaysan Ariz"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. kaysan@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 font-bold mb-1">Mobile Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="e.g. 01799999999"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800 focus:bg-white transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-[0.98] mt-2"
                    >
                      Create Account & Log In
                    </button>
                  </form>

                  {/* Social Sign Up Slots */}
                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <label className="block text-center text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                      Or sign up instantly via
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {/* Google Button */}
                      <button
                        type="button"
                        onClick={() => triggerSocialLoginFlow('Google')}
                        className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold text-xs py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                      >
                        <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-[10px]">G</span>
                        Sign up with Google
                      </button>

                      {/* Microsoft Button */}
                      <button
                        type="button"
                        onClick={() => triggerSocialLoginFlow('Microsoft')}
                        className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-semibold text-xs py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                      >
                        <span className="w-4 h-4 bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-[10px]">M</span>
                        Sign up with Microsoft
                      </button>

                      {/* Apple Button */}
                      <button
                        type="button"
                        onClick={() => triggerSocialLoginFlow('Apple')}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                      >
                        <span className="w-4 h-4 rounded-full bg-stone-850 text-white flex items-center justify-center font-bold text-[10px]"></span>
                        Sign up with Apple
                      </button>
                    </div>
                  </div>

                  {/* Standard OTP Flow Fallback option inside Sign Up */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-stone-100"></div>
                    <span className="flex-shrink mx-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Or Use OTP Code</span>
                    <div className="flex-grow border-t border-stone-100"></div>
                  </div>

                  <CustomerOtpLoginSection onLogin={handleOtpLogin} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC SIMULATED OAUTH POPUP OVERLAY */}
      {oauthOverlay && oauthOverlay.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/85 backdrop-blur-sm p-4 animate-fade-in" id="oauth-loading-overlay">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-6 text-white text-center shadow-2xl relative space-y-6 animate-scale-up">
            
            {/* Handshake/Lock Icon & Brand Badge */}
            <div className="flex justify-center items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700 shadow-inner relative">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"></div>
                {oauthOverlay.provider === 'Google' && (
                  <span className="text-rose-500 font-serif font-black text-lg">G</span>
                )}
                {oauthOverlay.provider === 'Microsoft' && (
                  <span className="text-blue-400 font-serif font-black text-lg">M</span>
                )}
                {oauthOverlay.provider === 'Apple' && (
                  <span className="text-white font-serif font-black text-lg"></span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm tracking-wide text-white">
                Securing Handshake with {oauthOverlay.provider}...
              </h4>
              <p className="text-[10px] text-stone-400">
                Verifying authentication payload securely...
              </p>
            </div>

            {/* Dynamic Status Steps */}
            <div className="bg-stone-950 p-4 rounded-xl text-left border border-stone-850 font-mono space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <span className={`w-2 h-2 rounded-full ${oauthOverlay.stage >= 0 ? 'bg-amber-500 animate-pulse' : 'bg-stone-700'}`}></span>
                <span className={oauthOverlay.stage === 0 ? 'text-amber-400 font-semibold' : 'text-stone-500'}>
                  1. Connecting to {oauthOverlay.provider} API Gateway...
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className={`w-2 h-2 rounded-full ${oauthOverlay.stage >= 1 ? 'bg-amber-500' : 'bg-stone-700'}`}></span>
                <span className={oauthOverlay.stage === 1 ? 'text-amber-400 font-semibold' : 'text-stone-500'}>
                  2. Validating cryptographically signed token...
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className={`w-2 h-2 rounded-full ${oauthOverlay.stage >= 2 ? 'bg-emerald-500' : 'bg-stone-700'}`}></span>
                <span className={oauthOverlay.stage === 2 ? 'text-emerald-400 font-semibold' : 'text-stone-500'}>
                  3. Synchronizing authenticated session...
                </span>
              </div>
            </div>

            {/* Visual Progress Line */}
            <div className="w-full bg-stone-800 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-1000" 
                style={{ width: `${(oauthOverlay.stage + 1) * 33.3}%` }}
              ></div>
            </div>

            {/* Bottom Note */}
            <p className="text-[9px] text-stone-500 italic">
              Access token secured with standard AES-256 digital signature.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

function CustomerOtpLoginSection({ onLogin }: { onLogin: (name: string, phone: string) => void }) {
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!custPhone || !custName) {
      setLoginError('Please provide both your name and phone number.');
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(custPhone)) {
      setLoginError('Please enter a valid Bangladeshi phone number (e.g., 01712345678).');
      return;
    }
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (otpCode !== '1234' && otpCode !== '123456') {
      setLoginError('Invalid OTP code. Please use standard demo code: 1234');
      return;
    }
    onLogin(custName, custPhone);
  };

  return (
    <div className="space-y-4">
      {loginError && (
        <div className="bg-rose-50 border border-rose-100 text-rose-800 p-2.5 rounded-lg text-[10px] leading-snug">
          {loginError}
        </div>
      )}

      {!otpStep ? (
        <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-600 font-bold mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kaysan Ariz"
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-bold mb-1">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-stone-400 font-semibold text-xs">🇧🇩</span>
              <input
                type="tel"
                required
                placeholder="e.g. 01799999999"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-full transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            Send Verification OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-600 font-bold mb-1">Enter 4-Digit OTP Code</label>
            <input
              type="text"
              maxLength={6}
              required
              placeholder="Demo code: 1234"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 font-mono text-center tracking-widest text-stone-800 focus:outline-hidden focus:border-emerald-700"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 rounded-full transition-all cursor-pointer font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded-full transition-all cursor-pointer font-semibold shadow-xs"
            >
              Verify OTP
            </button>
          </div>
        </form>
      )}


    </div>
  );
}

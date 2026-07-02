import React, { useState } from 'react';
import { 
  BarChart2, ShoppingCart, DollarSign, Package, 
  Plus, Edit2, Trash2, Eye, Check, X, ArrowLeft, 
  Sparkles, ShieldAlert, CheckCircle, TrendingUp, RefreshCw, 
  Shield, UserPlus, UserMinus, UserCheck, Key, ShieldCheck,
  Sliders
} from 'lucide-react';
import { Order, Product, SalesStat, PendingAdminRequest, AuthenticatedAdmin, AdBanner } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  stats: SalesStat[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onBackToStore: () => void;
  pendingAdminRequests: PendingAdminRequest[];
  authenticatedAdmins: AuthenticatedAdmin[];
  currentAdmin: AuthenticatedAdmin | null;
  onApproveAdminRequest: (requestId: string) => void;
  onDenyAdminRequest: (requestId: string) => void;
  onAddAdmin: (admin: AuthenticatedAdmin) => void;
  onRemoveAdmin: (adminId: string) => void;
  onSwitchAdmin: (adminId: string) => void;
  promotionalCampaigns: string[];
  onAddCampaign: (campaign: string) => void;
  onDeleteCampaign: (campaign: string) => void;
  adBanners: AdBanner[];
  onAddBanner: (banner: AdBanner) => void;
  onDeleteBanner: (id: string) => void;
}

export default function AdminDashboard({
  products,
  orders,
  stats,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onBackToStore,
  pendingAdminRequests,
  authenticatedAdmins,
  currentAdmin,
  onApproveAdminRequest,
  onDenyAdminRequest,
  onAddAdmin,
  onRemoveAdmin,
  onSwitchAdmin,
  promotionalCampaigns,
  onAddCampaign,
  onDeleteCampaign,
  adBanners = [],
  onAddBanner,
  onDeleteBanner
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics' | 'approvals' | 'team' | 'campaigns' | 'banners'>('orders');
  
  // States for banner creator
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerTargetCategory, setBannerTargetCategory] = useState('all');
  const [bannerInsertRow, setBannerInsertRow] = useState<number>(4);
  
  // State for Add Admin Form
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminPasscode, setNewAdminPasscode] = useState('');
  const [adminFormError, setAdminFormError] = useState('');
  const [adminFormSuccess, setAdminFormSuccess] = useState('');

  const allTargetCategories = React.useMemo(() => {
    const presets = [
      { value: 'all', label: 'All Products (Reset Filter)' },
      { value: 'panjabi', label: 'Luxury Panjabis' },
      { value: 'tshirt', label: 'Caligraphy Tees & Caps' },
      { value: 'hoodie', label: 'Tawakkul Hoodies' },
      { value: 'wall-art', label: 'Wooden Wall Art' },
      { value: 'perfume', label: 'Pure Attar' },
      { value: 'customized', label: 'Customized Collections' }
    ];

    const presetCategoryIds = ['panjabi', 'tshirt', 'hoodie', 'wall-art', 'perfume', 'customized'];
    const customCategoriesInProducts = products
      .map(p => p.category)
      .filter((cat): cat is string => !!cat && !presetCategoryIds.includes(cat.trim().toLowerCase()));
    const uniqueCustom = Array.from(new Set(customCategoriesInProducts.map(cat => cat.trim().toLowerCase())));

    const customOpts = uniqueCustom.map(cat => ({
      value: cat,
      label: `Category: ${cat.charAt(0).toUpperCase() + cat.slice(1)}`
    }));

    const campaignOpts = (promotionalCampaigns || []).map(campaign => ({
      value: `campaign:${campaign}`,
      label: `Campaign: ${campaign}`
    }));

    return [...presets, ...customOpts, ...campaignOpts];
  }, [products, promotionalCampaigns]);

  // Lock Screen States
  const [lockEmail, setLockEmail] = useState('');
  const [lockPasscode, setLockPasscode] = useState('');
  const [lockError, setLockError] = useState('');


  
  // State for Add/Edit Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Invite states
  const [inviteUrl, setInviteUrl] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);
  
  // Product Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('tshirt');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [price, setPrice] = useState(1000);
  const [originalPrice, setOriginalPrice] = useState(1200);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [sizes, setSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [stock, setStock] = useState(25);
  const [campaign, setCampaign] = useState('');

  // Dynamic Product Variations & Specifications State
  const [features, setFeatures] = useState<{ name: string; values: string[] }[]>([]);
  const [newOptionInputs, setNewOptionInputs] = useState<{ [key: string]: string }>({});
  const [customFeatureName, setCustomFeatureName] = useState('');

  // Compute metrics
  const totalSalesRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const completedOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const lowStockProductsCount = products.filter(p => p.stock < 15).length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('tshirt');
    setCustomCategoryName('');
    setPrice(1000);
    setOriginalPrice(1200);
    setDescription('');
    setImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop');
    setSizes(['M', 'L', 'XL']);
    setStock(25);
    setFeatures([]);
    setNewOptionInputs({});
    setCustomFeatureName('');
    setCampaign('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    
    const isPresetCategory = ['panjabi', 'tshirt', 'hoodie', 'wall-art', 'perfume'].includes(product.category);
    if (isPresetCategory) {
      setCategory(product.category as any);
      setCustomCategoryName('');
    } else {
      setCategory('customized');
      setCustomCategoryName(product.category);
    }

    setPrice(product.price);
    setOriginalPrice(product.originalPrice || product.price);
    setDescription(product.description);
    setImage(product.image);
    setSizes(product.sizes || []);
    setStock(product.stock);
    setFeatures(product.features || []);
    setNewOptionInputs({});
    setCustomFeatureName('');
    setCampaign(product.campaign || '');
    setIsModalOpen(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) {
      alert('Please fill out all required fields');
      return;
    }

    const finalCategory = category === 'customized' ? (customCategoryName.trim() || 'customized') : category;

    const sizeFeature = features.find(f => f.name.toLowerCase().includes('size'));
    const finalSizes = sizeFeature ? sizeFeature.values : [];
    
    const colorFeature = features.find(f => f.name.toLowerCase().includes('color'));
    const finalColors = colorFeature ? colorFeature.values : [];

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      title,
      category: finalCategory as any,
      price: Number(price),
      originalPrice: Number(originalPrice),
      description,
      image,
      sizes: finalSizes,
      colors: finalColors,
      stock: Number(stock),
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      features: features.length > 0 ? features : [],
      campaign: campaign || undefined
    };

    if (editingProduct) {
      onUpdateProduct(productPayload);
    } else {
      onAddProduct(productPayload);
    }
    setIsModalOpen(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPreset = (presetName: string, defaultValues: string[]) => {
    if (features.some(f => f.name.toLowerCase() === presetName.toLowerCase())) {
      alert(`Category "${presetName}" is already initialized.`);
      return;
    }
    setFeatures([...features, { name: presetName, values: defaultValues }]);
  };

  const handleInitializeCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customFeatureName.trim();
    if (!trimmed) {
      alert('Please enter a feature name.');
      return;
    }
    if (features.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) {
      alert(`Category "${trimmed}" is already initialized.`);
      return;
    }
    setFeatures([...features, { name: trimmed, values: [] }]);
    setCustomFeatureName('');
  };

  const handleDeleteFeatureCategory = (featureName: string) => {
    setFeatures(features.filter(f => f.name !== featureName));
  };

  const handleDeleteFeatureValue = (featureName: string, valueToDelete: string) => {
    setFeatures(features.map(f => {
      if (f.name === featureName) {
        return { ...f, values: f.values.filter(v => v !== valueToDelete) };
      }
      return f;
    }));
  };

  const handleAddFeatureValue = (featureName: string, valueToAdd: string) => {
    const trimmed = valueToAdd.trim();
    if (!trimmed) return;
    setFeatures(features.map(f => {
      if (f.name === featureName) {
        if (f.values.includes(trimmed)) {
          alert(`"${trimmed}" is already an option for ${featureName}.`);
          return f;
        }
        return { ...f, values: [...f.values, trimmed] };
      }
      return f;
    }));
  };

  if (currentAdmin === null) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-stone-800 font-sans animate-fade-in" id="admin-lock-screen">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-stone-950 text-amber-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-6 h-6 text-amber-100" />
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900">Secure Access Gateway</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              This command console is sealed for authorized administrative officers only. Please authenticate.
            </p>
          </div>

          {lockError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{lockError}</span>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setLockError('');
              const found = authenticatedAdmins.find(
                a => a.email.toLowerCase() === lockEmail.toLowerCase() && a.passcode === lockPasscode
              );
              if (found) {
                onSwitchAdmin(found.id);
              } else {
                setLockError('Invalid credentials or pending authorization signature.');
              }
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-semibold mb-1 text-stone-700">Admin Email</label>
              <input
                type="email"
                required
                placeholder="developer@example.com"
                value={lockEmail}
                onChange={(e) => setLockEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-emerald-700 text-stone-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-stone-700">6-Digit Passcode</label>
              <input
                type="password"
                maxLength={6}
                required
                placeholder="••••••"
                value={lockPasscode}
                onChange={(e) => setLockPasscode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 tracking-widest font-mono text-stone-800 focus:outline-hidden focus:border-emerald-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-3 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Verify & Enter Console
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center">
            <button 
              onClick={onBackToStore}
              className="text-stone-500 hover:text-stone-800 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-stone-800" id="admin-dashboard">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button 
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-semibold mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-black tracking-tight text-stone-900">
              Store Back-Office Command Panel
            </h2>
            {currentAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Active: {currentAdmin.name}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time shop manager & live product editing dashboard.
          </p>
        </div>

        <div className="flex gap-2">
          {currentAdmin && (
            <div className="sm:hidden flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {currentAdmin.name}
            </div>
          )}
          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Premium Product
          </button>
        </div>
      </div>

      {/* Analytics KPI widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Gross Revenue', value: `৳${totalSalesRevenue.toLocaleString()}`, change: '+18.4% this week', color: 'text-emerald-800', icon: DollarSign },
          { title: 'Pending Deliveries', value: pendingOrdersCount, change: 'Requires fast packing', color: 'text-amber-700', icon: ShoppingCart },
          { title: 'Completed Orders', value: completedOrdersCount, change: '100% full fulfillment', color: 'text-stone-800', icon: CheckCircle },
          { title: 'Low Stock Alerts', value: lowStockProductsCount, change: 'Stock under 15 units', color: 'text-rose-700', icon: Package }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
              <div className="flex justify-between items-start">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-400">{kpi.title}</span>
                <span className="p-1.5 bg-stone-50 rounded-lg text-stone-500"><Icon className="w-4 h-4" /></span>
              </div>
              <div className="mt-2">
                <span className={`text-xl sm:text-2xl font-serif font-black ${kpi.color}`}>{kpi.value}</span>
                <p className="text-[10px] text-stone-400 mt-1">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6 gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'orders', label: 'Inbound Orders list', count: orders.length },
          { id: 'products', label: 'Product catalog', count: products.length },
          { id: 'analytics', label: 'Sales performance', count: null },
          { id: 'campaigns', label: 'Campaign Workspace', count: promotionalCampaigns.length },
          { id: 'banners', label: 'Banner Ads Manager', count: adBanners.length },
          { id: 'approvals', label: 'Contract Approvals', count: pendingAdminRequests.length },
          { id: 'team', label: 'Team Management', count: authenticatedAdmins.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer relative ${
              activeTab === tab.id
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-1.5 bg-stone-100 text-stone-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTRACT APPROVALS TAB */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs animate-fade-in" id="contract-approvals-tab">
          <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <div>
              <h3 className="font-serif font-black text-sm text-stone-900">Contract Verification Approvals Queue</h3>
              <p className="text-[10px] text-stone-400">Newly requested administration profiles pending security contract authorization.</p>
            </div>
            <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
              {pendingAdminRequests.length} Pending Signature(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                <tr>
                  <th className="p-4">Requested Admin</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Passcode Verification</th>
                  <th className="p-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {pendingAdminRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-stone-400 space-y-2">
                      <Shield className="w-8 h-8 text-stone-300 mx-auto animate-pulse" />
                      <p className="text-xs font-semibold">Queue is clear.</p>
                      <p className="text-[10px] text-stone-400">No pending contractor signatures require review.</p>
                    </td>
                  </tr>
                ) : (
                  pendingAdminRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 font-semibold text-stone-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center font-bold text-[10px]">
                            {req.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{req.name}</span>
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="block">{req.email}</span>
                        <span className="block text-[10px] text-stone-400">{req.phone}</span>
                      </td>
                      <td className="p-4 text-[11px] text-stone-500">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold text-stone-600">
                          <Key className="w-3 h-3 text-stone-400" />
                          •••••• (Passcode Set)
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => onDenyAdminRequest(req.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] rounded-full font-bold transition-all cursor-pointer inline-flex items-center gap-1 border border-rose-100"
                        >
                          Deny
                        </button>
                        <button
                          onClick={() => onApproveAdminRequest(req.id)}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] rounded-full font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3 h-3" /> Approve & Sign
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TEAM MANAGEMENT TAB */}
      {activeTab === 'team' && (
        <div className="space-y-6 animate-fade-in" id="team-management-tab">
          
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/50">
              <div>
                <h3 className="font-serif font-black text-sm text-stone-900">Authorized System Administrators</h3>
                <p className="text-[10px] text-stone-400">Manage cryptographic signature authorities. Switch operators or revoke developer accounts.</p>
              </div>
              <button
                onClick={() => {
                  setAdminFormError('');
                  setAdminFormSuccess('');
                  setIsAddingAdmin(!isAddingAdmin);
                }}
                className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-[11px] px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs self-stretch sm:self-auto justify-center"
              >
                {isAddingAdmin ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {isAddingAdmin ? 'Cancel' : 'Create Admin'}
              </button>
            </div>

            {/* ADD ADMIN INLINE FORM */}
            {isAddingAdmin && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setAdminFormError('');
                  setAdminFormSuccess('');

                  if (!newAdminName || !newAdminEmail || !newAdminPhone || !newAdminPasscode) {
                    setAdminFormError('Please complete all fields for the new admin.');
                    return;
                  }

                  if (newAdminPasscode.length !== 6 || !/^\d+$/.test(newAdminPasscode)) {
                    setAdminFormError('Passcode must be exactly 6 numeric digits.');
                    return;
                  }

                  if (authenticatedAdmins.some(a => a.email.toLowerCase() === newAdminEmail.toLowerCase())) {
                    setAdminFormError('An administrator with this email already exists.');
                    return;
                  }

                  onAddAdmin({
                    id: `admin-${Date.now()}`,
                    name: newAdminName,
                    email: newAdminEmail,
                    phone: newAdminPhone,
                    passcode: newAdminPasscode,
                    createdAt: new Date().toISOString()
                  });

                  setNewAdminName('');
                  setNewAdminEmail('');
                  setNewAdminPhone('');
                  setNewAdminPasscode('');
                  setAdminFormSuccess('Admin successfully enrolled!');
                  setIsAddingAdmin(false);
                }}
                className="p-5 bg-stone-50 border-b border-stone-200 text-xs text-stone-700 space-y-4 animate-slide-down"
              >
                <h4 className="font-bold text-stone-800 flex items-center gap-1">
                  <UserPlus className="w-4 h-4 text-emerald-800" />
                  Enroll New Administrative Officer
                </h4>

                {adminFormError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-[11px] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{adminFormError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kaysan Ariz"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. buyer@example.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01799999999"
                      value={newAdminPhone}
                      onChange={(e) => setNewAdminPhone(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">6-Digit Passcode *</label>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit numeric passcode"
                      value={newAdminPasscode}
                      onChange={(e) => setNewAdminPasscode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 font-mono tracking-widest focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAdmin(false)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-full font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full font-medium cursor-pointer shadow-2xs"
                  >
                    Enroll Admin
                  </button>
                </div>
              </form>
            )}

            {adminFormSuccess && (
              <div className="m-5 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{adminFormSuccess}</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                  <tr>
                    <th className="p-4">Administrator</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {authenticatedAdmins.map((admin) => {
                    const isSelf = currentAdmin?.id === admin.id;
                    const isDeveloper = admin.id === 'dev-admin';
                    return (
                      <tr key={admin.id} className={`hover:bg-stone-50/50 transition-colors ${isSelf ? 'bg-emerald-50/20' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isDeveloper ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                            }`}>
                              {admin.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                {admin.name}
                                {isSelf && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400 capitalize block">
                                {isDeveloper ? 'Developer Account (Revocable)' : 'Authorized Admin'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{admin.email}</td>
                        <td className="p-4 font-mono text-[11px]">{admin.phone}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            isSelf 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                              : 'bg-stone-100 text-stone-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelf ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`}></div>
                            {isSelf ? 'Active Session' : 'Offline'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-2">
                            {!isSelf && (
                              <button
                                onClick={() => onSwitchAdmin(admin.id)}
                                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] rounded-full font-bold transition-all cursor-pointer flex items-center gap-1"
                                title={`Switch active login session to act as ${admin.name}`}
                              >
                                <UserCheck className="w-3 h-3" /> Act As
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                // Block deleting themselves
                                if (isSelf) {
                                  alert('Security Guardrail Violation: You cannot delete yourself while you are the active logged-in admin. Please switch to another administrator account first to revoke these privileges.');
                                  return;
                                }

                                // Block if last admin
                                if (authenticatedAdmins.length === 1) {
                                  alert('Security Guardrail Violation: The system requires at least one active administrator. You cannot delete the sole remaining administrator.');
                                  return;
                                }

                                if (confirm(`Are you absolutely sure you want to securely revoke all administrative and signature privileges for ${admin.name}? This operation is permanent.`)) {
                                  onRemoveAdmin(admin.id);
                                }
                              }}
                              className={`p-1.5 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1 ${
                                isSelf 
                                  ? 'text-stone-300 cursor-not-allowed' 
                                  : 'text-stone-400 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              disabled={isSelf}
                              title={isSelf ? 'Cannot delete yourself' : `Revoke administrator status for ${admin.name}`}
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Helpful context info card for settlement */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3">
            <h4 className="font-serif font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              Contract Settled Handover Protocol
            </h4>
            <p className="text-[11px] leading-relaxed text-stone-500">
              This cryptographic multi-admin mechanism allows safe and secure handover. Once the contract terms are settled, the buyer can follow this protocol:
            </p>
            <ol className="list-decimal list-inside text-[11px] leading-relaxed text-stone-500 space-y-1 pl-1">
              <li>Add the Buyer's personal administrator account using the form or through the Gateway queue.</li>
              <li>Switch active operator status to act as the Buyer (or sign in as the Buyer using the lock screen passcode).</li>
              <li>In the Team list, securely click the <strong>Trash/Revoke</strong> icon on the developer's pre-configured account (<code>developer@example.com</code>).</li>
              <li>The developer's access is instantly and irrevocably terminated from the system, granting the Buyer 100% unilateral ownership.</li>
            </ol>
          </div>

          {/* Dockable One-Time Dev Invitation Link Engine */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-4 shadow-sm" id="dev-invitation-generator-panel">
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" />
                Dockable One-Time Dev Invitation Link Engine
              </h4>
              <p className="text-[10px] leading-relaxed text-stone-500 mt-1">
                Generate a secure, single-use administration enrollment link to transfer ownership. Visiting this link self-destructs the token and launches the master admin initiation form.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const token = 'dev_secure_' + Math.random().toString(36).substring(2, 15);
                  localStorage.setItem('believersign_dev_invite_token', token);
                  const url = window.location.origin + '?invite=' + token;
                  setInviteUrl(url);
                  setCopiedInvite(false);
                }}
                className="bg-amber-600 hover:bg-amber-500 active:scale-[0.98] transition-all duration-300 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Single-Use Dev Invite Link
              </button>

              {inviteUrl && (
                <div className="flex-1 flex gap-2 items-center bg-white border border-stone-200 rounded-lg p-1.5 min-w-0 animate-fade-in">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 bg-transparent border-0 outline-hidden font-mono text-[10px] text-stone-600 px-2 truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteUrl);
                      setCopiedInvite(true);
                      setTimeout(() => setCopiedInvite(false), 3000);
                    }}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors cursor-pointer shrink-0"
                  >
                    {copiedInvite ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* CAMPAIGN WORKSPACE TAB */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fade-in" id="campaign-workspace-tab">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/50">
              <div>
                <h3 className="font-serif font-black text-sm text-stone-900">Campaign Workspace</h3>
                <p className="text-[10px] text-stone-400">Manage promotional banners, badges, and store-wide marketing campaigns.</p>
              </div>
            </div>

            {/* Campaign Creator Form */}
            <div className="p-5 bg-stone-50 border-b border-stone-200 text-xs text-stone-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('campaignName') as HTMLInputElement;
                  const value = input.value.trim();
                  if (!value) return;
                  if (promotionalCampaigns.includes(value)) {
                    alert('This campaign tag already exists.');
                    return;
                  }
                  onAddCampaign(value);
                  input.value = '';
                }}
                className="flex flex-col sm:flex-row items-end gap-3"
              >
                <div className="flex-1">
                  <label className="block font-semibold mb-1 text-stone-700">New Campaign Name / Tag *</label>
                  <input
                    name="campaignName"
                    type="text"
                    required
                    placeholder="e.g. Hot Sales, Eid Special, Busy Rush"
                    className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-emerald-700 text-stone-800"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-3 rounded-lg transition-all cursor-pointer h-10 flex items-center justify-center whitespace-nowrap"
                >
                  Create Campaign
                </button>
              </form>
            </div>

            {/* Active Campaigns List */}
            <div className="p-5">
              <h4 className="font-semibold text-stone-800 text-xs mb-3">Active Promotional Campaigns</h4>
              {promotionalCampaigns.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-stone-200 rounded-lg text-stone-400 text-xs">
                  No active promotional campaigns configured yet. Create one above!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {promotionalCampaigns.map((campaignName) => {
                    const taggedCount = products.filter(p => p.campaign === campaignName).length;
                    return (
                      <div key={campaignName} className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-rose-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                              {campaignName}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 block">
                            {taggedCount} {taggedCount === 1 ? 'product' : 'products'} tagged
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the "${campaignName}" campaign? This will remove the campaign tag from all associated products.`)) {
                              onDeleteCampaign(campaignName);
                              // Update products to clear this campaign
                              products.forEach(p => {
                                if (p.campaign === campaignName) {
                                  onUpdateProduct({ ...p, campaign: undefined });
                                }
                              });
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BANNER ADS MANAGER TAB */}
      {activeTab === 'banners' && (
        <div className="space-y-6 animate-fade-in" id="banner-ads-workspace">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-50/50">
              <div>
                <h3 className="font-serif font-black text-sm text-stone-900">Banner Ads Workspace</h3>
                <p className="text-[10px] text-stone-400">Configure full-width inline promotion cards to inject after dynamic product counts.</p>
              </div>
            </div>

            {/* Banner Creator Form */}
            <div className="p-5 bg-stone-50 border-b border-stone-200 text-xs text-stone-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!bannerImageUrl) {
                    alert('Please upload a file or provide a custom Image URL.');
                    return;
                  }
                  
                  const newBanner: AdBanner = {
                    id: `banner-${Date.now()}`,
                    imageUrl: bannerImageUrl,
                    targetCategory: bannerTargetCategory,
                    insertAfterRowIndex: bannerInsertRow
                  };
                  
                  onAddBanner(newBanner);
                  setBannerImageUrl('');
                  setBannerTargetCategory('all');
                  setBannerInsertRow(4);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Image input & file chooser */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-stone-700">Banner Image File upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setBannerImageUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-xs text-stone-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                    />
                    
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] text-stone-400 whitespace-nowrap">Or use URL:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={bannerImageUrl.startsWith('data:') ? '' : bannerImageUrl}
                        onChange={(e) => setBannerImageUrl(e.target.value)}
                        className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-[10px] text-stone-800 focus:outline-hidden focus:border-emerald-700"
                      />
                    </div>
                  </div>

                  {/* Redirection choice */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-stone-700">Redirection / Category Filter *</label>
                    <select
                      value={bannerTargetCategory}
                      onChange={(e) => setBannerTargetCategory(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-3 focus:outline-hidden focus:border-emerald-700 text-stone-800 cursor-pointer"
                    >
                      {allTargetCategories.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row insertion offset */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-stone-700">Placement Offset (Product Count) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={bannerInsertRow}
                      onChange={(e) => setBannerInsertRow(Number(e.target.value))}
                      className="w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-emerald-700 text-stone-800"
                    />
                    <p className="text-[9px] text-stone-400 mt-1">
                      Injects the full-width banner after exactly this number of products in the storefront grid (e.g., 4 or 8).
                    </p>
                  </div>
                </div>

                {bannerImageUrl && (
                  <div className="p-3 bg-white border border-stone-200 rounded-xl max-w-md flex items-center gap-3 animate-fade-in">
                    <div className="w-16 h-10 rounded-md overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <img src={bannerImageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-stone-500 font-semibold block">Banner Image Preview</span>
                      <span className="text-[9px] text-stone-400 block truncate font-mono">
                        {bannerImageUrl.startsWith('data:') ? 'Local Base64 Data Asset' : bannerImageUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBannerImageUrl('')}
                      className="text-stone-400 hover:text-rose-600 text-xs font-bold px-2 py-1"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-emerald-800/10"
                  >
                    Create Promotional Banner Ad
                  </button>
                </div>
              </form>
            </div>

            {/* Active banners table */}
            <div className="p-5">
              <h4 className="font-semibold text-stone-800 text-xs mb-3">Currently Active Banners</h4>
              {adBanners.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-stone-200 rounded-xl text-stone-400 text-xs">
                  No promotional banner ads configured yet. Add your first banner using the form above!
                </div>
              ) : (
                <div className="overflow-x-auto border border-stone-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-600">
                      <tr>
                        <th className="p-3.5">Visual Banner Preview</th>
                        <th className="p-3.5">Target Redirection</th>
                        <th className="p-3.5">Placement Index</th>
                        <th className="p-3.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {adBanners.map((banner) => {
                        const targetLabel = allTargetCategories.find(opt => opt.value === banner.targetCategory)?.label || banner.targetCategory;
                        return (
                          <tr key={banner.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="p-3.5">
                              <div className="w-32 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden">
                                <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            </td>
                            <td className="p-3.5 font-medium text-stone-800">
                              {targetLabel}
                            </td>
                            <td className="p-3.5 text-stone-500">
                              After {banner.insertAfterRowIndex} products
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this promotional banner?')) {
                                    onDeleteBanner(banner.id);
                                  }
                                }}
                                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
                                title="Delete Banner"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      No customer orders recorded yet. Place an order on the checkout screen to see it here!
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-stone-900">{order.id}</td>
                      <td className="p-4 space-y-1">
                        <span className="block font-semibold text-stone-800">{order.customerName}</span>
                        <span className="block text-[10px] text-stone-400">{order.phone}</span>
                        <span className="block text-[10px] text-stone-500 leading-tight max-w-xs truncate">{order.address}, {order.city}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 max-w-xs">
                          {order.items.map((item, idx) => {
                            const sizeStr = item.size ? `Size: ${item.size}` : '';
                            const featsStr = item.selectedFeatures
                              ? Object.entries(item.selectedFeatures).map(([k, v]) => `${k}:${v}`).join(', ')
                              : '';
                            const specDetails = [sizeStr, featsStr].filter(Boolean).join(' | ');
                            return (
                              <div key={idx} className="text-[10px] text-stone-600 leading-tight">
                                • {item.productTitle} {specDetails ? `(${specDetails})` : ''} x {item.quantity}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4 font-bold font-serif text-stone-800">
                        ৳{order.totalAmount.toLocaleString()}
                        <span className="block text-[9px] text-stone-400 capitalize font-sans font-medium">
                          via {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-800' :
                          order.status === 'processing' ? 'bg-amber-50 text-amber-800' :
                          order.status === 'pending' ? 'bg-indigo-50 text-indigo-800' :
                          'bg-rose-50 text-rose-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'processing')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] rounded-md font-semibold transition-colors cursor-pointer"
                              title="Set to Processing"
                            >
                              Pack
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] rounded-md font-semibold transition-colors cursor-pointer"
                              title="Set to Shipped"
                            >
                              Ship
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] rounded-md font-semibold transition-colors cursor-pointer"
                              title="Set to Delivered"
                            >
                              Deliver
                            </button>
                          </>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] rounded-md font-semibold transition-colors cursor-pointer"
                            title="Cancel Order"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                  <tr>
                    <th className="p-4">Item Thumbnail</th>
                    <th className="p-4">Product Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stock count</th>
                    <th className="p-4">Price (৳)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-4 shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-12 h-12 rounded-md object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-semibold block text-stone-800 leading-snug">{product.title}</span>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block mt-0.5">ID: {product.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${product.stock < 15 ? 'text-rose-600' : 'text-stone-700'}`}>
                          {product.stock} units
                        </span>
                        {product.stock < 15 && (
                          <span className="block text-[9px] font-bold text-rose-500 uppercase mt-0.5">LOW STOCK</span>
                        )}
                      </td>
                      <td className="p-4 font-bold font-serif text-stone-800">
                        ৳{product.price}
                        {product.originalPrice && (
                          <span className="block text-[10px] text-stone-400 line-through font-sans font-normal">
                            ৳{product.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer inline-flex"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-md transition-colors cursor-pointer inline-flex"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Revenue Chart Visualiser */}
          <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm">Revenue Sales Trend</h4>
                <p className="text-[10px] text-stone-400">June 2026 sales curve projection</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +22.5% Month-over-Month
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="h-64 flex items-end justify-between relative pt-8 px-2 font-mono text-[9px] text-stone-400">
              
              {/* Background horizontal guide lines */}
              <div className="absolute inset-x-0 bottom-8 border-b border-stone-100"></div>
              <div className="absolute inset-x-0 bottom-24 border-b border-stone-100"></div>
              <div className="absolute inset-x-0 bottom-40 border-b border-stone-100"></div>
              
              {/* Chart Plotting bars */}
              {stats.map((stat, idx) => {
                const maxVal = Math.max(...stats.map(s => s.sales));
                const percentage = (stat.sales / maxVal) * 80; // Scale up to 80% max height
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 space-y-2 group relative z-10">
                    {/* Hover Tooltip tooltip */}
                    <div className="absolute -top-6 bg-stone-900 text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-sans pointer-events-none whitespace-nowrap">
                      ৳{stat.sales.toLocaleString()}
                    </div>

                    <div 
                      style={{ height: `${percentage}%` }} 
                      className="w-8 bg-gradient-to-t from-emerald-800 to-emerald-600 group-hover:from-emerald-700 group-hover:to-emerald-500 rounded-t-sm transition-all duration-300 relative shadow-2xs"
                    ></div>
                    <span className="text-[10px] text-stone-500 font-sans font-semibold">{stat.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales Distribution Categories info */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
            <h4 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">Category Popularity</h4>
            
            <div className="space-y-4">
              {[
                { label: 'Panjabi Wear', percent: 45, value: '৳112,000', color: 'bg-emerald-700' },
                { label: 'T-Shirts (Arabic calligraphy)', percent: 30, value: '৳74,000', color: 'bg-amber-600' },
                { label: 'Islamic 3D Wooden signs', percent: 15, value: '৳37,000', color: 'bg-stone-800' },
                { label: 'Pure Musks & Perfumes', percent: 10, value: '৳24,500', color: 'bg-amber-700' }
              ].map((cat, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>{cat.label}</span>
                    <span className="text-stone-500">{cat.value} ({cat.percent}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${cat.percent}%` }} className={`h-full ${cat.color} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 text-[11px] leading-relaxed text-stone-500 mt-2">
              💡 <strong>Inventory Insight:</strong> Semi-fit Panjabis represent 45% of total sales revenue. Consider stocking Snowy-White sizes 42 and 44, which have the fastest stock turn-over rates prior to upcoming Islamic holidays.
            </div>
          </div>

        </div>
      )}

      {/* MOCK MODAL - ADD / EDIT PRODUCT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            
            <div className="bg-stone-900 text-white p-5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-sm tracking-wide">
                {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Premium Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-stone-700">
              
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCategory(val as any);
                      if (val !== 'customized') {
                        setCustomCategoryName('');
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700 text-stone-800"
                  >
                    <option value="panjabi">Panjabi</option>
                    <option value="tshirt">T-Shirts</option>
                    <option value="hoodie">Hoodies</option>
                    <option value="wall-art">Wooden Wall Art</option>
                    <option value="perfume">Attar / Perfume</option>
                    <option value="customized">Customized</option>
                  </select>

                  {category === 'customized' && (
                    <div className="mt-2" id="custom-category-container">
                      <label className="block font-semibold mb-1 text-[10px] text-stone-500">Custom Category Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. exclusive-panjabi"
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-emerald-700 text-stone-800"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Sale Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Assign to Sales Campaign</label>
                <select
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700 text-stone-800"
                >
                  <option value="">None (No Campaign Tag)</option>
                  {promotionalCampaigns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 focus:outline-hidden focus:border-emerald-700"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Image Selection *</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-emerald-700 text-xs text-stone-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 cursor-pointer"
                  />
                  {image && (
                    <div className="flex items-center gap-3 p-2 bg-stone-100/50 border border-stone-200 rounded-lg" id="image-upload-preview">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-stone-200 shrink-0">
                        <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-stone-500 font-semibold block truncate">Current Image Selected</span>
                        <span className="text-[9px] text-stone-400 block truncate font-mono">
                          {image.startsWith('data:') ? 'Local Base64 Data Asset' : image}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="text-stone-400 hover:text-rose-600 text-[10px] font-bold p-1"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">Or use Image URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={image.startsWith('data:') ? '' : image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-hidden focus:border-emerald-700 text-stone-800"
                    />
                  </div>
                </div>
              </div>

              {/* Product Variations & Specifications Section */}
              <div className="pt-4 border-t border-stone-100 space-y-4" id="variations-specifications-section">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-900 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-800" />
                    Product Variations & Specifications
                  </h4>
                  <span className="text-[10px] text-stone-400">Dynamic Configuration Suite</span>
                </div>

                {/* Active Features Workspace Cards */}
                {features.length === 0 ? (
                  <div className="text-center p-6 border border-dashed border-stone-200 rounded-xl bg-stone-50/50 text-stone-400">
                    <Sparkles className="w-6 h-6 mx-auto mb-1.5 text-stone-300 animate-pulse" />
                    <p className="font-semibold text-[11px] text-stone-700">No custom variations or specs configured yet</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Use the quick presets or custom engine below to initialize features.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {features.map((feat) => {
                      const currentInputValue = newOptionInputs[feat.name] || '';
                      return (
                        <div key={feat.name} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5 relative">
                          <button
                            type="button"
                            onClick={() => handleDeleteFeatureCategory(feat.name)}
                            className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-stone-100"
                            title="Remove Category"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-black text-emerald-950 block">
                              {feat.name}
                            </span>
                          </div>

                          {/* Options tag badges list */}
                          <div className="flex flex-wrap gap-1 min-h-[22px]">
                            {feat.values.length === 0 ? (
                              <span className="text-[10px] text-stone-400 italic">No option values. Add below:</span>
                            ) : (
                              feat.values.map((val) => (
                                <span 
                                  key={val} 
                                  className="inline-flex items-center gap-1 bg-stone-200 text-stone-800 text-[10px] font-semibold pl-2 pr-1 py-0.5 rounded-md"
                                >
                                  {val}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFeatureValue(feat.name, val)}
                                    className="text-stone-400 hover:text-stone-800 hover:bg-stone-300 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px] leading-none transition-colors"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))
                            )}
                          </div>

                          {/* Quick Add Input inside card */}
                          <div className="flex gap-1 pt-1">
                            <input
                              type="text"
                              placeholder="e.g. Slim Fit, Cotton..."
                              value={currentInputValue}
                              onChange={(e) => setNewOptionInputs({ ...newOptionInputs, [feat.name]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddFeatureValue(feat.name, currentInputValue);
                                  setNewOptionInputs({ ...newOptionInputs, [feat.name]: '' });
                                }
                              }}
                              className="flex-1 bg-white border border-stone-200 rounded-md px-2 py-1 text-[10px] focus:outline-hidden focus:border-emerald-700"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                handleAddFeatureValue(feat.name, currentInputValue);
                                setNewOptionInputs({ ...newOptionInputs, [feat.name]: '' });
                              }}
                              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-[9px] px-2 py-1 rounded-md transition-all cursor-pointer"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Preset & Custom Initialize Panel */}
                <div className="p-4 bg-stone-950 text-stone-300 rounded-xl space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-100 tracking-wider">Initialize New Configurations</span>
                    <p className="text-[10px] text-stone-400">Quickly setup standardized presets or build bespoke custom categories.</p>
                  </div>

                  {/* Presets Row */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-stone-400 font-bold uppercase block">Quick Presets:</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleAddPreset('Shirt Size', ['S', 'M', 'L', 'XL', 'XXL'])}
                        className="bg-stone-900 hover:bg-stone-800 hover:text-white text-[10px] font-bold py-1 px-2.5 rounded-lg border border-stone-800 transition-all cursor-pointer text-stone-300"
                      >
                        Shirt Size
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPreset('Color Variations', ['Midnight Black', 'Ruby Red', 'Teal Blue'])}
                        className="bg-stone-900 hover:bg-stone-800 hover:text-white text-[10px] font-bold py-1 px-2.5 rounded-lg border border-stone-800 transition-all cursor-pointer text-stone-300"
                      >
                        Color Variations
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPreset('Fabric Finish', ['Matte Satin', 'Standard Linen', 'Lustrous Silk'])}
                        className="bg-stone-900 hover:bg-stone-800 hover:text-white text-[10px] font-bold py-1 px-2.5 rounded-lg border border-stone-800 transition-all cursor-pointer text-stone-300"
                      >
                        Fabric Finish
                      </button>
                    </div>
                  </div>

                  {/* Custom Feature Engine form inside panel */}
                  <div className="border-t border-stone-800/80 pt-3 space-y-2">
                    <span className="text-[9px] text-stone-400 font-bold uppercase block">Custom Feature Property:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Sleeve Type, Embroidery style..."
                        value={customFeatureName}
                        onChange={(e) => setCustomFeatureName(e.target.value)}
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-[11px] text-white focus:outline-hidden focus:border-amber-100 placeholder:text-stone-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleInitializeCustomFeature(e)}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        Initialize Feature
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full font-medium cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

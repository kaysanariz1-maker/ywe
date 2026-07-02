import { useState, useMemo } from 'react';
import { 
  Filter, Tag, Eye, Heart, Star, Check, 
  Plus, ShoppingCart, Sliders, Info, MessageCircle, RefreshCw 
} from 'lucide-react';
import { Product, AdBanner } from '../types';

interface StoreFrontProps {
  products: Product[];
  searchQuery: string;
  onAddToCart: (
    product: Product,
    quantity: number,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => void;
  promotionalCampaigns?: string[];
  adBanners?: AdBanner[];
}

export default function StoreFront({ products, searchQuery, onAddToCart, promotionalCampaigns = [], adBanners = [] }: StoreFrontProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [colorChoice, setColorChoice] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<{ [featureName: string]: string }>({});

  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  // Base category definitions
  const baseCategories = [
    { id: 'all', label: 'All Products' },
    { id: 'panjabi', label: 'Luxury Panjabis' },
    { id: 'tshirt', label: 'Caligraphy Tees & Caps' },
    { id: 'hoodie', label: 'Tawakkul Hoodies' },
    { id: 'wall-art', label: '3D Calligraphy Wall Signs' },
    { id: 'perfume', label: 'Pure Attar' },
    { id: 'customized', label: 'Customized Collections' }
  ];

  // Build the final category pills list
  const categoryPills = useMemo(() => {
    const presetCategoryIds = ['panjabi', 'tshirt', 'hoodie', 'wall-art', 'perfume', 'customized'];
    const customCategoriesInProducts = products
      .map(p => p.category)
      .filter((cat): cat is string => !!cat && !presetCategoryIds.includes(cat.trim().toLowerCase()));

    // Remove duplicates and normalize to lowercase for custom categories
    const uniqueCustomCategories = Array.from(new Set(
      customCategoriesInProducts.map(cat => cat.trim().toLowerCase())
    ));

    return [
      ...baseCategories,
      ...uniqueCustomCategories.map(cat => {
        // Find original category casing from products if possible
        const originalProduct = products.find(p => p.category && p.category.trim().toLowerCase() === cat);
        const labelText = originalProduct?.category || cat;
        return {
          id: cat,
          label: labelText.charAt(0).toUpperCase() + labelText.slice(1)
        };
      }),
      ...(promotionalCampaigns || []).map(campaign => ({
        id: `campaign:${campaign}`,
        label: campaign
      }))
    ];
  }, [products, promotionalCampaigns]);

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matchesCategory = false;
      
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory.startsWith('campaign:')) {
        const campName = selectedCategory.substring(9).trim().toLowerCase();
        matchesCategory = !!(product.campaign && product.campaign.trim().toLowerCase() === campName);
      } else {
        const productCat = product.category ? product.category.trim().toLowerCase() : '';
        const selectedCat = selectedCategory ? selectedCategory.trim().toLowerCase() : '';
        
        matchesCategory = productCat === selectedCat ||
          (selectedCat === 'customized' && productCat && !['panjabi', 'tshirt', 'hoodie', 'wall-art', 'perfume'].includes(productCat));
      }
        
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Sorting products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'popular') return b.rating - a.rating;
      return 0; // Default Featured sorting (original layout)
    });
  }, [filteredProducts, sortBy]);

  // Dynamic feed injection for inline ad banners
  const gridItems = useMemo(() => {
    const items: ({ type: 'product'; data: Product } | { type: 'banner'; data: AdBanner })[] = [];
    
    // Sort adBanners by insertAfterRowIndex ascending
    const sortedBanners = [...(adBanners || [])].sort((a, b) => a.insertAfterRowIndex - b.insertAfterRowIndex);
    
    let productIndex = 0;
    while (productIndex < sortedProducts.length) {
      items.push({ type: 'product', data: sortedProducts[productIndex] });
      productIndex++;
      
      // Check if any banner should be inserted right after this total count of products
      const matchingBanner = sortedBanners.find(b => b.insertAfterRowIndex === productIndex);
      if (matchingBanner) {
        items.push({ type: 'banner', data: matchingBanner });
      }
    }
    
    return items;
  }, [sortedProducts, adBanners]);

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    
    // Check if "Size" or "Color" is explicitly present in features
    const sizeFeature = product.features?.find(f => f.name.toLowerCase().includes('size'));
    const colorFeature = product.features?.find(f => f.name.toLowerCase().includes('color'));
    
    setSelectedSize(sizeFeature && sizeFeature.values.length > 0 ? sizeFeature.values[0] : '');
    setColorChoice(colorFeature && colorFeature.values.length > 0 ? colorFeature.values[0] : '');
    setQuantity(1);

    const defaultFeatures: { [key: string]: string } = {};
    if (product.features) {
      product.features.forEach(f => {
        if (f.values && f.values.length > 0) {
          defaultFeatures[f.name] = f.values[0];
        }
      });
    }
    setSelectedFeatures(defaultFeatures);
  };

  const handleAddToCartSubmit = () => {
    if (!selectedProduct) return;
    
    let finalSize = selectedSize;
    if (selectedFeatures) {
      const sizeKey = Object.keys(selectedFeatures).find(k => k.toLowerCase().includes('size'));
      if (sizeKey) {
        finalSize = selectedFeatures[sizeKey];
      }
    }
    
    onAddToCart(selectedProduct, quantity, finalSize || undefined, selectedFeatures);
    
    // Brief visual confirmation
    setAddedFeedback('Successfully added to shopping bag!');
    setTimeout(() => {
      setAddedFeedback(null);
      setSelectedProduct(null); // Close modal
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans" id="storefront-container">
      
      {/* Category selector pill navigation & sorting controls bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-100 pb-8 mb-10">
        
        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none max-w-full">
          {categoryPills.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Sliders className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-500 font-semibold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold px-3 py-2 text-stone-700 focus:outline-hidden focus:border-emerald-700 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01]"
          >
            <option value="featured">Featured / Custom</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="popular">Popular Customer Rating</option>
          </select>
        </div>

      </div>

      {/* Main Product Catalog Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <Info className="w-12 h-12 text-stone-300 mx-auto" />
          <div>
            <h3 className="font-serif font-black text-lg text-stone-800">No products match your search</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your spelling or searching for standard categories like "Sabr", "Oversized", "Attar" or "Panjabi".
            </p>
          </div>
          <button
            onClick={() => { setSelectedCategory('all'); }}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {gridItems.map((item) => {
            if (item.type === 'banner') {
              return (
                <div 
                  key={`banner-${item.data.id}`}
                  onClick={() => {
                    setSelectedCategory(item.data.targetCategory);
                    const element = document.getElementById('storefront-container');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="col-span-full w-full h-36 sm:h-48 md:h-56 rounded-2xl overflow-hidden relative group cursor-pointer border border-stone-100/50 hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99]"
                >
                  <img 
                    src={item.data.imageUrl} 
                    alt="Promotional Advertisement"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent flex flex-col justify-center px-8 sm:px-12 text-white">
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-600 text-white px-2.5 py-1 rounded-sm w-fit mb-2">
                      SPONSORED PROMOTION
                    </span>
                    <h3 className="text-base sm:text-2xl font-serif font-black tracking-tight drop-shadow-sm max-w-lg leading-tight">
                      Special Collection Highlight
                    </h3>
                    <p className="text-[10px] sm:text-xs text-stone-200 mt-1 max-w-sm font-medium">
                      Tap here to view this curated list of products now.
                    </p>
                  </div>
                </div>
              );
            }

            const product = item.data;
            return (
              <div 
                key={product.id} 
                className="group flex flex-col relative bg-white border border-stone-100 rounded-2xl overflow-hidden p-3 hover:shadow-xl hover:border-stone-200/80 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                onClick={() => handleOpenQuickView(product)}
              >
                {/* Product Visual Container */}
                <div className="aspect-square w-full rounded-xl bg-stone-50 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Labels/Badges overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.campaign && (
                      <span className="bg-rose-600 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                        {product.campaign}
                      </span>
                    )}
                    {product.isNew && (
                      <span className="bg-amber-500 text-stone-950 text-[8px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        NEW IN
                      </span>
                    )}
                    {product.isPopular && (
                      <span className="bg-emerald-800 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        TRENDING
                      </span>
                    )}
                  </div>

                  {/* Quick Add overlay button - subtle appearing on hover */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="bg-white/95 text-stone-900 font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-full shadow-md hover:bg-emerald-700 hover:text-white transition-colors duration-200">
                      Quick Shop View
                    </span>
                  </div>
                </div>

                {/* Product Info Block */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category label */}
                    <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold block mb-1">
                      {product.category === 'wall-art' ? 'Wooden Wall Art' : product.category === 'perfume' ? 'Attar / Perfume' : product.category}
                    </span>
                    
                    {/* Title */}
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-800 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-between border-t border-stone-50 pt-2.5">
                    {/* Prices */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-black text-xs sm:text-sm text-stone-900">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Trust Rating */}
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-bold text-stone-700">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK VIEW & DETAILED ORDER MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="product-quickview-modal">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative">
            
            {/* Close button top right */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-stone-100 text-stone-700 shadow-xs cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left Product Image block */}
              <div className="bg-stone-50 aspect-square md:aspect-auto md:h-full max-h-[400px] overflow-hidden">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Order Details form */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-800 font-bold">
                      {selectedProduct.category} COLLECTION
                    </span>
                    {selectedProduct.campaign && (
                      <span className="bg-rose-600 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {selectedProduct.campaign}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-stone-900 leading-tight mt-1.5">
                    {selectedProduct.title}
                  </h3>

                  {/* Prices breakdown */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-serif font-black text-stone-900">৳{selectedProduct.price.toLocaleString()}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">৳{selectedProduct.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Star Rating details */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-stone-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">({selectedProduct.reviewsCount} customer reviews)</span>
                  </div>

                  {/* Description body */}
                  <p className="text-xs text-stone-500 mt-4 leading-relaxed line-clamp-3">
                    {selectedProduct.description}
                  </p>



                  {/* Dynamic Variations/Specifications Choices */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="space-y-4 mt-4" id="dynamic-specifications-selectors">
                      {selectedProduct.features.map((feature) => (
                        <div key={feature.name}>
                          <span className="block text-xs font-semibold text-stone-700 mb-1.5">
                            Select {feature.name}:
                          </span>
                          <div className="flex gap-1.5 flex-wrap">
                            {feature.values.map((val) => (
                              <button
                                key={val}
                                onClick={() => setSelectedFeatures({
                                  ...selectedFeatures,
                                  [feature.name]: val
                                })}
                                className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  selectedFeatures[feature.name] === val
                                    ? 'bg-stone-900 text-white shadow-xs'
                                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom checkout action buttons */}
                <div className="border-t border-stone-100 pt-4 space-y-4">
                  {/* Quantity selector & Add to bag row */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-200 bg-white rounded-lg h-11 shrink-0">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 text-stone-500 hover:text-stone-800 cursor-pointer font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-1 text-xs font-bold text-stone-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3.5 text-stone-500 hover:text-stone-800 cursor-pointer font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCartSubmit}
                      className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs h-11 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/10 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Shopping Bag
                    </button>
                  </div>

                  {/* Live Feedback alert */}
                  {addedFeedback && (
                    <div className="text-center text-xs font-bold text-emerald-800 bg-emerald-50 py-2 rounded-lg border border-emerald-100 animate-pulse">
                      {addedFeedback}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

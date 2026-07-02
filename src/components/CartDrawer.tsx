import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => void;
  onRemoveItem: (
    productId: string,
    size?: string,
    selectedFeatures?: { [featureName: string]: string }
  ) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="cart-drawer-overlay">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-serif font-bold text-stone-900">Your Shopping Bag</h2>
              <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {cartItems.length}
              </span>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-stone-50 rounded-full text-stone-300">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-800">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Browse our premium clothing, customized signs, and long-lasting attar collections to add items!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const serializedFeatures = item.selectedFeatures 
                  ? Object.entries(item.selectedFeatures).map(([k, v]) => `${k}:${v}`).join(',')
                  : '';
                const itemKey = `${item.product.id}-${item.selectedSize || 'default'}-${serializedFeatures}`;
                return (
                  <div 
                    key={itemKey} 
                    className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100/50 hover:border-stone-200/65 transition-colors relative"
                  >
                    {/* Product thumbnail */}
                    <div className="w-20 h-20 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="font-semibold text-xs text-stone-900 truncate leading-snug">
                          {item.product.title}
                        </h4>
                        
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedSize && (
                            <span className="inline-block bg-stone-200 text-stone-700 text-[9px] font-bold px-2 py-0.5 rounded-md">
                              Size: {item.selectedSize}
                            </span>
                          )}

                          {item.selectedFeatures && Object.entries(item.selectedFeatures).map(([featName, featValue]) => (
                            <span 
                              key={featName} 
                              className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 text-[8px] font-bold px-1.5 py-0.5 rounded-md"
                            >
                              {featName}: {featValue}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-stone-200 bg-white rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedFeatures)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedFeatures)}
                            className="px-2 py-1 text-stone-500 hover:text-stone-800 cursor-pointer text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-serif font-black text-xs text-stone-900">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedFeatures)}
                      className="absolute top-2 right-2 p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations */}
          {cartItems.length > 0 && (
            <div className="border-t border-stone-100 p-6 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">৳{calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping:</span>
                  <span className="text-[11px] text-stone-500">Calculated at checkout</span>
                </div>
                <div className="border-t border-stone-200/60 pt-2 flex justify-between text-sm text-stone-900 font-bold">
                  <span>Subtotal:</span>
                  <span className="font-serif font-black text-emerald-800">৳{calculateSubtotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 transition-all cursor-pointer group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[10px] text-stone-400 text-center">
                🔒 Secure SSL Checkouts • Fast Delivery across Bangladesh • bKash, Nagad or Cash on Delivery supported.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

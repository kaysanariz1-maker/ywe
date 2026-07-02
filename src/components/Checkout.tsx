import { useState } from 'react';
import { 
  ArrowLeft, MapPin, Phone, User, CheckCircle, 
  CreditCard, Truck, Smartphone, MessageSquare, ClipboardCheck 
} from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

export default function Checkout({ cartItems, onBack, onOrderSuccess }: CheckoutProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  
  // Payment numbers simulator
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const shippingCost = city === 'Dhaka' ? 80 : 150;
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalAmount = subtotal + shippingCost;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Full Name is required';
    
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!bdPhoneRegex.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Bangladesh mobile number (e.g., 01712345678)';
    }

    if (!address.trim()) newErrors.address = 'Full shipping address is required';

    if (paymentMethod !== 'cod') {
      if (!paymentNumber.trim()) {
        newErrors.paymentNumber = 'MFS Payment Number is required';
      } else if (!bdPhoneRegex.test(paymentNumber.replace(/\s/g, ''))) {
        newErrors.paymentNumber = 'Please enter a valid MFS wallet number';
      }
      if (!transactionId.trim()) newErrors.transactionId = 'Transaction ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (viaWhatsApp: boolean = false) => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      phone,
      address,
      city,
      paymentMethod,
      paymentNumber: paymentMethod !== 'cod' ? paymentNumber : undefined,
      transactionId: paymentMethod !== 'cod' ? transactionId : undefined,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize,
        selectedFeatures: item.selectedFeatures
      })),
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsSubmitting(false);

      if (viaWhatsApp) {
        // Generate beautifully formatted WhatsApp text
        const itemsText = cartItems
          .map((item) => {
            const sizeStr = item.selectedSize ? `Size: ${item.selectedSize}` : '';
            const featsStr = item.selectedFeatures
              ? Object.entries(item.selectedFeatures).map(([k, v]) => `${k}: ${v}`).join(', ')
              : '';
            const specDetails = [sizeStr, featsStr].filter(Boolean).join(' | ') || 'N/A';
            return `• ${item.product.title} [${specDetails}] x ${item.quantity} (৳${item.product.price})`;
          })
          .join('\n');
        
        const text = `*NEW ORDER - BELIEVER SIGN (PROTOTYPE)*\n\n` +
          `*Order ID:* ${newOrder.id}\n` +
          `*Customer Name:* ${name}\n` +
          `*Phone:* ${phone}\n` +
          `*Shipping Address:* ${address}, ${city}\n` +
          `*Payment:* ${paymentMethod.toUpperCase()}${paymentMethod !== 'cod' ? ` (Acc: ${paymentNumber} | TxID: ${transactionId})` : ''}\n\n` +
          `*Ordered Items:*\n${itemsText}\n\n` +
          `*Subtotal:* ৳${subtotal}\n` +
          `*Shipping:* ৳${shippingCost}\n` +
          `*Total Amount:* ৳${totalAmount}\n\n` +
          `Please confirm my order on WhatsApp. Thank you!`;

        const encodedText = encodeURIComponent(text);
        // Standard WhatsApp business forwarding URL (01712345678 placeholder)
        const whatsappUrl = `https://wa.me/8801712345678?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
      }

      // Add to state and redirect to success
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="checkout-container">
      {/* Back navigation */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-xs mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8">
          
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">Secure Delivery Checkout</h2>
            <p className="text-xs text-stone-500 mt-1">Please provide accurate shipping details for express delivery across Bangladesh.</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            
            {/* Section 1: Customer Info */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500 flex items-center gap-2 border-b border-stone-100 pb-2">
                <User className="w-4 h-4 text-emerald-700" /> 1. Contact Information
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kaysan Ariz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-stone-50 border ${errors.name ? 'border-rose-500' : 'border-stone-200'} rounded-lg px-4 py-2.5 text-xs focus:outline-hidden focus:border-emerald-700 focus:bg-white text-stone-800`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full bg-stone-50 border ${errors.phone ? 'border-rose-500' : 'border-stone-200'} rounded-lg px-4 py-2.5 text-xs focus:outline-hidden focus:border-emerald-700 focus:bg-white text-stone-800`}
                  />
                  {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Shipping */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500 flex items-center gap-2 border-b border-stone-100 pb-2">
                <MapPin className="w-4 h-4 text-emerald-700" /> 2. Shipping Destination
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Region/City</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCity('Dhaka')}
                      className={`py-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        city === 'Dhaka'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <Truck className="w-4 h-4" /> Inside Dhaka (৳80)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCity('Outside Dhaka')}
                      className={`py-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        city === 'Outside Dhaka'
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <MapPin className="w-4 h-4" /> Outside Dhaka (৳150)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">Full Delivery Address</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. House 14, Road 5, Block B, Niketan, Gulshan-1, Dhaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full bg-stone-50 border ${errors.address ? 'border-rose-500' : 'border-stone-200'} rounded-lg p-4 text-xs focus:outline-hidden focus:border-emerald-700 focus:bg-white text-stone-800`}
                  ></textarea>
                  {errors.address && <p className="text-[10px] text-rose-500 mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Payment */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500 flex items-center gap-2 border-b border-stone-100 pb-2">
                <CreditCard className="w-4 h-4 text-emerald-700" /> 3. Payment Method
              </h3>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                  { id: 'bkash', label: 'bKash Wallet', desc: 'Instant 2% Cash-back' },
                  { id: 'nagad', label: 'Nagad Wallet', desc: 'Secure MFS portal' }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentMethod === method.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <span className="block font-bold text-xs capitalize">{method.label}</span>
                    <span className="block text-[10px] text-stone-400 mt-0.5">{method.desc}</span>
                  </button>
                ))}
              </div>

              {/* MFS Payment details instructions simulator (If bKash/Nagad selected) */}
              {paymentMethod !== 'cod' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 animate-fade-in text-xs text-stone-600">
                  <div className="space-y-1">
                    <p className="font-bold text-stone-800">MFS Instruction Details:</p>
                    <p>1. Send Money or Cashout <strong>৳{totalAmount.toLocaleString()}</strong> to our official {paymentMethod} merchant: <strong>01712-345678</strong></p>
                    <p>2. Put your transaction ID and wallet number in the form below to complete verification.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">{paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number Used</label>
                      <input
                        type="tel"
                        placeholder="e.g. 01712xxxxxx"
                        value={paymentNumber}
                        onChange={(e) => setPaymentNumber(e.target.value)}
                        className={`w-full bg-white border ${errors.paymentNumber ? 'border-rose-500' : 'border-stone-200'} rounded-lg px-4 py-2.5 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800`}
                      />
                      {errors.paymentNumber && <p className="text-[10px] text-rose-500 mt-1">{errors.paymentNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">Transaction ID (TxID)</label>
                      <input
                        type="text"
                        placeholder="e.g. BKX9384291"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className={`w-full bg-white border ${errors.transactionId ? 'border-rose-500' : 'border-stone-200'} rounded-lg px-4 py-2.5 text-xs focus:outline-hidden focus:border-emerald-700 text-stone-800`}
                      />
                      {errors.transactionId && <p className="text-[10px] text-rose-500 mt-1">{errors.transactionId}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Sticky Checkout summary */}
        <div className="lg:col-span-5 bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-6 lg:sticky lg:top-24">
          <h3 className="font-serif font-bold text-stone-900 text-sm border-b border-stone-200 pb-3">Order Summary</h3>
          
          {/* Order products summary list */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const serializedFeatures = item.selectedFeatures 
                ? Object.entries(item.selectedFeatures).map(([k, v]) => `${k}:${v}`).join(',')
                : '';
              const itemKey = `${item.product.id}-${item.selectedSize || 'default'}-${serializedFeatures}`;
              return (
                <div key={itemKey} className="flex justify-between text-xs text-stone-700 border-b border-stone-100/50 pb-2">
                  <div className="min-w-0 pr-4">
                    <span className="font-semibold block truncate leading-tight">{item.product.title}</span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-stone-400">Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</span>
                      {item.selectedFeatures && Object.entries(item.selectedFeatures).map(([featName, featValue]) => (
                        <span key={featName} className="text-[9px] bg-stone-200/50 text-stone-600 px-1 py-0.5 rounded-sm border border-stone-200/40">
                          {featName}: {featValue}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="font-serif shrink-0 font-bold">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Pricing breakdowns */}
          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-stone-900">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery Cost:</span>
              <span className="font-semibold text-stone-900">৳{shippingCost}</span>
            </div>
            
            <div className="border-t border-stone-200 pt-3 flex justify-between text-stone-900 font-bold text-sm">
              <span>Total Bill Amount:</span>
              <span className="font-serif font-black text-emerald-800 text-base">৳{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Two Order buttons: Standard & WhatsApp */}
          <div className="space-y-3 pt-2">
            
            <button
              onClick={() => handlePlaceOrder(true)}
              disabled={isSubmitting}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs py-4 rounded-full flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/15 transition-all cursor-pointer disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              {isSubmitting ? 'Verifying Checkout...' : 'Order Direct via WhatsApp'}
            </button>

            <button
              onClick={() => handlePlaceOrder(false)}
              disabled={isSubmitting}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs py-4 rounded-full flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <ClipboardCheck className="w-4 h-4" />
              {isSubmitting ? 'Verifying Checkout...' : 'Place Order on Website'}
            </button>

          </div>

          <p className="text-[10px] text-stone-400 text-center leading-relaxed">
            By placing your order, you agree to our 14-day replacement warranty. You will receive an instant confirmation SMS alert.
          </p>
        </div>

      </div>
    </div>
  );
}

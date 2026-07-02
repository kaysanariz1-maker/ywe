import { Product, Order, SalesStat } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Sabr (Patience) Premium Oversized Tee',
    category: 'tshirt',
    price: 990,
    originalPrice: 1250,
    description: 'A heavyweight 100% organic cotton t-shirt featuring elegant Arabic calligraphy of "Sabr" (Patience) on the back and a minimal typography branding on the chest. Soft-washed, breathable, and designed for an elegant Islamic urban lifestyle look.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Jet Black', 'Off-White', 'Olive Green'],
    isNew: true,
    isPopular: true,
    stock: 45,
    rating: 4.8,
    reviewsCount: 124,
    features: [
      { name: 'Size', values: ['M', 'L', 'XL', 'XXL'] },
      { name: 'Color', values: ['Jet Black', 'Off-White', 'Olive Green'] }
    ]
  },
  {
    id: 'p2',
    title: 'Al-Noor Premium Semi-Fit Panjabi',
    category: 'panjabi',
    price: 2450,
    originalPrice: 2950,
    description: 'Crafted from high-grade cotton-linen blend fabric with precise, minimal premium embroidery on the collar and placket. Features metal snap buttons and high stitch-density finishing. Perfect for Jummah, Eid, and formal family gatherings.',
    image: 'https://images.unsplash.com/photo-1621249197930-794ef9c52d46?q=80&w=600&auto=format&fit=crop',
    sizes: ['40', '42', '44', '46'],
    colors: ['Snow White', 'Midnight Blue', 'Dusty Rose'],
    isNew: true,
    stock: 22,
    rating: 4.9,
    reviewsCount: 88,
    features: [
      { name: 'Size', values: ['40', '42', '44', '46'] },
      { name: 'Color', values: ['Snow White', 'Midnight Blue', 'Dusty Rose'] }
    ]
  },
  {
    id: 'p3',
    title: 'Ayat-al-Kursi Wooden Wall Sign (3D Art)',
    category: 'wall-art',
    price: 3800,
    originalPrice: 4500,
    description: 'Exquisite 3-layer laser-cut wooden wall calligraphy featuring Ayat-al-Kursi. Made of high-quality imported walnut wood with metallic gold plating on the raised letters. Adds a spiritual elegance and modern minimalist Islamic look to your living room.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop',
    isPopular: true,
    stock: 12,
    rating: 5.0,
    reviewsCount: 42,
    features: []
  },
  {
    id: 'p4',
    title: 'Premium White Musk Pure Dehn-Al-Oudh',
    category: 'perfume',
    price: 1200,
    originalPrice: 1500,
    description: '100% alcohol-free premium concentrated perfume oil (Attar). A rich blend of warm white musk, sweet sandalwood, and subtle undertones of premium Cambodian oudh. Long-lasting fragrance of over 24 hours on fabrics. Packaged in a luxury leather gift box.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
    sizes: ['6ml', '12ml'],
    colors: ['Crystal Bottle'],
    stock: 30,
    rating: 4.7,
    reviewsCount: 61,
    features: [
      { name: 'Size', values: ['6ml', '12ml'] },
      { name: 'Bottle', values: ['Crystal Bottle'] }
    ]
  },
  {
    id: 'p5',
    title: 'Tawakkul (Trust in Allah) Heavyweight Hoodie',
    category: 'hoodie',
    price: 1850,
    originalPrice: 2200,
    description: 'Ultra-soft 400 GSM brushed fleece hoodie featuring minimalist abstract Arabic typography of "Tawakkul" (Trust). Deep double-lined hood, ribbed cuffs, and high-density premium screen print. Keep warm while wearing your faith.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Sand Charcoal', 'Forest Green', 'Mocha'],
    isPopular: true,
    stock: 18,
    rating: 4.9,
    reviewsCount: 110,
    features: [
      { name: 'Size', values: ['M', 'L', 'XL', 'XXL'] },
      { name: 'Color', values: ['Sand Charcoal', 'Forest Green', 'Mocha'] }
    ]
  },
  {
    id: 'p6',
    title: 'Shukr (Gratitude) Minimalist Drop-Shoulder Tee',
    category: 'tshirt',
    price: 890,
    originalPrice: 1100,
    description: 'Premium drop-shoulder heavy t-shirt with high-density print of "Shukr" (Gratitude) in contemporary artistic script. Styled in premium comfort fit for regular wear.',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop',
    sizes: ['M', 'L', 'XL'],
    colors: ['Sandstone', 'Midnight Olive', 'Burgundy'],
    isNew: true,
    stock: 50,
    rating: 4.6,
    reviewsCount: 35,
    features: [
      { name: 'Size', values: ['M', 'L', 'XL'] },
      { name: 'Color', values: ['Sandstone', 'Midnight Olive', 'Burgundy'] }
    ]
  },
  {
    id: 'p7',
    title: 'Al-Haqq Minimal Embroidered Cap',
    category: 'tshirt', // Group with apparel
    price: 650,
    originalPrice: 800,
    description: 'Classic 6-panel unstructured baseball cap made from durable washed cotton twill. Features delicate 3D custom embroidery of "Al-Haqq" (The Truth) in beautiful white Kufic script on the front, adjustable brass strap.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
    sizes: ['Adjustable One Size'],
    colors: ['Charcoal Gray', 'Olive Drab', 'Camel Brown'],
    stock: 25,
    rating: 4.8,
    reviewsCount: 53,
    features: [
      { name: 'Size', values: ['Adjustable One Size'] },
      { name: 'Color', values: ['Charcoal Gray', 'Olive Drab', 'Camel Brown'] }
    ]
  },
  {
    id: 'p8',
    title: 'Madinah Rose Luxury Concentrated Attar',
    category: 'perfume',
    price: 1550,
    originalPrice: 1800,
    description: 'An exquisite concentrated perfume oil capturing the essence of blooming Taif roses, intertwined with white cedarwood and amber. Absolutely non-alcoholic, soft, powdery, and highly pleasing for daily use.',
    image: 'https://images.unsplash.com/photo-1528740564065-f3782d133941?q=80&w=600&auto=format&fit=crop',
    sizes: ['6ml', '12ml'],
    colors: ['Vintage Brass Bottle'],
    stock: 15,
    rating: 4.9,
    reviewsCount: 29,
    features: [
      { name: 'Size', values: ['6ml', '12ml'] },
      { name: 'Bottle', values: ['Vintage Brass Bottle'] }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-9842',
    customerName: 'Kazi Kaysan Ariz',
    phone: '01712345678',
    address: 'House 42, Road 11, Banani',
    city: 'Dhaka',
    paymentMethod: 'bkash',
    paymentNumber: '01712345678',
    transactionId: 'BKX937482910',
    items: [
      { productId: 'p1', productTitle: 'Sabr (Patience) Premium Oversized Tee', quantity: 2, price: 990, size: 'L' },
      { productId: 'p4', productTitle: 'Premium White Musk Pure Dehn-Al-Oudh', quantity: 1, price: 1200, size: '6ml' }
    ],
    totalAmount: 3260, // 1980 + 1200 + 80
    status: 'delivered',
    createdAt: '2026-06-25T14:22:10Z'
  },
  {
    id: 'ORD-7512',
    customerName: 'Naimur Rahman',
    phone: '01987654321',
    address: 'Holding 12, Oxygen Circle, Nasirabad',
    city: 'Outside Dhaka',
    paymentMethod: 'cod',
    items: [
      { productId: 'p2', productTitle: 'Al-Noor Premium Semi-Fit Panjabi', quantity: 1, price: 2450, size: '42' }
    ],
    totalAmount: 2600, // 2450 + 150
    status: 'processing',
    createdAt: '2026-06-27T10:05:45Z'
  },
  {
    id: 'ORD-2910',
    customerName: 'Sheikh Jamil',
    phone: '01511223344',
    address: 'Miapara Pipra Road, Rangpur Sadar',
    city: 'Outside Dhaka',
    paymentMethod: 'nagad',
    paymentNumber: '01511223344',
    transactionId: 'NGD3827419',
    items: [
      { productId: 'p5', productTitle: 'Tawakkul (Trust in Allah) Heavyweight Hoodie', quantity: 1, price: 1850, size: 'XL' }
    ],
    totalAmount: 2000, // 1850 + 150
    status: 'pending',
    createdAt: '2026-06-28T04:12:30Z'
  }
];

export const MOCK_SALES_STATS: SalesStat[] = [
  { date: 'Jun 22', sales: 4500, orders: 3 },
  { date: 'Jun 23', sales: 8900, orders: 5 },
  { date: 'Jun 24', sales: 6200, orders: 4 },
  { date: 'Jun 25', sales: 11400, orders: 7 },
  { date: 'Jun 26', sales: 15200, orders: 9 },
  { date: 'Jun 27', sales: 9800, orders: 6 },
  { date: 'Jun 28', sales: 18450, orders: 11 }
];

import { useState } from 'react';
import { ArrowLeft, Store, ShoppingCart, Volume2, Search, Package, Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface ShopsScreenProps {
  onBack: () => void;
  highContrast: boolean;
  voiceEnabled: boolean;
}

interface Shop {
  id: string;
  name: string;
  category: 'grocery' | 'pharmacy' | 'restaurant' | 'electronics' | 'service';
  distance: string;
  deliveryFee: number;
  rating: number;
  isOpen: boolean;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export function ShopsScreen({ onBack, highContrast, voiceEnabled }: ShopsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const shops: Shop[] = [
    {
      id: '1',
      name: 'Fresh Grocery Store',
      category: 'grocery',
      distance: '0.5 km',
      deliveryFee: 20,
      rating: 4.5,
      isOpen: true,
      products: [
        { id: 'p1', name: 'Fresh Milk (1L)', price: 120, inStock: true },
        { id: 'p2', name: 'Bread', price: 80, inStock: true },
        { id: 'p3', name: 'Eggs (12 pack)', price: 250, inStock: false },
        { id: 'p4', name: 'Rice (5kg)', price: 800, inStock: true },
      ],
    },
    {
      id: '2',
      name: 'Quick Pharmacy',
      category: 'pharmacy',
      distance: '1.2 km',
      deliveryFee: 30,
      rating: 4.8,
      isOpen: true,
      products: [
        { id: 'p5', name: 'Paracetamol', price: 50, inStock: true },
        { id: 'p6', name: 'Band-Aid', price: 120, inStock: true },
        { id: 'p7', name: 'Hand Sanitizer', price: 150, inStock: true },
      ],
    },
    {
      id: '3',
      name: 'Food Express',
      category: 'restaurant',
      distance: '0.8 km',
      deliveryFee: 25,
      rating: 4.3,
      isOpen: true,
      products: [
        { id: 'p8', name: 'Chicken Biryani', price: 350, inStock: true },
        { id: 'p9', name: 'Burger Combo', price: 450, inStock: true },
        { id: 'p10', name: 'Pizza Large', price: 850, inStock: true },
      ],
    },
    {
      id: '4',
      name: 'Electronics Hub',
      category: 'electronics',
      distance: '2.1 km',
      deliveryFee: 40,
      rating: 4.6,
      isOpen: false,
      products: [
        { id: 'p11', name: 'Phone Charger', price: 500, inStock: true },
        { id: 'p12', name: 'Earphones', price: 800, inStock: true },
      ],
    },
    {
      id: '5',
      name: 'Mobile Repair Service',
      category: 'service',
      distance: '1.5 km',
      deliveryFee: 50,
      rating: 4.7,
      isOpen: true,
    },
  ];

  const speak = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShopClick = (shop: Shop) => {
    if (shop.category === 'service') {
      speak(`${shop.name}, service provider, ${shop.distance} away`);
      alert(`Booking service from ${shop.name}`);
    } else {
      setSelectedShop(shop);
      speak(`Opening ${shop.name}, ${shop.category}`);
    }
  };

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    speak('Added to cart');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
    speak('Removed from cart');
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    if (!selectedShop) return 0;
    return Object.entries(cart).reduce((sum, [productId, qty]) => {
      const product = selectedShop.products?.find((p) => p.id === productId);
      return sum + (product?.price || 0) * qty;
    }, 0);
  };

  const handleCheckout = () => {
    const total = getTotalPrice() + (selectedShop?.deliveryFee || 0);
    speak(`Placing order. Total amount ${total} rupees`);
    alert(`Order placed for ₹${total}`);
    setCart({});
    setSelectedShop(null);
  };

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: Shop['category']) => {
    switch (category) {
      case 'service':
        return <Wrench className="h-8 w-8" />;
      default:
        return <Store className="h-8 w-8" />;
    }
  };

  if (selectedShop) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`flex items-center gap-3 p-4 ${highContrast ? 'bg-black border-b-2 border-green-400' : 'bg-white border-b border-gray-200'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedShop(null);
              speak('Returning to shops list');
            }}
            className={highContrast ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700'}
            aria-label="Go back to shops"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-lg">{selectedShop.name}</h2>
            <p className="text-xs opacity-70">
              {selectedShop.distance} • ₹{selectedShop.deliveryFee} delivery
            </p>
          </div>
        </div>

        {/* Scrollable Products */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedShop.products?.map((product) => (
            <Card
              key={product.id}
              className={`p-4 ${
                highContrast ? 'bg-gray-900 border-green-400' : ''
              } ${!product.inStock ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg">{product.name}</h3>
                  <p className="text-xl">₹{product.price}</p>
                  {!product.inStock && (
                    <Badge variant="destructive" className="mt-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {product.inStock && (
                  <div className="flex items-center gap-2">
                    {cart[product.id] ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(product.id)}
                        >
                          -
                        </Button>
                        <span className="text-lg w-8 text-center">{cart[product.id]}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          className={
                            highContrast
                              ? 'bg-green-900 border border-green-400'
                              : 'bg-green-600'
                          }
                        >
                          +
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                        className={
                          highContrast ? 'bg-green-900 border border-green-400' : 'bg-green-600'
                        }
                      >
                        Add
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <Card
            className={`p-4 ${
              highContrast ? 'bg-green-900 border-green-400' : 'bg-green-50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items ({getTotalItems()})</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{selectedShop.deliveryFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl">
                <span>Total</span>
                <span>₹{getTotalPrice() + selectedShop.deliveryFee}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className={`w-full mt-4 h-14 ${
                highContrast
                  ? 'bg-green-900 hover:bg-green-800 text-white border-2 border-green-400'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Place Order
            </Button>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={highContrast ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700'}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl">Nearby Shops</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            highContrast ? 'text-green-400' : 'text-gray-500'
          }`}
        />
        <Input
          type="text"
          placeholder="Search shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => speak('Search shops')}
          className={`pl-10 h-12 ${
            highContrast ? 'bg-gray-900 border-green-400 text-white' : ''
          }`}
        />
      </div>

      {/* Info Card */}
      <Card className={`p-4 ${highContrast ? 'bg-gray-900 border-green-400' : 'bg-green-50'}`}>
        <div className="flex items-start gap-3">
          <ShoppingCart
            className={`h-6 w-6 ${highContrast ? 'text-green-400' : 'text-green-600'}`}
          />
          <div>
            <p className={highContrast ? 'text-white' : 'text-green-800'}>
              Order from nearby stores and get items delivered to your doorstep
            </p>
          </div>
        </div>
      </Card>

      {/* Shops List */}
      <div className="space-y-3">
        {filteredShops.map((shop) => (
          <Card
            key={shop.id}
            className={`p-4 cursor-pointer transition-all ${
              highContrast ? 'bg-gray-900 border-green-400 hover:bg-gray-800' : 'hover:bg-gray-50'
            }`}
            onClick={() => handleShopClick(shop)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleShopClick(shop);
              }
            }}
            aria-label={`${shop.name}, ${shop.category}, ${shop.distance} away, delivery fee ${shop.deliveryFee} rupees, ${shop.isOpen ? 'open' : 'closed'}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  highContrast ? 'bg-green-900' : 'bg-green-100'
                }`}
              >
                <div className={highContrast ? 'text-green-400' : 'text-green-600'}>
                  {getCategoryIcon(shop.category)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg">{shop.name}</h3>
                  {!shop.isOpen && (
                    <Badge variant="destructive">Closed</Badge>
                  )}
                </div>
                <p className="text-sm opacity-70 capitalize">{shop.category}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm opacity-70">⭐ {shop.rating}</p>
                  <p className="text-sm opacity-70">📍 {shop.distance}</p>
                  <p className="text-sm opacity-70">🚚 ₹{shop.deliveryFee}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={highContrast ? 'text-green-400' : 'text-green-600'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleShopClick(shop);
                }}
              >
                {shop.category === 'service' ? 'Book' : 'Browse'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Voice Hint */}
      {voiceEnabled && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            highContrast ? 'bg-green-900 text-white' : 'bg-green-50 text-green-800'
          }`}
        >
          <Volume2 className="h-5 w-5" />
          <p className="text-sm">Tap on a shop to hear details</p>
        </div>
      )}
    </div>
  );
}
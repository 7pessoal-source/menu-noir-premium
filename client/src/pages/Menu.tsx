import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, Send, Clock, MessageSquare } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  categoryId: number;
  image: string;
  active: number;
}

interface Category {
  id: number;
  name: string;
  active: number;
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [observations, setObservations] = useState("");

  useEffect(() => {
    const cats = storage.getCategories().filter((c: any) => c.active === 1);
    const prods = storage.getProducts().filter((p: any) => p.active === 1);
    const rest = storage.getRestaurant();
    
    setCategories(cats);
    setProducts(prods);
    setRestaurant(rest);
    
    if (cats.length > 0) {
      setSelectedCategory(null);
    }
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} adicionado!`);
  };

  const removeFromCart = (productId: number) => {
    const existing = cart.find((item) => item.id === productId);
    if (existing?.quantity === 1) {
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)));
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + parseFloat(item.basePrice) * item.quantity, 0);

  const sendWhatsAppOrder = () => {
    if (!restaurant?.whatsapp) return;

    let message = `*🍟 NOVO PEDIDO - ${restaurant.name}*\n\n`;
    message += "----------------------------\n";
    cart.forEach((item) => {
      message += `• *${item.quantity}x* ${item.name}\n`;
      message += `  R$ ${(parseFloat(item.basePrice) * item.quantity).toFixed(2)}\n\n`;
    });
    message += "----------------------------\n";
    
    if (observations.trim()) {
      message += `*📝 OBSERVAÇÕES:*\n${observations.trim()}\n\n`;
      message += "----------------------------\n";
    }
    
    message += `*💰 TOTAL: R$ ${cartTotal.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = restaurant.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  if (!restaurant) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32 selection:bg-yellow-400 selection:text-black">
      {/* Header */}
      <header className="bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {restaurant.logo && (
              <motion.img 
                whileHover={{ rotate: 5 }}
                src={restaurant.logo} 
                alt="Logo" 
                className="w-11 h-11 rounded-full object-cover border-2 border-zinc-700 shadow-lg shadow-white/5" 
              />
            )}
            <div>
              <h1 className="text-xl font-black leading-tight tracking-tighter uppercase">{restaurant.name}</h1>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${restaurant.status === 'open' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {restaurant.status === 'open' ? 'Aberto agora' : 'Fechado'}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            <ShoppingCart size={22} className="text-yellow-400" />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-black"
                >
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Categories Horizontal Scroll */}
      <div className="bg-black/80 backdrop-blur-md sticky top-[77px] z-30 py-4 border-b border-zinc-900/50">
        <div className="container mx-auto px-4 overflow-x-auto scrollbar-hide no-scrollbar">
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === null ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/10" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600"}`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat.id ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/10" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-3 py-6">
        <motion.div layout className="grid grid-cols-3 gap-3 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                className="flex flex-col"
              >
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
                  className="aspect-square relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer shadow-xl group"
                  onClick={() => addToCart(product)}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-800"><Plus size={32} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-yellow-400/20">
                      <p className="text-[10px] font-black text-yellow-400 tracking-tighter italic">R$ {parseFloat(product.basePrice).toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <motion.div whileHover={{ rotate: 90 }} className="bg-yellow-400 text-black p-2 rounded-2xl shadow-2xl">
                      <Plus size={16} strokeWidth={4} />
                    </motion.div>
                  </div>
                </motion.div>
                <div className="mt-3 px-1">
                  <h3 className="text-[11px] sm:text-sm font-black tracking-tight leading-tight truncate text-zinc-100 uppercase italic">{product.name}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 rounded-t-3xl z-50 max-h-[85vh] flex flex-col"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase tracking-widest italic">Carrinho</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-zinc-600">
                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="uppercase text-xs font-bold tracking-widest">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0">
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item.name}</p>
                          <p className="text-xs text-yellow-400 font-black mt-0.5">R$ {parseFloat(item.basePrice).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-zinc-800 rounded-2xl px-3 py-1.5 border border-zinc-700">
                          <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-white transition-colors"><Minus size={14} /></button>
                          <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="text-zinc-400 hover:text-white transition-colors"><Plus size={14} /></button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <MessageSquare size={14} /> Alguma observação?
                      </label>
                      <textarea
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Ex: sem cebola, bem passado..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 transition-colors resize-none h-24"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-black text-white">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <Button disabled={cart.length === 0} onClick={sendWhatsAppOrder} className="w-full h-16 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase italic tracking-tighter text-lg shadow-2xl shadow-yellow-400/10">
                  Enviar Pedido
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Bar */}
      {cart.length > 0 && !isCartOpen && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-8 left-6 right-6 z-40">
          <motion.button
            onClick={() => setIsCartOpen(true)}
            className="w-full h-16 bg-yellow-400 text-black rounded-[2.5rem] flex justify-between px-8 items-center border border-yellow-300/50 relative overflow-hidden"
            animate={{ boxShadow: ["0 0 0px rgba(250,204,21,0)", "0 0 30px rgba(250,204,21,0.5)", "0 0 0px rgba(250,204,21,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            <div className="flex items-center gap-3 relative z-10">
              <ShoppingCart size={22} />
              <span className="text-xs font-black uppercase tracking-widest">{cart.reduce((a, b) => a + b.quantity, 0)} Itens</span>
            </div>
            <span className="text-lg font-black italic uppercase tracking-tighter relative z-10">R$ {cartTotal.toFixed(2)}</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

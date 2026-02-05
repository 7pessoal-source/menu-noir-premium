import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Utensils, Settings, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { storage } from "@/lib/storage";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
  });

  useEffect(() => {
    setStats({
      categories: storage.getCategories().length,
      products: storage.getProducts().length,
    });
  }, []);

  const cards = [
    {
      title: "Categorias",
      value: stats.categories,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/categories",
    },
    {
      title: "Produtos",
      value: stats.products,
      icon: Utensils,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/admin/products",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600 mt-1">Visão geral do seu cardápio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setLocation(card.href)}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </CardTitle>
                  <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                    <Icon size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <div className="flex items-center text-xs text-slate-500 mt-2 hover:text-black transition-colors">
                    Gerenciar {card.title.toLowerCase()} <ArrowRight size={12} className="ml-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
          <CardContent className="p-8 relative z-10">
            <h2 className="text-2xl font-bold mb-2">Configurações Rápidas</h2>
            <p className="text-slate-400 mb-6 max-w-md">
              Ajuste as informações básicas do seu restaurante, como nome, WhatsApp e logo.
            </p>
            <button 
              onClick={() => setLocation("/admin/settings")}
              className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              Acessar Configurações <Settings size={16} />
            </button>
          </CardContent>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Settings size={120} />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Menu, Zap, Users, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation() as [string, (path: string) => void];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const handleViewMenu = () => {
    navigate("/menu");
  };

  const handleNavigateAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Menu size={24} />
            </div>
            <span className="text-xl font-bold">Menu Noir</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleViewMenu}
              className="text-slate-300 hover:text-white"
            >
              Ver Cardápio
            </Button>
            {isAuthenticated ? (
              <Button onClick={handleNavigateAdmin} className="bg-blue-600 hover:bg-blue-700">
                Painel Admin
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Entrar
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Cardápio Digital Profissional
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                Gerencie seu cardápio com facilidade e receba pedidos direto no WhatsApp
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 gap-2 text-lg px-8"
              >
                Começar Agora <ArrowRight size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleViewMenu}
                className="border-slate-600 text-white hover:bg-slate-800 text-lg px-8"
              >
                Ver Demo do Cardápio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-slate-800/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16">Funcionalidades Principais</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Menu className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Gerenciamento Completo</h3>
              <p className="text-slate-400">
                Crie categorias, produtos e extras com facilidade. Ative ou desative itens sem perder dados.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cardápio Público</h3>
              <p className="text-slate-400">
                Cardápio responsivo e moderno que funciona perfeitamente em desktop, tablet e mobile.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">WhatsApp Integrado</h3>
              <p className="text-slate-400">
                Clientes fazem pedidos direto pelo WhatsApp com mensagem automática formatada.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Dashboard em Tempo Real</h3>
              <p className="text-slate-400">
                Visualize estatísticas, total de produtos, categorias e últimas alterações.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Fácil de Usar</h3>
              <p className="text-slate-400">
                Interface intuitiva que não requer conhecimento técnico. Comece em minutos.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Menu className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Configurações Flexíveis</h3>
              <p className="text-slate-400">
                Customize nome, logo, WhatsApp, horário de funcionamento e status do restaurante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16">Como Funciona</h2>

          <div className="space-y-8">
            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Configure seu Restaurante</h3>
                <p className="text-slate-400">
                  Acesse o painel admin e configure o nome, logo, WhatsApp e horário de funcionamento.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Crie Categorias e Produtos</h3>
                <p className="text-slate-400">
                  Organize seu cardápio em categorias e adicione produtos com descrição, preço e imagem.
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Adicione Extras e Adicionais</h3>
                <p className="text-slate-400">
                  Configure extras como bacon, queijo, etc. com opções de múltiplos (checkbox) ou único (radio).
                </p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Compartilhe o Cardápio</h3>
                <p className="text-slate-400">
                  Seus clientes acessam o cardápio público, selecionam produtos e extras, e fazem pedidos via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-t border-b border-slate-700">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold">Pronto para Começar?</h2>
          <p className="text-xl text-slate-300">
            Crie seu cardápio digital profissional em minutos e comece a receber pedidos via WhatsApp.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 gap-2 text-lg px-8"
          >
            Começar Agora <ArrowRight size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-700">
        <div className="container mx-auto max-w-5xl text-center text-slate-400">
          <p>
            Menu Noir © 2026. Todos os direitos reservados. | Cardápio Digital Profissional
          </p>
        </div>
      </footer>
    </div>
  );
}

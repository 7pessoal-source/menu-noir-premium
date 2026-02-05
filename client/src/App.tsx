import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import Menu from "@/pages/Menu";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminCategories from "@/pages/AdminCategories";
import AdminProducts from "@/pages/AdminProducts";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Menu} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;

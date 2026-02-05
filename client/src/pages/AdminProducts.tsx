import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Power, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import { storage } from "@/lib/storage";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: string;
  categoryId: number;
  image: string;
  active: number;
}

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    categoryId: 0,
    image: "",
  });

  useEffect(() => {
    setProducts(storage.getProducts());
    setCategories(storage.getCategories());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categoryId === 0) {
      toast.error("Por favor, selecione uma categoria para o produto.");
      return;
    }

    let updatedProducts;
    if (editingId) {
      updatedProducts = products.map(p => 
        p.id === editingId ? { ...p, ...formData, categoryId: Number(formData.categoryId) } : p
      );
      toast.success("Produto atualizado com sucesso");
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        categoryId: Number(formData.categoryId),
        active: 1
      };
      updatedProducts = [...products, newProduct];
      toast.success("Produto criado com sucesso");
    }

    setProducts(updatedProducts);
    storage.setProducts(updatedProducts);
    setOpen(false);
    setEditingId(null);
    setFormData({ name: "", description: "", basePrice: "", categoryId: 0, image: "" });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      basePrice: product.basePrice.toString(),
      categoryId: product.categoryId,
      image: product.image || "",
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      storage.setProducts(updated);
      toast.success("Produto deletado com sucesso");
    }
  };

  const handleToggle = (id: number) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, active: p.active === 1 ? 0 : 1 } : p
    );
    setProducts(updated);
    storage.setProducts(updated);
    toast.success("Status atualizado");
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "—";
  };

  const noCategories = categories.length === 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-slate-600 mt-1">Gerencie os produtos do cardápio</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={noCategories}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", description: "", basePrice: "", categoryId: 0, image: "" });
                }}
                className="gap-2"
              >
                <Plus size={20} />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: X-Burger"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria *</label>
                  <Select
                    value={formData.categoryId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Preço *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <ImageUpload
                  label="Imagem do Produto"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
                <Button type="submit" className="w-full">
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {noCategories && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>Você precisa criar pelo menos uma categoria antes de cadastrar produtos.</span>
              <Button variant="link" onClick={() => setLocation("/admin/categories")} className="text-white p-0 h-auto font-bold underline">
                Ir para Categorias
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        Nenhum produto cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">Sem foto</div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                        <TableCell>R$ {parseFloat(product.basePrice).toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              product.active === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.active === 1 ? "Ativo" : "Inativo"}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                            <Edit2 size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggle(product.id)}>
                            <Power size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                            <Trash2 size={16} className="text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

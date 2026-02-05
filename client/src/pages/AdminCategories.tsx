import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import { storage } from "@/lib/storage";

interface Category {
  id: number;
  name: string;
  displayOrder: number;
  active: number;
}

export default function AdminCategories() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    displayOrder: 0,
  });

  useEffect(() => {
    setCategories(storage.getCategories());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedCategories;
    if (editingId) {
      updatedCategories = categories.map(c => 
        c.id === editingId ? { ...c, ...formData } : c
      );
      toast.success("Categoria atualizada");
    } else {
      const newCategory = {
        ...formData,
        id: Date.now(),
        active: 1
      };
      updatedCategories = [...categories, newCategory];
      toast.success("Categoria criada");
    }

    setCategories(updatedCategories);
    storage.setCategories(updatedCategories);
    setOpen(false);
    setEditingId(null);
    setFormData({ name: "", displayOrder: 0 });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      displayOrder: category.displayOrder,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza? Isso pode afetar produtos vinculados.")) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      storage.setCategories(updated);
      toast.success("Categoria deletada");
    }
  };

  const handleToggle = (id: number) => {
    const updated = categories.map(c => 
      c.id === id ? { ...c, active: c.active === 1 ? 0 : 1 } : c
    );
    setCategories(updated);
    storage.setCategories(updated);
    toast.success("Status atualizado");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categorias</h1>
            <p className="text-slate-600 mt-1">Gerencie as categorias do cardápio</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({ name: "", displayOrder: 0 });
              }}>
                <Plus size={20} className="mr-2" /> Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Hambúrgueres"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ordem de Exibição</label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      Nenhuma categoria cadastrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.displayOrder}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          category.active === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {category.active === 1 ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleToggle(category.id)}>
                          <Power size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(category.id)}>
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

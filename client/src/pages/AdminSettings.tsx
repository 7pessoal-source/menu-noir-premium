import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { storage } from "@/lib/storage";

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    whatsapp: "",
    hoursOfOperation: "",
    status: "open" as "open" | "closed",
  });

  useEffect(() => {
    const restaurant = storage.getRestaurant();
    if (restaurant) {
      setFormData(restaurant);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      storage.setRestaurant(formData);
      toast.success("Configurações atualizadas com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar configurações");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-slate-600 mt-1">Gerencie as informações do seu restaurante</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Nome do Restaurante</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Menu Noir"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">WhatsApp</label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="Ex: 5511999999999"
                  />
                </div>
              </div>

              <ImageUpload
                label="Logo do Restaurante"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
              />

              <div>
                <label className="text-sm font-medium">Horário de Funcionamento</label>
                <Textarea
                  value={formData.hoursOfOperation}
                  onChange={(e) => setFormData({ ...formData, hoursOfOperation: e.target.value })}
                  placeholder="Ex: Ter-Dom: 18h às 23h"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "open" | "closed" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
                {formData.status === "closed" && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Quando fechado, um aviso será exibido no cardápio público
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Salvar Configurações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { products as localProducts, Product, categories } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Package, ChevronDown, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AdminProduct = Omit<Product, "image"> & {
  id: string;
  image: string;
};

const emptyProduct = (): Partial<AdminProduct> => ({
  name: "",
  tagline: "",
  category: "Nervous-System Support",
  description: "",
  price: 0,
  image: "",
  badge: "",
  ingredients: [],
  rating: 5.0,
  reviews: 0,
  in_stock: true,
});

export function AdminProductEditor() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AdminProduct> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ingredientsText, setIngredientsText] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error || !data || data.length === 0) {
        // Seed local products into Supabase on first load if table is empty
        setProducts(localProducts as AdminProduct[]);
      } else {
        setProducts(data as AdminProduct[]);
      }
    } catch {
      setProducts(localProducts as AdminProduct[]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product: AdminProduct) => {
    setEditing({ ...product });
    setIngredientsText((product.ingredients || []).join(", "));
    setIsNew(false);
  };

  const startNew = () => {
    setEditing(emptyProduct());
    setIngredientsText("");
    setIsNew(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name || !editing.price) {
      toast.error("Name and price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      ...editing,
      price: Number(editing.price),
      rating: Number(editing.rating) || 5.0,
      reviews: Number(editing.reviews) || 0,
      ingredients: ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from("products")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        setProducts((prev) => [...prev, data as AdminProduct]);
        toast.success("Product created!");
      } else {
        const { id, ...rest } = payload as AdminProduct;
        const { error } = await supabase
          .from("products")
          .update(rest)
          .eq("id", id);
        if (error) throw error;
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? ({ ...p, ...rest } as AdminProduct) : p))
        );
        toast.success("Product updated!");
      }
      setEditing(null);
      setIsNew(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-olive-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit / New Panel */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-olive-200 shadow-lg p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-serif font-bold text-olive-800 flex items-center gap-2">
                <Package className="h-5 w-5" />
                {isNew ? "Add New Product" : `Edit: ${editing.name}`}
              </h3>
              <button onClick={cancelEdit} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Product Name *</Label>
                <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1" placeholder="e.g. Calm & Relaxation Tincture" />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input value={editing.tagline || ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} className="mt-1" placeholder="e.g. Find your center, naturally." />
              </div>
              <div>
                <Label>Price ($) *</Label>
                <Input type="number" min="0" step="0.01" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={editing.category || ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {categories.filter(c => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Badge (optional)</Label>
                <Input value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} className="mt-1" placeholder="e.g. Best Seller, New" />
              </div>
              <div>
                <Label>Rating (0–5)</Label>
                <Input type="number" min="0" max="5" step="0.1" value={editing.rating || ""} onChange={(e) => setEditing({ ...editing, rating: parseFloat(e.target.value) })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Image URL</Label>
                <Input value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="mt-1" placeholder="/product-image.png or full URL" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="mt-1" placeholder="Describe the product..." />
              </div>
              <div className="md:col-span-2">
                <Label>Ingredients (comma-separated)</Label>
                <Input value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} className="mt-1" placeholder="Lavender, Chamomile, Lemon Balm" />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={editing.in_stock !== false}
                  onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })}
                  className="h-4 w-4 accent-olive-600"
                />
                <Label htmlFor="in_stock" className="cursor-pointer">In Stock</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full gap-2 px-6">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isNew ? "Create Product" : "Save Changes"}
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="rounded-full px-6">Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product List */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-olive-700 flex items-center gap-2">
          <Package className="h-4 w-4" /> Products ({products.length})
        </h3>
        <Button onClick={startNew} className="bg-olive-600 hover:bg-olive-700 text-white rounded-full text-xs gap-1.5 px-4">
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-secondary text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover bg-stone-100"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/herbal.png"; }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      {p.badge && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground text-xs">{p.category}</td>
                <td className="px-5 py-4 font-semibold">${Number(p.price).toFixed(2)}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.in_stock !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {p.in_stock !== false ? "In Stock" : "Out"}
                  </span>
                </td>
                <td className="px-5 py-4">★ {p.rating}</td>
                <td className="px-5 py-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs gap-1 border-olive-200 text-olive-700 hover:bg-olive-50"
                    onClick={() => startEdit(p)}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
                    onClick={() => handleDelete(p.id)}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

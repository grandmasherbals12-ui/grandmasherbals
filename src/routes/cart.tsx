import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Grandma's Herbals" },
      {
        name: "description",
        content: "Your selected botanical wellness companions.",
      },
      { property: "og:url", content: "/cart" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 60 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <SiteLayout>
      <div className="bg-olive-50">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl font-cormorant font-bold text-olive-700">
            Your Ritual Basket
          </h1>
          <p className="mt-2 text-lg text-olive-600 max-w-2xl mx-auto">
            Review your items before proceeding to a mindful checkout.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link to="/shop" search={{}}>Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-6 py-6">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-28 w-28 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-cormorant font-bold text-olive-800">
                      {item.product.name}
                    </h2>
                    <p className="text-gray-500">${item.product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-semibold text-olive-700 w-24 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="bg-white p-8 rounded-lg shadow-md lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-2xl font-cormorant font-bold text-olive-800 border-b pb-4">
                Order Summary
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
                </div>
                <div className="flex justify-between text-gray-500">
                  <dt>Tax</dt>
                  <dd>Calculated at checkout</dd>
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                  <dt>Total</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>
              </dl>
              <Button
                asChild
                size="lg"
                className="w-full mt-6 bg-olive-500 hover:bg-olive-600"
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Free shipping on orders over $60
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
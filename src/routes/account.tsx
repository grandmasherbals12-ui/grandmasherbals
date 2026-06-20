
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { LogOut, User, ShoppingBag, Heart, Leaf } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AuthModal } from "@/components/site/AuthModal";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

function AccountPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // No redirect — show inline login prompt instead

  // Load user profile and orders
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          email: profileData.email || user.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          zip_code: profileData.zip_code || "",
          country: profileData.country || "",
        });
      } else {
        setProfile((prev) => ({
          ...prev,
          email: user.email || "",
        }));
      }

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error: any) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load your account information.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate({ to: "/" });
      toast.success("Logged out successfully.");
    } catch (error: any) {
      toast.error("Failed to log out.");
    }
  };

  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-stone-50 to-olive-50/40">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-olive-100 mb-6">
              <Leaf className="w-10 h-10 text-olive-600" />
            </div>
            <h1 className="text-3xl font-cormorant font-bold text-olive-900 mb-3">Welcome to Your Wellness Hub</h1>
            <p className="text-stone-600 mb-8">
              Sign in to manage your profile, track orders, and access your personalized wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="rounded-full bg-olive-600 hover:bg-olive-700 px-8"
              >
                <User className="w-4 h-4 mr-2" /> Sign In
              </Button>
              <Button
                onClick={() => setAuthModalOpen(true)}
                variant="outline"
                className="rounded-full border-olive-300 text-olive-700 px-8"
              >
                Create Account
              </Button>
            </div>
          </div>
        </section>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </SiteLayout>
    );
  }

  if (isLoading) {
    return (
      <SiteLayout>
        <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-stone-50 to-olive-50/40">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-600"></div>
            <p className="mt-4 text-stone-600">Loading your account...</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="min-h-[80vh] bg-gradient-to-b from-stone-50 to-olive-50/40 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-cormorant font-bold text-olive-900">My Account</h1>
                <p className="text-stone-600 mt-2">Manage your profile and view your orders</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full border-olive-200 text-olive-700 hover:bg-olive-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>

            {/* Main Content */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Profile Section */}
              <div className="md:col-span-2">
                <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_70px_rgba(73,88,52,0.10)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-cormorant font-bold text-olive-900 flex items-center gap-2">
                      <User className="w-6 h-6" />
                      Personal Information
                    </h2>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="rounded-full bg-olive-600 hover:bg-olive-700"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            value={profile.full_name}
                            onChange={(e) =>
                              setProfile({ ...profile, full_name: e.target.value })
                            }
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            placeholder="your@email.com"
                            className="bg-stone-100"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={profile.country}
                            onChange={(e) =>
                              setProfile({ ...profile, country: e.target.value })
                            }
                            placeholder="United States"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) =>
                            setProfile({ ...profile, address: e.target.value })
                          }
                          placeholder="123 Main St"
                        />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) =>
                              setProfile({ ...profile, city: e.target.value })
                            }
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={profile.state}
                            onChange={(e) =>
                              setProfile({ ...profile, state: e.target.value })
                            }
                            placeholder="State"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip_code">ZIP/Postal Code</Label>
                          <Input
                            id="zip_code"
                            value={profile.zip_code}
                            onChange={(e) =>
                              setProfile({ ...profile, zip_code: e.target.value })
                            }
                            placeholder="12345"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex-1 bg-olive-600 hover:bg-olive-700"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="flex-1 border-stone-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-stone-600">Full Name</p>
                          <p className="text-lg text-olive-900">
                            {profile.full_name || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-600">Email</p>
                          <p className="text-lg text-olive-900">{profile.email}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-stone-600">Phone</p>
                          <p className="text-lg text-olive-900">
                            {profile.phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-600">Country</p>
                          <p className="text-lg text-olive-900">
                            {profile.country || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-stone-600">Address</p>
                        <p className="text-lg text-olive-900">
                          {profile.address || "Not provided"}
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-stone-600">City</p>
                          <p className="text-lg text-olive-900">
                            {profile.city || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-600">State</p>
                          <p className="text-lg text-olive-900">
                            {profile.state || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-600">ZIP Code</p>
                          <p className="text-lg text-olive-900">
                            {profile.zip_code || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-olive-200 bg-gradient-to-br from-olive-50 to-white p-6 shadow-[0_10px_40px_rgba(73,88,52,0.08)]">
                  <div className="flex items-center gap-3 mb-4">
                    <ShoppingBag className="w-6 h-6 text-olive-600" />
                    <h3 className="text-lg font-cormorant font-bold text-olive-900">
                      Total Orders
                    </h3>
                  </div>
                  <p className="text-4xl font-bold text-olive-600">{orders.length}</p>
                </div>

                <div className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[0_10px_40px_rgba(217,119,6,0.08)]">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-amber-600" />
                    <h3 className="text-lg font-cormorant font-bold text-amber-900">
                      Member Since
                    </h3>
                  </div>
                  <p className="text-sm text-amber-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="mt-12 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_70px_rgba(73,88,52,0.10)]">
              <h2 className="text-2xl font-cormorant font-bold text-olive-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Recent Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-600 mb-4">No orders yet</p>
                  <Button asChild className="rounded-full bg-olive-600 hover:bg-olive-700">
                    <a href="/shop">Start Shopping</a>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">
                          Order ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-stone-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-stone-100 hover:bg-stone-50/50"
                        >
                          <td className="py-3 px-4 text-olive-600 font-mono">
                            {order.id.slice(0, 8)}...
                          </td>
                          <td className="py-3 px-4">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            ${order.total_amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-stone-100 text-stone-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );

}

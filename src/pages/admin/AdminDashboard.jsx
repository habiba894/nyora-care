import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrdersPage from "./OrdersPage";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ArrowUpRight,
  Plus,
  ChevronRight,
  CircleAlert,
  RefreshCw,
  Flower2,
  ShieldCheck,
} from "lucide-react";

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api`;
const REFRESH_INTERVAL = 15000;

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingBag },
  { label: "Products", icon: Package },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "Settings", icon: Settings },
];

function NyoraMark({ className = "h-10 w-9" }) {
  return (
    <svg
      viewBox="0 0 50 56"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-label="Nyora botanical logo"
    >
      <text
        x="1"
        y="42"
        fill="#493438"
        fontFamily="Georgia, serif"
        fontSize="40"
      >
        N
      </text>
      <g
        stroke="#A66D78"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 51C24 40 29 28 36 17C39 12 42 7 44 3" />
        <path d="M25 43C17 44 13 39 15 34C22 34 26 38 25 43Z" />
        <path d="M29 35C36 36 40 32 39 26C33 27 29 30 29 35Z" />
        <path d="M33 27C26 27 22 23 24 18C30 19 34 22 33 27Z" />
        <path d="M37 19C43 19 47 15 46 10C41 11 37 14 37 19Z" />
        <path d="M41 11C36 10 34 7 36 4C40 5 42 8 41 11Z" />
      </g>
    </svg>
  );
}

function NyoraLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#A66D78]">
        <NyoraMark className="h-[38px] w-[34px] [&_text]:!fill-white [&_g]:!stroke-white" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-[30px] font-semibold tracking-[-0.025em] text-[#493438]">
          Nyora
        </span>
        <span className="mt-1 text-[7px] font-bold uppercase tracking-[0.38em] text-[#A66D78]">
          BEAUTY
        </span>
      </div>
    </div>
  );
}

function money(value) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getAvailability(product) {
  if (product.stockQuantity === null || product.stockQuantity === undefined) return null;
  if (typeof product.stockQuantity === "number") return product.stockQuantity > 0;
  if (typeof product.inStock === "boolean") return product.inStock;
  if (typeof product.stock === "number") return product.stock > 0;
  if (typeof product.quantity === "number") return product.quantity > 0;
  return null;
}

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="group rounded-2xl border border-[#E3D7D1] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(73,52,56,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#806C70]">{title}</p>
          <p className="mt-4 text-2xl font-medium text-[#493438]">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-[#A66D78] group-hover:text-white ${
            accent
              ? "bg-[#542D3A] text-white"
              : "bg-[#F3E8E4] text-[#A66D78]"
          }`}
        >
          <Icon size={21} strokeWidth={1.7} className="transition-colors duration-500" />
        </div>
      </div>
      <p className="mt-4 border-t border-[#F1EAE5] pt-3 text-xs text-[#998583]">
        {subtitle}
      </p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-5 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3E8E4] text-[#A66D78]">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-sm font-medium text-[#493438]">{title}</h3>
      <p className="mt-2 max-w-sm text-xs leading-6 text-[#806C70]">
        {description}
      </p>
    </div>
  );
}

function ProductTable({ products, loading, error, onEditStock }) {
  if (loading) {
    return (
      <p className="p-10 text-center text-sm text-[#806C70]">
        Loading products from your database...
      </p>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={CircleAlert}
        title="Products unavailable"
        description={error}
      />
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        icon={Package}
        title="No products found"
        description="No products were returned by the backend."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead>
          <tr className="bg-[#FCFAF8] text-[11px] uppercase tracking-wider text-[#A18C8B]">
            <th className="px-6 py-4 font-medium">Product</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Price</th>
            <th className="px-6 py-4 font-medium">Stock quantity</th>
            <th className="px-6 py-4 font-medium">Availability</th>
            <th className="px-6 py-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const availability = getAvailability(product);

            return (
              <tr
                key={product._id || product.id || `${product.name}-${index}`}
                className="border-t border-[#F1EAE5] transition hover:bg-[#FCFAF8]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F4EF]">
                      {product.image ? (
                        <img
                          src={
                            product.image
                              ? /^(https?:\/\/|data:|blob:)/i.test(String(product.image).trim())
                                ? String(product.image).trim()
                                : `/${encodeURI(
                                    String(product.image)
                                      .trim()
                                      .replace(/^public[\\/]/i, "")
                                      .replace(/\\/g, "/")
                                      .replace(/^\.\//, "")
                                      .replace(/^\/+/, "")
                                      .replace(/%20/gi, " ")
                                  )}`
                              : undefined
                          }
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Flower2 size={20} className="text-[#A66D78]" />
                      )}
                    </div>
                    <span className="max-w-48 truncate text-sm font-medium">
                      {product.name || "Unnamed product"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#806C70]">
                  {product.category || "—"}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {money(product.price)}
                </td>
                <td className="px-6 py-4 text-sm text-[#806C70]">
                  {product.stockQuantity === null || product.stockQuantity === undefined
                    ? "Not set"
                    : product.stockQuantity}
                </td>
                <td className="px-6 py-4">
                  {availability === null ? (
                    <span className="inline-flex rounded-full bg-[#F3E8E4] px-3 py-1.5 text-[11px] text-[#806C70]">
                      Unknown
                    </span>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] ${
                        availability
                          ? "bg-[#E8F3E9] text-[#487653]"
                          : "bg-[#F8E9E6] text-[#A35454]"
                      }`}
                    >
                      {availability ? "In stock" : "Out of stock"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onEditStock?.(product)}
                    className="rounded-full border border-[#E3D7D1] bg-white px-3 py-2 text-xs text-[#542D3A] transition hover:bg-[#F3E8E4]"
                  >
                    {product.stockQuantity === null || product.stockQuantity === undefined
                      ? "Set stock"
                      : "Edit stock"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CustomersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  async function loadCustomers() {
    setLoading(true);
    setError("");
    try {
      const token = sessionStorage.getItem("nyoraAdminToken");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("nyoraAdminToken");
        sessionStorage.removeItem("nyoraAdmin");
        navigate("/admin/login", { replace: true });
        return;
      }
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load customers.");
      }
      setOrders(Array.isArray(result.data) ? result.data : []);
      setLastUpdated(new Date());
    } catch (loadError) {
      setError(loadError.message === "Failed to fetch"
        ? "Cannot connect to the backend. Check that your server is running."
        : loadError.message || "Could not load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const customers = useMemo(() => {
    const grouped = new Map();
    for (const order of orders) {
      const customer = order?.customer || {};
      const email = String(customer.email || "").trim().toLowerCase();
      const phone = String(customer.phone || "").replace(/\s+/g, "");
      const name = String(customer.fullName || customer.name || "Guest customer").trim();
      const address = [customer.governorate, customer.city, customer.address]
        .filter(Boolean).join(" ").trim().toLowerCase();
      // Prefer stable identifiers. Fall back to name + address if contact details are absent.
      const key = email ? `email:${email}` : phone ? `phone:${phone}` : `fallback:${name.toLowerCase()}|${address}`;
      const current = grouped.get(key) || {
        key,
        name,
        email: customer.email || "",
        phone: customer.phone || "",
        governorate: customer.governorate || "",
        city: customer.city || "",
        address: customer.address || "",
        orderCount: 0,
        orderValue: 0,
        lastOrder: null,
      };
      current.orderCount += 1;
      current.orderValue += Number(order.total) || 0;
      const orderDate = order.createdAt ? new Date(order.createdAt) : null;
      if (orderDate && !Number.isNaN(orderDate.getTime()) && (!current.lastOrder || orderDate > current.lastOrder)) {
        current.lastOrder = orderDate;
      }
      // Fill missing details from a later order for the same customer.
      current.name = current.name || name;
      current.email = current.email || customer.email || "";
      current.phone = current.phone || customer.phone || "";
      current.governorate = current.governorate || customer.governorate || "";
      current.city = current.city || customer.city || "";
      current.address = current.address || customer.address || "";
      grouped.set(key, current);
    }
    return Array.from(grouped.values()).sort((a, b) => {
      if (a.lastOrder && b.lastOrder) return b.lastOrder - a.lastOrder;
      if (a.lastOrder) return -1;
      if (b.lastOrder) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((customer) => [
      customer.name, customer.email, customer.phone, customer.governorate,
      customer.city, customer.address,
    ].some((value) => String(value || "").toLowerCase().includes(query)));
  }, [customers, search]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#A66D78]">YOUR COMMUNITY</p>
          <h1 className="mt-2 font-display text-4xl font-normal">Customers</h1>
          <p className="mt-3 text-sm text-[#806C70]">Unique customers gathered from saved orders.</p>
          {lastUpdated && <p className="mt-2 text-xs text-[#A18C8B]">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
        </div>
        <button onClick={loadCustomers} disabled={loading} className="flex items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-3 text-sm transition hover:bg-[#EDE3DD] disabled:opacity-60">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh customers
        </button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <StatCard title="Unique customers" value={loading ? "..." : customers.length} subtitle="Deduplicated from order contact details" icon={Users} accent />
        <StatCard title="Orders in records" value={loading ? "..." : orders.length} subtitle="All orders returned by the protected API" icon={ShoppingBag} />
      </div>

      <div className="mt-7 flex items-center gap-3 rounded-full border border-[#E3D7D1] bg-white px-4 py-3">
        <Search size={17} className="shrink-0 text-[#A18C8B]" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, phone, or location" className="w-full bg-transparent text-sm outline-none placeholder:text-[#B5A4A0]" />
        {search && <button onClick={() => setSearch("")} className="text-xs text-[#A66D78] hover:text-[#542D3A]">Clear</button>}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#E3D7D1] bg-white">
        {error ? (
          <div className="flex items-start gap-3 p-6 text-sm text-red-700">
            <CircleAlert size={19} className="mt-0.5 shrink-0" />
            <div><p className="font-medium">Customers unavailable</p><p className="mt-1">{error}</p><button onClick={loadCustomers} className="mt-3 underline">Try again</button></div>
          </div>
        ) : loading ? (
          <p className="p-10 text-center text-sm text-[#806C70]">Loading customer records...</p>
        ) : customers.length === 0 ? (
          <EmptyState icon={Users} title="No customers yet" description="Customers will appear here after an order containing customer details is saved." />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState icon={Search} title="No matching customers" description="Try another name, email, phone number, or location." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr className="bg-[#FCFAF8] text-[11px] uppercase tracking-wider text-[#A18C8B]">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Contact</th>
                <th className="px-5 py-4 font-medium">Location</th>
                <th className="px-5 py-4 font-medium">Orders</th>
                <th className="px-5 py-4 font-medium">Order value</th>
                <th className="px-5 py-4 font-medium">Last order</th>
              </tr></thead>
              <tbody>{filteredCustomers.map((customer) => (
                <tr key={customer.key} className="border-t border-[#F1EAE5] align-top hover:bg-[#FCFAF8]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3E8E4] text-sm font-medium text-[#542D3A]">{(customer.name || "C").charAt(0).toUpperCase()}</div><span className="max-w-48 break-words text-sm font-medium text-[#493438]">{customer.name || "Guest customer"}</span></div></td>
                  <td className="px-5 py-4 text-sm text-[#806C70]"><div>{customer.email || "—"}</div><div className="mt-1">{customer.phone || "—"}</div></td>
                  <td className="px-5 py-4 text-sm text-[#806C70]"><div>{[customer.city, customer.governorate].filter(Boolean).join(", ") || "—"}</div>{customer.address && <div className="mt-1 max-w-48 truncate text-xs" title={customer.address}>{customer.address}</div>}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#493438]">{customer.orderCount}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#493438]">{money(customer.orderValue)}</td>
                  <td className="px-5 py-4 text-sm text-[#806C70]">{customer.lastOrder ? customer.lastOrder.toLocaleDateString("en-GB") : "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {!loading && !error && customers.length > 0 && <div className="border-t border-[#F1EAE5] px-5 py-3 text-xs text-[#A18C8B]">Showing {filteredCustomers.length} of {customers.length} unique customers</div>}
      </div>
    </section>
  );
}

function PlaceholderPage({ eyebrow, title, icon: Icon, description }) {
  return (
    <section>
      <p className="text-xs tracking-[0.18em] text-[#A66D78]">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl font-normal">{title}</h1>
      <div className="mt-7 rounded-2xl border border-[#E3D7D1] bg-white">
        <EmptyState
          icon={Icon}
          title={`${title} management`}
          description={description}
        />
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingStockProduct, setEditingStockProduct] = useState(null);
  const [stockQuantityInput, setStockQuantityInput] = useState("");
  const [savingStock, setSavingStock] = useState(false);
  const [stockFormError, setStockFormError] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stockQuantity: "0",
    featured: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const token = sessionStorage.getItem("nyoraAdminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const savedAdmin = sessionStorage.getItem("nyoraAdmin");

      if (!savedAdmin) {
        throw new Error("Admin session is missing.");
      }

      setAdmin(JSON.parse(savedAdmin));
    } catch {
      sessionStorage.removeItem("nyoraAdminToken");
      sessionStorage.removeItem("nyoraAdmin");
      navigate("/admin/login", { replace: true });
    }
  }, [token, navigate]);

  async function loadProducts({ silent = false } = {}) {
    if (!silent) {
      setLoading(true);
      setLoadError("");
    }

    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("nyoraAdminToken");
        sessionStorage.removeItem("nyoraAdmin");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load products.");
      }

      setProducts(Array.isArray(result.data) ? result.data : []);
      setLoadError("");
    } catch (error) {
      setLoadError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that your server is running."
          : error.message
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function loadAnalytics({ silent = false } = {}) {
    if (!silent) {
      setAnalyticsLoading(true);
      setAnalyticsError("");
    }

    try {
      const response = await fetch(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("nyoraAdminToken");
        sessionStorage.removeItem("nyoraAdmin");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load analytics.");
      }

      setAnalytics(result.data || null);
      setAnalyticsError("");
      setLastUpdated(new Date());
    } catch (error) {
      setAnalyticsError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that your server is running."
          : error.message
      );
    } finally {
      if (!silent) setAnalyticsLoading(false);
    }
  }

  async function refreshDashboard({ silent = false } = {}) {
    if (!token || !admin) return;

    await Promise.all([
      loadProducts({ silent }),
      loadAnalytics({ silent }),
    ]);
  }

  useEffect(() => {
    if (!token || !admin) return;

    refreshDashboard();

    // Refresh data periodically while the dashboard is open.
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshDashboard({ silent: true });
      }
    }, REFRESH_INTERVAL);

    // Refresh immediately when the user returns to this tab.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshDashboard({ silent: true });
      }
    };

    const handleFocus = () => {
      refreshDashboard({ silent: true });
    };

    // OrdersPage dispatches this event after a successful status update.
    const handleOrdersUpdated = () => {
      refreshDashboard({ silent: true });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("nyora:orders-updated", handleOrdersUpdated);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("nyora:orders-updated", handleOrdersUpdated);
    };
  }, [token, admin]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.category, product.slug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [products, search]);

  const availableCount = products.filter(
    (product) => getAvailability(product) === true
  ).length;

  const unavailableCount = products.filter(
    (product) => getAvailability(product) === false
  ).length;

  const unknownCount = products.filter(
    (product) => getAvailability(product) === null
  ).length;

  function logout() {
    sessionStorage.removeItem("nyoraAdminToken");
    sessionStorage.removeItem("nyoraAdmin");
    navigate("/admin/login", { replace: true });
  }

  function choosePage(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
  }

  function openStockEditor(product) {
    setEditingStockProduct(product);
    setStockQuantityInput(
      product.stockQuantity === null || product.stockQuantity === undefined
        ? ""
        : String(product.stockQuantity)
    );
    setStockFormError("");
  }

  async function handleSaveStock(event) {
    event.preventDefault();
    setStockFormError("");

    if (!editingStockProduct?._id && !editingStockProduct?.id) {
      setStockFormError("This product does not have a valid database ID.");
      return;
    }

    const quantity = Number(stockQuantityInput);
    if (
      stockQuantityInput.trim() === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setStockFormError("Enter a whole number of 0 or more.");
      return;
    }

    setSavingStock(true);
    try {
      const productId = editingStockProduct._id || editingStockProduct.id;
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockQuantity: quantity,
          inStock: quantity > 0,
        }),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("nyoraAdminToken");
        sessionStorage.removeItem("nyoraAdmin");
        navigate("/admin/login", { replace: true });
        return;
      }
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update stock quantity.");
      }

      setEditingStockProduct(null);
      await loadProducts();
      await loadAnalytics({ silent: true });
    } catch (error) {
      setStockFormError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the backend. Check that your server is running."
          : error.message
      );
    } finally {
      setSavingStock(false);
    }
  }

  async function handleAddProduct(event) {
    event.preventDefault();
    setProductFormError("");

    const name = productForm.name.trim();
    const price = Number(productForm.price);
    const stockQuantity = Number(productForm.stockQuantity);

    if (!name) {
      setProductFormError("Please enter the product name.");
      return;
    }
    if (productForm.price === "" || !Number.isFinite(price) || price < 0) {
      setProductFormError("Please enter a valid price.");
      return;
    }
    if (productForm.stockQuantity === "" || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setProductFormError("Stock quantity must be a whole number of 0 or more.");
      return;
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) {
      setProductFormError("Use a product name containing English letters or numbers so a URL slug can be created.");
      return;
    }

    setSavingProduct(true);
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...productForm,
          name,
          slug,
          price,
          stockQuantity,
          inStock: stockQuantity > 0,
          featured: Boolean(productForm.featured),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not create the product.");
      }

      setShowProductForm(false);
      setProductForm({
        name: "", description: "", price: "", image: "", category: "",
        stockQuantity: "0", featured: false,
      });
      await loadProducts();
      await loadAnalytics({ silent: true });
      setActivePage("Products");
    } catch (error) {
      setProductFormError(error.message === "Failed to fetch"
        ? "Cannot connect to the backend. Check that your server is running."
        : error.message);
    } finally {
      setSavingProduct(false);
    }
  }

  if (!token || !admin) return null;

  const monthly = analytics?.monthly || [];

  const maxOrders = Math.max(
    ...monthly.map((month) => Number(month.orders) || 0),
    1
  );

  return (
    <div dir="ltr" lang="en" className="min-h-screen bg-[#F8F4EF] text-[#493438] lg:flex">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#34232B]/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#E3D7D1] bg-[#F8F4EF] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[94px] items-center justify-between border-b border-[#E3D7D1] px-6">
          <button onClick={() => choosePage("Overview")} aria-label="Nyora Beauty home">
            <NyoraLogo />
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-2 hover:bg-[#EDE3DD] lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-3 px-3 text-[10px] font-medium tracking-[0.2em] text-[#A18C8B]">
            WORKSPACE
          </p>

          <nav className="space-y-1.5">
            {navigation.map(({ label, icon: Icon }) => {
              const selected = activePage === label;

              return (
                <button
                  key={label}
                  onClick={() => choosePage(label)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition ${
                    selected
                      ? "bg-[#542D3A] text-white shadow-[0_7px_18px_rgba(84,45,58,0.13)]"
                      : "text-[#806C70] hover:bg-[#EDE3DD] hover:text-[#493438]"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.7} />
                  <span>{label}</span>
                  {selected && <ChevronRight className="ml-auto" size={16} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          <div className="rounded-2xl border border-[#E3D7D1] bg-white/70 p-4">
            <div className="flex items-center gap-2">
              <NyoraMark className="h-7 w-6 shrink-0" />
              <span className="text-xs font-medium text-[#A66D78]">Nyora Beauty</span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#806C70]">
              A little space for everything beautiful.
            </p>

            <button
              onClick={logout}
              className="mt-4 flex w-full items-center gap-2 border-t border-[#EDE3DD] pt-4 text-sm text-[#806C70] transition hover:text-[#542D3A]"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>

          <p className="mt-5 text-center text-[10px] tracking-widest text-[#A18C8B]">
            NYORA · ADMINISTRATION
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-[#E3D7D1] bg-[#F8F4EF]/95 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#E3D7D1] bg-white p-2.5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-[10px] tracking-[0.22em] text-[#A66D78]">
                NYORA BEAUTY
              </p>
              <p className="mt-1 text-sm text-[#806C70]">Store administration</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden w-48 items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-2.5 md:flex xl:w-64">
              <Search size={17} className="shrink-0 text-[#A18C8B]" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActivePage("Products");
                }}
                placeholder="Search products..."
                className="w-full bg-transparent text-xs outline-none placeholder:text-[#B5A4A0]"
              />
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3D7D1] bg-white transition hover:bg-[#EDE3DD]"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={17} strokeWidth={1.6} />
            </button>

            <div className="flex items-center gap-3 border-l border-[#E3D7D1] pl-3 sm:pl-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE3DD] font-serif text-lg text-[#542D3A]">
                {(admin.name || "A").charAt(0).toUpperCase()}
              </div>

              <div className="hidden min-w-0 sm:block">
                <p className="max-w-36 truncate text-sm font-medium">
                  {admin.name || "Admin"}
                </p>
                <p className="mt-0.5 text-xs text-[#A18C8B]">Store administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-5 sm:p-8">
          {loadError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <CircleAlert size={19} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Could not load store data</p>
                <p className="mt-1">{loadError}</p>
                <button onClick={() => refreshDashboard()} className="mt-2 underline">
                  Try again
                </button>
              </div>
            </div>
          )}

          {activePage === "Overview" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.18em] text-[#A66D78]">
                    YOUR STORE AT A GLANCE
                  </p>
                  <h1 className="mt-2 font-display text-4xl font-normal tracking-tight sm:text-[42px]">
                    Overview
                  </h1>
                  <p className="mt-3 text-sm text-[#806C70]">
                    Welcome back, {admin.name || "Admin"}. Here is your store overview.
                  </p>
                  {lastUpdated && (
                    <p className="mt-2 text-xs text-[#A18C8B]">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => refreshDashboard()}
                  className="flex items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-3 text-sm transition hover:bg-[#EDE3DD]"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total products"
                  value={loading ? "..." : products.length}
                  subtitle="Products returned by the backend"
                  icon={Package}
                  accent
                />
                <StatCard
                  title="Available products"
                  value={loading ? "..." : availableCount}
                  subtitle="Availability confirmed by product data"
                  icon={ShoppingBag}
                />
                <StatCard
                  title="Out of stock"
                  value={loading ? "..." : unavailableCount}
                  subtitle="Products marked unavailable"
                  icon={CircleAlert}
                />
                <StatCard
                  title="Availability unknown"
                  value={loading ? "..." : unknownCount}
                  subtitle="Products missing stock information"
                  icon={Users}
                />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total orders"
                  value={analyticsLoading && !analytics ? "..." : (analytics?.totalOrders ?? 0)}
                  subtitle="Orders saved in MongoDB"
                  icon={ShoppingBag}
                />
                <StatCard
                  title="Pending orders"
                  value={analyticsLoading && !analytics ? "..." : (analytics?.pendingOrders ?? 0)}
                  subtitle="Orders waiting for processing"
                  icon={CircleAlert}
                />
                <StatCard
                  title="Delivered orders"
                  value={analyticsLoading && !analytics ? "..." : (analytics?.completedOrders ?? analytics?.deliveredOrders ?? 0)}
                  subtitle="Orders marked delivered"
                  icon={ShieldCheck}
                />
              </div>

              <div className="mt-7 grid gap-6 xl:grid-cols-2">
                <section className="rounded-2xl border border-[#E3D7D1] bg-white p-5 sm:p-7">
                  <h2 className="font-display text-2xl font-normal">Store performance</h2>
                  <p className="mt-1 text-xs text-[#A18C8B]">Sales analytics</p>

                  <div className="mt-8 rounded-xl bg-[#FCFAF8] p-4 sm:p-5">
                    {analyticsError ? (
                      <p className="py-10 text-center text-sm text-red-600">
                        {analyticsError}
                      </p>
                    ) : analyticsLoading && !analytics ? (
                      <p className="py-10 text-center text-sm text-[#806C70]">
                        Loading store analytics...
                      </p>
                    ) : (
                      <>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-[#806C70]">
                              Confirmed revenue
                            </p>
                            <p className="mt-1 text-2xl font-medium">
                              {money(analytics?.revenue ?? 0)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-[#806C70]">Orders this year</p>
                            <p className="mt-1 text-xl font-medium">
                              {monthly.reduce(
                                (sum, item) => sum + (Number(item.orders) || 0),
                                0
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex h-36 items-end gap-2 sm:gap-3">
                          {monthly.map((item) => {
                            const height = Math.max(
                              ((Number(item.orders) || 0) / maxOrders) * 100,
                              Number(item.orders) ? 8 : 3
                            );

                            return (
                              <div
                                key={item.month}
                                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                              >
                                <div
                                  title={`${item.orders || 0} orders · ${money(item.revenue || 0)} revenue`}
                                  className="w-full rounded-t-md bg-[#A66D78] transition-all"
                                  style={{ height: `${height}%` }}
                                />
                                <span className="text-[10px] text-[#806C70] sm:text-xs">
                                  {item.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <p className="mt-4 text-xs leading-5 text-[#806C70]">
                          Bars show order count, so pending orders are visible even when
                          recognized revenue is zero.
                        </p>
                      </>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-[#E3D7D1] bg-white p-5 sm:p-7">
                  <h2 className="font-display text-2xl font-normal">Inventory</h2>
                  <p className="mt-1 text-xs text-[#A18C8B]">
                    Current product availability
                  </p>

                  <div className="mt-8 flex items-center justify-between text-sm">
                    <span className="text-[#806C70]">Available</span>
                    <span className="font-medium">{loading ? "..." : availableCount}</span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1E8E3]">
                    <div
                      className="h-full rounded-full bg-[#A66D78]"
                      style={{
                        width: `${products.length ? (availableCount / products.length) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm">
                    <span className="text-[#806C70]">Out of stock</span>
                    <span className="font-medium">{loading ? "..." : unavailableCount}</span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1E8E3]">
                    <div
                      className="h-full rounded-full bg-[#542D3A]"
                      style={{
                        width: `${products.length ? (unavailableCount / products.length) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  <button
                    onClick={() => choosePage("Products")}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#542D3A] px-4 py-3 text-sm text-white transition hover:bg-[#6B3A49]"
                  >
                    View products <ArrowUpRight size={16} />
                  </button>
                </section>
              </div>

              <section className="mt-7 overflow-hidden rounded-2xl border border-[#E3D7D1] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0E8E3] p-5 sm:px-7 sm:py-6">
                  <div>
                    <h2 className="font-display text-2xl font-normal">Your products</h2>
                    <p className="mt-1 text-xs text-[#A18C8B]">
                      Live data from your products API
                    </p>
                  </div>

                  <button
                    onClick={() => choosePage("Products")}
                    className="flex items-center gap-1 text-sm text-[#A66D78] hover:text-[#542D3A]"
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>

                <ProductTable
                  products={products.slice(0, 5)}
                  loading={loading}
                  error={loadError}
                  onEditStock={openStockEditor}
                />
              </section>
            </>
          )}

          {activePage === "Products" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.18em] text-[#A66D78]">YOUR INVENTORY</p>
                  <h1 className="mt-2 font-display text-4xl font-normal">Products</h1>
                  <p className="mt-3 text-sm text-[#806C70]">
                    Manage inventory, pricing, and availability.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProductFormError("");
                    setShowProductForm(true);
                  }}
                  className="flex items-center gap-2 rounded-full bg-[#542D3A] px-4 py-3 text-sm text-white transition hover:bg-[#6B3A49]"
                >
                  <Plus size={17} />
                  Add product
                </button>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-3">
                  <Search size={17} className="shrink-0 text-[#A18C8B]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by product name or category"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#B5A4A0]"
                  />
                </div>

                <button
                  onClick={() => loadProducts()}
                  className="rounded-full border border-[#E3D7D1] bg-white p-3 text-[#806C70] hover:bg-[#EDE3DD]"
                  aria-label="Refresh products"
                >
                  <RefreshCw size={18} />
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[#E3D7D1] bg-white">
                <ProductTable products={filteredProducts} loading={loading} error={loadError} onEditStock={openStockEditor} />
              </div>
            </>
          )}

          {activePage === "Orders" && <OrdersPage />}

          {activePage === "Customers" && <CustomersPage />}

          {activePage === "Analytics" && (
            <section>
              <p className="text-xs tracking-[0.18em] text-[#A66D78]">STORE INSIGHTS</p>

              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-4xl font-normal">Analytics</h1>
                  <p className="mt-3 text-sm text-[#806C70]">
                    Store performance calculated from saved orders.
                  </p>
                  {lastUpdated && (
                    <p className="mt-2 text-xs text-[#A18C8B]">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => loadAnalytics()}
                  className="flex items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-3 text-sm transition hover:bg-[#EDE3DD]"
                >
                  <RefreshCw size={16} />
                  Refresh analytics
                </button>
              </div>

              {analyticsError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {analyticsError}
                </div>
              )}

              <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Delivered revenue"
                  value={analyticsLoading && !analytics ? "..." : money(analytics?.revenue ?? 0)}
                  subtitle="Only delivered/completed orders"
                  icon={ChartNoAxesCombined}
                  accent
                />
                <StatCard
                  title="Total orders"
                  value={analyticsLoading && !analytics ? "..." : (analytics?.totalOrders ?? 0)}
                  subtitle="All orders saved in the database"
                  icon={ShoppingBag}
                />
                <StatCard
                  title="Pending orders"
                  value={analyticsLoading && !analytics ? "..." : (analytics?.pendingOrders ?? 0)}
                  subtitle="Waiting for processing"
                  icon={CircleAlert}
                />
                <StatCard
                  title="Delivered orders"
                  value={analyticsLoading && !analytics ? "..." : (analytics?.completedOrders ?? analytics?.deliveredOrders ?? 0)}
                  subtitle="Delivered or completed orders"
                  icon={ShieldCheck}
                />
              </div>

              <div className="mt-7 rounded-2xl border border-[#E3D7D1] bg-white p-5 sm:p-7">
                <h2 className="font-display text-2xl font-normal">Monthly orders</h2>
                <p className="mt-1 text-xs text-[#A18C8B]">
                  Number of orders by month, with recognized revenue on hover
                </p>

                {analyticsLoading && !analytics ? (
                  <p className="py-12 text-center text-sm text-[#806C70]">
                    Loading monthly data...
                  </p>
                ) : (
                  <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">
                    {monthly.map((item) => {
                      const height = Math.max(
                        ((Number(item.orders) || 0) / maxOrders) * 100,
                        Number(item.orders) ? 5 : 2
                      );

                      return (
                        <div
                          key={item.month}
                          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                        >
                          <span className="text-[10px] text-[#806C70] sm:text-xs">
                            {item.orders || 0}
                          </span>
                          <div
                            title={`${item.orders || 0} orders · ${money(item.revenue || 0)} recognized revenue`}
                            className="w-full max-w-12 rounded-t-md bg-[#A66D78] transition-all"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-[10px] text-[#806C70] sm:text-xs">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="mt-5 text-xs leading-5 text-[#806C70]">
                  Revenue remains zero until an order is marked delivered or completed.
                  The bars display order counts independently.
                </p>
              </div>
            </section>
          )}

          {activePage === "Settings" && (
            <section>
              <p className="text-xs tracking-[0.18em] text-[#A66D78]">YOUR ACCOUNT</p>
              <h1 className="mt-2 font-display text-4xl font-normal">Settings</h1>

              <div className="mt-7 max-w-2xl rounded-2xl border border-[#E3D7D1] bg-white p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E8E4] font-display text-2xl text-[#542D3A]">
                    {(admin.name || "A").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-medium">{admin.name || "Admin"}</h2>
                    <p className="mt-1 break-all text-sm text-[#806C70]">{admin.email}</p>
                  </div>
                </div>

                <div className="mt-7 border-t border-[#F0E8E3] pt-5">
                  <p className="text-xs tracking-wider text-[#A66D78]">ACCOUNT ROLE</p>
                  <p className="mt-2 text-sm capitalize">{admin.role || "admin"}</p>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#F8F4EF] p-4">
                  <ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#A66D78]" />
                  <p className="text-xs leading-5 text-[#806C70]">
                    Admin access should be enforced by the backend on every protected
                    endpoint, not only by hiding dashboard pages.
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="mt-7 flex items-center gap-2 rounded-full border border-[#E3D7D1] px-4 py-3 text-sm transition hover:bg-[#F8F4EF]"
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            </section>
          )}

          {editingStockProduct && (
            <div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-[#34232B]/50 p-4 backdrop-blur-sm"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget && !savingStock) {
                  setEditingStockProduct(null);
                }
              }}
            >
              <div className="w-full max-w-lg rounded-2xl border border-[#E3D7D1] bg-[#F8F4EF] p-6 shadow-2xl sm:p-8">
                <p className="text-xs tracking-[0.18em] text-[#A66D78]">YOUR INVENTORY</p>
                <h2 className="mt-2 font-display text-3xl font-normal text-[#493438]">Update stock</h2>
                <p className="mt-2 text-sm text-[#806C70]">
                  Set the available quantity for <strong>{editingStockProduct.name}</strong>.
                </p>
                <form onSubmit={handleSaveStock} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-[#493438]">Stock quantity *</label>
                    <input
                      required
                      autoFocus
                      type="number"
                      min="0"
                      step="1"
                      value={stockQuantityInput}
                      onChange={(event) => setStockQuantityInput(event.target.value)}
                      placeholder="Enter available units"
                      className="w-full rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]"
                    />
                    <p className="mt-2 text-xs leading-5 text-[#806C70]">
                      Enter the actual number of units currently available. Zero marks the product as out of stock.
                    </p>
                  </div>
                  {stockFormError && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {stockFormError}
                    </div>
                  )}
                  <div className="flex justify-end gap-3 border-t border-[#E3D7D1] pt-5">
                    <button
                      type="button"
                      disabled={savingStock}
                      onClick={() => setEditingStockProduct(null)}
                      className="rounded-full border border-[#E3D7D1] bg-white px-5 py-3 text-sm text-[#806C70] hover:bg-[#EDE3DD] disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingStock}
                      className="rounded-full bg-[#542D3A] px-6 py-3 text-sm text-white transition hover:bg-[#6B3A49] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingStock ? "Saving..." : "Save stock"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showProductForm && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#34232B]/50 p-4 backdrop-blur-sm"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget && !savingProduct) setShowProductForm(false);
              }}
            >
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E3D7D1] bg-[#F8F4EF] p-6 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.18em] text-[#A66D78]">YOUR INVENTORY</p>
                    <h2 className="mt-2 font-display text-3xl font-normal text-[#493438]">Add product</h2>
                    <p className="mt-2 text-sm text-[#806C70]">Add product details and set the initial stock quantity.</p>
                  </div>
                  <button type="button" disabled={savingProduct} onClick={() => setShowProductForm(false)} className="rounded-full border border-[#E3D7D1] bg-white px-3 py-2 text-sm text-[#806C70] hover:bg-[#EDE3DD] disabled:opacity-50">Close</button>
                </div>
                <form onSubmit={handleAddProduct} className="mt-7 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-[#493438]">Product name *</label>
                    <input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="e.g. Body Butter" className="w-full rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-[#493438]">Price (EGP) *</label>
                      <input required type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="220" className="w-full rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-[#493438]">Category *</label>
                      <input required value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} placeholder="Body Care" className="w-full rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#493438]">Initial stock quantity *</label>
                    <input required type="number" min="0" step="1" value={productForm.stockQuantity} onChange={(event) => setProductForm({ ...productForm, stockQuantity: event.target.value })} className="w-full rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]" />
                    <p className="mt-2 text-xs leading-5 text-[#806C70]">Enter the actual number of available units. Zero marks the product as out of stock.</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#493438]">Image URL (optional)</label>
                    <input type="url" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} placeholder="https://..." className="w-full rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-[#493438]">Description (optional)</label>
                    <textarea rows={3} value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="Describe your product..." className="w-full resize-y rounded-xl border border-[#E3D7D1] bg-white px-4 py-3 text-sm outline-none focus:border-[#A66D78]" />
                  </div>
                  <label className="flex items-center gap-3 text-sm text-[#493438]">
                    <input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm({ ...productForm, featured: event.target.checked })} className="h-4 w-4 accent-[#542D3A]" />
                    Feature this product
                  </label>
                  {productFormError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{productFormError}</div>}
                  <div className="flex flex-wrap justify-end gap-3 border-t border-[#E3D7D1] pt-5">
                    <button type="button" disabled={savingProduct} onClick={() => setShowProductForm(false)} className="rounded-full border border-[#E3D7D1] bg-white px-5 py-3 text-sm text-[#806C70] hover:bg-[#EDE3DD] disabled:opacity-50">Cancel</button>
                    <button type="submit" disabled={savingProduct} className="rounded-full bg-[#542D3A] px-6 py-3 text-sm text-white transition hover:bg-[#6B3A49] disabled:cursor-not-allowed disabled:opacity-60">{savingProduct ? "Saving product..." : "Save product"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3D7D1] py-6 text-[11px] text-[#A18C8B]">
            <p>© {new Date().getFullYear()} Nyora Beauty</p>
            <p>Made with care, for your beauty business.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
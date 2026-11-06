import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "react-i18next";
import { Heart, ShoppingBag, X } from "lucide-react";
import { products as localProducts } from "../data/products";

const StoreContext = createContext(null);

const CART_KEY = "nyora-cart";
const WISHLIST_KEY = "nyora-wishlist";
const ORDER_NOTE_KEY = "nyora-order-note";
const ORDER_NOTE_MAX = 250;
const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/products`;

const load = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep the store usable if storage is unavailable.
  }
};

const loadText = (key) => {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const saveText = (key, value) => {
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Keep the store usable if storage is unavailable.
  }
};

const normalizeName = (name = "") =>
  String(name).trim().toLowerCase().replace(/\s+/g, " ");

// Images are served by Vite from the frontend's public/ directory.
const decodeURIComponentSafe = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};


const resolveProductImage = (image) => {
  if (typeof image !== "string" || !image.trim()) {
    return "";
  }

  const value = image.trim();

  if (/^(https?:\/\/|data:|blob:)/i.test(value)) {
    return value;
  }

  const cleanPath = value
    .replace(/^public[\\/]/i, "")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");

  return `/${encodeURI(decodeURIComponentSafe(cleanPath))}`;
};


// Match local products with database products,
// then append products that exist only in the database.
const mergeProducts = (apiProducts = []) => {
  const matchedApiIds = new Set();

  const mergedLocalProducts = localProducts.map((localProduct) => {
    const apiProduct = apiProducts.find(
      (item) =>
        normalizeName(item.name) === normalizeName(localProduct.name)
    );

    if (!apiProduct) {
      return { ...localProduct, image: "" };
    }

    matchedApiIds.add(String(apiProduct._id));

    return {
      ...localProduct,
      ...apiProduct,

      // Preserve IDs used by existing product routes and local storage.
      id: localProduct.id,

      // Preserve the database ID for backend requests.
      _id: apiProduct._id,
      apiId: apiProduct._id,
      mongoId: apiProduct._id,

      // MongoDB is the source of truth for product images.
      image: resolveProductImage(apiProduct.image),
      

      // Preserve local descriptive metadata.
      sizes: localProduct.sizes || [],
      ingredients: localProduct.ingredients || [],
      reviews: localProduct.reviews ?? 0,
      tagline: localProduct.tagline || "",
      position: localProduct.position || "50% 50%",

      // Database values take priority when provided.
      price: apiProduct.price ?? localProduct.price,
      category: apiProduct.category || localProduct.category,
      inStock: apiProduct.inStock ?? true,
      featured: apiProduct.featured ?? false,
    };
  });

  const newApiProducts = apiProducts
    .filter((item) => !matchedApiIds.has(String(item._id)))
    .map((item) => {
      const category = normalizeName(item.category);

      let group = "All";

      if (category.includes("lip")) group = "Lips";
      else if (category.includes("face")) group = "Face";
      else if (category.includes("body")) group = "Body";
      else if (category.includes("hair")) group = "Hair";

      return {
        ...item,
        id: String(item._id),
        apiId: item._id,
        mongoId: item._id,
        group,
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        ingredients: Array.isArray(item.ingredients)
          ? item.ingredients
          : [],
        reviews: item.reviews ?? 0,
        tagline: item.tagline || "",
        position: item.position || "50% 50%",
        image: resolveProductImage(item.image),
        inStock: item.inStock ?? true,
        featured: item.featured ?? false,
      };
    });

  return [...mergedLocalProducts, ...newApiProducts];
};

// ======================================================
// TOAST
// ======================================================

const Toast = ({ toast, onClose }) => {
  const { i18n } = useTranslation();

  if (!toast) return null;

  const isArabic = i18n.language?.startsWith("ar");
  const isWishlist = toast.type === "wishlist";
  const isRemoved = toast.action === "removed";

  const messages = {
    cart: {
      added: {
        title: "Added to your bag",
        subtitle: "Your product is ready in your bag.",
      },
      removed: {
        title: "Removed from your bag",
        subtitle: "Removed from your bag.",
      },
    },
    wishlist: {
      added: {
        title: "Added to wishlist",
        subtitle: "Saved to your wishlist.",
      },
      removed: {
        title: "Removed from wishlist",
        subtitle: "Removed from your saved products.",
      },
    },
  };

  const arabicMessages = {
    cart: {
      added: {
        title: "تمت إضافة المنتج إلى حقيبتك",
        subtitle: "منتجك جاهز في حقيبتك.",
      },
      removed: {
        title: "تم حذف المنتج من حقيبتك",
        subtitle: "تم حذف المنتج من حقيبتك.",
      },
    },
    wishlist: {
      added: {
        title: "تمت إضافة المنتج للمفضلة",
        subtitle: "تم حفظ المنتج في قائمة المفضلة.",
      },
      removed: {
        title: "تم حذف المنتج من المفضلة",
        subtitle: "تم حذف المنتج من المنتجات المحفوظة.",
      },
    },
  };

  const messageSet = isArabic ? arabicMessages : messages;
  const toastContent =
    messageSet[isWishlist ? "wishlist" : "cart"][
      isRemoved ? "removed" : "added"
    ];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className={`
        fixed top-[90px] z-[9999]
        w-[calc(100%-32px)] max-w-[470px]
        animate-[toast-in_0.4s_ease-out]
        ${
          isArabic
            ? "left-1/2 -translate-x-1/2 sm:left-8 sm:right-auto sm:translate-x-0"
            : "left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0"
        }
        sm:top-[105px]
      `}
      role="status"
      aria-live="polite"
    >
      <div
        className="
          flex min-h-[92px] items-center gap-4
          rounded-[22px] border border-[#D8C9C3]
          bg-[#EDE3DD] px-5 py-5
          shadow-[0_20px_50px_rgba(73,52,56,0.16)]
        "
      >
        <div
          className="
            flex h-[52px] w-[52px] shrink-0 items-center
            justify-center rounded-full bg-[#FFFDFC]
            text-[#A66D78]
            shadow-[0_5px_16px_rgba(73,52,56,0.07)]
          "
        >
          {isWishlist ? (
            <Heart
              size={22}
              strokeWidth={1.7}
              className={
                toast.action === "added"
                  ? "fill-[#A66D78] text-[#A66D78]"
                  : ""
              }
            />
          ) : (
            <ShoppingBag size={22} strokeWidth={1.7} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-[1.7] text-[#493438]">
            {toastContent.title}
          </p>

          <p className="mt-1.5 text-[12px] leading-[1.6] text-[#79686A]">
            <span className="font-medium text-[#A66D78]">
              Nyora Beauty
            </span>
            <span className="mx-2 text-[#C5B5AF]">·</span>
            {toastContent.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={isArabic ? "إغلاق الإشعار" : "Close notification"}
          className="
            flex h-[34px] w-[34px] shrink-0 items-center
            justify-center rounded-full text-[#79686A]
            transition-all duration-200
            hover:bg-[#FFFDFC] hover:text-[#493438]
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#A66D78]
          "
        >
          <X size={16} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
};

// ======================================================
// STORE PROVIDER
// ======================================================

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => load(CART_KEY));
  const [wishlist, setWishlist] = useState(() =>
    load(WISHLIST_KEY)
  );
  const [toast, setToast] = useState(null);

  const [orderNote, setOrderNoteState] = useState(() =>
    loadText(ORDER_NOTE_KEY).slice(0, ORDER_NOTE_MAX)
  );

  const [products, setProducts] = useState(() =>
  localProducts.map((product) => ({
    ...product,
    image: "",
  }))
);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Load products from the backend.
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Products request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid products API response");
        }

        const mergedProducts = mergeProducts(result.data);
        console.log(
  "PRODUCTS AFTER MERGE:",
  mergedProducts.map((product) => ({
    name: product.name,
    image: product.image,
  }))
);

        if (!cancelled) {
          setProducts(mergedProducts);
        }
      } catch (error) {
        console.error("Products API error:", error);

        if (!cancelled) {
          // Keep the local catalog available if the backend is offline.
          setProducts(
            localProducts.map((product) => ({
              ...product,
              image: "",
            }))
          );

          setProductsError(
            error instanceof Error
              ? error.message
              : "Failed to load products"
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    save(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    save(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  useEffect(() => {
    saveText(ORDER_NOTE_KEY, orderNote);
  }, [orderNote]);

  const setOrderNote = useCallback((value) => {
    setOrderNoteState(String(value ?? "").slice(0, ORDER_NOTE_MAX));
  }, []);

  const clearOrderNote = useCallback(() => {
    setOrderNoteState("");
  }, []);

  const showToast = useCallback(
    (message, type = "cart", action = "added") => {
      setToast({
        message,
        type,
        action,
        id: Date.now(),
      });
    },
    []
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => clearTimeout(timer);
  }, [toast]);

  // ======================================================
  // CART
  // ======================================================

  const addToCart = useCallback(
    (id, size = "", qty = 1) => {
      const quantity = Math.max(1, Number(qty) || 1);

      setCart((previousCart) => {
        const found = previousCart.find(
          (item) =>
            String(item.id) === String(id) &&
            (item.size || "") === (size || "")
        );

        if (found) {
          return previousCart.map((item) =>
            item === found
              ? {
                  ...item,
                  qty: (Number(item.qty) || 1) + quantity,
                }
              : item
          );
        }

        return [...previousCart, { id, size, qty: quantity }];
      });

      showToast("Added to your bag", "cart", "added");
    },
    [showToast]
  );

  const updateQty = useCallback((id, size, qty) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        String(item.id) === String(id) &&
        (item.size || "") === (size || "")
          ? { ...item, qty: Math.max(1, Number(qty) || 1) }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback(
    (id, size = "") => {
      setCart((previousCart) =>
        previousCart.filter(
          (item) =>
            !(
              String(item.id) === String(id) &&
              (item.size || "") === (size || "")
            )
        )
      );

      showToast("Removed from your bag", "cart", "removed");
    },
    [showToast]
  );

  // ======================================================
  // WISHLIST
  // ======================================================

  const toggleWishlist = useCallback(
    (id) => {
      const alreadyLiked = wishlist.some(
        (itemId) => String(itemId) === String(id)
      );

      setWishlist((previousWishlist) =>
        previousWishlist.some(
          (itemId) => String(itemId) === String(id)
        )
          ? previousWishlist.filter(
              (itemId) => String(itemId) !== String(id)
            )
          : [...previousWishlist, id]
      );

      showToast(
        alreadyLiked
          ? "Removed from wishlist"
          : "Added to wishlist",
        "wishlist",
        alreadyLiked ? "removed" : "added"
      );
    },
    [wishlist, showToast]
  );

  const isLiked = useCallback(
    (id) =>
      wishlist.some((itemId) => String(itemId) === String(id)),
    [wishlist]
  );

  // ======================================================
  // STORE VALUE
  // ======================================================

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      products,
      productsLoading,
      productsError,

      orderNote,
      orderNoteMax: ORDER_NOTE_MAX,
      setOrderNote,
      clearOrderNote,

      cartCount: cart.reduce(
        (sum, item) => sum + (Number(item.qty) || 0),
        0
      ),

      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isLiked,
    }),
    [
      cart,
      wishlist,
      products,
      productsLoading,
      productsError,
      orderNote,
      setOrderNote,
      clearOrderNote,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isLiked,
    ]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <Toast toast={toast} onClose={closeToast} />
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }

  return context;
};
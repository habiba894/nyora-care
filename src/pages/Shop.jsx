import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { groups } from "../data/products";
import { useStore } from "../context/StoreContext";

// ======================================================
// ARABIC TRANSLATIONS
// ======================================================

const translations = {
  all: "الكل",
  face: "الوجه",
  lips: "الشفاه",
  body: "الجسم",
  hair: "الشعر",
  "lip scrub": "مقشر الشفاه",
  "lips scrub": "مقشر الشفاه",
  "lip exfoliator": "مقشر الشفاه",
  "lip exfoliating scrub": "مقشر الشفاه",
  "body butter": "زبدة الجسم",
  bodybutter: "زبدة الجسم",
  "body cream": "كريم الجسم",
  "body lotion": "لوشن الجسم",
  "hair balm": "بلسم الشعر",
  "hair mask": "ماسك الشعر",
  "hair oil": "زيت الشعر",
  "hair serum": "سيروم الشعر",
  shampoo: "شامبو",
  conditioner: "بلسم الشعر",
  "lip balm": "مرطب الشفاه",
  "lip mask": "ماسك الشفاه",
  "lip oil": "زيت الشفاه",
  "lip gloss": "ملمع الشفاه",
  "face mask": "ماسك الوجه",
  "face scrub": "مقشر الوجه",
  "face wash": "غسول الوجه",
  "facial cleanser": "غسول الوجه",
  "face cream": "كريم الوجه",
  "face moisturizer": "مرطب الوجه",
  moisturizer: "مرطب",
  cleanser: "غسول",
  scrub: "مقشر",
  mask: "ماسك",
  featured: "المميزة",
  "price: low to high": "السعر: من الأقل للأعلى",
  "price: high to low": "السعر: من الأعلى للأقل",
  "most reviewed": "الأكثر تقييمًا",
  home: "الرئيسية",
  shop: "المتجر",
  "add to cart": "أضيفي إلى السلة",
  added: "تمت الإضافة",
  "sort by": "ترتيب حسب",
  "clear search": "مسح البحث",
  "show all products": "عرض كل المنتجات",
  "try another category or browse all of our products.":
    "جربي قسمًا آخر أو تصفحي جميع منتجاتنا.",
  "lips, face, body and hair. pick a category or browse everything.":
    "منتجات للعناية بالشفاه والوجه والجسم والشعر. اختاري قسمًا أو تصفحي كل المنتجات.",
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const translate = (value, isArabic) => {
  if (!value || !isArabic) return value;

  const normalized = normalizeText(value);

  if (translations[normalized]) {
    return translations[normalized];
  }

  if (normalized.includes("lip") && normalized.includes("scrub")) {
    return "مقشر الشفاه";
  }

  if (normalized.includes("body") && normalized.includes("butter")) {
    return "زبدة الجسم";
  }

  if (normalized.includes("hair") && normalized.includes("balm")) {
    return "بلسم الشعر";
  }

  return value;
};

const formatNumber = (value, isArabic) => {
  if (!isArabic) return String(value ?? "");

  return String(value ?? "").replace(
    /\d/g,
    (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]
  );
};

const formatSize = (size, isArabic) => {
  if (!isArabic || !size) return size;

  return String(size)
    .replace(/\s*gm\b/gi, " جم")
    .replace(/\s*ml\b/gi, " مل")
    .replace(/\s*g\b/gi, " جم")
    .replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
};

const sorters = {
  featured: () => 0,
  "price-asc": (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
  "price-desc": (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
  reviews: (a, b) =>
    (Number(b.reviews) || 0) - (Number(a.reviews) || 0),
};

const getProductImageSrc = (image) => {
  const value = String(image ?? "").trim();

  if (!value) return null;

  if (/^(https?:\/\/|data:|blob:)/i.test(value)) {
    return value;
  }

  const cleanPath = value
    .replace(/^public[\\/]/i, "")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")
    .replace(/%20/gi, " ");

  return `/${encodeURI(cleanPath)}`;
};

// ======================================================
// SORT DROPDOWN (Nyora-styled)
// ======================================================

const SortDropdown = ({ value, options, onChange, isArabic }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-w-[190px] items-center justify-between gap-3 rounded-full border bg-[#FCFAF8] px-4 py-2.5 text-[13px] text-[#493438] transition-all duration-300 hover:border-[#A66D78] hover:bg-[#F8EDEA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A66D78]/25 ${
          open
            ? "border-[#A66D78] ring-2 ring-[#A66D78]/15"
            : "border-[#E3D7D1]"
        }`}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
          className={`shrink-0 text-[#A66D78] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={isArabic ? "ترتيب حسب" : "Sort by"}
          className={`absolute z-50 mt-2 w-[230px] overflow-hidden rounded-2xl border border-[#E8DCD6] bg-[#FFFCFA] p-2 shadow-[0_18px_45px_rgba(73,52,56,0.16)] ${
            isArabic ? "left-0" : "right-0"
          }`}
        >
          <div className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-start text-[13px] transition-colors duration-200 ${
                    isSelected
                      ? "bg-[#F3E5E5] font-medium text-[#542D3A]"
                      : "text-[#79686A] hover:bg-[#F8EDEA] hover:text-[#493438]"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="shrink-0 text-[#A66D78]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ======================================================
// PRODUCT CARD
// ======================================================

const ProductCard = ({ product, justAdded, onAdd, isArabic }) => {
  const productName = translate(product.name, isArabic);
  const productCategory = translate(product.category, isArabic);
  const imageSrc = getProductImageSrc(product.image);
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  return (
    <article className="group" dir={isArabic ? "rtl" : "ltr"}>
      {/* PRODUCT IMAGE */}
      <div className="relative aspect-[1.08/1] overflow-hidden rounded-[22px] bg-[#EDE3DD]">
        <Link
          to={`/product/${product.id}`}
          aria-label={`${isArabic ? "عرض" : "View"} ${productName}`}
          className="block h-full w-full"
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={productName}
              style={{ objectPosition: product.position || "center" }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-[#79686A]">
              {isArabic ? "الصورة غير متاحة حاليًا" : "Image unavailable"}
            </div>
          )}
        </Link>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="mt-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#A66D78]">
          {productCategory}
        </p>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h2 className="text-[18px] font-medium leading-snug text-[#493438]">
            {productName}
          </h2>

          <p className="shrink-0 pt-1 text-[15px] font-semibold text-[#493438]">
            {formatNumber(product.price, isArabic)}{" "}
            {isArabic ? "ج.م" : "EGP"}
          </p>
        </div>

        {sizes.length > 0 && (
          <p className="mt-2 text-[12px] text-[#79686A]">
            {sizes.map((size) => formatSize(size, isArabic)).join(" / ")}
          </p>
        )}

        {/* REVIEWS */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="text-[13px] tracking-[0.04em] text-[#806654]"
            aria-label={isArabic ? "٥ من ٥ نجوم" : "5 out of 5 stars"}
          >
            ★★★★★
          </span>
          <span className="text-[12px] text-[#79686A]">
            ({formatNumber(product.reviews ?? 0, isArabic)})
          </span>
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={() => onAdd(product)}
          className={`mt-5 flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-[11px] font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78] ${
            justAdded
              ? "border-[#A66D78] bg-[#A66D78] text-white"
              : "border-[#493438] bg-transparent text-[#493438] hover:bg-[#493438] hover:text-white"
          }`}
        >
          <ShoppingBag size={15} strokeWidth={1.8} />
          {translate(justAdded ? "Added" : "Add to cart", isArabic)}
        </button>
      </div>
    </article>
  );
};

// ======================================================
// SHOP PAGE
// ======================================================

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const { products = [], addToCart } = useStore();

  const [sort, setSort] = useState("featured");
  const [justAdded, setJustAdded] = useState(null);

  const sortOptions = [
    {
      value: "featured",
      label: isArabic ? "المميزة" : "Featured",
    },
    {
      value: "price-asc",
      label: isArabic ? "السعر: من الأقل للأعلى" : "Price: low to high",
    },
    {
      value: "price-desc",
      label: isArabic ? "السعر: من الأعلى للأقل" : "Price: high to low",
    },
    {
      value: "reviews",
      label: isArabic ? "الأكثر تقييمًا" : "Most reviewed",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (justAdded === null) return undefined;

    const timer = setTimeout(() => setJustAdded(null), 1400);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const requested = params.get("category");
  const active = groups.includes(requested) ? requested : "All";
  const query = (params.get("q") || "").trim();

  const visible = useMemo(() => {
    const q = normalizeText(query);

    const filteredProducts = products.filter((product) => {
      const matchesCategory = active === "All" || product.group === active;

      const searchableText = [
        product.name,
        product.category,
        product.group,
        translate(product.name, true),
        translate(product.category, true),
        translate(product.group, true),
      ]
        .filter(Boolean)
        .map(normalizeText)
        .join(" ");

      return matchesCategory && (!q || searchableText.includes(q));
    });

    return [...filteredProducts].sort(sorters[sort] || sorters.featured);
  }, [active, query, sort, products]);

  const chooseGroup = (group) => {
    const next = new URLSearchParams(params);

    if (group === "All") {
      next.delete("category");
    } else {
      next.set("category", group);
    }

    setParams(next);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(params);
    next.delete("q");
    setParams(next);
  };

  const quickAdd = (product) => {
    addToCart(product.id, product.sizes?.[0] || "", 1);
    setJustAdded(product.id);
  };

  const categoryLabel = (group) => translate(group, isArabic);

  const countLabel = (count) => {
    if (!isArabic) return count === 1 ? "product" : "products";
    return count === 1 ? "منتج" : "منتجات";
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER */}
        <header className="max-w-[650px]">
          <nav
            aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}
            className="text-[13px] text-[#79686A]"
          >
            <Link
              to="/"
              className="transition-colors duration-300 hover:text-[#A66D78]"
            >
              {isArabic ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2 text-[#D8CBC5]">/</span>
            <span className="text-[#493438]">
              {isArabic ? "المتجر" : "Shop"}
            </span>
          </nav>

          <h1
            className="mt-5 font-display font-normal leading-[0.95] tracking-[-0.03em] text-[#493438]"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            {isArabic ? (
              "كل منتجات العناية"
            ) : (
              <>
                Shop all <span className="italic text-[#A66D78]">care</span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-[480px] text-[16px] leading-[1.7] text-[#79686A]">
            {isArabic
              ? "منتجات للعناية بالشفاه والوجه والجسم والشعر. اختاري قسمًا أو تصفحي كل المنتجات."
              : "Lips, face, body and hair. Pick a category or browse everything."}
          </p>
        </header>

        {/* TOOLBAR */}
        <div className="mt-12 flex flex-col gap-5 border-y border-[#E3D7D1] py-5 lg:flex-row lg:items-center lg:justify-between">
          {/* CATEGORIES */}
          <div
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0"
            role="group"
            aria-label={isArabic ? "التصفية حسب القسم" : "Filter by category"}
          >
            {["All", ...groups.filter((group) => group !== "All")].map(
              (group) => {
                const selected = active === group;

                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => chooseGroup(group)}
                    aria-pressed={selected}
                    className={`shrink-0 rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78] ${
                      selected
                        ? "border-[#A66D78] bg-[#A66D78] text-white"
                        : "border-[#E3D7D1] bg-transparent text-[#493438] hover:border-[#A66D78] hover:text-[#A66D78]"
                    }`}
                  >
                    {group === "All" && isArabic
                      ? translations.all
                      : categoryLabel(group)}
                  </button>
                );
              }
            )}
          </div>

          {/* COUNT + SORT */}
          <div className="flex items-center justify-between gap-6 lg:justify-end">
            <p className="text-[13px] text-[#79686A]" aria-live="polite">
              {formatNumber(visible.length, isArabic)} {countLabel(visible.length)}
            </p>

            <div className="flex items-center gap-3 text-[13px] text-[#493438]">
              <span className="text-[#79686A]">
                {isArabic ? "ترتيب حسب" : "Sort by"}
              </span>

              <SortDropdown
                value={sort}
                options={sortOptions}
                onChange={setSort}
                isArabic={isArabic}
              />
            </div>
          </div>
        </div>

        {/* SEARCH RESULTS */}
        {query && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#79686A]">
            <span>
              {isArabic ? "نتائج البحث عن" : "Results for"}{" "}
              <span className="font-semibold text-[#493438]">“{query}”</span>
            </span>

            <button
              type="button"
              onClick={clearSearch}
              className="text-[#A66D78] underline underline-offset-4 transition-colors duration-300 hover:text-[#493438]"
            >
              {isArabic ? "مسح البحث" : "Clear search"}
            </button>
          </div>
        )}

        {/* PRODUCT GRID / EMPTY STATE */}
        {visible.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                justAdded={String(justAdded) === String(product.id)}
                onAdd={quickAdd}
                isArabic={isArabic}
              />
            ))}
          </div>
        ) : (
          <div className="mt-24 flex flex-col items-center text-center">
            <p className="font-display text-[32px] font-normal text-[#493438]">
              {query
                ? isArabic
                  ? `لا توجد منتجات تطابق "${query}"`
                  : `No products match "${query}"`
                : isArabic
                  ? `لا توجد منتجات في قسم ${categoryLabel(active)} حتى الآن`
                  : `Nothing in ${active} yet`}
            </p>

            <p className="mt-3 max-w-[380px] text-[14px] leading-[1.7] text-[#79686A]">
              {isArabic
                ? "جربي قسمًا آخر أو تصفحي جميع منتجاتنا."
                : "Try another category or browse all of our products."}
            </p>

            <button
              type="button"
              onClick={() => setParams({})}
              className="mt-7 rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold text-white transition-colors duration-300 hover:bg-[#62474D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
            >
              {isArabic ? "عرض كل المنتجات" : "Show all products"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;
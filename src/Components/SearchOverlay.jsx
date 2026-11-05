import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

const categoryTranslations = {
  All: "الكل",
  Lips: "الشفاه",
  Lip: "الشفاه",
  Face: "الوجه",
  Body: "الجسم",
  Hair: "الشعر",
  "Lip Care": "العناية بالشفاه",
  "Face Care": "العناية بالبشرة",
  "Body Care": "العناية بالجسم",
  "Hair Care": "العناية بالشعر",
};

const productTranslations = {
  "Hair Balm": "بلسم الشعر",
  "Lip Balm": "مرطب الشفاه",
  "Body Butter": "زبدة الجسم",
  "Strawberry Lip Scrub": "مقشر الشفاه بالفراولة",
  "Lip Scrub": "مقشر الشفاه",
  "Face Mask": "ماسك الوجه",
  "Hair Oil": "زيت الشعر",
  "Body Oil": "زيت الجسم",
  "Face Scrub": "مقشر الوجه",
  "Face Wash": "غسول الوجه",
  "Body Lotion": "لوشن الجسم",
  "Lip Gloss": "ملمع الشفاه",
};

const normalize = (text) =>
  String(text ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const getArabicText = (text) => {
  if (!text) return "";

  const normalized = normalize(text);

  const productEntry = Object.entries(productTranslations).find(
    ([name]) => normalize(name) === normalized
  );

  if (productEntry) return productEntry[1];

  const categoryEntry = Object.entries(categoryTranslations).find(
    ([name]) => normalize(name) === normalized
  );

  if (categoryEntry) return categoryEntry[1];

  if (normalized.includes("lip") && normalized.includes("scrub")) {
    return "مقشر الشفاه";
  }

  if (normalized.includes("body") && normalized.includes("butter")) {
    return "زبدة الجسم";
  }

  if (normalized.includes("hair") && normalized.includes("balm")) {
    return "بلسم الشعر";
  }

  return text;
};

const SearchOverlay = ({ open, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [term, setTerm] = useState("");

  const { products = [] } = useStore();
  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar") ?? false;
  const query = normalize(term);

  const closeSearch = () => {
    setTerm("");
    onClose?.();
  };

  useEffect(() => {
    if (!open) return undefined;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setTerm("");
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query) return [];

    return products
      .filter((product) => {
        const name = normalize(product.name);
        const category = normalize(product.category);
        const group = normalize(product.group);
        const arabicName = normalize(getArabicText(product.name));
        const arabicCategory = normalize(
          getArabicText(product.category || product.group)
        );

        return (
          name.includes(query) ||
          category.includes(query) ||
          group.includes(query) ||
          arabicName.includes(query) ||
          arabicCategory.includes(query)
        );
      })
      .slice(0, 5);
  }, [query, products]);

  const goToShop = (value = "") => {
    const searchQuery = String(value).trim();

    navigate(
      searchQuery
        ? `/shop?q=${encodeURIComponent(searchQuery)}`
        : "/shop"
    );

    closeSearch();
  };

  const openProduct = (product) => {
    const productId = product.id ?? product._id ?? product.apiId;

    if (productId == null || String(productId).trim() === "") {
      goToShop(product.name);
      return;
    }

    navigate(`/product/${encodeURIComponent(String(productId))}`);
    closeSearch();
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`
        absolute top-1/2 z-[150] -translate-y-1/2
        transition-[width,opacity] duration-300 ease-out
        ${isArabic ? "left-0 origin-left" : "right-0 origin-right"}
        ${
          open
            ? "pointer-events-auto w-[250px] opacity-100"
            : "pointer-events-none w-10 opacity-0"
        }
      `}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          goToShop(term);
        }}
        className="
          flex h-[42px] w-full items-center gap-2
          overflow-hidden rounded-full border border-[#E3D7D1]
          bg-[#FFFDFC] px-3
          shadow-[0_8px_24px_rgba(73,52,56,0.10)]
        "
      >
        <Search
          size={18}
          strokeWidth={1.7}
          className="shrink-0 text-[#A66D78]"
        />

        <input
          ref={inputRef}
          type="text"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={isArabic ? "ابحثي عن منتج..." : "Search..."}
          aria-label={isArabic ? "البحث عن المنتجات" : "Search products"}
          autoComplete="off"
          className="
            !m-0 !h-auto !w-full !min-w-0
            !border-0 !bg-transparent !p-0
            !outline-none !ring-0 !shadow-none
            appearance-none text-[13px] font-normal
            text-[#493438] placeholder:text-[#A99A9B]
            focus:!border-0 focus:!outline-none
            focus:!ring-0 focus:!shadow-none
          "
        />

        <button
          type="button"
          onClick={closeSearch}
          aria-label={isArabic ? "إغلاق البحث" : "Close search"}
          className="
            flex h-7 w-7 shrink-0 items-center justify-center
            rounded-full text-[#493438]
            transition-all duration-200
            hover:bg-[#EDE3DD] hover:text-[#A66D78]
          "
        >
          <X size={15} strokeWidth={1.8} />
        </button>
      </form>

      <div
        className={`
          absolute top-[50px] w-[300px]
          overflow-hidden rounded-[18px]
          border border-[#E3D7D1] bg-[#FFFDFC]
          shadow-[0_18px_40px_rgba(73,52,56,0.14)]
          transition-all duration-200 ease-out
          ${isArabic ? "right-0" : "left-0"}
          ${
            open && query
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0"
          }
        `}
      >
        {!query ? null : results.length === 0 ? (
          <p className="px-4 py-4 text-[13px] leading-6 text-[#79686A]">
            {isArabic
              ? `مفيش منتجات مطابقة لـ "${term.trim()}".`
              : `No products match "${term.trim()}".`}
          </p>
        ) : (
          <ul className="max-h-[320px] overflow-y-auto p-2">
            {results.map((product) => (
              <li key={product._id || product.id}>
                <button
                  type="button"
                  onClick={() => openProduct(product)}
                  className="
                    flex w-full items-center gap-3
                    rounded-[14px] px-2 py-2.5 text-start
                    transition-colors duration-150
                    hover:bg-[#F3ECE8]
                  "
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={
                        isArabic
                          ? getArabicText(product.name)
                          : product.name
                      }
                      style={{
                        objectPosition: product.position || "50% 50%",
                      }}
                      className="
                        h-11 w-11 shrink-0 rounded-lg
                        bg-[#F8F4EF] object-cover
                      "
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="
                        flex h-11 w-11 shrink-0 items-center
                        justify-center rounded-lg bg-[#F8F4EF]
                        text-[#A66D78]
                      "
                    >
                      <Search size={16} />
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span
                      className={`
                        block truncate font-display text-[15px]
                        leading-tight text-[#493438]
                        ${isArabic ? "text-right" : "text-left"}
                      `}
                    >
                      {isArabic
                        ? getArabicText(product.name)
                        : product.name}
                    </span>

                    <span
                      className={`
                        mt-1 block text-[11px] text-[#79686A]
                        ${isArabic ? "text-right" : "text-left"}
                      `}
                    >
                      {isArabic
                        ? getArabicText(
                            product.category || product.group
                          )
                        : product.category || product.group || ""}
                    </span>
                  </span>

                  <span
                    dir="ltr"
                    className="shrink-0 text-[12px] font-semibold text-[#A66D78]"
                  >
                    {Number(product.price || 0)} EGP
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
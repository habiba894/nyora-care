
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "../context/StoreContext";

// ======================================================
// TRANSLATIONS
// ======================================================

const productTranslations = {
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

  face: "الوجه",
  lips: "الشفاه",
  body: "الجسم",
  hair: "الشعر",
  all: "الكل",
};

const normalizeText = (value) =>
  String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const translateProductText = (value, isArabic) => {
  if (!value || !isArabic) return value;

  const normalized = normalizeText(value);

  if (productTranslations[normalized]) {
    return productTranslations[normalized];
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
  if (!isArabic) return String(value);

  return String(value).replace(
    /\d/g,
    (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]
  );
};

const formatSize = (size, isArabic) => {
  if (!isArabic || !size) return size;

  return String(size)
    .replace(/\s*ml\b/gi, " مل")
    .replace(/\s*gm\b/gi, " جم")
    .replace(/\s*g\b/gi, " جم")
    .replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
};

// ======================================================
// WISHLIST
// ======================================================

const Wishlist = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const {
    products = [],
    productsLoading,
    wishlist = [],
    toggleWishlist,
    addToCart,
  } = useStore();

  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (justAdded === null) return;

    const timer = setTimeout(() => setJustAdded(null), 1400);

    return () => clearTimeout(timer);
  }, [justAdded]);

  // Keep the existing StoreContext wishlist behavior.
  const saved = products.filter((product) =>
    wishlist.some((id) => String(id) === String(product.id))
  );

  const handleAddToCart = (product) => {
    addToCart(product.id, product.sizes?.[0] || "", 1);
    setJustAdded(product.id);
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="min-h-[70vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER */}
        <header className="max-w-[700px]">
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
              {isArabic ? "المفضلة" : "Wishlist"}
            </span>
          </nav>

          <h1
            className="mt-5 font-display font-normal leading-[0.95] tracking-[-0.03em] text-[#493438]"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            {isArabic ? (
              <>
                قائمة{" "}
                <span className="italic text-[#A66D78]">المفضلة</span>
              </>
            ) : (
              <>
                Your{" "}
                <span className="italic text-[#A66D78]">wishlist</span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-[470px] text-[16px] leading-[1.7] text-[#79686A]">
            {isArabic
              ? "مجموعة صغيرة من المنتجات اللي بتحبيها وعايزة تحتفظي بيها."
              : "A little collection of the pieces you love most."}
          </p>
        </header>

        {/* LOADING */}
        {productsLoading && products.length === 0 ? (
          <p className="mt-12 text-[14px] text-[#79686A]">
            {isArabic
              ? "جاري تحميل المنتجات المحفوظة..."
              : "Loading your saved products..."}
          </p>
        ) : saved.length === 0 ? (
          /* EMPTY WISHLIST */
          <div className="mt-16 max-w-[620px] border-y border-[#E3D7D1] py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
              <Heart size={23} strokeWidth={1.5} />
            </div>

            <h2 className="mt-7 font-display text-[32px] font-normal leading-[1.1] text-[#493438]">
              {isArabic ? "لسه مفيش منتجات محفوظة" : "Nothing saved yet"}
            </h2>

            <p className="mt-3 max-w-[430px] text-[15px] leading-[1.7] text-[#79686A]">
              {isArabic
                ? "اضغطي على علامة القلب عند أي منتج بتحبيه، وهيفضل موجود هنا لحد ما تكوني جاهزة تطلبيه."
                : "Tap the heart on any product you love and it will stay here until you are ready for it."}
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold transition-colors duration-300 hover:bg-[#62474D] text-white"
            >
              {isArabic ? "تصفحي المتجر" : "Browse the shop"}
            </Link>
          </div>
        ) : (
          <>
            {/* WISHLIST TOOLBAR */}
            <div className="mt-12 flex items-center justify-between gap-4 border-y border-[#E3D7D1] py-5">
              <p className="text-[13px] text-[#79686A]">
                {formatNumber(saved.length, isArabic)}{" "}
                {isArabic
                  ? saved.length === 1
                    ? "منتج محفوظ"
                    : "منتجات محفوظة"
                  : saved.length === 1
                    ? "saved piece"
                    : "saved pieces"}
              </p>

              <Link
                to="/shop"
                className="text-[12px] font-semibold text-[#A66D78] transition-colors duration-300 hover:text-[#493438]"
              >
                {isArabic ? "متابعة التسوق" : "Continue shopping"}
              </Link>
            </div>

            {/* SAVED PRODUCTS */}
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {saved.map((product) => {
                const productName = translateProductText(
                  product.name,
                  isArabic
                );

                const productCategory = translateProductText(
                  product.category,
                  isArabic
                );

                return (
                  <article
                    key={product.id}
                    className="group"
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    {/* PRODUCT IMAGE */}
                    <div className="relative aspect-[1.08/1] overflow-hidden rounded-[22px] bg-[#EDE3DD]">
                      <Link
                        to={`/product/${product.id}`}
                        aria-label={`${isArabic ? "عرض" : "View"} ${productName}`}
                        className="block h-full w-full"
                      >
                        <img
                          src={product.image}
                          alt={productName}
                          style={{
                            objectPosition: product.position || "50% 50%",
                          }}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      </Link>

                      {/* REMOVE FROM WISHLIST */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={
                          isArabic
                            ? `إزالة ${productName} من المفضلة`
                            : `Remove ${productName} from wishlist`
                        }
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E3D7D1] bg-[#F8F4EF]/95 text-[#A66D78] transition-all duration-300 hover:border-[#A66D78] hover:bg-[#A66D78] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
                      >
                        <Heart
                          size={19}
                          strokeWidth={1.6}
                          className="fill-current"
                        />
                      </button>
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="mt-5">
                      <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                          <p className="text-[12px] text-[#A66D78]">
                            {productCategory}
                          </p>

                          <h2 className="mt-1 font-display text-[24px] font-normal leading-[1.08] text-[#493438]">
                            {productName}
                          </h2>

                          {product.sizes?.length > 0 && (
                            <p className="mt-2 text-[12px] text-[#79686A]">
                              {product.sizes
                                .map((size) => formatSize(size, isArabic))
                                .join(" / ")}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 pt-1 text-[15px] font-semibold text-[#493438]">
                          {formatNumber(product.price, isArabic)}{" "}
                          {isArabic ? "ج.م" : "EGP"}
                        </p>
                      </div>

                      {/* REVIEWS */}
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className="text-[13px] tracking-[0.04em] text-[#806654]"
                          aria-label={
                            isArabic ? "٥ من ٥ نجوم" : "5 out of 5 stars"
                          }
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
                        onClick={() => handleAddToCart(product)}
                        className={`mt-5 flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-[11px] font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78] ${
                          justAdded === product.id
                            ? "border-[#A66D78] bg-[#A66D78] text-white"
                            : "border-[#493438] bg-transparent text-[#493438] hover:bg-[#493438] hover:text-white"
                        }`}
                      >
                        <ShoppingBag size={15} strokeWidth={1.8} />

                        {justAdded === product.id
                          ? isArabic
                            ? "تمت الإضافة"
                            : "Added"
                          : isArabic
                            ? "أضيفي إلى السلة"
                            : "Add to cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Wishlist;

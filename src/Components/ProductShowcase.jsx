
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "../context/StoreContext";

const normalizeName = (name = "") =>
  String(name ?? "").trim().toLowerCase().replace(/\s+/g, " ");

const getProductImageSrc = (image) => {
  const value = String(image ?? "").trim();

  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/")) return value;

  return `/${value
    .replace(/^(?:\.\.\/)+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
};

const productTranslations = {
  "hair balm": "بلسم الشعر",
  "lip balm": "مرطب الشفاه",
  "body butter": "زبدة الجسم",
  "strawberry lip scrub": "مقشر الشفاه بالفراولة",
  "face mask": "ماسك الوجه",
  "lip scrub": "مقشر الشفاه",
  "hair oil": "زيت الشعر",
  "body oil": "زيت الجسم",
};

const categoryTranslations = {
  body: "العناية بالجسم",
  hair: "العناية بالشعر",
  face: "العناية بالوجه",
  lips: "العناية بالشفاه",
  skincare: "العناية بالبشرة",
  "body care": "العناية بالجسم",
  "hair care": "العناية بالشعر",
  "lip care": "العناية بالشفاه",
  "face care": "العناية بالوجه",
};

const FEATURED_PRODUCTS = ["hair balm", "lip balm", "body butter"];

const copy = {
  en: {
    eyebrow: "THE NYORA EDIT",
    title: "Our Best",
    highlight: "Sellers",
    description:
      "Three Nyora favourites, thoughtfully made to bring a little more care to your everyday ritual.",
    viewProduct: "View product",
    reviews: "reviews",
    add: "Add to bag",
    wishlist: "Add to wishlist",
    removeWishlist: "Remove from wishlist",
    all: "Explore the full collection",
    loading: "Preparing your favourites...",
    unavailable: "Our featured products are currently unavailable.",
    error: "Some product information may be temporarily unavailable.",
    pricePrefix: "EGP",
  },

  ar: {
    eyebrow: "اختيارات نيورا",
    title: "الأكثر",
    highlight: "مبيعًا",
    description:
      "ثلاثة من منتجات نيورا المفضلة، صُممت بعناية لتضيف لمسة من الاهتمام والجمال إلى روتينك اليومي.",
    viewProduct: "عرض المنتج",
    reviews: "مراجعة",
    add: "أضيفي إلى السلة",
    wishlist: "أضيفي إلى المفضلة",
    removeWishlist: "إزالة من المفضلة",
    all: "اكتشفي المجموعة كاملة",
    loading: "بنجهزلك منتجاتك المفضلة...",
    unavailable: "المنتجات المختارة غير متاحة حاليًا.",
    error: "بعض بيانات المنتجات قد تكون غير متاحة مؤقتًا.",
    pricePrefix: "جنيه",
  },
};

const ProductShowcase = () => {
  const {
    products = [],
    productsLoading = false,
    productsError = false,
    addToCart,
    toggleWishlist,
    isLiked,
  } = useStore();

  const { i18n } = useTranslation();

  const isArabic = i18n.language?.startsWith("ar") ?? false;
  const text = isArabic ? copy.ar : copy.en;

  const font = isArabic
    ? '"El Messiri", sans-serif'
    : '"DM Sans", sans-serif';

  const displayNumber = (value) =>
    Number(value ?? 0).toLocaleString(isArabic ? "ar-EG" : "en-US");

  const getProductName = (name = "") =>
    isArabic ? productTranslations[normalizeName(name)] || name : name;

  const getCategoryName = (category = "") =>
    isArabic
      ? categoryTranslations[normalizeName(category)] || category
      : category;

  const productList = Array.isArray(products) ? products : [];

  const featuredProducts = FEATURED_PRODUCTS.map((name) =>
    productList.find((product) => normalizeName(product.name) === name)
  ).filter(Boolean);

  const getProductId = (product) =>
    product.id ?? product._id ?? product.apiId;

  const actionClass =
    "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#E7D9D1] bg-[#FBF7F2] text-[#493438] shadow-sm transition-all duration-300 hover:border-[#A66D78] hover:text-[#A66D78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66D78]";

  return (
    <section
      id="shop"
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="relative scroll-mt-24 overflow-hidden bg-[#F8F4EF] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      {/* Soft background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-16 h-64 w-64 rounded-full bg-[#EAD5D5]/20 blur-3xl sm:h-72 sm:w-72"
      />

      <div className="relative mx-auto w-full max-w-[1400px]">
        {/* Centered heading */}
        <div className="mx-auto mb-9 max-w-[720px] text-center sm:mb-11 lg:mb-14">
          <p
            className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#A66D78] sm:mb-4 sm:text-[11px]"
            style={{ fontFamily: font }}
          >
            {text.eyebrow}
          </p>

          <h2
            className="text-[clamp(2.4rem,5vw,4.2rem)] font-normal leading-[1.05] tracking-[-0.035em] text-[#493438]"
            style={{
              fontFamily: isArabic
                ? '"El Messiri", sans-serif'
                : '"Cormorant Garamond", Georgia, serif',
            }}
          >
            {text.title}{" "}
            <span className="italic text-[#A66D78]">
              {text.highlight}
            </span>
          </h2>

          <p
            className="mx-auto mt-4 max-w-[500px] text-[14px] leading-[1.9] text-[#79686A] sm:mt-5 sm:text-[15px] sm:leading-[2]"
            style={{ fontFamily: font }}
          >
            {text.description}
          </p>
        </div>

        {/* Loading state */}
        {productsLoading && (
          <p
            role="status"
            className="py-10 text-center text-sm text-[#79686A]"
            style={{ fontFamily: font }}
          >
            {text.loading}
          </p>
        )}

        {/* Error state */}
        {!productsLoading && productsError && (
          <p
            role="status"
            className="mb-5 text-center text-xs text-[#79686A]"
            style={{ fontFamily: font }}
          >
            {text.error}
          </p>
        )}

        {/* Best-selling products */}
        {!productsLoading &&
          (featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-9 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
              {featuredProducts.map((product, index) => {
                const productId = getProductId(product);
                const liked = Boolean(isLiked?.(productId));
                const displayName = getProductName(product.name);
                const imageSrc = getProductImageSrc(product.image);
                const productPath = `/product/${productId}`;

                return (
                  <article
                    key={productId ?? product.name}
                    className="group min-w-0"
                  >
                    {/* Product image */}
                    <div className="relative overflow-hidden rounded-[3px] bg-[#EDE3DD]">
                      <Link
                        to={productPath}
                        aria-label={`${text.viewProduct}: ${displayName}`}
                        className="relative block aspect-[0.91/1] overflow-hidden"
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={displayName}
                            loading="lazy"
                            style={{
                              objectPosition: product.position || "50% 50%",
                            }}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            onError={(event) => {
                              event.currentTarget.style.opacity = "0";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#79686A]">
                            {displayName}
                          </div>
                        )}

                        <span
                          className={`absolute top-3 text-[10px] tracking-[0.18em] text-[#493438]/75 sm:top-4 ${
                            isArabic ? "right-3 sm:right-4" : "left-3 sm:left-4"
                          }`}
                        >
                          0{index + 1}
                        </span>
                      </Link>

                      {/* Wishlist and cart buttons */}
                      <div
                        className={`absolute top-3 flex flex-col gap-2 sm:top-4 ${
                          isArabic ? "left-3 sm:left-4" : "right-3 sm:right-4"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleWishlist?.(productId)}
                          aria-label={
                            liked
                              ? `${text.removeWishlist}: ${displayName}`
                              : `${text.wishlist}: ${displayName}`
                          }
                          aria-pressed={liked}
                          className={actionClass}
                        >
                          <Heart
                            size={17}
                            strokeWidth={1.5}
                            className={
                              liked
                                ? "fill-[#A66D78] text-[#A66D78]"
                                : ""
                            }
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addToCart?.(
                              productId,
                              Array.isArray(product.sizes)
                                ? product.sizes[0] || ""
                                : "",
                              1
                            )
                          }
                          aria-label={`${text.add}: ${displayName}`}
                          className={actionClass}
                        >
                          <ShoppingBag size={17} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* Product details */}
                    <div
                      className={`mt-4 border-b border-[#E3D7D1] pb-4 transition-colors duration-300 group-hover:border-[#C99AA0] sm:mt-5 sm:pb-5 ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#A66D78] sm:text-[10px]"
                            style={{ fontFamily: font }}
                          >
                            {getCategoryName(product.category)}
                          </p>

                          <Link to={productPath} className="mt-1.5 block">
                            <h3
                              className="text-[22px] font-normal leading-tight text-[#493438] transition-colors duration-300 group-hover:text-[#A66D78] sm:text-[25px] lg:text-[27px]"
                              style={{
                                fontFamily: isArabic
                                  ? '"El Messiri", sans-serif'
                                  : '"Cormorant Garamond", Georgia, serif',
                              }}
                            >
                              {displayName}
                            </h3>
                          </Link>
                        </div>

                        <p
                          className="shrink-0 pt-4 text-[10px] font-medium text-[#493438] sm:text-[12px]"
                          style={{ fontFamily: font }}
                        >
                          {text.pricePrefix} {displayNumber(product.price)}
                        </p>
                      </div>

                      {Number(product.reviews) > 0 && (
                        <p
                          className="mt-2 text-[10px] text-[#8B7773]"
                          style={{ fontFamily: font }}
                        >
                          {displayNumber(product.reviews)} {text.reviews}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p
              role="status"
              className="py-10 text-center text-sm text-[#79686A]"
              style={{ fontFamily: font }}
            >
              {text.unavailable}
            </p>
          ))}

        {/* View all products */}
        <div className="mt-9 flex justify-center sm:mt-11">
          <Link
            to="/shop"
           className={`group translate-y-8 inline-flex items-center gap-3 border-b border-[#A66D78] pb-2.5 text-[10px] font-medium text-[#493438] transition-colors duration-300 hover:border-[#493438] hover:text-[#A66D78] sm:gap-4 sm:pb-3 sm:text-[11px] ${
              isArabic ? "" : "uppercase tracking-[0.17em]"
            }`}
            style={{ fontFamily: font }}
          >
            <span>{text.all}</span>

            <ArrowRight
              size={16}
              strokeWidth={1.4}
              className={`transition-transform duration-300 ${
                isArabic
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;

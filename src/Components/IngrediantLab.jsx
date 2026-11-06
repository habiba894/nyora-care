
import { useState } from "react";
import { useTranslation } from "react-i18next";

const products = [
  {
    id: "lip-balm",
    category: "LIPS",
    name: "Lip Balm",
    image: "/lipbalm-ingrediant.png",
    arabicImage: "/lipbalm-ingrediant-Arabic.png",
    arabicName: "ليب بالم",
    arabicCategory: "شفاه",
  },
  {
    id: "hair-balm",
    category: "HAIR",
    name: "Hair Balm",
    image: "/Hairbalm ingrediant.png",
    arabicImage: "/Hairbalm ingrediant-Arabic.png",
    arabicName: "هير بالم",
    arabicCategory: "شعر",
  },
  {
    id: "body-butter",
    category: "BODY",
    name: "Body Butter",
    image: "/bodybutter ingrediant.png",
    arabicImage: "/bodybutter ingrediant-Arabic.png",
    arabicName: "بادي باتر",
    arabicCategory: "جسم",
  },
  {
    id: "face-mask",
    category: "FACE",
    name: "Face Mask",
    image: "/Facemask ingrediant.png",
    arabicImage: "/Facemask ingrediant-Arabic.png",
    arabicName: "ماسك الوجه",
    arabicCategory: "وجه",
  },
  {
    id: "lip-scrub",
    category: "LIPS",
    name: "Strawberry Lip Scrub",
    image: "/lipscrub ingrediant.png",
    arabicImage: "/lipscrub ingrediant-Arabic.png",
    arabicName: "مقشر الشفاه بالفراولة",
    arabicCategory: "شفاه",
  },
];

export default function IngredientLab() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const product = products[selectedIndex];

  const currentImage = isArabic
    ? product.arabicImage
    : product.image;

  const selectProduct = (index) => {
    if (index === selectedIndex) return;

    setSelectedIndex(index);
    setImageError(false);
  };

  const labels = isArabic
    ? {
        eyebrow: "اكتشفي سر كل تركيبة",
        title: "سر الجمال في كل مكون",
        subtitle:
          "مكوّنات مختارة بعناية لبشرة وشعر أكثر جمالًا.",
        choose: "اختاري منتجك",
        previous: "المنتج السابق",
        next: "المنتج التالي",
        unavailable:
          "تأكدي من وجود صورة المنتج داخل مجلد public.",
        brand: "صُنع بعناية من نيورا",
        products: products.map((item) => item.arabicName),
      }
    : {
        eyebrow: "A CLOSER LOOK AT OUR FORMULAS",
        title: "Beauty in Every Ingredient",
        subtitle:
          "Thoughtfully chosen ingredients for your everyday beauty ritual.",
        choose: "CHOOSE YOUR PRODUCT",
        previous: "Previous product",
        next: "Next product",
        unavailable:
          "Make sure the product image is inside the public folder.",
        brand: "THOUGHTFULLY MADE BY NYORA",
        products: products.map((item) => item.name),
      };

  const previousProduct = () => {
    selectProduct(
      (selectedIndex - 1 + products.length) % products.length
    );
  };

  const nextProduct = () => {
    selectProduct((selectedIndex + 1) % products.length);
  };

  const font = isArabic
    ? '"El Messiri", sans-serif'
    : '"DM Sans", sans-serif';

  const headingFont = isArabic
    ? '"El Messiri", sans-serif'
    : '"Cormorant Garamond", Georgia, serif';

  return (
    <section
      id="ingredient-lab"
      lang={isArabic ? "ar" : "en"}
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#EDE3DD] px-5 py-14 text-[#493438] sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16"
    >
      <style>{`
        @keyframes ingredientImageEnter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .ingredient-main-image {
          animation: ingredientImageEnter 450ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .ingredient-main-image {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1400px]">

        {/* SECTION HEADER */}
        <header className="mx-auto mb-9 max-w-[720px] text-center sm:mb-11 lg:mb-12">
          <p
            className={`mb-3 text-[10px] font-medium text-[#A66D78] sm:text-[11px] ${
              isArabic ? "" : "uppercase tracking-[0.25em]"
            }`}
            style={{ fontFamily: font }}
          >
            {labels.eyebrow}
          </p>

          <h2
            className={`text-[clamp(2.4rem,4.5vw,3.8rem)] font-normal leading-[1.15] text-[#493438] ${
              isArabic ? "" : "tracking-[-0.035em]"
            }`}
            style={{ fontFamily: headingFont }}
          >
            {labels.title}
          </h2>

          <p
            className="mx-auto mt-3 max-w-[580px] text-[14px] leading-[1.9] text-[#79686A] sm:mt-4 sm:text-[15px]"
            style={{ fontFamily: font }}
          >
            {labels.subtitle}
          </p>

          <div className="mx-auto mt-5 h-px w-10 bg-[#A66D78]/70 sm:mt-6" />
        </header>

        {/* PRODUCT SELECTOR AND MAIN IMAGE */}
        <div className="grid items-center gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[285px_minmax(0,1fr)] xl:gap-11">

          {/* PRODUCT SELECTOR */}
          <aside className="order-2 min-w-0 lg:order-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p
                className={`text-[10px] font-medium text-[#A66D78] ${
                  isArabic ? "" : "uppercase tracking-[0.22em]"
                }`}
                style={{ fontFamily: font }}
              >
                {labels.choose}
              </p>

              <span className="text-[10px] tracking-[0.16em] text-[#826D68]">
                {String(selectedIndex + 1).padStart(2, "0")} / 05
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0">
              {products.map((item, index) => {
                const selected = selectedIndex === index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectProduct(index)}
                    aria-pressed={selected}
                    className={`group relative flex min-w-[155px] flex-1 items-center gap-3 rounded-[18px] border px-3 py-3 text-start transition-all duration-300 active:scale-[0.98] lg:min-w-0 lg:flex-none lg:rounded-[19px] lg:px-4 lg:py-3.5 ${
                      selected
                        ? "border-[#A66D78]/55 bg-[#F8F4EF] shadow-[0_6px_18px_rgba(73,52,56,0.05)]"
                        : "border-transparent bg-transparent hover:border-[#E3D7D1] hover:bg-[#F8F4EF]/55"
                    }`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8F4EF] transition-all duration-300 lg:h-[52px] lg:w-[52px] ${
                        selected
                          ? "ring-1 ring-[#A66D78] ring-offset-2 ring-offset-[#F8F4EF]"
                          : "ring-1 ring-[#DCCBC3] group-hover:ring-[#A66D78]/60"
                      }`}
                    >
                      <img
                        src={isArabic ? item.arabicImage : item.image}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] uppercase tracking-[0.15em] text-[#A66D78]">
                        {isArabic
                          ? item.arabicCategory
                          : item.category}
                      </span>

                      <span
                        className="mt-1 block text-[13px] leading-snug text-[#493438] sm:text-sm"
                        style={{ fontFamily: font }}
                      >
                        {labels.products[index]}
                      </span>
                    </span>

                    {selected && (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path
                            d={
                              isArabic
                                ? "M19 12H5m0 0 6-6m-6 6 6 6"
                                : "M5 12h14m0 0-6-6m6 6-6 6"
                            }
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* DESKTOP SELECTOR FOOTER */}
            <div className="mt-5 hidden items-center gap-3 border-t border-[#D8C7BF] pt-4 text-[10px] tracking-[0.15em] text-[#826D68] lg:flex">
              <span>
                {String(selectedIndex + 1).padStart(2, "0")}
              </span>

              <span className="h-px flex-1 bg-[#D8C7BF]" />

              <span>05</span>
            </div>
          </aside>

          {/* MAIN PRODUCT IMAGE */}
          <div className="order-1 min-w-0 lg:order-2">
            <div className="relative flex min-h-[250px] w-full items-center justify-center overflow-hidden rounded-[22px] border border-[#E3D7D1]/80 bg-[#F8F4EF]/55 px-3 py-5 sm:min-h-[330px] sm:rounded-[26px] sm:px-5 sm:py-6 lg:min-h-[440px] lg:px-7 lg:py-7 xl:min-h-[500px]">

              {/* SUBTLE DECORATIVE CIRCLES */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D8C7BF]/50"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D8C7BF]/40"
              />

              {!imageError ? (
                <img
                  key={`${product.id}-${isArabic ? "ar" : "en"}`}
                  src={currentImage}
                  alt={labels.products[selectedIndex]}
                  onError={() => setImageError(true)}
                  className="ingredient-main-image relative z-10 block h-auto max-h-[34vh] w-[88%] object-contain sm:max-h-[370px] sm:w-[78%] lg:max-h-[420px] lg:w-[78%] xl:max-h-[460px] xl:w-[80%]"
                  draggable="false"
                />
              ) : (
                <div className="relative z-10 flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
                  <span className="mb-4 text-4xl text-[#A66D78]">
                    ✳
                  </span>

                  <p className="max-w-xs text-sm leading-7 text-[#79686A]">
                    {labels.unavailable}
                  </p>

                  <p className="mt-2 break-all text-xs text-[#A66D78]">
                    {currentImage}
                  </p>
                </div>
              )}

              {/* IMAGE COUNTER */}
              <span
                className={`absolute top-4 text-[10px] tracking-[0.18em] text-[#826D68] sm:top-5 ${
                  isArabic ? "left-4 sm:left-5" : "right-4 sm:right-5"
                }`}
              >
                {String(selectedIndex + 1).padStart(2, "0")} — 05
              </span>

              {/* BRAND SIGNATURE */}
              <span
                className={`absolute bottom-4 text-[8px] tracking-[0.18em] text-[#A66D78]/80 sm:bottom-5 sm:text-[9px] ${
                  isArabic ? "left-4 sm:left-5" : "right-4 sm:right-5"
                }`}
                style={{ fontFamily: font }}
              >
                {labels.brand}
              </span>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className="mt-4 flex items-center justify-center gap-5 lg:hidden">
              <button
                type="button"
                onClick={previousProduct}
                aria-label={labels.previous}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C7BF] text-[#493438] transition-all duration-300 hover:bg-[#F8F4EF] active:scale-95 active:bg-[#A66D78]/10"
              >
                <span className="text-xl">
                  {isArabic ? "›" : "‹"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {products.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectProduct(index)}
                    aria-label={labels.products[index]}
                    aria-pressed={selectedIndex === index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? "w-7 bg-[#A66D78]"
                        : "w-2 bg-[#D8C5BC]"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextProduct}
                aria-label={labels.next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8C7BF] text-[#493438] transition-all duration-300 hover:bg-[#F8F4EF] active:scale-95 active:bg-[#A66D78]/10"
              >
                <span className="text-xl">
                  {isArabic ? "‹" : "›"}
                </span>
              </button>
            </div>

            {/* DESKTOP PROGRESS */}
            <div className="mt-5 hidden items-center justify-center gap-3 lg:flex">
              <span className="text-[10px] tracking-[0.15em] text-[#826D68]">
                {String(selectedIndex + 1).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-2">
                {products.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectProduct(index)}
                    aria-label={labels.products[index]}
                    aria-pressed={selectedIndex === index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? "w-8 bg-[#A66D78]"
                        : "w-2 bg-[#D8C5BC] hover:bg-[#A66D78]/60"
                    }`}
                  />
                ))}
              </div>

              <span className="text-[10px] tracking-[0.15em] text-[#826D68]">
                05
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

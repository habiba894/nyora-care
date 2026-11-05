import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Leaf, Droplets } from "lucide-react";

const heroContent = {
  en: {
    eyebrow: "Made with real ingredients",
    headingTop: "Discover Your",
    headingMid: "Natural",
    headingHighlight: "Glow.",
    description:
      "Natural oils, rich butters, and little moments of self-care — made just for you.",
    ctaText: "Explore rituals",
    image: "/hero-slide-2.jpg",
    imageAlt: "Nyora Beauty hair balm in soft natural light",
    ratingLabel: "Loved by 100+ customers",
  },

  ar: {
    eyebrow: "مكونات مختارة بعناية",
    headingTop: "اكتشفي",
    headingMid: "جمالك",
    headingHighlight: "الطبيعي",
    description:
      "زيوت طبيعية وزبدات غنية، ولحظات صغيرة من العناية بنفسك — معمولة مخصوص ليكي.",
    ctaText: "اكتشفي طقوس العناية",
    image: "/hero-slide-2-ar.jpg",
    imageAlt: "منتجات نيورا بيوتي بإضاءة طبيعية دافئة",
    ratingLabel: "محبوب من +١٠٠ عميلة",
  },
};

const benefits = [
  { icon: Leaf, en: "100% Natural", ar: "مكونات طبيعية" },
  { icon: null, en: "Egyptian Brand", ar: "براند مصري" },
  { icon: Droplets, en: "Rich Oils & Butters", ar: "زيوت وزبدات غنية" },
];

const categories = [
  { en: "Face", ar: "الوجه", href: "/shop?category=Face" },
  { en: "Lips", ar: "الشفاه", href: "/shop?category=Lips" },
  { en: "Body", ar: "الجسم", href: "/shop?category=Body" },
  { en: "Hair", ar: "الشعر", href: "/shop?category=Hair" },
];

const HeroSection = () => {
  const { i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");
  const language = isArabic ? "ar" : "en";
  const slide = heroContent[language];

  const headingFont = isArabic
    ? '"Noto Sans Arabic", sans-serif'
    : '"Cormorant Garamond", Georgia, serif';

  const bodyFont = isArabic
    ? '"Noto Sans Arabic", sans-serif'
    : '"DM Sans", sans-serif';

  const imagePosition = isArabic ? "left 30%" : "right 52%";

  const fadeMask = isArabic
    ? "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.12) 7%, #000 29%, #000 100%)"
    : "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 7%, #000 29%, #000 100%)";

  return (
    <section
      dir="ltr"
      lang={language}
      className="relative isolate min-h-screen overflow-hidden bg-[#F8F4EF] text-[#493438]"
    >
      {/* HERO ANIMATIONS */}
      <style>{`
        @keyframes nyoraFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nyora-fade-up { animation: nyoraFadeUp 0.8s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .nyora-fade-up { animation: none; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[#F8F4EF]" />

      {/* DESKTOP HERO IMAGE — FIRST IMAGE ONLY */}
      <div
        className={`pointer-events-none absolute inset-y-0 z-[1] hidden overflow-hidden lg:block ${
          isArabic ? "left-0" : "right-0"
        }`}
        style={{
          top: "-10px",
          bottom: "-12px",
          width: "78vw",
        }}
      >
        <img
          src={slide.image}
          alt={slide.imageAlt}
          draggable="false"
          className="absolute inset-0 h-full w-full select-none"
          style={{
            objectFit: "cover",
            objectPosition: imagePosition,
            WebkitMaskImage: fadeMask,
            maskImage: fadeMask,
          }}
        />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 mx-auto min-h-screen max-w-[1480px] px-3 pb-0 pt-[125px] sm:px-5 lg:px-3">
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="grid min-h-[calc(100vh-125px)] grid-cols-1 items-center gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:gap-0"
        >
          {/* TEXT CONTENT */}
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className={`relative z-30 min-w-0 pb-10 pt-5 lg:pb-20 lg:pt-0 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {/* EYEBROW */}
            <div
              className={`mb-7 flex items-center gap-3 ${
                isArabic
                  ? "flex-row-reverse justify-end"
                  : "justify-start"
              }`}
            >
              <span className="h-px w-14 shrink-0 bg-[#A66D78]" />

              <span
                className={`text-[12px] font-normal text-[#A66D78] ${
                  isArabic ? "" : "uppercase tracking-[0.28em]"
                }`}
                style={{ fontFamily: bodyFont }}
              >
                {slide.eyebrow}
              </span>
            </div>

            {/* HEADING */}
            <h1
              dir={isArabic ? "rtl" : "ltr"}
              className={`font-normal text-[#493438] ${
                isArabic
                  ? "max-w-[680px] text-[clamp(2.8rem,4.4vw,4.5rem)] leading-[1.5] tracking-normal"
                  : "max-w-[560px] text-[clamp(3.1rem,4.9vw,5.25rem)] leading-[1.08] tracking-[-0.035em]"
              }`}
              style={{
                textWrap: "balance",
                fontFamily: headingFont,
                fontWeight: 400,
              }}
            >
              {isArabic ? (
                <>
                  <span>{slide.headingTop} </span>
                  <span>{slide.headingMid} </span>
                  <span
                    className="inline-block text-[#A66D78]"
                    style={{
                      fontFamily: headingFont,
                      fontStyle: "normal",
                      fontWeight: 500,
                      letterSpacing: "normal",
                      paddingInline: "0.04em",
                      paddingBottom: "0.08em",
                    }}
                  >
                    {slide.headingHighlight}
                  </span>
                </>
              ) : (
                <>
                  <span>{slide.headingTop}</span>
                  <br />
                  <span>{slide.headingMid}</span>
                  <br />
                  <span
                    className="text-[#A66D78]"
                    style={{
                      fontFamily: headingFont,
                      fontStyle: "italic",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      display: "inline-block",
                      paddingRight: "0.08em",
                      paddingBottom: "0.08em",
                    }}
                  >
                    {slide.headingHighlight}
                  </span>
                </>
              )}
            </h1>

            {/* DESCRIPTION */}
            <p
              dir={isArabic ? "rtl" : "ltr"}
              className={`mt-6 max-w-[520px] text-[17px] font-normal leading-[2] text-[#715F5D] sm:text-[18px] sm:leading-[2.05] ${
                isArabic ? "text-pretty" : ""
              }`}
              style={{ fontFamily: bodyFont, fontWeight: 400 }}
            >
              {slide.description}
            </p>

            {/* CTA BUTTON */}
            <div className="mt-7 sm:mt-8">
              <Link
                to="/shop"
                dir={isArabic ? "rtl" : "ltr"}
                className={`group inline-flex max-w-full items-center gap-4 rounded-full bg-[#493438] px-5 py-3.5 text-[12px] font-normal !text-white shadow-[0_15px_35px_rgba(73,52,56,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#62474D] hover:shadow-[0_20px_40px_rgba(73,52,56,0.24)] sm:px-8 sm:py-4 ${
  isArabic ? "" : "uppercase tracking-[0.2em]"
}`}
                style={{ fontFamily: bodyFont }}
              >
                <span>{slide.ctaText}</span>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F8F4EF] text-[#493438] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight
                    size={17}
                    strokeWidth={1.5}
                    className={isArabic ? "rotate-180" : ""}
                  />
                </span>
              </Link>

              {/* RATING */}
<div
  className={`nyora-fade-up mt-6 flex items-center gap-3.5 ${
    isArabic ? "flex-row-reverse justify-end" : ""
  }`}
  style={{ animationDelay: "0.3s" }}
>
  <div className="flex items-center text-[20px] tracking-[0.12em] text-[#C9929B]">
    ★★★★★
  </div>

  <span
    className="text-[17px] font-medium text-[#493438]"
    style={{ fontFamily: bodyFont }}
  >
    4.9
  </span>

  <span className="h-5 w-px bg-[#D9C6BE]" />

  <span
    className="text-[15px] font-medium text-[#493438]"
    style={{ fontFamily: bodyFont }}
  >
    {slide.ratingLabel}
  </span>
</div>
            </div>

            {/* BRAND BENEFITS */}
            <div className="mt-9 flex flex-wrap items-center gap-y-4 sm:mt-11 lg:mt-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.en} className="flex items-center">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {Icon ? (
                        <Icon
                          size={21}
                          strokeWidth={1.4}
                          className="shrink-0 text-[#A66D78]"
                        />
                      ) : (
                        <svg
                          viewBox="0 0 64 64"
                          className="h-[25px] w-[25px] shrink-0 text-[#A66D78]"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M16 52C21 42 28 31 48 13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M31 31C25 25 25 19 31 14C37 20 37 26 31 31Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M37 25C40 18 46 15 53 17C50 24 45 27 37 25Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M24 40C18 35 17 30 21 25C27 29 28 35 24 40Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M29 36C35 30 41 30 45 34C40 40 34 41 29 36Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 47C14 43 13 39 16 35C21 39 22 43 19 47Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 44C27 40 32 41 35 44C31 49 26 49 22 44Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}

                      <span
                        className={`text-[11px] font-normal text-[#493438] sm:text-[12px] ${
                          isArabic
                            ? ""
                            : "uppercase tracking-[0.1em] sm:tracking-[0.14em]"
                        }`}
                        style={{ fontFamily: bodyFont }}
                      >
                        {isArabic ? benefit.ar : benefit.en}
                      </span>
                    </div>

                    {index !== benefits.length - 1 && (
                      <span className="mx-3 hidden h-6 w-px bg-[#E3D7D1] sm:mx-4 sm:block lg:mx-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE IMAGE — FIRST IMAGE ONLY */}
          <div className="relative min-w-0 lg:hidden">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="w-full"
              style={{
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* CATEGORY BAR AND ORIGINAL WAVE */}
        <div className="relative left-1/2 z-20 -mx-0 -mt-14 w-screen -translate-x-1/2 bg-[#EDE3DD] px-5 pb-7 pt-9 shadow-[0_-8px_25px_rgba(73,52,56,0.025)] sm:px-8 lg:px-12">
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[65px] w-full -translate-y-[calc(100%-1px)]"
            viewBox="0 0 1440 65"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 65 C175 30 340 14 520 25 C730 38 835 57 1035 45 C1205 35 1330 14 1440 8 L1440 65 Z"
              fill="#DCC8C0"
              opacity="0.38"
              transform="translate(0 -5)"
            />
            <path
              d="M0 65 C180 28 360 5 560 12 C760 19 860 52 1050 43 C1210 36 1330 13 1440 5 L1440 65 Z"
              fill="#EDE3DD"
            />
          </svg>

          <div
            dir={isArabic ? "rtl" : "ltr"}
            className="relative z-30 mx-auto flex max-w-[850px] flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10 lg:gap-x-12"
          >
            {categories.map((category, index) => (
              <div
                key={category.en}
                className="flex items-center gap-4 sm:gap-6"
              >
                <Link
                  to={category.href}
                  className="whitespace-nowrap text-[17px] font-normal text-[#493438] transition-colors duration-300 hover:text-[#A66D78] sm:text-[19px]"
                  style={{ fontFamily: bodyFont }}
                >
                  {isArabic ? category.ar : category.en}
                </Link>

                {index !== categories.length - 1 && (
                  <span className="hidden h-px w-5 bg-[#E3D7D1] sm:block lg:w-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
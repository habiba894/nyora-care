import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Leaf, Droplets } from "lucide-react";

const slides = {
  en: [
    {
      eyebrow: "Made with real ingredients",
      headingTop: "Discover Your",
      headingMid: "Natural",
      headingHighlight: "Glow.",
      description:
        "Natural oils, rich butters, and little moments of self-care — made just for you.",
      ctaText: "Explore rituals",
      image: "/hero-slide-2.jpg",
      imageAlt: "Nyora Beauty hair balm in soft natural light",
    },
    {
      eyebrow: "Natural beauty rituals",
      headingTop: "Beauty",
      headingMid: "that feels",
      headingHighlight: "like you.",
      description:
        "Thoughtfully made rituals for your lips, body, hair and face — because everyday care should feel a little special.",
      ctaText: "Shop the collection",
      image: "/hero-slide4.png",
      imageAlt:
        "Nyora Beauty lip scrub, hair balm, face mask and lip gloss with pink peonies on marble",
    },
    {
      eyebrow: "Egyptian made, globally loved",
      headingTop: "Luxury,",
      headingMid: "bottled",
      headingHighlight: "for you.",
      description:
        "Every jar and bottle is made with care, so your everyday beauty routine feels a little more indulgent.",
      ctaText: "Discover the range",
      image: "/hero-slide-3.jpg",
      imageAlt: "Nyora Beauty product with warm shadow and natural light",
    },
  ],
  ar: [
    {
      eyebrow: "مكونات مختارة بعناية",
      headingTop: "اكتشفي",
      headingMid: "جمالك",
      headingHighlight: "الطبيعي",
      description:
        "زيوت طبيعية وزبدات غنية، ولحظات صغيرة من العناية بنفسك — معمولة مخصوص ليكي.",
      ctaText: "اكتشفي طقوس العناية",
      image: "/hero-slide-2-ar.jpg",
      imageAlt: "منتجات نيورا بيوتي بإضاءة طبيعية دافئة",
    },
    {
      eyebrow: "طقوس جمال طبيعية",
      headingTop: "جمال",
      headingMid: "يحسّسك",
      headingHighlight: "إنك إنتي",
      description:
        "طقوس معمولة بحب للشفايف والجسم والشعر والوش — لأن العناية اليومية تستاهل تبقى مميزة.",
      ctaText: "تسوقي المجموعة",
      image: "/hero-slide4.png",
      imageAlt: "منتجات نيورا بيوتي على رخام مع بيوني وردي",
    },
    {
      eyebrow: "صناعة مصرية، بحب عالمي",
      headingTop: "فخامة",
      headingMid: "جوه",
      headingHighlight: "إزازة",
      description:
        "كل برطمان وإزازة معمولين بعناية، عشان روتين جمالك اليومي يبقى أدلع شوية.",
      ctaText: "اكتشفي المنتجات",
      image: "/hero-slide-3.jpg",
      imageAlt: "منتج من نيورا بيوتي بإضاءة طبيعية دافئة",
    },
  ],
};

const ratingLabels = {
  en: "Loved by 100+ customers",
  ar: "محبوب من +١٠٠ عميلة",
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

const BrandIcon = () => (
  <svg
    viewBox="0 0 64 64"
    className="h-6 w-6 shrink-0 text-[#A66D78]"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M16 52C21 42 28 31 48 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M31 31C25 25 25 19 31 14C37 20 37 26 31 31Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M37 25C40 18 46 15 53 17C50 24 45 27 37 25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 40C18 35 17 30 21 25C27 29 28 35 24 40Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M29 36C35 30 41 30 45 34C40 40 34 41 29 36Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 47C14 43 13 39 16 35C21 39 22 43 19 47Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 44C27 40 32 41 35 44C31 49 26 49 22 44Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeroSection = () => {
  const { i18n } = useTranslation();
  const [active, setActive] = useState(0);

  const isArabic = i18n.language.startsWith("ar");
  const language = isArabic ? "ar" : "en";
  const slideList = slides[language];
  const slide = slideList[active];

  // AUTO SLIDE
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.en.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [active]);

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
      <style>{`
        @keyframes nyoraFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes nyoraFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .nyora-fade-up {
          animation: nyoraFadeUp 0.8s ease-out both;
        }

        .nyora-fade-in {
          animation: nyoraFadeIn 1s ease-in-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .nyora-fade-up,
          .nyora-fade-in {
            animation: none;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[#F8F4EF]" />

      {/* DESKTOP HERO IMAGE */}
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
          key={`desktop-${language}-${active}`}
          src={slide.image}
          alt={slide.imageAlt}
          draggable="false"
          className="nyora-fade-in absolute inset-0 h-full w-full select-none"
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
            className={`relative z-30 min-w-0 pb-8 pt-5 lg:pb-16 lg:pt-0 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {/* Animated part: changes with every slide */}
            <div key={`text-${language}-${active}`} className="nyora-fade-up">
              {/* EYEBROW */}
              <div
                className={`mb-5 flex items-center gap-3 ${
                  isArabic ? "flex-row-reverse justify-end" : "justify-start"
                }`}
              >
                <span className="h-px w-12 shrink-0 bg-[#A66D78]" />

                <span
                  className={`text-[12px] font-normal text-[#A66D78] ${
                    isArabic ? "" : "uppercase tracking-[0.25em]"
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
                      className="inline-block text-[#A66D78]"
                      style={{
                        fontFamily: headingFont,
                        fontStyle: "italic",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
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
                className={`mt-5 max-w-[520px] text-[16px] font-normal leading-[1.9] text-[#715F5D] sm:text-[17px] ${
                  isArabic ? "text-pretty" : ""
                }`}
                style={{ fontFamily: bodyFont, fontWeight: 400 }}
              >
                {slide.description}
              </p>

              {/* CTA BUTTON */}
              <div className="mt-6 sm:mt-7">
                <Link
                  to="/shop"
                  dir={isArabic ? "rtl" : "ltr"}
                  className={`group inline-flex max-w-full items-center gap-4 rounded-full bg-[#493438] px-5 py-3.5 text-[12px] font-normal !text-white shadow-[0_12px_30px_rgba(73,52,56,0.16)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#62474D] hover:!text-white sm:px-8 sm:py-4 ${
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
              </div>
            </div>

            {/* RATING (fixed, doesn't change with slides) */}
            <div
              className={`nyora-fade-up mt-5 flex flex-wrap items-center gap-3 ${
                isArabic ? "flex-row-reverse justify-end" : ""
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center text-[22px] tracking-[0.1em] text-[#C9929B]">
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
                {ratingLabels[language]}
              </span>
            </div>

            {/* BRAND BENEFITS */}
            <div className="mt-7 flex flex-wrap items-center gap-y-3 sm:mt-8 lg:mt-9">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.en} className="flex items-center">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {Icon ? (
                        <Icon
                          size={22}
                          strokeWidth={1.4}
                          className="shrink-0 text-[#A66D78]"
                        />
                      ) : (
                        <BrandIcon />
                      )}

                      <span
                        className={`text-[12px] font-normal text-[#493438] sm:text-[13px] ${
                          isArabic
                            ? ""
                            : "uppercase tracking-[0.08em] sm:tracking-[0.12em]"
                        }`}
                        style={{ fontFamily: bodyFont }}
                      >
                        {isArabic ? benefit.ar : benefit.en}
                      </span>
                    </div>

                    {index !== benefits.length - 1 && (
                      <span className="mx-2.5 hidden h-5 w-px bg-[#E3D7D1] sm:mx-3 sm:block lg:mx-4" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* SLIDE DOTS */}
            <div
              className={`mt-7 flex items-center gap-3 ${
                isArabic ? "justify-start" : ""
              }`}
            >
              {slideList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-[6px] rounded-full transition-all duration-500 ${
                    i === active
                      ? "w-8 bg-[#A66D78]"
                      : "w-[6px] bg-[#A66D78]/25 hover:bg-[#A66D78]/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* MOBILE IMAGE - FULL IMAGE, NO CROPPING */}
          <div className="relative z-10 -mx-3 mt-1 min-w-0 overflow-hidden sm:-mx-5 lg:hidden">
            <img
              key={`mobile-${language}-${active}`}
              src={slide.image}
              alt={slide.imageAlt}
              draggable="false"
              className="nyora-fade-in block h-auto w-full select-none"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
        </div>

        {/* CATEGORY BAR AND WAVE */}
        <div className="relative left-1/2 z-20 -mx-0 -mt-8 w-screen -translate-x-1/2 bg-[#EDE3DD] px-5 pb-6 pt-8 shadow-[0_-8px_25px_rgba(73,52,56,0.025)] sm:-mt-9 sm:px-8 sm:pb-6 sm:pt-8 lg:mt-5 lg:px-12">
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[38px] w-full -translate-y-[calc(100%-1px)] sm:h-[46px] lg:h-[65px]"
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
            className="relative z-30 mx-auto flex max-w-[850px] flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 lg:gap-x-12"
          >
            {categories.map((category, index) => (
              <div
                key={category.en}
                className="flex items-center gap-4 sm:gap-6"
              >
                <Link
                  to={category.href}
                  className="whitespace-nowrap text-[16px] font-normal text-[#493438] transition-colors duration-300 hover:text-[#A66D78] sm:text-[18px]"
                  style={{ fontFamily: bodyFont }}
                >
                  {isArabic ? category.ar : category.en}
                </Link>

                {index !== categories.length - 1 && (
                  <span className="hidden h-px w-5 bg-[#D9C6BE] sm:block lg:w-8" />
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
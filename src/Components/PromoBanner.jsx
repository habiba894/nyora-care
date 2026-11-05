
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const VISIBLE_SLIDES = 3.2;
const TRANSITION_DURATION = 1000;

const PromoBanner = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const images = [
    "/pic5.png",
    "/pic6.png",
    "/pic4.png",
    "/pic7.png",
  ];

  const totalSlides = images.length;

  // Keep several copies for a seamless infinite carousel.
  const extendedImages = [
    ...images,
    ...images,
    ...images,
    ...images,
  ];

  const [currentSlide, setCurrentSlide] = useState(totalSlides);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Each slide occupies an equal fraction of the track.
  const slideWidth = 100 / VISIBLE_SLIDES;
  const trackWidth = extendedImages.length * slideWidth;

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // SEAMLESS INFINITE LOOP
  const handleTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;

    if (currentSlide >= totalSlides * 2) {
      setIsTransitioning(false);
      setCurrentSlide(totalSlides);
    } else if (currentSlide < totalSlides) {
      setIsTransitioning(false);
      setCurrentSlide(totalSlides + totalSlides - 1);
    }
  };

  // Re-enable animation after resetting the position.
  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  // NEXT
  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  // PREVIOUS
  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  // CURRENT DOT
  const actualIndex =
    ((currentSlide - totalSlides) % totalSlides + totalSlides) %
    totalSlides;

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentSlide(totalSlides + index);
  };

  return (
    <section
      lang={isArabic ? "ar" : "en"}
      className="relative overflow-hidden bg-[#F8F4EF] pb-24 pt-0 sm:pb-28 sm:pt-4"
    >
      {/* CAROUSEL — Keep its direction LTR in both languages. */}
      <div
        dir="ltr"
        className="relative w-full overflow-hidden"
      >
        {/* MOVING TRACK */}
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex ${
            isTransitioning
              ? "transition-transform duration-1000 ease-in-out"
              : ""
          }`}
          style={{
            width: `${trackWidth}%`,
            transform: `translateX(-${
              currentSlide * (100 / extendedImages.length)
            }%)`,
            direction: "ltr",
          }}
        >
          {extendedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="shrink-0 px-[4px]"
              style={{
                width: `${100 / extendedImages.length}%`,
              }}
            >
              <div className="relative h-[380px] overflow-hidden rounded-[20px] bg-[#EDE5DE] sm:h-[420px] lg:h-[450px]">
                <img
                  src={image}
                  alt={`Nyora Beauty ${((index % totalSlides) + 1)}`}
                  className="h-full w-full object-cover"
                  draggable="false"
                />

                {/* VERY SOFT OVERLAY */}
                <div className="pointer-events-none absolute inset-0 bg-[#493438]/[0.04]" />
              </div>
            </div>
          ))}
        </div>

        {/* FIXED CENTER CARD */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
        >
          <div className="pointer-events-auto w-full max-w-[440px] rounded-[18px] bg-[#F8F4EF] px-8 py-9 text-center shadow-[0_12px_30px_rgba(73,52,56,0.08)] sm:px-10 sm:py-10">
            {/* SMALL HEADING */}
            <span
              className={`text-[12px] font-semibold text-[#A66D78] ${
                isArabic ? "" : "uppercase tracking-[0.30em]"
              }`}
            >
              {isArabic ? "إحنا هنا عشان نساعدك" : "We're here to help"}
            </span>

            {/* MAIN HEADING */}
            <h2
              className={`mt-4 font-display font-normal leading-[1.3] text-[#493438] ${
                isArabic ? "tracking-normal" : "tracking-[-0.015em]"
              }`}
              style={{
                fontSize: "clamp(2rem, 3vw, 2.5rem)",
                fontFamily: isArabic
                  ? '"DM Sans", sans-serif'
                  : '"Cormorant Garamond", Georgia, serif',
              }}
            >
              {isArabic
                ? "ابدئي رحلة جمالك مع نيورا"
                : "Start Your Beauty Ritual with Nyora"}
            </h2>

            {/* BUTTON */}
            <a
              href="#shop"
              className={`mt-6 inline-flex items-center justify-center rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-semibold text-white transition-all duration-300 hover:bg-[#62474D] ${
                isArabic ? "" : "uppercase tracking-[0.20em]"
              }`}
            >
              {isArabic ? "تسوّقي كل المنتجات" : "Shop all"}
            </a>
          </div>
        </div>

        {/* LEFT ARROW */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label={isArabic ? "الصورة السابقة" : "Previous slide"}
          className="absolute left-5 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F8F4EF]/90 text-[#493438] transition-all duration-300 hover:scale-105 hover:bg-[#F8F4EF]"
        >
          <span className="text-[24px] leading-none">‹</span>
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label={isArabic ? "الصورة التالية" : "Next slide"}
          className="absolute right-5 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#F8F4EF]/90 text-[#493438] transition-all duration-300 hover:scale-105 hover:bg-[#F8F4EF]"
        >
          <span className="text-[24px] leading-none">›</span>
        </button>
      </div>

      {/* DOTS */}
      <div className="mt-6 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={
              isArabic
                ? `الانتقال إلى الصورة ${index + 1}`
                : `Go to slide ${index + 1}`
            }
            aria-current={actualIndex === index ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              actualIndex === index
                ? "w-7 bg-[#A66D78]"
                : "w-1.5 bg-[#D8CBC5]"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;

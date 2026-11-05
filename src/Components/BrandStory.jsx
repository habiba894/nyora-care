import { useTranslation } from "react-i18next";

const PANEL = "#F8F4EF";
const STORY_IMAGE = "/hero-slide-4.jpg";

// Solid cream panel edge
const WAVE_EDGE =
  "M1 0 C2 4 4 16 6 25 C8 33 10 42 13 50 C17 59 21 67 26 76 C31 85 37 93 44 102 C50 111 58 120 65 128 C72 137 80 146 87 155 C93 163 100 172 106 181 C111 189 116 198 121 207 C125 216 129 224 131 233 C134 242 136 251 138 259 C139 268 140 277 140 285 C139 294 138 303 137 312 C135 320 133 329 130 338 C128 347 124 355 122 364 C120 372 117 381 116 389 C115 398 115 406 115 413 C115 421 115 428 116 435 C117 442 118 449 120 456 C122 463 124 470 127 477 C131 484 136 491 141 499 C146 506 153 514 159 523 C166 531 172 539 178 548 C183 556 188 565 191 574 C195 582 197 591 199 600 C201 608 201 617 201 626 C202 635 202 643 202 652 C203 661 203 670 205 678 C206 687 208 696 210 704 C212 713 214 722 217 731 C219 739 222 748 225 757 C229 765 233 774 237 783 C242 791 247 800 252 808 C258 816 265 824 272 832 C279 840 291 851 295 855";

const WAVE_FILL = `${WAVE_EDGE} L340 855 L340 0 Z`;

// Thin pink line: inside the panel at the top, then becomes the outer edge of the frosted band
const WAVE_LINE =
  "M25 3 C28 11 37 38 44 54 C52 71 59 88 67 102 C76 116 86 128 95 139 C104 150 114 158 123 168 C131 177 139 185 146 194 C152 203 158 211 162 220 C166 229 170 237 172 246 C174 255 175 264 175 272 C175 281 174 290 172 299 C170 307 167 316 162 325 C158 333 153 342 147 351 C142 360 136 368 130 377 C124 385 118 393 111 402 C105 410 97 418 91 427 C84 435 77 444 72 454 C68 463 63 474 62 485 C61 495 62 508 67 519 C71 531 79 542 88 553 C97 564 110 574 122 586 C134 598 148 610 160 625 C171 639 182 656 191 673 C200 689 208 708 215 725 C223 742 229 759 236 775 C244 790 251 804 260 817 C268 831 282 849 287 855";

// Frosted cashmere band between the pink line and the panel edge
const WAVE_BAND =
  "M91 427 C88 431 77 444 72 454 C68 463 63 474 62 485 C61 495 62 508 67 519 C71 531 79 542 88 553 C97 564 110 574 122 586 C134 598 148 610 160 625 C171 639 182 656 191 673 C200 689 208 708 215 725 C223 742 233 766 236 775 C236 776 239 786 237 783 C235 780 229 765 225 757 C222 748 219 739 217 731 C214 722 212 713 210 704 C208 696 206 687 205 678 C203 670 203 661 202 652 C202 643 202 635 201 626 C201 617 201 608 199 600 C197 591 195 582 191 574 C188 565 183 556 178 548 C172 539 166 531 159 523 C153 514 146 506 141 499 C136 491 131 484 127 477 C124 470 122 463 120 456 C118 449 117 439 116 435 Z";

const BrandStory = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const values = isArabic
    ? [
        "مكونات طبيعية ١٠٠٪",
        "براند مصري نفتخر بيه",
        "زيوت وزبدات غنية",
      ]
    : [
        "100% Natural ingredients",
        "Proudly Egyptian brand",
        "Rich oils & butters",
      ];

  // Arabic: image on the left, text on the right (as before)
  // English: text on the left, image on the right (mirrored)
  const imageBoxSide = isArabic ? "lg:left-0" : "lg:right-0";

  const imageInnerSide = isArabic
    ? "lg:-left-[5%] lg:[-webkit-mask-image:linear-gradient(to_right,black_94%,transparent)] lg:[mask-image:linear-gradient(to_right,black_94%,transparent)]"
    : "lg:left-auto lg:-right-[5%] lg:[-webkit-mask-image:linear-gradient(to_left,black_94%,transparent)] lg:[mask-image:linear-gradient(to_left,black_94%,transparent)]";

  const panelSide = isArabic
    ? "lg:ml-auto lg:rounded-l-none lg:rounded-r-[30px] lg:pl-8 lg:pr-10 xl:pr-14"
    : "lg:mr-auto lg:rounded-r-none lg:rounded-l-[30px] lg:pr-8 lg:pl-10 xl:pl-14";

  const creamBodySide = isArabic
    ? "left-[10%] right-0 rounded-r-[30px]"
    : "right-[10%] left-0 rounded-l-[30px]";

  const waveSide = isArabic ? "-left-[42%]" : "-right-[42%]";

  return (
    <section
      id="our-story"
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="scroll-mt-32 overflow-hidden bg-[#EDE3DD] px-4 py-10 sm:px-7 sm:py-14 lg:px-12 lg:py-16"
    >
      <div
        dir="ltr"
        className="relative mx-auto max-w-[1560px] lg:min-h-[820px]"
      >
        {/* PRODUCT IMAGE (same top and bottom as the story panel) */}
        <div
          className={`relative h-[420px] overflow-hidden rounded-[26px] bg-[#F6E3D8] shadow-[0_24px_60px_rgba(73,52,56,0.10)] sm:h-[520px] lg:absolute lg:bottom-0 lg:top-0 lg:h-auto lg:w-[66%] ${imageBoxSide}`}
        >
          <img
            src={STORY_IMAGE}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl"
          />

          <img
            src={STORY_IMAGE}
            alt={
              isArabic
                ? "منتجات نيورا بيوتي للعناية"
                : "Nyora Beauty product collection"
            }
            className={`absolute inset-y-0 left-0 h-full w-full object-cover object-center lg:w-[90%] ${imageInnerSide}`}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF8F2]/10 via-transparent to-[#C98E77]/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-[#F4D4C2]/10 to-transparent" />
        </div>

        {/* STORY PANEL */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className={`relative z-10 -mt-8 rounded-[26px] bg-[#F8F4EF] px-7 py-12 shadow-[0_24px_60px_rgba(73,52,56,0.08)] sm:px-11 sm:py-16 lg:mt-0 lg:flex lg:min-h-[820px] lg:w-[37%] lg:items-center lg:bg-transparent lg:py-14 lg:shadow-none ${panelSide} ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {/* Desktop-only cream body, starts next to the curve */}
          <div
            aria-hidden="true"
            style={{ backgroundColor: PANEL }}
            className={`pointer-events-none absolute inset-y-0 hidden lg:block ${creamBodySide}`}
          />

          {/* WAVE: SHADOW + FROSTED BAND + CREAM SURFACE + LINES + LEAF */}
          <svg
            viewBox="0 0 300 855"
            preserveAspectRatio="none"
            style={{ transform: isArabic ? undefined : "scaleX(-1)" }}
            className={`pointer-events-none absolute top-0 hidden h-full w-[50%] overflow-visible lg:block ${waveSide}`}
            aria-hidden="true"
          >
            <defs>
              <filter
                id="nyora-wave-shadow"
                x="-40%"
                y="-5%"
                width="180%"
                height="110%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation="6" />
              </filter>

              {/* Cuts the shadow exactly where the cream surface ends, so no vertical seam shows */}
              <clipPath id="nyora-shadow-clip">
                <rect x="-300" y="-80" width="640" height="1015" />
              </clipPath>

              <filter
                id="nyora-band-blur"
                x="-10%"
                y="-5%"
                width="120%"
                height="110%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur stdDeviation="1.2" />
              </filter>

              {/* Cashmere: translucent pink-beige near the line, fading into the panel colour */}
              <linearGradient id="nyora-band-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#F1D5CB" stopOpacity="0.55" />
                <stop offset="0.45" stopColor="#F8E6DF" stopOpacity="0.85" />
                <stop offset="1" stopColor={PANEL} stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Soft shadow toward the image */}
            <g clipPath="url(#nyora-shadow-clip)">
              <path
                d={WAVE_FILL}
                fill="#8D625D"
                opacity="0.1"
                transform="translate(-3 2)"
                filter="url(#nyora-wave-shadow)"
              />
            </g>

            {/* Frosted cashmere band, sitting on the photo */}
            <path
              d={WAVE_BAND}
              fill="url(#nyora-band-grad)"
              filter="url(#nyora-band-blur)"
            />

            {/* Solid cream surface */}
            <path d={WAVE_FILL} fill={PANEL} />

            {/* Pink line */}
            <path
              d={WAVE_LINE}
              fill="none"
              stroke="#D4A5A3"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Second thin line next to it */}
            <path
              d={WAVE_LINE}
              transform="translate(7 0)"
              fill="none"
              stroke="#E6C6C2"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {/* Botanical leaf: traced from the original design */}
            <g
              transform="translate(76 285) scale(0.218)"
              fill="none"
              stroke="#B5687C"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* stem */}
              <path
                d="M40 650C140 590 200 550 262 500C330 445 380 400 420 350C460 295 500 250 535 195"
                vectorEffect="non-scaling-stroke"
              />

              {/* leaves */}
              <g vectorEffect="non-scaling-stroke">
                <path vectorEffect="non-scaling-stroke" d="M255 492Q334 401 308 283Q229 374 255 492Z" />
                <path vectorEffect="non-scaling-stroke" d="M270 506Q373 541 470 492Q367 457 270 506Z" />
                <path vectorEffect="non-scaling-stroke" d="M408 347Q470 255 437 150Q375 242 408 347Z" />
                <path vectorEffect="non-scaling-stroke" d="M426 353Q532 365 612 294Q506 282 426 353Z" />
                <path vectorEffect="non-scaling-stroke" d="M530 204Q632 169 642 62Q540 97 530 204Z" />
              </g>

              {/* faint centre lines inside each leaf */}
              <g opacity="0.4">
                <path vectorEffect="non-scaling-stroke" d="M255 492L292 346" />
                <path vectorEffect="non-scaling-stroke" d="M270 506L410 496" />
                <path vectorEffect="non-scaling-stroke" d="M408 347L428 209" />
                <path vectorEffect="non-scaling-stroke" d="M426 353L556 312" />
                <path vectorEffect="non-scaling-stroke" d="M530 204L608 105" />
              </g>
            </g>
          </svg>

          {/* TEXT CONTENT */}
          <div className="relative z-10 mx-auto w-full max-w-[520px]">
            <span
              className={`block text-[11px] font-semibold text-[#C47778] sm:text-[13px] ${
                isArabic ? "" : "uppercase tracking-[0.34em]"
              }`}
            >
              {isArabic ? "نيورا بيوتي" : "NYORA BEAUTY"}
            </span>

            <h2
              className="mt-6 font-normal leading-[1.02] text-[#493438] sm:mt-7"
              style={{
                fontFamily: isArabic
                  ? '"DM Sans", sans-serif'
                  : '"Cormorant Garamond", Georgia, serif',
                fontSize: isArabic
                  ? "clamp(2.6rem, 4.3vw, 4.4rem)"
                  : "clamp(3rem, 5.3vw, 6.2rem)",
                letterSpacing: isArabic ? "normal" : "-0.035em",
              }}
            >
              {isArabic ? (
                <>
                  حكايتنا
                  <br />
                  بتبدأ هنا
                </>
              ) : (
                <>
                  Our Story
                  <br />
                  Starts Here
                </>
              )}
            </h2>

            <p className="mt-7 max-w-[490px] text-[15px] leading-[1.85] text-[#725F60] sm:text-[17px] sm:leading-[1.9] lg:text-[20px] lg:leading-[1.6]">
              {isArabic ? (
                "نيورا بيوتي مش مجرد منتجات؛ دي فكرة وطقوس عناية ووعد بالجمال الطبيعي، وكل ده بإلهام من الطبيعة."
              ) : (
                <>
                  Nyora Beauty is not just products — it's a belief,
                  <br className="hidden lg:block" /> a ritual, and a promise
                  inspired by nature.
                </>
              )}
            </p>

           {/* BRAND VALUES */}
<ul className="mt-7 space-y-3 sm:mt-8 sm:space-y-3.5">
  {values.map((value, index) => (
    <li
      key={value}
      className="group flex cursor-default items-center gap-4 text-[13px] text-[#493438] sm:gap-5 sm:text-[16px] lg:text-[19px]"
    >
      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#F4DFD8] text-[#A96670] transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#EFCFC6] group-hover:shadow-[0_8px_20px_rgba(169,102,112,0.20)] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-[60px] sm:w-[60px]">
        {index === 0 && (
          <svg
            viewBox="0 0 32 32"
            className="h-7 w-7 transition-transform duration-500 ease-out group-hover:rotate-[10deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M26 5C14 5 6 11 6 20c0 3 2 5 5 6C21 23 26 15 26 5Z" />
            <path d="M4 29C10 20 16 14 23 9" />
            <path d="M13 19L12 13M17 15L22 15" />
          </svg>
        )}

        {index === 1 && (
          <svg
            viewBox="0 0 32 32"
            className="h-7 w-7 transition-transform duration-500 ease-out group-hover:rotate-[10deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="2.6" />
            {[0, 72, 144, 216, 288].map((angle) => (
              <path
                key={angle}
                d="M16 13.4C11.8 10 11.8 5.4 16 2.4C20.2 5.4 20.2 10 16 13.4Z"
                transform={`rotate(${angle} 16 16)`}
              />
            ))}
          </svg>
        )}

        {index === 2 && (
          <svg
            viewBox="0 0 32 32"
            className="h-7 w-7 transition-transform duration-500 ease-out group-hover:rotate-[10deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 3C12 10 7 16 7 21a9 9 0 0 0 18 0c0-5-5-11-9-18Z" />
          </svg>
        )}
      </span>

      <span>{value}</span>
    </li>
  ))}
</ul>

            {/* SHOP BUTTON */}
<div className="mt-8 sm:mt-9">
  <a
    href="#shop"
    className="inline-flex min-h-[66px] min-w-[230px] items-center justify-center gap-8 rounded-[17px] bg-[#493438] px-8 py-4 text-[15px] font-normal !text-white shadow-[0_12px_30px_rgba(73,52,56,0.17)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#62464B] sm:min-w-[295px] sm:gap-10 sm:px-10"
  >
    <span className="!text-white">
      {isArabic ? "تسوقي دلوقتي" : "Shop Now"}
    </span>

    <span className="text-[22px] !text-white" aria-hidden="true">
      {isArabic ? "←" : "→"}
    </span>
  </a>
</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
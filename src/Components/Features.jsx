
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: Truck,
    title: {
      en: "Fast Delivery",
      ar: "توصيل سريع",
    },
    text: {
      en: "Delivered fresh to your door, fast and carefully packed.",
      ar: "منتجاتك لحد باب بيتك بسرعة، مع تغليف بعناية.",
    },
  },
  {
    icon: ShieldCheck,
    title: {
      en: "Flexible Payment",
      ar: "طرق دفع مرنة",
    },
    text: {
      en: "Pay with multiple credit cards.",
      ar: "اختاري طريقة الدفع المناسبة ليكي بسهولة.",
    },
  },
  {
    icon: RefreshCw,
    title: {
      en: "Easy Returns",
      ar: "استبدال واسترجاع بسهولة",
    },
    text: {
      en: "Not satisfied? Exchange or return with no hassle.",
      ar: "مش راضية عن طلبك؟ تقدري تستبدليه أو ترجعيه بسهولة.",
    },
  },
];

const Features = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const font = isArabic
    ? '"El Messiri", sans-serif'
    : '"DM Sans", sans-serif';

  const headingFont = isArabic
    ? '"El Messiri", sans-serif'
    : '"Cormorant Garamond", Georgia, serif';

  const content = {
    en: {
      eyebrow: "THE NYORA EXPERIENCE",
      title: "Little things,",
      highlight: "thoughtfully done.",
    },
    ar: {
      eyebrow: "تجربة نيورا",
      title: "تفاصيل صغيرة،",
      highlight: "بعناية كبيرة.",
    },
  };

  const text = isArabic ? content.ar : content.en;

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="relative overflow-hidden bg-[#EDE3DD] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
       
       
{/* SECTION HEADER */}
<div className="mx-auto mb-12 max-w-[760px] text-center sm:mb-16 lg:mb-20">
  <p
    className={`mb-5 text-[10px] font-medium text-[#A66D78] sm:text-[11px] ${
      isArabic ? "" : "uppercase tracking-[0.28em]"
    }`}
    style={{ fontFamily: font }}
  >
    {isArabic ? "مميزاتنا وأكثر" : "FEATURES AND MORE"}
  </p>

  <h2
    className={`text-[clamp(2.6rem,5.5vw,4.6rem)] font-normal leading-[1.12] text-[#493438] ${
      isArabic ? "" : "tracking-[-0.035em]"
    }`}
    style={{
      fontFamily: isArabic
        ? '"El Messiri", sans-serif'
        : '"Cormorant Garamond", Georgia, serif',
    }}
  >
    {isArabic ? "إيه اللي بنقدمه؟" : "What we offer"}
  </h2>

  <p
   className="mx-auto mt-5 max-w-[600px] text-[16px] leading-[2] text-[#79686A] sm:mt-6 sm:text-[18px]"
    style={{ fontFamily: font }}
  >
    {isArabic
      ? "كل تفصيلة في تجربتك مع نيورا مصممة عشان تمنحك عناية أسهل، وراحة أكبر، وتجربة جمال تستحقّيها."
      : "From the moment you order to the care in every detail, we make your Nyora experience feel effortless, thoughtful, and special."}
  </p>

  <div className="mx-auto mt-7 h-px w-12 bg-[#A66D78]/70 sm:mt-8" />
</div>


        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-5 lg:gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title.en}
                dir={isArabic ? "rtl" : "ltr"}
                className={`group relative flex min-h-[280px] flex-col overflow-hidden rounded-[22px] border border-[#E3D7D1] bg-[#F8F4EF] p-7 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#A66D78]/50 hover:shadow-[0_20px_45px_rgba(73,52,56,0.09)] sm:min-h-[310px] sm:p-8 lg:p-10 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {/* CARD NUMBER */}
                <span
                  className={`absolute top-7 text-[10px] tracking-[0.18em] text-[#A66D78]/65 sm:top-8 ${
                    isArabic ? "left-7 sm:left-8" : "right-7 sm:right-8"
                  }`}
                >
                  0{index + 1}
                </span>

                {/* ICON */}
                <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border border-[#A66D78]/25 bg-[#A66D78]/[0.08] transition-all duration-500 group-hover:border-[#A66D78] group-hover:bg-[#A66D78]">
                  <Icon
                    size={25}
                    strokeWidth={1.35}
                    className="text-[#A66D78] transition-colors duration-500 group-hover:text-white"
                  />
                </div>

                {/* TITLE */}
                <h3
                  className={`mt-7 text-[23px] font-normal leading-[1.45] text-[#493438] transition-colors duration-300 group-hover:text-[#A66D78] sm:text-[24px] lg:text-[26px] ${
                    isArabic ? "" : "font-display"
                  }`}
                  style={{ fontFamily: headingFont }}
                >
                  {isArabic ? feature.title.ar : feature.title.en}
                </h3>

                {/* DECORATIVE LINE */}
                <span
                  className={`mt-4 block h-px w-9 bg-[#A66D78] transition-all duration-500 group-hover:w-16 ${
                    isArabic ? "ml-auto" : "mr-auto"
                  }`}
                />

                {/* DESCRIPTION */}
                <p
                  className={`mt-4 text-[14px] leading-[1.95] text-[#79686A] sm:text-[15px] ${
                    isArabic ? "" : ""
                  }`}
                  style={{ fontFamily: font }}
                >
                  {isArabic ? feature.text.ar : feature.text.en}
                </p>

                {/* SUBTLE BOTTOM ACCENT */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[#A66D78] transition-transform duration-500 group-hover:scale-x-100" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

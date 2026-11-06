
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

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="relative overflow-hidden bg-[#EDE3DD] px-5 py-14 sm:px-8 sm:py-16 lg:px-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1400px]">

        {/* SECTION HEADER */}
        <div className="mx-auto mb-9 max-w-[720px] text-center sm:mb-11 lg:mb-13">
          <p
            className={`mb-3 text-[10px] font-medium text-[#A66D78] sm:text-[11px] ${
              isArabic ? "" : "uppercase tracking-[0.25em]"
            }`}
            style={{ fontFamily: font }}
          >
            {isArabic ? "مميزاتنا وأكثر" : "FEATURES AND MORE"}
          </p>

          <h2
            className={`text-[clamp(2.4rem,4.5vw,3.8rem)] font-normal leading-[1.15] text-[#493438] ${
              isArabic ? "" : "tracking-[-0.035em]"
            }`}
            style={{ fontFamily: headingFont }}
          >
            {isArabic ? "إيه اللي بنقدمه؟" : "What we offer"}
          </h2>

          <p
            className="mx-auto mt-3 max-w-[590px] text-[14px] leading-[1.9] text-[#79686A] sm:mt-4 sm:text-[15px]"
            style={{ fontFamily: font }}
          >
            {isArabic
              ? "كل تفصيلة في تجربتك مع نيورا مصممة عشان تمنحك عناية أسهل، وراحة أكبر، وتجربة جمال تستحقّيها."
              : "From the moment you order to the care in every detail, we make your Nyora experience feel effortless, thoughtful, and special."}
          </p>

          <div className="mx-auto mt-5 h-px w-10 bg-[#A66D78]/70 sm:mt-6" />
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title.en}
                dir={isArabic ? "rtl" : "ltr"}
                className={`group relative flex min-h-[245px] flex-col overflow-hidden rounded-[20px] border border-[#E3D7D1] bg-[#F8F4EF] p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#A66D78]/40 hover:shadow-[0_14px_32px_rgba(73,52,56,0.07)] active:-translate-y-1 active:border-[#A66D78]/50 active:shadow-[0_14px_32px_rgba(73,52,56,0.07)] sm:min-h-[265px] sm:p-7 lg:p-8 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {/* CARD NUMBER */}
                <span
                  className={`absolute top-6 text-[10px] tracking-[0.18em] text-[#A66D78]/65 sm:top-7 ${
                    isArabic ? "left-6 sm:left-7" : "right-6 sm:right-7"
                  }`}
                >
                  0{index + 1}
                </span>

                {/* ICON */}
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[#A66D78]/25 bg-[#A66D78]/[0.07] transition-all duration-500 group-hover:border-[#A66D78] group-hover:bg-[#A66D78] group-active:border-[#A66D78] group-active:bg-[#A66D78]">
                  <Icon
                    size={23}
                    strokeWidth={1.4}
                    className="text-[#A66D78] transition-colors duration-500 group-hover:text-white group-active:text-white"
                  />
                </div>

                {/* TITLE */}
                <h3
                  className="mt-5 text-[21px] font-normal leading-[1.4] text-[#493438] transition-colors duration-300 group-hover:text-[#A66D78] group-active:text-[#A66D78] sm:text-[22px] lg:text-[24px]"
                  style={{ fontFamily: headingFont }}
                >
                  {isArabic ? feature.title.ar : feature.title.en}
                </h3>

                {/* DECORATIVE LINE */}
                <span
                  className={`mt-3 block h-px w-8 bg-[#A66D78] transition-all duration-500 group-hover:w-12 group-active:w-12 ${
                    isArabic ? "ml-auto" : "mr-auto"
                  }`}
                />

                {/* DESCRIPTION */}
                <p
                  className="mt-3 text-[13px] leading-[1.85] text-[#79686A] sm:text-[14px]"
                  style={{ fontFamily: font }}
                >
                  {isArabic ? feature.text.ar : feature.text.en}
                </p>

                {/* BOTTOM ACCENT */}
                <div
                  className={`absolute bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#A66D78] transition-transform duration-500 group-hover:scale-x-100 group-active:scale-x-100 ${
                    isArabic ? "right-0" : "left-0"
                  }`}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ArrowUpRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    rating: 5,
    text: "والله بجد استخدمته امبارح بجد وانا بسرح شعري بجد خلاه ناعم جدا ومحتجتش احط اي حاجه تانيه اسرحه بيه شعري لان كل مره بستخدم حاجات كتيره. هو بجد كفايه بجد لوحده وريحته تحفه",
    productId: 2,
  },
  {
    rating: 5,
    text: "اللي عجبني انه مواد طبيعيه وريحته حلوه مش وحشه متعوده ان الحاجات الطبيعيه بتعمل ريحه كده مش لطيفه حاجه بس لا هو حلو اوي ❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "حرفيا ترطيب خطييير جدا ويدي جلو ف الشعر تحفه وينعمه موت ❤️❤️❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "المنتج ده توب التوب ما شاء الله ريحته جميله ومش بيعمل ملمس دهني علي الشعر تحفه",
    productId: 2,
  },
  {
    rating: 5,
    text: "بجد والله منتج مختلف وخفيف جدا علي الشعر زي السيرم والريحة في حته تانيه لوحدها 🙏",
    productId: 2,
  },
  {
    rating: 5,
    text: "تحفه والله وكفايه ريحته وانه أمن علي الشعر من غير كيماويات",
    productId: 2,
  },
  {
    rating: 5,
    text: "بجد تحفه ولمعان فوق الوصف بالتوفيق دايما ليكم ❤️❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "ما شاء الله تحفه وعن تجربه",
    productId: 2,
  },
  {
    rating: 5,
    text: "الهير بالم تحفة ما شاء الله ريحته جميلة اوي بجد و بينعم الشعر تسلم ايدكم بجد 🥹❤️❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "انا اخدت الكريم من ماما، ريحته حلوه اوي بجد و جربته علي شعري ملزقش يعني قوامه حلو اوي بجد ❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "بس الكريم اللي انتي عمله ريحته تحفه ❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "الكريم تحفه وريحته جميله وثابته وترطيبه عالي 🥰 ربنا يحسن ما بين ايديكم يارب",
    productId: 2,
  },
  {
    rating: 5,
    text: "لا والله حلو ما شاء الله بجد ❤️",
    productId: 2,
  },
  {
    rating: 5,
    text: "عندي نفس الرأي فعلا الليب بالم جميل جدا وبيرطب اوي وشفايفي جميلة وناعمة رغم الظروف 😂🥹",
    productId: 4,
  },
  {
    rating: 5,
    text: "جربت الليب بالم جميل جميل مش بيقشر الشفايف ومديها ترطيب ولون جميل",
    productId: 4,
  },
  {
    rating: 5,
    text: "والليب بالم كمان لطيف اوي وترطيبه جميل تسلم ايدك بجد ❤️",
    productId: 4,
  },
  {
    rating: 5,
    text: "الليب بالم تحفه",
    productId: 4,
  },
  {
    rating: 5,
    text: "البادي بطل تحفه حلو اوي اوي. حطيت منه النهارده بعد ما خدت دش، تحفه اوي اوي وريحته تحفه",
    productId: 5,
  },
  {
    rating: 5,
    text: "حطيته و منتي صحيت اختي بتقولي وشك بقى حلو كده ليه، كان فيه فرق صراحه وكنت هبعتلك بس قلت اما احطه تاني مرة ❤️❤️",
    productId: 5,
  },
];

const isArabicText = (text = "") => /[\u0600-\u06FF]/.test(text);

const productNameTranslations = {
  "hair balm": "بلسم الشعر",
  "lip balm": "بلسم الشفايف",
  "body butter": "زبدة الجسم",
  "strawberry lip scrub": "مقشر الشفايف بالفراولة",
  "face mask": "ماسك الوجه",
  "lip scrub": "مقشر الشفايف",
  "hair oil": "زيت الشعر",
  "body oil": "زيت الجسم",
};

const Testimonials = () => {
  const { products } = useStore();
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [expandedReviews, setExpandedReviews] = useState({});

  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString(isArabic ? "ar-EG" : "en-US");

  const getProductName = (name = "") => {
    if (!isArabic) return name;

    return (
      productNameTranslations[name.trim().toLowerCase()] || name
    );
  };

  const reviews = testimonials
    .map((review, index) => ({
      ...review,
      key: index,
      product: products.find(
        (product) => String(product.id) === String(review.productId)
      ),
    }))
    .filter((review) => review.product);

  const toggleReview = (key) => {
    setExpandedReviews((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="overflow-hidden bg-[#F8F4EF] px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8"
    >
      <div className="mx-auto max-w-[1700px]">
        {/* SECTION HEADER */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <span
            className={`inline-block text-[11px] font-semibold text-[#A66D78] ${
              isArabic ? "" : "uppercase tracking-[0.3em]"
            }`}
          >
            {isArabic ? "آراء عملائنا" : "THE NYORA EXPERIENCE"}
          </span>

          <h2
            className={`mt-4 font-normal leading-[1.2] text-[#493438] ${
              isArabic ? "tracking-normal" : "tracking-[-0.035em]"
            }`}
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 4.2rem)",
              fontFamily: isArabic
                ? '"El Messiri", sans-serif'
                : '"Cormorant Garamond", Georgia, serif',
            }}
          >
            {isArabic
              ? "عملاؤنا بيقولوا إيه؟"
              : "What Our Customers Say"}
          </h2>

          <p className="mt-4 text-[14px] leading-8 text-[#79686A] sm:text-[16px]">
            {isArabic
              ? "تجارب حقيقية ونتائج ملموسة"
              : "Real results, real stories, and a little love for your daily rituals."}
          </p>

          <div
            className="mt-5 flex items-center justify-center gap-1"
            aria-label="5 out of 5 stars"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                strokeWidth={1.4}
                className="fill-[#A66D78] text-[#A66D78]"
              />
            ))}

            <span className="ms-2 text-[11px] tracking-wide text-[#79686A]">
              {isArabic ? "تقييمات عملائنا" : "Customer love"}
            </span>
          </div>
        </div>

        {/* REVIEWS CAROUSEL */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6"
        >
          {reviews.map((review) => {
            const { product, text, rating, key } = review;

            const reviewIsArabic = isArabicText(text);
            const displayName = getProductName(product.name);
            const isExpanded = Boolean(expandedReviews[key]);
            const needsExpansion = text.length > 115;

            return (
              <article
                key={key}
                dir={isArabic ? "rtl" : "ltr"}
                className="group flex min-h-[370px] w-[290px] shrink-0 snap-start flex-col rounded-[22px] border border-[#E3D7D1] bg-[#FDF9F6] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C7BF] hover:shadow-[0_14px_35px_rgba(73,52,56,0.08)] sm:w-[350px] sm:p-7 lg:w-[370px]"
              >
                {/* STARS AND REVIEW LABEL */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div dir="ltr" className="flex gap-[3px]">
                    {Array.from({ length: rating }).map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        strokeWidth={1.5}
                        className="fill-[#A66D78] text-[#A66D78]"
                      />
                    ))}
                  </div>

                  <span
                    className={`text-[9px] font-medium text-[#A66D78] ${
                      isArabic ? "" : "tracking-wide"
                    }`}
                  >
                    {isArabic ? "رأي عميلة" : "CUSTOMER REVIEW"}
                  </span>
                </div>

                {/* REVIEW TEXT */}
                <div className="flex-1">
                  <p
                    dir={reviewIsArabic ? "rtl" : "ltr"}
                    lang={reviewIsArabic ? "ar" : "en"}
                    className={`whitespace-normal break-words text-[15px] font-normal leading-[1.95] text-[#79686A] sm:text-[16px] ${
                      reviewIsArabic ? "text-right" : "text-left"
                    } ${isExpanded ? "" : "line-clamp-4"}`}
                  >
                    “{text}”
                  </p>

                  {needsExpansion && (
                    <button
                      type="button"
                      onClick={() => toggleReview(key)}
                      className="mt-2 text-[12px] font-semibold text-[#A66D78] underline-offset-4 transition-colors hover:text-[#493438] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A66D78]"
                    >
                      {isExpanded
                        ? isArabic
                          ? "عرض أقل"
                          : "Read less"
                        : isArabic
                          ? "اقرئي المزيد"
                          : "Read more"}
                    </button>
                  )}
                </div>

                {/* PRODUCT FOOTER */}
                <div className="mt-6 border-t border-[#E3D7D1] pt-4">
                  <Link
                    to={`/product/${product.id}`}
                    aria-label={
                      isArabic
                        ? `عرض ${displayName}`
                        : `View ${product.name}`
                    }
                    className="flex min-w-0 items-center gap-3 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A66D78]"
                  >
                    <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[#E3D7D1] bg-[#EDE3DD]">
                      <img
                        src={product.image}
                        alt={displayName}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                        className="h-full w-full object-contain p-1.5"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-[#493438]">
                        {displayName}
                      </p>

                      <p className="mt-1 text-[12px] text-[#A66D78]">
                        {isArabic
                          ? `${formatNumber(product.price)} جنيه`
                          : `${formatNumber(product.price)} EGP`}
                      </p>

                      <p className="mt-1 text-[10px] text-[#79686A]">
                        {isArabic ? "اكتشفي المنتج" : "Discover product"}
                      </p>
                    </div>

                    <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[#E3D7D1] text-[#493438] transition-all duration-300 group-hover:border-[#A66D78] group-hover:bg-[#A66D78] group-hover:text-white">
                      <ArrowUpRight
                        size={17}
                        strokeWidth={1.5}
                        className={isArabic ? "-rotate-90" : ""}
                      />
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* SCROLL HINT */}
        <p className="mt-4 text-center text-[10px] tracking-wide text-[#A66D78]">
          {isArabic
            ? "اسحبي لاكتشاف المزيد من آراء عملائنا"
            : "SCROLL TO DISCOVER MORE REVIEWS"}
        </p>
      </div>
    </section>
  );
};

export default Testimonials;

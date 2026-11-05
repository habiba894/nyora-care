import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { Heart, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";

import { useStore } from "../context/StoreContext";

import { useTranslation } from "react-i18next";

import { products as localProducts } from "../data/products";



const productTranslations = {

  "hair balm": {

    name: "بلسم الشعر",

    category: "العناية بالشعر",

    tagline: "ترطيب غني ونعومة حريرية للشعر",

    description: "بلسم مغذٍ يساعد على تنعيم الشعر وترطيبه، ويمنحه مظهرًا صحيًا ولمعانًا جميلًا.",

  },

  "lip balm": {

    name: "بلسم الشفايف",

    category: "العناية بالشفايف",

    tagline: "شفايف ناعمة وترطيب يدوم",

    description: "بلسم مرطب يساعد على تنعيم الشفايف ويمنحها ملمسًا ناعمًا ومظهرًا صحيًا.",

  },

  "body butter": {

    name: "زبدة الجسم",

    category: "العناية بالجسم",

    tagline: "ترطيب غني. وبشرة ناعمة كالحرير",

    description: "زبدة جسم سريعة الامتصاص تساعد على ترطيب البشرة بعمق وتنعيمها، من غير ملمس دهني.",

  },

  "strawberry lip scrub": {

    name: "مقشر الشفايف بالفراولة",

    category: "العناية بالشفايف",

    tagline: "شفايف أنعم بلمسة لطيفة",

    description: "مقشر للشفايف يساعد على إزالة الخلايا الميتة ويترك الشفايف أنعم.",

  },

  "lip scrub": {

    name: "مقشر الشفايف",

    category: "العناية بالشفايف",

    tagline: "نعومة وانتعاش لشفايفك",

    description: "مقشر لطيف يساعد على تنعيم الشفايف وإزالة الجلد الجاف.",

  },

  "face mask": {

    name: "ماسك الوجه",

    category: "العناية بالوجه",

    tagline: "لحظات عناية لبشرة منتعشة",

    description: "ماسك للوجه ضمن روتين العناية بالبشرة، يمنحك لحظة عناية واسترخاء.",

  },

  "hair oil": {

    name: "زيت الشعر",

    category: "العناية بالشعر",

    tagline: "لمعان ونعومة لشعرك",

    description: "زيت للشعر يساعد على تحسين ملمسه وإضافة لمسة من اللمعان.",

  },

  "body oil": {

    name: "زيت الجسم",

    category: "العناية بالجسم",

    tagline: "لمسة ناعمة لبشرتك",

    description: "زيت للجسم ضمن روتين العناية اليومي، يساعد على منح البشرة ملمسًا ناعمًا.",

  },

};



const ingredientTranslations = {

  "aloe vera": "ألوفيرا",

  "sweet almond oil": "زيت اللوز الحلو",

  "jojoba oil": "زيت الجوجوبا",

  "mango butter": "زبدة المانجو",

  "shea butter": "زبدة الشيا",

  glycerin: "جلسرين",

  panthenol: "بانثينول",

  "coconut oil": "زيت جوز الهند",

  "olive oil": "زيت الزيتون",

  "vitamin e": "فيتامين هـ",

  "argan oil": "زيت الأرجان",

  "rose water": "ماء الورد",

  "strawberry extract": "مستخلص الفراولة",

  "cocoa butter": "زبدة الكاكاو",

  "grape seed oil": "زيت بذور العنب",

  "castor oil": "زيت الخروع",

  beeswax: "شمع العسل",

  "pumpkin oil": "زيت اليقطين",

  "marrow oil": "زيت النخاع",

  "kaolin clay": "طين الكاولين",

  "bentonite clay": "طين البنتونيت",

  "salicylic acid": "حمض الساليسيليك",

  charcoal: "الفحم النشط",

  "blue indigo": "النيلة الزرقاء",

};



const sizeTranslations = {

  "100ml": "١٠٠ مل",

  "200ml": "٢٠٠ مل",

  "250ml": "٢٥٠ مل",

  "50ml": "٥٠ مل",

  "30ml": "٣٠ مل",

  "15ml": "١٥ مل",

};





const getProductImageSrc = (image) => {
  const value = String(image ?? "").trim();

  if (!value) return "";

  if (/^(https?:\/\/|data:|blob:)/i.test(value)) {
    return value;
  }

  const cleanPath = value
    .replace(/^public[\\/]/i, "")
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")
    .replace(/%20/gi, " ");

  return `/${encodeURI(cleanPath)}`;
};



const ProductDetails = () => {

  const { id } = useParams();

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



  // Find the API/StoreContext product by its route ID or MongoDB ID.

  const storeProduct = useMemo(

    () => products.find((item) =>

      [item.id, item._id, item.apiId, item.mongoId, item.slug]

        .some((value) => value != null && String(value) === String(id))

    ),

    [products, id]

  );



  // Keep the original local catalog as the source for presentation details

  // (image, tagline, ingredients, sizes, and detailed copy) when the API

  // product does not contain those fields or has only a generic description.

  const localProduct = useMemo(() => localProducts.find((item) => {

    if (String(item.id) === String(id)) return true;

    if (storeProduct?.id != null && String(item.id) === String(storeProduct.id)) return true;

    return Boolean(storeProduct?.name) &&

      item.name?.trim().toLowerCase() === storeProduct.name.trim().toLowerCase();

  }), [id, storeProduct]);



  const product = useMemo(() => {

    if (!storeProduct && !localProduct) return undefined;

    const apiDescription = String(storeProduct?.description ?? "").trim();

    const normalizedApiDescription = apiDescription.toLowerCase().replace(/[.!\s]+$/g, "");

    const normalizedApiName = String(storeProduct?.name ?? "").trim().toLowerCase();

    const genericDescription = !apiDescription ||

      normalizedApiDescription === normalizedApiName ||

      normalizedApiDescription === `nyora ${normalizedApiName}`;



    return {

      ...localProduct,

      ...storeProduct,

      // Keep the numeric/local ID when the store uses it for cart and wishlist.

      id: storeProduct?.id ?? localProduct?.id ?? storeProduct?._id,

      // Keep existing product photography and layout position.

      image: storeProduct?.image || storeProduct?.imageUrl || "",

      position: localProduct?.position || storeProduct?.position || "50% 50%",

      // Prefer a real database description; use the original detailed copy

      // when the database contains only a placeholder like the product name.

      description: genericDescription

        ? (localProduct?.description || apiDescription)

        : apiDescription,

      tagline: storeProduct?.tagline || localProduct?.tagline || "",

      ingredients: Array.isArray(localProduct?.ingredients) && localProduct.ingredients.length

        ? localProduct.ingredients

        : (Array.isArray(storeProduct?.ingredients) ? storeProduct.ingredients : []),

      sizes: Array.isArray(localProduct?.sizes) && localProduct.sizes.length

        ? localProduct.sizes

        : (Array.isArray(storeProduct?.sizes) ? storeProduct.sizes.filter(Boolean) : []),

      reviews: storeProduct?.reviews ?? localProduct?.reviews ?? 0,

      category: storeProduct?.category || localProduct?.category,

      group: storeProduct?.group || localProduct?.group,

    };

  }, [storeProduct, localProduct]);



  const [selectedSize, setSelectedSize] = useState("");

  const [qty, setQty] = useState(1);

  const [justAdded, setJustAdded] = useState(false);



  const sizes = useMemo(() => {

    if (!Array.isArray(product?.sizes)) return [];

    return product.sizes.filter((size) => String(size ?? "").trim());

  }, [product]);



  useEffect(() => {

    window.scrollTo(0, 0);

  }, [id]);



  useEffect(() => {

    setSelectedSize(sizes[0] || "");

    setQty(1);

    setJustAdded(false);

  }, [id, product, sizes]);



  useEffect(() => {

    if (!justAdded) return undefined;

    const timer = window.setTimeout(() => setJustAdded(false), 1600);

    return () => window.clearTimeout(timer);

  }, [justAdded]);



  const productKey = String(product?.name ?? "").trim().toLowerCase();

  const translated = productTranslations[productKey];

  const displayName = isArabic && translated ? translated.name : product?.name;

  const displayCategory = isArabic && translated

    ? translated.category

    : product?.category || product?.group || "";

  const displayTagline = isArabic && translated

    ? translated.tagline

    : product?.tagline || "";

  const displayDescription = isArabic && translated

    ? translated.description

    : product?.description || "";



  const getIngredientName = (ingredient) => {

    if (!isArabic) return ingredient;

    return ingredientTranslations[String(ingredient).trim().toLowerCase()] || ingredient;

  };



  const getSizeName = (size) => {

    if (!isArabic) return size;

    return sizeTranslations[String(size).trim().toLowerCase()] || size;

  };



  if (!product && productsLoading) {

    return (

      <main dir={isArabic ? "rtl" : "ltr"} className="min-h-[70vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16">

        <div className="mx-auto flex max-w-[700px] flex-col items-center py-20 text-center">

          <p className="text-[12px] font-semibold text-[#A66D78]">NYORA BEAUTY</p>

          <h1 className={`mt-5 text-[34px] font-normal text-[#493438] sm:text-[44px] ${isArabic ? "font-sans" : "font-display"}`}>

            {isArabic ? "جاري تحميل المنتج..." : "Loading product..."}

          </h1>

          <p className="mt-4 text-[17px] leading-[1.9] text-[#79686A]">

            {isArabic ? "استني لحظة لحد ما نحمل تفاصيل المنتج." : "Please wait while we load the product details."}

          </p>

        </div>

      </main>

    );

  }



  if (!product) {

    return (

      <main dir={isArabic ? "rtl" : "ltr"} className="min-h-[70vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16">

        <div className="mx-auto flex max-w-[700px] flex-col items-center py-20 text-center">

          <p className="text-[12px] font-semibold text-[#A66D78]">{isArabic ? "نيورا بيوتي" : "NYORA BEAUTY"}</p>

          <h1 className={`mt-5 text-[34px] font-normal text-[#493438] sm:text-[44px] ${isArabic ? "font-sans" : "font-display"}`}>

            {isArabic ? "المنتج مش موجود" : "Product not found"}

          </h1>

          <p className="mt-4 max-w-[420px] text-[17px] leading-[1.9] text-[#79686A]">

            {productsError

              ? isArabic ? "مقدرناش نحمل المنتج. جربي تاني من فضلك." : "We couldn't load this product. Please try again."

              : isArabic ? "مش قادرين نلاقي المنتج اللي بتدوري عليه." : "We couldn't find the product you're looking for."}

          </p>

          <Link to="/shop" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#493438] px-8 py-3.5 text-[12px] font-bold text-white transition-colors duration-300 hover:bg-[#62474D]">

            <ArrowLeft size={16} className={isArabic ? "rotate-180" : ""} />

            {isArabic ? "الرجوع للمتجر" : "Back to shop"}

          </Link>

        </div>

      </main>

    );

  }



  const liked = Boolean(isLiked?.(product.id));

  const unavailable = product.inStock === false;

  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];

  const price = Number(product.price) || 0;



  const handleAddToCart = () => {

    if (unavailable || (sizes.length > 0 && !selectedSize)) return;

    addToCart(product.id ?? product._id ?? product.apiId, selectedSize, qty);

    setJustAdded(true);

  };



  const increaseQty = () => setQty((current) => Math.min(99, current + 1));

  const decreaseQty = () => setQty((current) => Math.max(1, current - 1));



  return (

    <main dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} className="bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16">

      <div className="mx-auto max-w-[1500px]">

        <nav aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"} className="text-[14px] text-[#79686A]">

          <Link to="/" className="transition-colors hover:text-[#A66D78]">{isArabic ? "الرئيسية" : "Home"}</Link>

          <span className="mx-2 text-[#D8CBC5]">/</span>

          <Link to="/shop" className="transition-colors hover:text-[#A66D78]">{isArabic ? "المتجر" : "Shop"}</Link>

          <span className="mx-2 text-[#D8CBC5]">/</span>

          <span className="text-[#493438]">{displayName}</span>

        </nav>



        <div dir="ltr" className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.85fr)] lg:items-start lg:gap-16 xl:gap-24">

          <div className="relative overflow-hidden rounded-[28px] bg-[#EDE3DD]">

            <div className="aspect-[1.05/1]">

              {getProductImageSrc(product.image) ? (
                <img
                  src={getProductImageSrc(product.image)}
                  alt={displayName || product.name}
                  style={{ objectPosition: product.position || "50% 50%" }}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (

                <div className="flex h-full min-h-72 items-center justify-center text-sm text-[#A66D78]">

                  {isArabic ? "الصورة هتتوفر قريبًا" : "Product image coming soon"}

                </div>

              )}

            </div>

            <button type="button" onClick={() => toggleWishlist?.(product.id ?? product._id)} aria-label={liked ? (isArabic ? `إزالة ${displayName} من المفضلة` : `Remove ${product.name} from wishlist`) : (isArabic ? `إضافة ${displayName} للمفضلة` : `Add ${product.name} to wishlist`)} aria-pressed={liked} className={`absolute top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#E3D7D1] bg-[#F8F4EF]/95 text-[#493438] shadow-[0_8px_24px_rgba(73,52,56,0.10)] backdrop-blur transition-all duration-300 hover:border-[#A66D78] hover:text-[#A66D78] ${isArabic ? "left-5" : "right-5"}`}>

              <Heart size={20} strokeWidth={1.6} className={liked ? "fill-[#A66D78] text-[#A66D78]" : ""} />

            </button>

          </div>



          <section dir={isArabic ? "rtl" : "ltr"} className={`flex min-w-0 flex-col py-2 lg:py-6 ${isArabic ? "text-right" : "text-left"}`}>

            <p className={`text-[12px] font-semibold text-[#A66D78] ${isArabic ? "" : "uppercase tracking-[0.25em]"}`}>{displayCategory}</p>

            <h1 className={`mt-4 font-normal leading-[1.15] text-[#493438] ${isArabic ? "font-sans tracking-normal" : "font-display tracking-[-0.025em]"}`} style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>{displayName}</h1>



            {Number(product.reviews) > 0 && (

              <div dir="ltr" className={`mt-5 flex items-center gap-3 ${isArabic ? "justify-end" : "justify-start"}`}>

                <span className="text-[16px] tracking-[0.05em] text-[#806654]" aria-label="5 out of 5 stars">★★★★★</span>

                <span className="text-[14px] text-[#79686A]">{product.reviews} {isArabic ? "تقييم" : "reviews"}</span>

              </div>

            )}



            <p dir="ltr" className={`mt-6 text-[21px] font-semibold text-[#493438] ${isArabic ? "text-right" : "text-left"}`}>{price.toLocaleString("en-US")} EGP</p>

            <div className="mt-7 border-t border-[#E3D7D1]" />



            {displayTagline && <p className={`mt-7 text-[24px] leading-[1.6] text-[#A66D78] ${isArabic ? "font-sans" : "font-display italic"}`}>{displayTagline}</p>}

            {displayDescription && <p className="mt-5 max-w-[600px] text-[17px] leading-[2] text-[#79686A]">{displayDescription}</p>}



            {ingredients.length > 0 && (

              <div className="mt-7">

                <p className={`text-[13px] font-semibold text-[#493438] ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}>{isArabic ? "المكونات الأساسية" : "Key ingredients"}</p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {ingredients.map((ingredient, index) => <span key={`${ingredient}-${index}`} className="rounded-full border border-[#E3D7D1] bg-[#EDE3DD] px-4 py-2.5 text-[13px] leading-[1.5] text-[#79686A]">{getIngredientName(ingredient)}</span>)}

                </div>

              </div>

            )}



            {sizes.length > 0 && (

              <div className="mt-8">

                <div className="flex items-center justify-between gap-3">

                  <p className={`text-[13px] font-semibold text-[#493438] ${isArabic ? "" : "uppercase tracking-[0.2em]"}`}>{isArabic ? "الحجم" : "Size"}</p>

                  <span dir="ltr" className="text-[14px] text-[#79686A]">{getSizeName(selectedSize)}</span>

                </div>

                <div className="mt-3 flex flex-wrap gap-2">

                  {sizes.map((size) => {

                    const selected = selectedSize === size;

                    return <button key={size} type="button" onClick={() => setSelectedSize(size)} aria-pressed={selected} className={`rounded-full border px-5 py-3 text-[14px] transition-all duration-300 ${selected ? "border-[#493438] bg-[#493438] text-white" : "border-[#E3D7D1] bg-transparent text-[#493438] hover:border-[#A66D78] hover:text-[#A66D78]"}`}>{getSizeName(size)}</button>;

                  })}

                </div>

              </div>

            )}



            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <div dir="ltr" className="flex h-12 items-center justify-between rounded-full border border-[#E3D7D1] bg-transparent sm:w-[145px]">

                <button type="button" onClick={decreaseQty} disabled={qty <= 1} aria-label={isArabic ? "تقليل الكمية" : "Decrease quantity"} className="flex h-12 w-11 items-center justify-center text-[#493438] transition-colors hover:text-[#A66D78] disabled:cursor-not-allowed disabled:opacity-30"><Minus size={16} strokeWidth={1.6} /></button>

                <span className="text-[15px] text-[#493438]">{qty}</span>

                <button type="button" onClick={increaseQty} disabled={qty >= 99} aria-label={isArabic ? "زيادة الكمية" : "Increase quantity"} className="flex h-12 w-11 items-center justify-center text-[#493438] transition-colors hover:text-[#A66D78] disabled:cursor-not-allowed disabled:opacity-30"><Plus size={16} strokeWidth={1.6} /></button>

              </div>

              <button type="button" onClick={handleAddToCart} disabled={unavailable || (sizes.length > 0 && !selectedSize)} className={`flex h-12 flex-1 items-center justify-center gap-3 rounded-full px-7 text-[12px] font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:bg-[#D8CBC5] ${justAdded ? "bg-[#A66D78] text-white" : "bg-[#493438] text-white hover:bg-[#62474D]"} ${isArabic ? "" : "uppercase tracking-[0.18em]"}`}>

                <ShoppingBag size={17} strokeWidth={1.7} />

                {unavailable ? (isArabic ? "غير متوفر حاليًا" : "Currently unavailable") : justAdded ? (isArabic ? "اتضاف للسلة" : "Added to cart") : isArabic ? "أضيفي للسلة" : "Add to cart"}

              </button>

            </div>

            {sizes.length > 0 && !selectedSize && !unavailable && <p className="mt-3 text-xs text-[#A66D78]">{isArabic ? "اختاري الحجم قبل الإضافة للسلة." : "Please select a size before adding to cart."}</p>}



            {/* PRODUCT BENEFITS — preserved from the original design */}

            <div className="mt-8 grid grid-cols-1 border-y border-[#E3D7D1] sm:grid-cols-3">

              <div className="border-b border-[#E3D7D1] py-4 sm:border-b-0 sm:border-r sm:pr-5">

                <p className={`text-[12px] font-semibold text-[#493438] ${isArabic ? "" : "uppercase tracking-[0.16em]"}`}>{isArabic ? "طبيعي" : "Natural"}</p>

                <p className="mt-1 text-[13px] leading-[1.9] text-[#79686A]">{isArabic ? "مكونات مختارة بعناية." : "Thoughtfully selected ingredients."}</p>

              </div>

              <div className="border-b border-[#E3D7D1] py-4 sm:border-b-0 sm:border-r sm:px-5">

                <p className={`text-[12px] font-semibold text-[#493438] ${isArabic ? "" : "uppercase tracking-[0.16em]"}`}>{isArabic ? "مصري" : "Egyptian"}</p>

                <p className="mt-1 text-[13px] leading-[1.9] text-[#79686A]">{isArabic ? "صنع بكل فخر من نيورا بيوتي." : "Proudly made by Nyora Beauty."}</p>

              </div>

              <div className="py-4 sm:pl-5">

                <p className={`text-[12px] font-semibold text-[#493438] ${isArabic ? "" : "uppercase tracking-[0.16em]"}`}>{isArabic ? "عناية" : "Care"}</p>

                <p className="mt-1 text-[13px] leading-[1.9] text-[#79686A]">{isArabic ? "جزء من روتين عنايتك كل يوم." : "Made for your everyday ritual."}</p>

              </div>

            </div>

          </section>

        </div>



        <div className="mt-20 border-t border-[#E3D7D1] pt-6">

          <Link to="/shop" className={`inline-flex items-center gap-2 text-[13px] font-semibold text-[#A66D78] transition-colors duration-300 hover:text-[#493438] ${isArabic ? "" : "uppercase tracking-[0.16em]"}`}>

            <ArrowLeft size={16} strokeWidth={1.6} className={isArabic ? "rotate-180" : ""} />

            {isArabic ? "الرجوع للمتجر" : "Back to shop"}

          </Link>

        </div>

      </div>

    </main>

  );

};



export default ProductDetails;

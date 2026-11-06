import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

const productNameArabic = {
  "Hair Balm": "بلسم الشعر",
  "Lip Scrub": "مقشر الشفاه",
  "Face Mask": "ماسك الوجه",
  "Lip Balm": "مرطب الشفاه",
  "Body Butter": "زبدة الجسم",
};

const categoryArabic = {
  Face: "العناية بالوجه",
  Lips: "العناية بالشفاه",
  Body: "العناية بالجسم",
  Hair: "العناية بالشعر",
  "Face Care": "العناية بالوجه",
  "Lip Care": "العناية بالشفاه",
  "Body Care": "العناية بالجسم",
  "Hair Care": "العناية بالشعر",
};

const Cart = () => {
  const {
    cart,
    products,
    productsLoading,
    updateQty,
    removeFromCart,
    orderNote,
    setOrderNote,
    orderNoteMax,
  } = useStore();

  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar") ?? false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const text = isArabic
    ? {
        home: "الرئيسية",
        cart: "سلة التسوق",
        description: "كل المنتجات اللي اخترتيها، مجمعة في مكان واحد.",
        loading: "جاري تحميل المنتجات...",
        emptyTitle: "سلتك مستنياكي",
        emptyDescription:
          "ضيفي المنتجات اللي بتحبيها من المتجر وهتظهر هنا.",
        startShopping: "ابدئي التسوق",
        item: "منتج",
        items: "منتجات",
        continueShopping: "متابعة التسوق",
        size: "الحجم",
        each: "للقطعة",
        remove: "حذف",
        yourOrder: "طلبك",
        orderSummary: "ملخص الطلب",
        subtotal: "المجموع الفرعي",
        delivery: "التوصيل",
        total: "الإجمالي",
        deliveryNote: "رسوم التوصيل محددة حاليًا بـ ٥٠ جنيه.",
        checkout: "إتمام الشراء",
        decrease: "تقليل الكمية",
        increase: "زيادة الكمية",
        removeProduct: "حذف المنتج",
        noteTitle: "ملاحظة على الطلب",
        noteOptional: "اختياري",
        notePlaceholder:
          "اكتبي أي ملاحظة تخص طلبك، مثلًا: تغليف هدية أو أنسب وقت للتوصيل.",
        noteHint: "هتوصل لفريق نيورا مع طلبك.",
        noteClear: "مسح",
        noteSuggestions: [
          "تغليف هدية",
          "اتصلوا بيا قبل التوصيل",
          "التوصيل مساءً",
        ],
      }
    : {
        home: "Home",
        cart: "Cart",
        description: "Everything you picked, gathered in one place.",
        loading: "Loading your products...",
        emptyTitle: "Your cart is waiting",
        emptyDescription:
          "Add something you love from the shop and it will appear here.",
        startShopping: "Start shopping",
        item: "item",
        items: "items",
        continueShopping: "Continue shopping",
        size: "Size",
        each: "each",
        remove: "Remove",
        yourOrder: "Your order",
        orderSummary: "Order summary",
        subtotal: "Subtotal",
        delivery: "Delivery",
        total: "Total",
        deliveryNote: "Delivery fee is currently set to 50 EGP.",
        checkout: "Checkout",
        decrease: "Decrease quantity",
        increase: "Increase quantity",
        removeProduct: "Remove product",
        noteTitle: "Order note",
        noteOptional: "Optional",
        notePlaceholder:
          "Add a note for your order, e.g. gift wrapping or the best time for delivery.",
        noteHint: "Your note will reach the Nyora team with your order.",
        noteClear: "Clear",
        noteSuggestions: [
          "Gift wrapping",
          "Call me before delivery",
          "Deliver in the evening",
        ],
      };

  const formatNumber = (value) =>
    Number(value || 0).toLocaleString(isArabic ? "ar-EG" : "en-US");

  const formatPrice = (price) =>
    `${formatNumber(price)} ${isArabic ? "جنيه" : "EGP"}`;

  const formatSize = (size) => {
    if (size === null || size === undefined || size === "") {
      return "";
    }

    if (typeof size === "number") {
      return isArabic
        ? `${formatNumber(size)} مل`
        : `${formatNumber(size)} ml`;
    }

    const sizeText = String(size).trim();

    if (!isArabic) {
      return sizeText
        .replace(
          /(\d+(?:\.\d+)?)\s*(مل|ml)/gi,
          (_, number) => `${number}ml`
        )
        .replace(
          /(\d+(?:\.\d+)?)\s*(جرام|g|gm|grams?)/gi,
          (_, number) => `${number}g`
        );
    }

    return sizeText
      .replace(
        /(\d+(?:\.\d+)?)\s*(ml|مل)/gi,
        (_, number) => `${formatNumber(number)} مل`
      )
      .replace(
        /(\d+(?:\.\d+)?)\s*(g|gm|grams?|جرام)/gi,
        (_, number) => `${formatNumber(number)} جرام`
      );
  };

  const lines = useMemo(
    () =>
      cart
        .map((item) => ({
          ...item,
          product: products.find(
            (product) => String(product.id) === String(item.id)
          ),
        }))
        .filter((line) => line.product),
    [cart, products]
  );

  const subtotal = lines.reduce(
    (sum, line) =>
      sum + Number(line.product.price || 0) * line.qty,
    0
  );

  const addSuggestion = (phrase) => {
    const current = (orderNote || "").trim();

    if (current.includes(phrase)) return;

    setOrderNote(current ? `${current}. ${phrase}` : phrase);
  };

  const getProductName = (product) => {
    if (!isArabic) return product.name;

    return (
      product.nameAr ||
      productNameArabic[product.name] ||
      productNameArabic[product.name?.trim()] ||
      product.name
    );
  };

  const getCategoryName = (product) => {
    if (!isArabic) return product.category;

    return (
      product.categoryAr ||
      categoryArabic[product.category] ||
      categoryArabic[product.category?.trim()] ||
      product.category
    );
  };

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="min-h-[70vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-[700px]">
          <nav
            aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}
            className="text-[13px] text-[#79686A]"
          >
            <Link
              to="/"
              className="transition-colors hover:text-[#A66D78]"
            >
              {text.home}
            </Link>

            <span className="mx-2 text-[#D8CBC5]">/</span>

            <span className="text-[#493438]">{text.cart}</span>
          </nav>

          <h1
            className="mt-5 font-display font-normal leading-[0.95] tracking-[-0.03em] text-[#493438]"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            {isArabic ? (
              <>
                سلة{" "}
                <span className="italic text-[#A66D78]">
                  التسوق
                </span>
              </>
            ) : (
              <>
                Your{" "}
                <span className="italic text-[#A66D78]">
                  cart
                </span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-[470px] text-[16px] leading-[1.7] text-[#79686A]">
            {text.description}
          </p>
        </header>

        {productsLoading && products.length === 0 ? (
          <p className="mt-12 text-[14px] text-[#79686A]">
            {text.loading}
          </p>
        ) : lines.length === 0 ? (
          <div className="mt-16 max-w-[620px] border-y border-[#E3D7D1] py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
              <ShoppingBag size={23} strokeWidth={1.5} />
            </div>

            <h2 className="mt-7 font-display text-[32px] font-normal leading-[1.1] text-[#493438]">
              {text.emptyTitle}
            </h2>

            <p className="mt-3 max-w-[430px] text-[15px] leading-[1.7] text-[#79686A]">
              {text.emptyDescription}
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] !text-white transition-colors duration-300 hover:bg-[#62474D] hover:!text-white"
            >
              {text.startShopping}
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-16">
            <section aria-label={text.cart}>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[13px] text-[#79686A]">
                  {formatNumber(lines.length)}{" "}
                  {isArabic
                    ? text.items
                    : lines.length === 1
                      ? text.item
                      : text.items}
                </p>

                <Link
                  to="/shop"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#A66D78] transition-colors hover:text-[#493438]"
                >
                  {text.continueShopping}
                </Link>
              </div>

              <ul className="divide-y divide-[#E3D7D1] border-y border-[#E3D7D1]">
                {lines.map(({ product, size, qty }) => (
                  <li
                    key={`${product.id}-${size || "default"}`}
                    className="flex gap-4 py-6 sm:gap-7 sm:py-7"
                  >
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[18px] bg-[#EDE3DD] sm:h-32 sm:w-32">
                      <img
                        src={product.image}
                        alt={getProductName(product)}
                        style={{
                          objectPosition: product.position || "50% 50%",
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-[#A66D78]">
                            {getCategoryName(product)}
                          </p>

                          <h2 className="mt-1 font-display text-[24px] font-normal leading-[1.08] text-[#493438] sm:text-[26px]">
                            {getProductName(product)}
                          </h2>

                          {size && (
                            <p className="mt-2 text-[12px] text-[#79686A]">
                              {text.size}: {formatSize(size)}
                            </p>
                          )}

                          <p className="mt-2 text-[12px] text-[#79686A]">
                            {formatPrice(product.price)} {text.each}
                          </p>
                        </div>

                        <p
                          dir="ltr"
                          className="shrink-0 pt-1 text-[15px] font-semibold text-[#493438]"
                        >
                          {formatPrice(
                            Number(product.price || 0) * qty
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div
                          dir="ltr"
                          className="flex h-10 items-center rounded-full border border-[#E3D7D1]"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(product.id, size, qty - 1)
                            }
                            disabled={qty <= 1}
                            aria-label={`${text.decrease} ${getProductName(product)}`}
                            className="flex h-10 w-10 items-center justify-center text-[#493438] transition-colors hover:text-[#A66D78] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus size={14} strokeWidth={1.6} />
                          </button>

                          <span className="w-8 text-center text-[13px] text-[#493438]">
                            {formatNumber(qty)}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQty(product.id, size, qty + 1)
                            }
                            aria-label={`${text.increase} ${getProductName(product)}`}
                            className="flex h-10 w-10 items-center justify-center text-[#493438] transition-colors hover:text-[#A66D78]"
                          >
                            <Plus size={14} strokeWidth={1.6} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(product.id, size)
                          }
                          aria-label={`${text.removeProduct} ${getProductName(product)}`}
                          className="flex items-center gap-2 text-[12px] text-[#79686A] transition-colors hover:text-[#A66D78]"
                        >
                          <Trash2 size={15} strokeWidth={1.5} />

                          <span className="hidden sm:inline">
                            {text.remove}
                          </span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ORDER NOTE */}
              <div className="mt-10">
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="order-note"
                    className="font-display text-[24px] font-normal leading-[1.1] text-[#493438]"
                  >
                    {text.noteTitle}
                  </label>

                  <span className="text-[12px] text-[#A89A96]">
                    {text.noteOptional}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {text.noteSuggestions.map((phrase) => {
                    const active = (orderNote || "").includes(phrase);

                    return (
                      <button
                        key={phrase}
                        type="button"
                        onClick={() => addSuggestion(phrase)}
                        aria-pressed={active}
                        className={`rounded-full border px-4 py-2 text-[12.5px] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78] ${
                          active
                            ? "border-[#493438] bg-[#493438] text-white"
                            : "border-[#E3D7D1] bg-white/60 text-[#79686A] hover:border-[#A66D78] hover:text-[#A66D78]"
                        }`}
                      >
                        {phrase}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  id="order-note"
                  name="orderNote"
                  dir="auto"
                  rows={4}
                  maxLength={orderNoteMax}
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                  placeholder={text.notePlaceholder}
                  className="mt-4 w-full resize-none rounded-[18px] border border-[#E3D7D1] bg-white/60 px-5 py-4 text-[14px] leading-[1.8] text-[#493438] placeholder:text-[#A89A96] transition-all duration-300 focus:border-[#A66D78] focus:bg-white focus:shadow-[0_12px_30px_rgba(73,52,56,0.08)] focus:outline-none"
                />

                <div className="mt-2 flex items-center justify-between gap-3 text-[12px] text-[#79686A]">
                  <p>{text.noteHint}</p>

                  <div className="flex shrink-0 items-center gap-3">
                    {orderNote && (
                      <button
                        type="button"
                        onClick={() => setOrderNote("")}
                        className="text-[#A66D78] transition-colors hover:text-[#493438]"
                      >
                        {text.noteClear}
                      </button>
                    )}

                    <span dir="ltr">
                      {formatNumber((orderNote || "").length)} /{" "}
                      {formatNumber(orderNoteMax)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-[24px] border border-[#E3D7D1] bg-[#EDE3DD] p-7 sm:p-8 lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A66D78]">
                {text.yourOrder}
              </p>

              <h2 className="mt-3 font-display text-[30px] font-normal leading-[1.05] text-[#493438]">
                {text.orderSummary}
              </h2>

              <div className="mt-7 border-t border-[#DCCFC9] pt-5">
                <div className="flex items-center justify-between gap-3 text-[14px] text-[#79686A]">
                  <span>{text.subtotal}</span>

                  <span className="font-semibold text-[#493438]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-[14px] text-[#79686A]">
                  <span>{text.delivery}</span>

                  <span className="text-[#493438]">
                    {formatPrice(50)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between gap-3 border-t border-[#DCCFC9] pt-5">
                <span className="text-[14px] font-medium text-[#493438]">
                  {text.total}
                </span>

                <span className="font-display text-[28px] font-normal text-[#493438]">
                  {formatPrice(subtotal + 50)}
                </span>
              </div>

              <p className="mt-4 text-[12px] leading-[1.6] text-[#79686A]">
                {text.deliveryNote}
              </p>

              <Link
                to="/checkout"
               className="mt-7 flex w-full items-center justify-center rounded-full bg-[#493438] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] !text-white transition-colors duration-300 hover:bg-[#62474D] hover:!text-white"
              >
                {text.checkout}
              </Link>

              <Link
                to="/shop"
                className="mt-5 block text-center text-[13px] text-[#A66D78] underline underline-offset-4 transition-colors hover:text-[#493438]"
              >
                {text.continueShopping}
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
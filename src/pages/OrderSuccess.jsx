
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Check,
  Home,
  ShoppingBag,
  Copy,
  CheckCircle,
  Wallet,
  AlertCircle,
  MessageSquareText,
} from "lucide-react";

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api`;
const arabicGovernorates = {
  Cairo: "القاهرة",
  Giza: "الجيزة",
  Alexandria: "الإسكندرية",
  Qalyubia: "القليوبية",
  "Port Said": "بورسعيد",
  Suez: "السويس",
  "Red Sea": "البحر الأحمر",
  "South Sinai": "جنوب سيناء",
  "North Sinai": "شمال سيناء",
  Damietta: "دمياط",
  Dakahlia: "الدقهلية",
  Sharqia: "الشرقية",
  Gharbia: "الغربية",
  Monufia: "المنوفية",
  Beheira: "البحيرة",
  Ismailia: "الإسماعيلية",
  Fayoum: "الفيوم",
  "Beni Suef": "بني سويف",
  Minya: "المنيا",
  Assiut: "أسيوط",
  Sohag: "سوهاج",
  Qena: "قنا",
  Luxor: "الأقصر",
  Aswan: "أسوان",
  "New Valley": "الوادي الجديد",
  Matrouh: "مطروح",
};

const arabicAreas = {
  "New Cairo": "القاهرة الجديدة",
  "Nasr City": "مدينة نصر",
  Heliopolis: "مصر الجديدة",
  Maadi: "المعادي",
  "6th of October": "السادس من أكتوبر",
  "6th of October City": "السادس من أكتوبر",
  "Sheikh Zayed": "الشيخ زايد",
  "New Administrative Capital": "العاصمة الإدارية الجديدة",
  Banha: "بنها",
  Shubra: "شبرا",
  "Shubra El Kheima": "شبرا الخيمة",
  Alexandria: "الإسكندرية",
  "Alexandria City": "مدينة الإسكندرية",
  "Other Area": "منطقة أخرى",
  Other: "أخرى",
};

const productNameTranslations = {
  "hair balm": "بلسم الشعر",
  "lip balm": "بلسم الشفايف",
  "body butter": "زبدة الجسم",
  "strawberry lip scrub": "مقشر الشفايف بالفراولة",
  "face mask": "ماسك الوجه",
  "lip scrub": "مقشر الشفايف",
  "hair oil": "زيت الشعر",
  "body oil": "زيت الجسم",
  "body lotion": "لوشن الجسم",
  "face scrub": "مقشر الوجه",
  "hair mask": "ماسك الشعر",
  "body scrub": "مقشر الجسم",
};

const OrderSuccess = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const [instaPayPhone, setInstaPayPhone] = useState("");
  const [paymentDetailsLoading, setPaymentDetailsLoading] =
    useState(false);
  const [paymentDetailsError, setPaymentDetailsError] = useState("");
  const [copied, setCopied] = useState(false);
  const [livePaymentStatus, setLivePaymentStatus] = useState("");
  const [liveOrderStatus, setLiveOrderStatus] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const order = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("nyora-last-order");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // Load InstaPay number from the backend.
  useEffect(() => {
    if (order?.payment !== "instapay") return;

    const controller = new AbortController();

    const loadPaymentDetails = async () => {
      setPaymentDetailsLoading(true);
      setPaymentDetailsError("");

      try {
        const response = await fetch(
          `${API_URL}/payment-settings`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("PAYMENT_DETAILS_UNAVAILABLE");
        }

        const phone = String(
          result.data?.instaPayPhone || ""
        ).trim();

        if (!phone) {
          throw new Error("PAYMENT_DETAILS_UNAVAILABLE");
        }

        setInstaPayPhone(phone);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Could not load InstaPay details:", error);
        setPaymentDetailsError("PAYMENT_DETAILS_UNAVAILABLE");
      } finally {
        if (!controller.signal.aborted) {
          setPaymentDetailsLoading(false);
        }
      }
    };

    loadPaymentDetails();

    return () => controller.abort();
  }, [order?.payment]);

  // Refresh payment and order status every 5 seconds.
  useEffect(() => {
    if (
      order?.payment !== "instapay" ||
      !order?.orderNumber ||
      !order?.customer?.email
    ) {
      return;
    }

    let cancelled = false;
    let intervalId;

    const checkPaymentStatus = async () => {
      try {
        const params = new URLSearchParams({
          email: order.customer.email,
        });

        const response = await fetch(
          `${API_URL}/orders/${encodeURIComponent(
            order.orderNumber
          )}/payment-status?${params.toString()}`
        );

        const result = await response.json();

        if (!response.ok || !result.success || cancelled) {
          return;
        }

        const paymentStatus = String(
          result.data?.paymentStatus || ""
        ).toLowerCase();

        const orderStatus = String(
          result.data?.status || ""
        ).toLowerCase();

        if (
          ["pending_payment", "paid"].includes(paymentStatus)
        ) {
          setLivePaymentStatus(paymentStatus);
        }

        if (
          [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
          ].includes(orderStatus)
        ) {
          setLiveOrderStatus(orderStatus);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Could not refresh order status:",
            error
          );
        }
      }
    };

    checkPaymentStatus();

    intervalId = window.setInterval(
      checkPaymentStatus,
      5000
    );

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [
    order?.orderNumber,
    order?.payment,
    order?.customer?.email,
  ]);

  const t = (english, arabic) =>
    isArabic ? arabic : english;

  const formatNumber = (value) => {
    const number = Number(value ?? 0);

    if (!Number.isFinite(number)) {
      return value ?? "";
    }

    return number.toLocaleString(
      isArabic ? "ar-EG" : "en-US",
      { maximumFractionDigits: 2 }
    );
  };

  const formatPrice = (value) =>
    `${formatNumber(value)} ${t("EGP", "جنيه")}`;

  const getProductName = (name = "") => {
    if (!isArabic || !name) return name;

    if (/[\u0600-\u06FF]/.test(name)) {
      return name;
    }

    return (
      productNameTranslations[name.trim().toLowerCase()] ||
      name
    );
  };

  const getLocationName = (name = "") => {
    if (!isArabic || !name) return name;

    if (/[\u0600-\u06FF]/.test(name)) {
      return name;
    }

    return (
      arabicGovernorates[name] ||
      arabicAreas[name] ||
      name
    );
  };

  const formatSize = (size) => {
    if (!size) return "";
    if (!isArabic) return String(size);

    return String(size)
      .replace(
        /(\d+(?:\.\d+)?)\s*(ml|mL|مل)/gi,
        (_, number) => `${formatNumber(number)} مل`
      )
      .replace(
        /(\d+(?:\.\d+)?)\s*(g|gm|grams?|جرام)/gi,
        (_, number) => `${formatNumber(number)} جرام`
      );
  };

  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  // Support both order-note field names in case the backend
  // uses orderNote or note.
  const orderNote = String(
    order?.orderNote || order?.note || ""
  ).trim();

  const handleCopyPhone = async () => {
    if (!instaPayPhone) return;

    try {
      await navigator.clipboard.writeText(instaPayPhone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!order) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        lang={isArabic ? "ar" : "en"}
        className="flex min-h-[75vh] items-center justify-center bg-[#F8F4EF] px-6 py-24"
      >
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A66D78]">
            Nyora Beauty
          </p>

          <h1 className="mt-5 font-display text-[36px] font-normal text-[#493438] sm:text-[48px]">
            {t("No order found", "لم يتم العثور على طلب")}
          </h1>

          <p className="mx-auto mt-4 max-w-[400px] text-[15px] leading-[1.8] text-[#79686A]">
            {t(
              "We couldn't find a recent order. You can continue shopping from here.",
              "لم نتمكن من العثور على طلب حديث. يمكنكِ متابعة التسوق من هنا."
            )}
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold text-white transition-colors duration-300 hover:bg-[#62474D]"
          >
            <ShoppingBag size={14} strokeWidth={1.8} />
            {t("Continue shopping", "متابعة التسوق")}
          </Link>
        </div>
      </main>
    );
  }

  const customer = order.customer || {};
  const isInstaPay = order.payment === "instapay";

  const paymentStatus = String(
    livePaymentStatus || order.paymentStatus || ""
  ).toLowerCase();

  const orderStatus = String(
    liveOrderStatus || order.status || "pending"
  ).toLowerCase();

  const isPaymentConfirmed = paymentStatus === "paid";
  const isOrderCancelled = orderStatus === "cancelled";

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="min-h-[75vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[900px]">
        {/* SUCCESS HEADER */}
        <section className="text-center">
          <div className="mx-auto flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFFDFC]">
              <Check size={25} strokeWidth={1.8} />
            </div>
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A66D78]">
            {t("Order received", "تم استلام الطلب")}
          </p>

          <h1
            className="mt-4 font-display font-normal leading-[1.15] text-[#493438]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            {t("Thank you for", "شكرًا لاختياركِ")}{" "}
            <span className="italic text-[#A66D78]">
              {t("choosing Nyora", "نيورا")}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-[520px] text-[15px] leading-[1.8] text-[#79686A]">
            {t(
              "Your order has been received successfully. We'll prepare everything with care.",
              "تم استلام طلبكِ بنجاح، وسنجهز كل شيء بعناية من أجلكِ."
            )}
          </p>
        </section>

        {/* ORDER CARD */}
        <section className="mt-12 overflow-hidden rounded-[26px] border border-[#E3D7D1] bg-[#FFFDFC]">
          <div className="border-b border-[#E3D7D1] bg-[#EDE3DD] px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A66D78]">
                  {t("Order number", "رقم الطلب")}
                </p>

                <p
                  className="mt-1 font-display text-[25px] font-normal text-[#493438]"
                  dir="ltr"
                >
                  {order.orderNumber || "—"}
                </p>
              </div>

              <div className="rounded-full bg-[#FFFDFC] px-4 py-2 text-[11px] font-medium text-[#A66D78]">
                {isInstaPay
                  ? "InstaPay"
                  : t("Cash on delivery", "الدفع عند الاستلام")}
              </div>
            </div>
          </div>

          {/* CUSTOMER AND DELIVERY */}
          <div className="grid sm:grid-cols-2">
            <div className="border-b border-[#E3D7D1] p-6 sm:border-e sm:px-8 sm:py-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
                {t("Customer", "بيانات العميلة")}
              </p>

              <p className="mt-3 text-[14px] font-medium text-[#493438]">
                {customer.fullName || "—"}
              </p>

              <p className="mt-1 text-[12px] text-[#79686A]" dir="ltr">
                {customer.phone || "—"}
              </p>

              <p className="mt-1 break-all text-[12px] text-[#79686A]" dir="ltr">
                {customer.email || "—"}
              </p>
            </div>

            <div className="border-b border-[#E3D7D1] p-6 sm:px-8 sm:py-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
                {t("Delivery details", "بيانات التوصيل")}
              </p>

              <p className="mt-3 text-[13px] font-medium text-[#493438]">
                {getLocationName(customer.city)}
                {customer.city && customer.governorate ? "، " : ""}
                {getLocationName(customer.governorate)}
              </p>

              <p className="mt-1 text-[12px] leading-[1.7] text-[#79686A]">
                {customer.address || "—"}
              </p>

              {customer.apartment && (
                <p className="mt-1 text-[12px] text-[#79686A]">
                  {customer.apartment}
                </p>
              )}
            </div>
          </div>

          {/* ORDER NOTE */}
          {orderNote && (
            <div className="border-b border-[#E3D7D1] px-6 py-6 sm:px-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
                  <MessageSquareText size={19} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
                    {t("Order note", "ملاحظات الطلب")}
                  </p>

                  <p
                    dir="auto"
                    className="mt-3 whitespace-pre-wrap break-words text-[13px] leading-[1.9] text-[#493438]"
                  >
                    {orderNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          <div className="px-6 py-7 sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
              {t("Your items", "المنتجات")}
            </p>

            <div className="mt-5 divide-y divide-[#E3D7D1]">
              {items.map((item, index) => {
                const product = item.product || item;
                const qty = Number(item.qty ?? item.quantity ?? 1);
                const price = Number(product.price ?? item.price ?? 0);
                const size = item.size ?? product.size ?? "";
                const image = product.image || item.image || "";
                const name = getProductName(
                  product.name || item.name || ""
                );

                return (
                  <div
                    key={`${product.id || item.id || index}-${size}-${index}`}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-[#EDE3DD]">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#A66D78]">
                          <ShoppingBag size={22} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-[#493438]">
                        {name}
                      </p>

                      <p className="mt-1 text-[11px] text-[#79686A]">
                        {size ? `${formatSize(size)} · ` : ""}
                        {t("Qty", "الكمية")} {formatNumber(qty)}
                      </p>
                    </div>

                    <p className="shrink-0 text-[13px] font-medium text-[#493438]">
                      {formatPrice(item.lineTotal ?? price * qty)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOTAL */}
          <div className="border-t border-[#E3D7D1] bg-[#F8F4EF] px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#79686A]">
                {t("Subtotal", "المجموع الفرعي")}
              </span>
              <span className="text-[13px] text-[#493438]">
                {formatPrice(order.subtotal)}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#79686A]">
                {t("Delivery", "التوصيل")}
              </span>
              <span className="text-[13px] text-[#493438]">
                {formatPrice(order.delivery)}
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#E3D7D1] pt-5">
              <span className="text-[14px] font-medium text-[#493438]">
                {t("Total", "الإجمالي")}
              </span>
              <span className="font-display text-[26px] font-normal text-[#493438] sm:text-[30px]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </section>

        {/* INSTAPAY PAYMENT */}
        {isInstaPay && (
          <section className="mt-7 rounded-[22px] border border-[#E3D7D1] bg-[#FFFDFC] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
                <Wallet size={21} />
              </div>

              <div>
                <h2 className="font-display text-[25px] font-normal text-[#493438]">
                  {t("Pay with InstaPay", "الدفع عن طريق InstaPay")}
                </h2>

                <p className="mt-1 text-[12px] text-[#79686A]">
                  {t(
                    "Transfer the exact order total below.",
                    "حوّلي إجمالي الطلب الموضح أدناه بالضبط."
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[16px] bg-[#F8F4EF] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A66D78]">
                {t("Amount to transfer", "المبلغ المطلوب تحويله")}
              </p>

              <p className="mt-2 font-display text-[32px] text-[#493438]">
                {formatPrice(order.total)}
              </p>

              <p className="mt-1 text-[12px] text-[#79686A]">
                {t("Order", "الطلب")} #{order.orderNumber || "—"}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A66D78]">
                {t(
                  "InstaPay mobile number",
                  "رقم الموبايل المرتبط بـ InstaPay"
                )}
              </p>

              {paymentDetailsLoading ? (
                <p className="mt-3 text-[13px] text-[#79686A]">
                  {t(
                    "Loading payment details...",
                    "جاري تحميل بيانات الدفع..."
                  )}
                </p>
              ) : instaPayPhone ? (
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <div
                    className="flex min-h-12 flex-1 items-center rounded-full border border-[#E3D7D1] bg-white px-5 text-[16px] font-medium text-[#493438]"
                    dir="ltr"
                  >
                    {instaPayPhone}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#493438] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#62474D]"
                  >
                    {copied ? (
                      <CheckCircle size={15} />
                    ) : (
                      <Copy size={15} />
                    )}

                    {copied
                      ? t("Copied", "تم النسخ")
                      : t("Copy number", "نسخ الرقم")}
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-start gap-3 rounded-[14px] border border-[#E3D7D1] bg-[#F8F4EF] p-4 text-[13px] leading-[1.8] text-[#79686A]">
                  <AlertCircle
                    className="mt-1 shrink-0 text-[#A66D78]"
                    size={18}
                  />
                  <p>
                    {t(
                      "InstaPay details are temporarily unavailable. Please contact Nyora Beauty before transferring.",
                      "بيانات InstaPay غير متاحة حاليًا. من فضلك تواصلي مع Nyora Beauty قبل التحويل."
                    )}
                  </p>
                </div>
              )}
            </div>

            <ol className="mt-6 space-y-3 text-[13px] leading-[1.8] text-[#79686A]">
              <li>
                <span className="me-2 font-semibold text-[#A66D78]">
                  01
                </span>
                {t(
                  "Open InstaPay and transfer the exact amount to the number above.",
                  "افتحي InstaPay وحوّلي المبلغ المحدد إلى الرقم الموضح."
                )}
              </li>

              <li>
                <span className="me-2 font-semibold text-[#A66D78]">
                  02
                </span>
                {t(
                  "Keep your transfer confirmation and reference number.",
                  "احتفظي بتأكيد التحويل والرقم المرجعي للعملية."
                )}
              </li>

              <li>
                <span className="me-2 font-semibold text-[#A66D78]">
                  03
                </span>
                {t(
                  "Your payment will remain pending until Nyora Beauty verifies receipt of the money.",
                  "سيظل الدفع قيد الانتظار لحد ما نتأكد من وصول الفلوس فعلًا."
                )}
              </li>
            </ol>

            <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-[#E3D7D1] p-4">
              {isOrderCancelled ? (
                <AlertCircle
                  className="mt-0.5 shrink-0 text-[#A66D78]"
                  size={19}
                />
              ) : isPaymentConfirmed ? (
                <CheckCircle
                  className="mt-0.5 shrink-0 text-[#64866A]"
                  size={19}
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 shrink-0 text-[#A66D78]"
                  size={19}
                />
              )}

              <div>
                <p className="text-[13px] font-semibold text-[#493438]">
                  {isOrderCancelled
                    ? t("Order cancelled", "تم إلغاء الطلب")
                    : isPaymentConfirmed
                    ? t("Payment confirmed", "تم تأكيد الدفع")
                    : t(
                        "Awaiting payment verification",
                        "في انتظار تأكيد الدفع"
                      )}
                </p>

                <p className="mt-1 text-[12px] leading-[1.8] text-[#79686A]">
                  {isOrderCancelled
                    ? t(
                        "This order has been cancelled. Please contact Nyora Beauty if you already transferred the money.",
                        "تم إلغاء الطلب. تواصلي مع Nyora Beauty لو كنتِ حولتِ الفلوس بالفعل."
                      )
                    : isPaymentConfirmed
                    ? t(
                        "Nyora Beauty has marked this payment as paid.",
                        "تم تسجيل الدفع على أنه مدفوع."
                      )
                    : t(
                        "Placing the order does not mean the transfer has been received or verified.",
                        "إنشاء الطلب لا يعني إن التحويل وصل أو تم تأكيده."
                      )}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* PAYMENT REMINDER */}
        {!isInstaPay && (
          <div className="mt-7 rounded-[20px] border border-[#E3D7D1] bg-[#EDE3DD] p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A66D78]">
              {t("Payment reminder", "تذكير بالدفع")}
            </p>

            <p className="mx-auto mt-3 max-w-[500px] text-[13px] leading-[1.8] text-[#79686A]">
              {t(
                "Please prepare the order amount to pay when your order arrives.",
                "يرجى تجهيز قيمة الطلب للدفع عند وصوله."
              )}
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold text-white transition-colors duration-300 hover:bg-[#62474D]"
          >
            <ShoppingBag size={14} strokeWidth={1.8} />
            {t("Continue shopping", "متابعة التسوق")}
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#E3D7D1] px-8 py-3.5 text-[11px] font-bold text-[#493438] transition-all duration-300 hover:border-[#A66D78] hover:text-[#A66D78]"
          >
            <Home size={14} strokeWidth={1.8} />
            {t("Back home", "العودة للرئيسية")}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;

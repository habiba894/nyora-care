import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Check, ChevronDown, ChevronRight, MapPin,
  ShoppingBag, User, Banknote, Wallet, MessageSquareText,
} from "lucide-react";
import {
  FaInstagram, FaFacebook, FaTiktok, FaWhatsapp,
} from "react-icons/fa";
import { useStore } from "../context/StoreContext";
import { useTranslation } from "react-i18next";

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api`;
const DELIVERY_FEE = 50;

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/nyora.care/",
  facebook: "https://www.facebook.com/share/g/1CDXxUFCcs/",
  tiktok: "https://www.tiktok.com/@nyora.care",
  whatsapp: "https://wa.me/201036156158",
};

const egyptLocations = {
  Cairo: [
    "Downtown", "Garden City", "Zamalek", "Maadi", "New Maadi",
    "Nasr City", "Heliopolis", "New Cairo", "Fifth Settlement",
    "Rehab City", "Madinaty", "Shorouk City", "Badr City",
    "Obour City", "Shubra", "Ain Shams", "Hadayek El Kobba",
    "Abbassia", "Roxy", "Sheraton", "Nozha", "Mokattam",
    "Helwan", "Dar El Salam", "Sayeda Zeinab", "Other Area",
  ],
  Alexandria: [
    "Smouha", "Sidi Gaber", "Gleem", "Stanley", "San Stefano",
    "Miami", "Mandara", "Montaza", "Asafra", "Agami",
    "Borg El Arab", "Kafr Abdo", "Roushdy", "Sporting",
    "Camp Caesar", "Ibrahimia", "Mahatet El Raml", "Mansheya",
    "Dekheila", "Abu Qir", "Amreya", "Other Area",
  ],
  Giza: [
    "Dokki", "Mohandessin", "Agouza", "Haram", "Faisal",
    "Giza Square", "Imbaba", "Warraq", "Bulaq El Dakrour",
    "6th of October", "Sheikh Zayed", "Hadayek October",
    "New Giza", "Haram Gardens", "Kerdasa", "Abu Rawash",
    "Hawamdeya", "Badrasheen", "Ayyat", "Other Area",
  ],
  Qalyubia: [
    "Banha", "Shubra El Kheima", "Qalyub", "Obour City",
    "Khanka", "Khosous", "Kafr Shukr", "Toukh",
    "Qanater El Khairia", "Shibin El Qanater", "Qaha",
    "Mostorod", "Other Area",
  ],
  Sharqia: [
    "Zagazig", "10th of Ramadan", "Belbeis", "Minya El Qamh",
    "Fakous", "Abu Hammad", "Abu Kebir", "Hehia",
    "Kafr Saqr", "Awlad Saqr", "Mashtoul El Souk",
    "El Ibrahimia", "Other Area",
  ],
  Dakahlia: [
    "Mansoura", "Talkha", "Mit Ghamr", "Aga", "Dekernes",
    "Sherbin", "Manzala", "Gamasa", "Bani Ebeid", "Nabaroh",
    "Sinbillawain", "Mit Salsil", "Other Area",
  ],
  Gharbia: [
    "Tanta", "El Mahalla El Kubra", "Kafr El Zayat", "Zefta",
    "Samanoud", "Santa", "Qutur", "Basyoun", "Other Area",
  ],
  Beheira: [
    "Damanhur", "Kafr El Dawwar", "Rashid", "Edko",
    "Abu Hummus", "Kom Hamada", "Hosh Essa", "Itay El Barud",
    "Delengat", "Wadi El Natrun", "Other Area",
  ],
  "Kafr El Sheikh": [
    "Kafr El Sheikh", "Desouk", "Baltim", "Fouh", "Metoubes",
    "Sidi Salem", "Biyala", "Qallin", "Hamoul", "Other Area",
  ],
  Monufia: [
    "Shebin El Kom", "Menouf", "Ashmoun", "Tala", "Quesna",
    "Sadat City", "Berket El Sab", "Sers El Layan", "Bagour",
    "Other Area",
  ],
  Damietta: [
    "Damietta", "New Damietta", "Ras El Bar", "Kafr Saad",
    "Faraskour", "Zarqa", "Kafr El Batikh", "Other Area",
  ],
  "Port Said": [
    "Port Fouad", "Al Arab", "Al Manakh", "Al Dawahi",
    "Al Sharq", "Al Zohour", "Al Janoub", "Other Area",
  ],
  Ismailia: [
    "Ismailia City", "Fayed", "Qantara East", "Qantara West",
    "Tell El Kebir", "Abu Suweir", "El Qassasin", "Other Area",
  ],
  Suez: [
    "Suez City", "Arbaeen", "Attaka", "Faisal",
    "Ganayen", "Ain Sokhna", "Other Area",
  ],
  "North Sinai": [
    "Arish", "Bir El Abd", "Sheikh Zuweid", "Rafah",
    "Nekhel", "Hasana", "Other Area",
  ],
  "South Sinai": [
    "Sharm El Sheikh", "Dahab", "Nuweiba", "Taba",
    "Saint Catherine", "Tor Sinai", "Ras Sidr", "Abu Rudeis",
    "Other Area",
  ],
  "Red Sea": [
    "Hurghada", "El Gouna", "Safaga", "El Quseir",
    "Marsa Alam", "Ras Gharib", "Shalateen", "Halayeb",
    "Other Area",
  ],
  Fayoum: [
    "Fayoum City", "Itsa", "Senouris", "Tamiya",
    "Youssef El Seddik", "Other Area",
  ],
  "Beni Suef": [
    "Beni Suef City", "New Beni Suef", "Al Wasta", "Nasser",
    "Ihnasia", "Biba", "Fashn", "Samasta", "Other Area",
  ],
  Minya: [
    "Minya City", "New Minya", "Mallawi", "Samalut",
    "Maghagha", "Beni Mazar", "Abu Qurqas", "Deir Mawas",
    "Matai", "Other Area",
  ],
  Assiut: [
    "Assiut City", "New Assiut", "Dairut", "Manfalut",
    "Qusiya", "Abnoub", "Abu Tig", "El Ghanayem", "Other Area",
  ],
  Sohag: [
    "Sohag City", "New Sohag", "Akhmim", "Girga", "Tahta",
    "Juhayna", "El Balyana", "Dar El Salam", "El Maragha",
    "Other Area",
  ],
  Qena: [
    "Qena City", "Nag Hammadi", "Qus", "Dishna", "Farshut",
    "Abu Tesht", "Naqada", "Other Area",
  ],
  Luxor: [
    "Luxor City", "Karnak", "New Luxor", "Esna", "Armant",
    "Al Bayadiya", "Other Area",
  ],
  Aswan: [
    "Aswan City", "New Aswan", "Edfu", "Kom Ombo", "Daraw",
    "Nasr El Nuba", "Abu Simbel", "Other Area",
  ],
  "New Valley": [
    "Kharga", "Dakhla", "Farafra", "Baris", "Balat",
    "Other Area",
  ],
  Matrouh: [
    "Marsa Matrouh", "El Alamein", "New Alamein", "Dabaa",
    "Siwa", "Sallum", "Sidi Barrani", "Other Area",
  ],
};

const arabicGovernorates = {
  Cairo: "القاهرة",
  Alexandria: "الإسكندرية",
  Giza: "الجيزة",
  Qalyubia: "القليوبية",
  Sharqia: "الشرقية",
  Dakahlia: "الدقهلية",
  Gharbia: "الغربية",
  Beheira: "البحيرة",
  "Kafr El Sheikh": "كفر الشيخ",
  Monufia: "المنوفية",
  Damietta: "دمياط",
  "Port Said": "بورسعيد",
  Ismailia: "الإسماعيلية",
  Suez: "السويس",
  "North Sinai": "شمال سيناء",
  "South Sinai": "جنوب سيناء",
  "Red Sea": "البحر الأحمر",
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
  Downtown: "وسط البلد",
  "Garden City": "جاردن سيتي",
  Zamalek: "الزمالك",
  Maadi: "المعادي",
  "New Maadi": "المعادي الجديدة",
  "Nasr City": "مدينة نصر",
  Heliopolis: "مصر الجديدة",
  "New Cairo": "القاهرة الجديدة",
  "Fifth Settlement": "التجمع الخامس",
  "Rehab City": "الرحاب",
  Madinaty: "مدينتي",
  "Shorouk City": "الشروق",
  "Badr City": "مدينة بدر",
  "Obour City": "العبور",
  Shubra: "شبرا",
  "Ain Shams": "عين شمس",
  "Hadayek El Kobba": "حدائق القبة",
  Abbassia: "العباسية",
  Roxy: "روكسي",
  Sheraton: "شيراتون",
  Nozha: "النزهة",
  Mokattam: "المقطم",
  Helwan: "حلوان",
  "Dar El Salam": "دار السلام",
  "Sayeda Zeinab": "السيدة زينب",
  "Other Area": "منطقة أخرى",
  Smouha: "سموحة",
  "Sidi Gaber": "سيدي جابر",
  Gleem: "جليم",
  Stanley: "ستانلي",
  "San Stefano": "سان ستيفانو",
  Miami: "ميامي",
  Mandara: "المندرة",
  Montaza: "المنتزه",
  Asafra: "العصافرة",
  Agami: "العجمي",
  "Borg El Arab": "برج العرب",
  "Kafr Abdo": "كفر عبده",
  Roushdy: "رشدي",
  Sporting: "سبورتنج",
  "Camp Caesar": "كامب شيزار",
  Ibrahimia: "الإبراهيمية",
  "Mahatet El Raml": "محطة الرمل",
  Mansheya: "المنشية",
  Dekheila: "الدخيلة",
  "Abu Qir": "أبو قير",
  Amreya: "العامرية",
  Dokki: "الدقي",
  Mohandessin: "المهندسين",
  Agouza: "العجوزة",
  Haram: "الهرم",
  Faisal: "فيصل",
  "Giza Square": "ميدان الجيزة",
  Imbaba: "إمبابة",
  Warraq: "الوراق",
  "Bulaq El Dakrour": "بولاق الدكرور",
  "6th of October": "٦ أكتوبر",
  "Sheikh Zayed": "الشيخ زايد",
  "Hadayek October": "حدائق أكتوبر",
  "New Giza": "نيو جيزة",
  "Haram Gardens": "حدائق الأهرام",
  Kerdasa: "كرداسة",
  "Abu Rawash": "أبو رواش",
  Hawamdeya: "الحوامدية",
  Badrasheen: "البدرشين",
  Ayyat: "العياط",
  Banha: "بنها",
  "Shubra El Kheima": "شبرا الخيمة",
  Qalyub: "قليوب",
  Khanka: "الخانكة",
  Khosous: "الخصوص",
  "Kafr Shukr": "كفر شكر",
  Toukh: "طوخ",
  "Qanater El Khairia": "القناطر الخيرية",
  "Shibin El Qanater": "شبين القناطر",
  Qaha: "قها",
  Mostorod: "مسطرد",
};

const inputBase =
  "mt-2 w-full rounded-[14px] border bg-[#FFFDFC] px-4 py-3.5 text-[14px] text-[#493438] outline-none transition-all duration-300 placeholder:text-[#A89A96] focus:border-[#A66D78] focus:ring-2 focus:ring-[#A66D78]/10";

function SectionIcon({ children }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
      {children}
    </div>
  );
}

function CustomDropdown({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  error,
  disabled = false,
  isArabic,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!event.target.closest(`[data-dropdown="${id}"]`)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    document.addEventListener("touchstart", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
      document.removeEventListener("touchstart", closeDropdown);
    };
  }, [id]);

  return (
    <div className="relative min-w-0" data-dropdown={id}>
      <label htmlFor={id} className="text-[12px] font-medium text-[#493438]">
        {label}
      </label>

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((previous) => !previous)}
        className={`mt-2 flex min-h-[49px] w-full items-center justify-between gap-3 rounded-[14px] border bg-[#FFFDFC] px-4 py-3.5 text-left text-[14px] outline-none transition-all disabled:cursor-not-allowed disabled:bg-[#F4EEEA] ${
          error || open
            ? "border-[#A66D78]"
            : "border-[#E3D7D1] hover:border-[#A66D78]"
        }`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${
            value ? "text-[#493438]" : "text-[#A89A96]"
          }`}
        >
          {(value && isArabic
            ? arabicGovernorates[value] || arabicAreas[value] || value
            : value) || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#79686A] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {error && (
        <p className="mt-1.5 text-[11px] text-[#A66D78]">{error}</p>
      )}

      {open && !disabled && (
        <div className="absolute left-0 top-full z-[100] mt-2 w-full overflow-hidden rounded-[16px] border border-[#E3D7D1] bg-[#FFFDFC] shadow-[0_18px_45px_rgba(73,52,56,0.16)]">
          <div
            role="listbox"
            className="max-h-[220px] overflow-y-auto overscroll-contain p-1.5"
          >
            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13px] transition-colors ${
                    selected
                      ? "bg-[#EDE3DD] font-medium text-[#493438]"
                      : "text-[#79686A] hover:bg-[#F8F4EF] hover:text-[#A66D78]"
                  }`}
                >
                  <span>
                    {isArabic
                      ? arabicGovernorates[option] ||
                        arabicAreas[option] ||
                        option
                      : option}
                  </span>
                  {selected && (
                    <Check size={15} className="shrink-0 text-[#A66D78]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3D7D1] bg-[#FFFDFC] text-[#493438] transition-all duration-300 hover:-translate-y-1 hover:border-[#A66D78] hover:bg-[#A66D78] hover:text-white"
    >
      {children}
    </a>
  );
}

function PaymentOption({
  selected,
  onClick,
  icon,
  title,
  description,
  badge,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative flex h-full items-start gap-3 rounded-[18px] border p-5 text-left transition-all duration-300 ${
        selected
          ? "border-[#A66D78] bg-[#F8F4EF]"
          : "border-[#E3D7D1] bg-[#FFFDFC] hover:border-[#A66D78]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-[#A66D78] bg-[#A66D78]"
            : "border-[#CDBDB7]"
        }`}
      >
        {selected && (
          <Check size={14} strokeWidth={2} className="text-white" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[14px] font-medium text-[#493438]">
          <span className="text-[#79686A]">{icon}</span>
          {title}
        </span>

        <span className="mt-2 block text-[12px] leading-[1.6] text-[#79686A]">
          {description}
        </span>

        {badge && (
          <span className="mt-3 inline-flex rounded-full bg-[#EDE3DD] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#79686A]">
            {badge}
          </span>
        )}
      </span>
    </button>
  );
}

const Checkout = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString(isArabic ? "ar-EG" : "en-US");
  const tr = (english, arabic) => (isArabic ? arabic : english);

  const {
    cart,
    products = [],
    productsLoading = false,
    orderNote,
    setOrderNote,
    orderNoteMax,
    clearOrderNote,
  } = useStore();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    apartment: "",
  });

  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const subtotal = useMemo(
    () =>
      lines.reduce(
        (sum, line) =>
          sum +
          Number(line.product.price || 0) *
            Number(line.qty || line.quantity || 0),
        0
      ),
    [lines]
  );

  const delivery = DELIVERY_FEE;
  const total = subtotal + delivery;
  const cityOptions = egyptLocations[form.governorate] || [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
    setSubmitError("");
  };

  const handleGovernorateChange = (governorate) => {
    setForm((previous) => ({ ...previous, governorate, city: "" }));
    setErrors((previous) => ({
      ...previous,
      governorate: "",
      city: "",
    }));
    setSubmitError("");
  };

  const handleCityChange = (city) => {
    setForm((previous) => ({ ...previous, city }));
    setErrors((previous) => ({ ...previous, city: "" }));
    setSubmitError("");
  };

  const inputClass = (name) =>
    `${inputBase} ${
      errors[name] ? "border-[#A66D78]" : "border-[#E3D7D1]"
    }`;

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = tr(
        "Please enter your full name.",
        "من فضلك اكتبي الاسم بالكامل."
      );
    }

    if (!form.email.trim()) {
      nextErrors.email = tr(
        "Please enter your email.",
        "من فضلك اكتبي البريد الإلكتروني."
      );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = tr(
        "Please enter a valid email.",
        "من فضلك اكتبي بريدًا إلكترونيًا صحيحًا."
      );
    }

    if (!form.phone.trim()) {
      nextErrors.phone = tr(
        "Please enter your phone number.",
        "من فضلك اكتبي رقم الهاتف."
      );
    } else if (!/^(?:\+?20|0)?1[0125]\d{8}$/.test(form.phone.trim())) {
      nextErrors.phone = tr(
        "Please enter a valid Egyptian mobile number.",
        "من فضلك اكتبي رقم موبايل مصري صحيح."
      );
    }

    if (!form.governorate) {
      nextErrors.governorate = tr(
        "Please select your governorate.",
        "من فضلك اختاري المحافظة."
      );
    }

    if (!form.city) {
      nextErrors.city = tr(
        "Please select your city or area.",
        "من فضلك اختاري المدينة أو المنطقة."
      );
    }

    if (!form.address.trim()) {
      nextErrors.address = tr(
        "Please enter your delivery address.",
        "من فضلك اكتبي عنوان التوصيل."
      );
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (productsLoading) {
      setSubmitError(
        tr(
          "Please wait while products are loading.",
          "من فضلك انتظري لحد ما المنتجات تتحمّل."
        )
      );
      return;
    }

    if (lines.length === 0) {
      setSubmitError(
        tr(
          "Your cart is empty. Please add a product first.",
          "سلة التسوق فارغة. من فضلك أضيفي منتجًا أولًا."
        )
      );
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const orderItems = lines.map(({ product, size, qty, quantity }) => {
        const databaseId = product._id || product.mongoId;

        if (!databaseId) {
          throw new Error(
            tr(
              `The database ID for ${product.name} is missing. Refresh the shop and try again.`,
              `بيانات المنتج ${product.nameAr || product.name} غير مكتملة. حدّثي صفحة المتجر وحاولي مرة تانية.`
            )
          );
        }

        return {
          id: databaseId,
          size: size || "",
          qty: Number(qty ?? quantity ?? 1),
        };
      });

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            ...form,
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            governorate: form.governorate.trim(),
            city: form.city.trim(),
            address: form.address.trim(),
            apartment: form.apartment.trim(),
          },
          payment,
          items: orderItems,
          orderNote: orderNote.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message ||
            tr("Could not place your order.", "تعذر تأكيد طلبك.")
        );
      }

      const savedOrder = result.data;

      const displayItems = (savedOrder.items || []).map((item) => {
        const matchingLine = lines.find(
          (line) =>
            String(line.product._id || line.product.mongoId || "") ===
            String(item.product || "")
        );

        return {
          id: String(item.product || ""),
          name: item.name,
          price: Number(item.price),
          image: matchingLine?.product?.image || item.image || "",
          category: item.category || "",
          size: item.size || "",
          qty: Number(item.qty),
          lineTotal: Number(item.lineTotal),
        };
      });

      const orderForSuccessPage = {
        ...savedOrder,
        orderNumber: savedOrder.orderNumber,
        customer: savedOrder.customer,
        payment: savedOrder.payment,
        paymentStatus: savedOrder.paymentStatus,
        subtotal: savedOrder.subtotal,
        delivery: savedOrder.delivery,
        total: savedOrder.total,
        orderNote: savedOrder.orderNote || orderNote.trim(),
        items: displayItems,
      };

      sessionStorage.setItem(
        "nyora-last-order",
        JSON.stringify(orderForSuccessPage)
      );

      clearOrderNote();
      navigate("/order-success");
    } catch (error) {
      console.error("Place order error:", error);
      setSubmitError(
        error.message ||
          tr(
            "Something went wrong while placing your order. Please try again.",
            "حصلت مشكلة أثناء تأكيد الطلب. حاولي مرة تانية."
          )
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (productsLoading && products.length === 0) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[75vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-[900px] py-20 text-center">
          <p className="text-[14px] text-[#79686A]">
            {tr("Loading your order...", "جاري تجهيز طلبك...")}
          </p>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className="min-h-[75vh] bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-[900px] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
            <ShoppingBag size={25} strokeWidth={1.5} />
          </div>

          <h1 className="mt-7 font-display text-[42px] font-normal leading-[1] text-[#493438] sm:text-[52px]">
            {tr("Your cart is empty", "سلة التسوق فارغة")}
          </h1>

          <p className="mx-auto mt-4 max-w-[430px] text-[15px] leading-[1.7] text-[#79686A]">
            {tr(
              "Add something you love before continuing to checkout.",
              "ضيفي المنتجات اللي بتحبيها قبل ما تكملي الطلب."
            )}
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#A66D78]"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            {tr("Back to shop", "العودة للمتجر")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="min-h-[75vh] overflow-x-clip bg-[#F8F4EF] px-6 pb-28 pt-[140px] sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label={tr("Breadcrumb", "مسار الصفحة")} className="text-[13px] text-[#79686A]">
          <Link to="/" className="transition-colors hover:text-[#A66D78]">
            {tr("Home", "الرئيسية")}
          </Link>
          <span className="mx-2 text-[#D8CBC5]">/</span>
          <Link to="/cart" className="transition-colors hover:text-[#A66D78]">
            {tr("Cart", "السلة")}
          </Link>
          <span className="mx-2 text-[#D8CBC5]">/</span>
          <span className="text-[#493438]">
            {tr("Checkout", "إتمام الطلب")}
          </span>
        </nav>

        <header className="mt-5 max-w-[650px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A66D78]">
            {tr("Complete your order", "أكملي طلبك")}
          </p>

          <h1
            className="mt-4 font-display font-normal leading-[0.95] tracking-[-0.03em] text-[#493438]"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            {isArabic ? (
              "إتمام الطلب"
            ) : (
              <>
                Check <span className="italic text-[#A66D78]">out</span>
              </>
            )}
          </h1>

          <p className="mt-5 max-w-[500px] text-[15px] leading-[1.7] text-[#79686A]">
            {tr(
              "Enter your details, choose how you would like to pay, and we’ll take care of the rest.",
              "اكتبي بياناتك واختاري طريقة الدفع المناسبة، وإحنا هنتولى باقي الخطوات."
            )}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className={`mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-16 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          <div className="space-y-8">
            <section className="rounded-[24px] border border-[#E3D7D1] bg-[#FFFDFC] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <SectionIcon>
                  <User size={19} strokeWidth={1.5} />
                </SectionIcon>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A66D78]">
                    {tr("Step 01", "الخطوة ٠١")}
                  </p>
                  <h2 className="mt-1 font-display text-[29px] font-normal text-[#493438]">
                    {tr("Contact information", "بيانات التواصل")}
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="text-[12px] font-medium text-[#493438]">
                    {tr("Full name", "الاسم بالكامل")}
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder={tr("Your full name", "اسمك بالكامل")}
                    className={inputClass("fullName")}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-[11px] text-[#A66D78]">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="text-[12px] font-medium text-[#493438]">
                    {tr("Email address", "البريد الإلكتروني")}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-[11px] text-[#A66D78]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="text-[12px] font-medium text-[#493438]">
                    {tr("Phone number", "رقم الهاتف")}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className={inputClass("phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-[11px] text-[#A66D78]">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="relative rounded-[24px] border border-[#E3D7D1] bg-[#FFFDFC] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <SectionIcon>
                  <MapPin size={19} strokeWidth={1.5} />
                </SectionIcon>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A66D78]">
                    {tr("Step 02", "الخطوة ٠٢")}
                  </p>
                  <h2 className="mt-1 font-display text-[29px] font-normal text-[#493438]">
                    {tr("Delivery address", "عنوان التوصيل")}
                  </h2>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <CustomDropdown
                  id="governorate"
                  label={tr("Governorate", "المحافظة")}
                  value={form.governorate}
                  options={Object.keys(egyptLocations)}
                  placeholder={tr("Select governorate", "اختاري المحافظة")}
                  onChange={handleGovernorateChange}
                  error={errors.governorate}
                  isArabic={isArabic}
                />

                <CustomDropdown
                  id="city"
                  label={tr("City / Area", "المدينة / المنطقة")}
                  value={form.city}
                  options={cityOptions}
                  placeholder={
                    form.governorate
                      ? tr("Select city / area", "اختاري المدينة / المنطقة")
                      : tr("Select governorate first", "اختاري المحافظة أولًا")
                  }
                  onChange={handleCityChange}
                  error={errors.city}
                  disabled={!form.governorate}
                  isArabic={isArabic}
                />

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="text-[12px] font-medium text-[#493438]">
                    {tr("Full address", "العنوان بالتفصيل")}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder={tr(
                      "Street, building number and any useful delivery details",
                      "اسم الشارع ورقم العمارة وأي تفاصيل تساعد في التوصيل"
                    )}
                    className={`${inputClass("address")} resize-y`}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-[11px] text-[#A66D78]">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className="text-[12px] font-medium text-[#493438]">
                    {tr("Apartment / Floor", "الشقة / الدور")}{" "}
                    <span className="text-[#A89A96]">
                      {tr("(optional)", "(اختياري)")}
                    </span>
                  </label>
                  <input
                    id="apartment"
                    name="apartment"
                    type="text"
                    value={form.apartment}
                    onChange={handleChange}
                    placeholder={tr(
                      "Apartment, floor, landmark...",
                      "الشقة، الدور، علامة مميزة..."
                    )}
                    className={inputClass("apartment")}
                  />
                </div>
              </div>
            </section>

            {/* Order note — optional */}
            <section className="rounded-[24px] border border-[#E3D7D1] bg-[#FFFDFC] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <SectionIcon>
                  <MessageSquareText size={19} strokeWidth={1.5} />
                </SectionIcon>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A66D78]">
                    {tr("Optional", "اختياري")}
                  </p>
                  <h2 className="mt-1 font-display text-[29px] font-normal text-[#493438]">
                    {tr("Order note", "ملاحظات الطلب")}
                  </h2>
                  <p className="mt-2 text-[13px] leading-[1.7] text-[#79686A]">
                    {tr(
                      "Anything we should know about your order or delivery?",
                      "في أي تفاصيل تحبي تبلغينا بيها بخصوص الطلب أو التوصيل؟"
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="orderNote"
                  className="text-[12px] font-medium text-[#493438]"
                >
                  {tr("Your note", "ملاحظاتك")}{" "}
                  <span className="font-normal text-[#A89A96]">
                    {tr("(optional)", "(اختياري)")}
                  </span>
                </label>

                <textarea
                  id="orderNote"
                  name="orderNote"
                  rows={4}
                  maxLength={orderNoteMax}
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                  dir="auto"
                  placeholder={tr(
                    "Write your note here...",
                    "اكتبي ملاحظاتك هنا..."
                  )}
                  className={`${inputBase} resize-y border-[#E3D7D1]`}
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] leading-[1.6] text-[#79686A]">
                    {tr(
                      "This field is optional.",
                      "الخانة دي اختيارية."
                    )}
                  </p>
                  <span className="shrink-0 text-[11px] tabular-nums text-[#A66D78]">
                    {orderNote.length}/{orderNoteMax}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#E3D7D1] bg-[#FFFDFC] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <SectionIcon>
                  <Wallet size={19} strokeWidth={1.5} />
                </SectionIcon>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A66D78]">
                    {tr("Step 03", "الخطوة ٠٣")}
                  </p>
                  <h2 className="mt-1 font-display text-[29px] font-normal text-[#493438]">
                    {tr("Payment method", "طريقة الدفع")}
                  </h2>
                  <p className="mt-2 max-w-[480px] text-[13px] leading-[1.7] text-[#79686A]">
                    {tr(
                      "Choose the option that feels most comfortable for you.",
                      "اختاري طريقة الدفع الأنسب ليكي."
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <PaymentOption
                  selected={payment === "cod"}
                  onClick={() => setPayment("cod")}
                  icon={<Banknote size={17} strokeWidth={1.6} />}
                  title={tr("Cash on Delivery", "الدفع عند الاستلام")}
                  description={tr(
                    "Pay when your order arrives. No advance payment needed.",
                    "ادفعي لما الطلب يوصلك، من غير دفع مقدم."
                  )}
                  badge={tr("Recommended", "موصى به")}
                />

                <PaymentOption
                  selected={payment === "instapay"}
                  onClick={() => setPayment("instapay")}
                  icon={<Wallet size={17} strokeWidth={1.6} />}
                  title="InstaPay"
                  description={tr(
                    "Transfer after placing your order. Payment must be verified.",
                    "حوّلي بعد تأكيد الطلب، ولازم يتم التحقق من الدفع."
                  )}
                  badge={tr("Optional", "اختياري")}
                />
              </div>

              {payment === "cod" ? (
                <div className="mt-5 rounded-[18px] border border-[#E3D7D1] bg-[#F8F4EF] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
                    {tr("What happens next", "إيه اللي هيحصل بعد كده؟")}
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EDE3DD] text-[#A66D78]">
                      <Check size={15} />
                    </div>
                    <p className="text-[12px] leading-[1.7] text-[#79686A]">
                      {tr(
                        "Place your order now and pay the order total to the delivery representative when your package arrives.",
                        "أكدي طلبك وادفعي إجمالي المبلغ لمندوب التوصيل لما الطلب يوصلك."
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[18px] border border-[#E3D7D1] bg-[#F8F4EF] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
                    {tr("InstaPay payment", "الدفع عن طريق InstaPay")}
                  </p>

                  <ol className="mt-4 space-y-3 text-[12px] leading-[1.7] text-[#79686A]">
                    <li className="flex gap-3">
                      <span className="font-semibold text-[#493438]">
                        {isArabic ? "٠١" : "01"}
                      </span>
                      <span>
                        {tr(
                          "Place your order first. It will be marked as awaiting payment.",
                          "أكدي الطلب الأول، وهيتسجل إنه في انتظار الدفع."
                        )}
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-[#493438]">
                        {isArabic ? "٠٢" : "02"}
                      </span>
                      <span>
                        {tr(
                          "Use the official InstaPay details provided by Nyora Beauty.",
                          "استخدمي بيانات InstaPay الرسمية اللي هتوفرها Nyora Beauty."
                        )}
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-[#493438]">
                        {isArabic ? "٠٣" : "03"}
                      </span>
                      <span>
                        {tr(
                          "Keep your transfer reference. Payment must be verified before the order is marked as paid.",
                          "احتفظي برقم التحويل؛ لازم يتم التحقق من الدفع قبل تسجيل الطلب كمدفوع."
                        )}
                      </span>
                    </li>
                  </ol>

                  <div className="mt-5 rounded-[14px] border border-[#D8C9C3] bg-[#FFFDFC] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#79686A]">
                      {tr("InstaPay details", "بيانات InstaPay")}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-[#493438]">
                      {tr(
                        "Payment details will be shared by Nyora Beauty.",
                        "هتتم مشاركة بيانات الدفع من خلال Nyora Beauty."
                      )}
                    </p>
                    <p className="mt-1 text-[11px] leading-[1.6] text-[#A66D78]">
                      {tr(
                        "Add the official account details before launching the website.",
                        "أضيفي بيانات الحساب الرسمية قبل إطلاق الموقع."
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-[18px] border border-[#E3D7D1] bg-[#FFFDFC] p-5">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66D78]">
                    {tr("We’re here to help", "إحنا هنا لمساعدتك")}
                  </p>
                  <p className="mt-2 text-[13px] leading-[1.7] text-[#79686A]">
                    {tr(
                      "Have a question about your order? Contact Nyora through our social channels.",
                      "عندك سؤال عن طلبك؟ تواصلي مع Nyora من خلال حساباتنا."
                    )}
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram">
                      <FaInstagram size={17} />
                    </SocialLink>
                    <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook">
                      <FaFacebook size={17} />
                    </SocialLink>
                    <SocialLink href={SOCIAL_LINKS.tiktok} label="TikTok">
                      <FaTiktok size={17} />
                    </SocialLink>
                    <SocialLink href={SOCIAL_LINKS.whatsapp} label="WhatsApp">
                      <FaWhatsapp size={18} />
                    </SocialLink>
                  </div>

                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-[11px] font-medium text-[#493438] transition-colors hover:text-[#A66D78]"
                  >
                    {tr(
                      "Questions about your order? Chat with us on Instagram",
                      "عندك سؤال عن طلبك؟ كلمينا على إنستجرام"
                    )}
                  </a>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-[24px] border border-[#E3D7D1] bg-[#EDE3DD] p-7 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A66D78]">
                {tr("Your order", "طلبك")}
              </p>

              <h2 className="mt-3 font-display text-[30px] font-normal leading-[1.05] text-[#493438]">
                {tr("Order summary", "ملخص الطلب")}
              </h2>

              <div className="mt-7 space-y-4">
                {lines.map(({ product, size, qty, quantity }) => {
                  const itemQty = Number(qty ?? quantity ?? 1);

                  return (
                    <div
                      key={`${product.id}-${size || "default"}`}
                      className="flex gap-3"
                    >
                      <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[14px] bg-[#F8F4EF]">
                        <img
                          src={product.image}
                          alt={
                            isArabic
                              ? product.nameAr || product.name
                              : product.name
                          }
                          style={{
                            objectPosition: product.position || "50% 50%",
                          }}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#493438] px-1 text-[9px] font-medium text-white">
                          {formatNumber(itemQty)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[#493438]">
                          {isArabic
                            ? product.nameAr || product.name
                            : product.name}
                        </p>

                        {size && (
                          <p className="mt-1 text-[10px] text-[#79686A]">
                            {size}
                          </p>
                        )}

                        <p className="mt-2 text-[12px] text-[#A66D78]">
                          {formatNumber(Number(product.price || 0) * itemQty)}{" "}
                          {isArabic ? "جنيه" : "EGP"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 border-t border-[#D8C9C3] pt-5">
                <div className="flex items-center justify-between text-[14px] text-[#79686A]">
                  <span>{tr("Subtotal", "المجموع الفرعي")}</span>
                  <span className="font-medium text-[#493438]">
                    {formatNumber(subtotal)} {isArabic ? "جنيه" : "EGP"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[14px] text-[#79686A]">
                  <span>{tr("Delivery", "التوصيل")}</span>
                  <span className="font-medium text-[#493438]">
                    {formatNumber(delivery)} {isArabic ? "جنيه" : "EGP"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#D8C9C3] pt-5">
                <span className="text-[14px] font-medium text-[#493438]">
                  {tr("Total", "الإجمالي")}
                </span>
                <span className="font-display text-[30px] font-normal text-[#493438]">
                  {formatNumber(total)} {isArabic ? "جنيه" : "EGP"}
                </span>
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-[#A66D78]/30 bg-[#F8F4EF] p-3 text-[12px] leading-[1.6] text-[#A66D78]"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || productsLoading}
                className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#493438] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#A66D78] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? tr("Saving your order...", "جاري حفظ طلبك...")
                  : tr("Place order", "تأكيد الطلب")}
                {!submitting && (
                  <ChevronRight
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>

              <p className="mt-4 text-center text-[10px] leading-[1.6] text-[#79686A]">
                {tr(
                  "By placing your order, you confirm that your information is correct.",
                  "بتأكيد الطلب، إنتِ بتأكدي إن بياناتك صحيحة."
                )}
              </p>
            </div>

            <Link
              to="/cart"
              className="group mt-5 flex items-center justify-center gap-2 text-[12px] font-medium text-[#A66D78] transition-colors hover:text-[#493438]"
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.7}
                className="transition-transform group-hover:-translate-x-1"
              />
              {tr("Back to cart", "العودة للسلة")}
            </Link>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
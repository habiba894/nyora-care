import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Same accounts as the footer
const WHATSAPP_NUMBER = "201036156158";
const INSTAGRAM_USER = "nyora.care";
const TIKTOK_URL = "https://www.tiktok.com/@nyora.care";
const SEEN_KEY = "nyora-dm-seen";

const TOPICS = [
  {
    id: "product",
    en: "A product",
    ar: "منتج",
    msgEn: "Hi Nyora! I'd like to ask about a product.",
    msgAr: "أهلًا نيورا! عايزة أسأل عن منتج.",
  },
  {
    id: "order",
    en: "My order",
    ar: "طلبي",
    msgEn: "Hi Nyora! I have a question about my order.",
    msgAr: "أهلًا نيورا! عندي سؤال عن طلبي.",
  },
  {
    id: "other",
    en: "Something else",
    ar: "حاجة تانية",
    msgEn: "Hi Nyora! I have a question.",
    msgAr: "أهلًا نيورا! عندي سؤال.",
  },
];

const DMLauncher = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const [seen, setSeen] = useState(true);
  const rootRef = useRef(null);

  // Show the soft pulse only until the visitor has opened the card once
  useEffect(() => {
    try {
      setSeen(window.localStorage.getItem(SEEN_KEY) === "1");
    } catch {
      setSeen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const toggle = () => {
    setOpen((value) => !value);

    if (!seen) {
      setSeen(true);
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage can be blocked, the card still works */
      }
    }
  };

  const topic = TOPICS.find((item) => item.id === topicId) || TOPICS[0];
  const message = isArabic ? topic.msgAr : topic.msgEn;

  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      hint: isArabic ? "ابدئي المحادثة فورًا" : "Start chatting right away",
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      Icon: FaWhatsapp,
      iconSize: 20,
      hover: "group-hover:bg-[#25D366] group-hover:text-white",
    },
    {
      id: "instagram",
      name: "Instagram",
      hint: isArabic ? "ابعتيلنا رسالة DM" : "Send us a DM",
      href: `https://ig.me/m/${INSTAGRAM_USER}`,
      Icon: FaInstagram,
      iconSize: 19,
      hover:
        "group-hover:bg-gradient-to-tr group-hover:from-[#F58529] group-hover:via-[#DD2A7B] group-hover:to-[#8134AF] group-hover:text-white",
    },
    {
      id: "tiktok",
      name: "TikTok",
      hint: isArabic ? "زوري صفحتنا" : "Visit our page",
      href: TIKTOK_URL,
      Icon: FaTiktok,
      iconSize: 17,
      hover: "group-hover:bg-[#161616] group-hover:text-white",
    },
  ];

  // Always bottom-right, in Arabic and English
  const side = "right-4 sm:right-6";
  const panelSide = "right-0 origin-bottom-right";
  const pillSide = "right-full mr-3";

  return (
    <div
      ref={rootRef}
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className={`fixed bottom-4 z-[70] sm:bottom-6 ${side}`}
    >
      {/* CARD */}
      <div
        id="nyora-dm-panel"
        role="dialog"
        aria-label={isArabic ? "تواصلي مع نيورا" : "Contact Nyora"}
        aria-hidden={!open}
        className={`absolute bottom-[72px] w-[calc(100vw-2rem)] max-w-[352px] overflow-hidden rounded-[26px] border border-[#E3D7D1] bg-[#F8F4EF] shadow-[0_28px_70px_rgba(73,52,56,0.20)] transition-all duration-300 ease-out motion-reduce:transition-none ${panelSide} ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible translate-y-3 scale-95 opacity-0"
        }`}
      >
        {/* header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#A66D78] to-[#8B5560] px-6 pb-6 pt-6 text-white">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl ${
              isArabic ? "-left-6" : "-right-6"
            }`}
          />

          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 font-display text-[24px] font-medium leading-none">
              N
            </span>

            <div className="leading-tight">
              <p className="text-[17px] font-semibold">
                {isArabic ? "نيورا بيوتي" : "Nyora Beauty"}
              </p>
              <p className="mt-1 text-[12.5px] text-white/80">
                {isArabic ? "يسعدنا نسمع منك" : "We'd love to hear from you"}
              </p>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="px-5 pb-5 pt-5">
          <div
            className={`rounded-2xl bg-white px-4 py-3 text-[14px] leading-[1.8] text-[#493438] shadow-[0_6px_18px_rgba(73,52,56,0.06)] ${
              isArabic ? "rounded-tr-md" : "rounded-tl-md"
            }`}
          >
            {isArabic
              ? "أهلًا بيكي في نيورا! نقدر نساعدك إزاي النهاردة؟"
              : "Welcome to Nyora! How can we help you today?"}
          </div>

          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#A66D78]">
            {isArabic ? "عايزة تسألي عن" : "I'm asking about"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {TOPICS.map((item) => {
              const active = item.id === topicId;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTopicId(item.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78] ${
                    active
                      ? "border-[#493438] bg-[#493438] text-white"
                      : "border-[#DCCFC9] bg-white/70 text-[#79686A] hover:border-[#A66D78] hover:text-[#A66D78]"
                  }`}
                >
                  {isArabic ? item.ar : item.en}
                </button>
              );
            })}
          </div>

          <ul className="mt-5 space-y-2.5">
            {channels.map(({ id, name, hint, href, Icon, iconSize, hover }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3.5 rounded-2xl border border-[#E8DDD7] bg-white/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D9C6BE] hover:bg-white hover:shadow-[0_12px_28px_rgba(73,52,56,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4DFD8] text-[#A66D78] transition-all duration-300 group-hover:scale-105 ${hover}`}
                  >
                    <Icon size={iconSize} aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[15px] font-medium text-[#493438]">
                      {name}
                    </span>
                    <span className="mt-1 block text-[12.5px] text-[#79686A]">
                      {hint}
                    </span>
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className={`shrink-0 text-[#A66D78] opacity-60 transition-all duration-300 group-hover:opacity-100 ${
                      isArabic
                        ? "-scale-x-100 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                        : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="nyora-dm-panel"
        aria-label={
          open
            ? isArabic
              ? "إغلاق"
              : "Close"
            : isArabic
              ? "راسلي نيورا"
              : "Message Nyora"
        }
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#A66D78] text-white shadow-[0_14px_30px_rgba(166,109,120,0.38)] ring-4 ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:bg-[#493438] hover:shadow-[0_18px_36px_rgba(73,52,56,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A66D78]"
      >
        {!open && !seen && (
          <span
            aria-hidden="true"
            className="nyora-dm-pulse pointer-events-none absolute inset-0 rounded-full bg-[#A66D78]"
          />
        )}

        <MessageCircle
          size={24}
          strokeWidth={1.7}
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${
            open
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />

        <X
          size={24}
          strokeWidth={1.7}
          aria-hidden="true"
          className={`absolute transition-all duration-300 ${
            open
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />

        {/* hover label (desktop only) */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-[#493438] px-4 py-2 text-[12.5px] font-medium text-white opacity-0 shadow-[0_10px_24px_rgba(73,52,56,0.18)] transition-all duration-300 sm:block ${pillSide} ${
            open ? "" : "group-hover:opacity-100"
          }`}
        >
          {isArabic ? "راسلينا" : "Message us"}
        </span>
      </button>

      <style>{`
        @keyframes nyoraDmPulse {
          0%   { transform: scale(1);   opacity: 0.35; }
          70%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .nyora-dm-pulse { animation: nyoraDmPulse 2.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .nyora-dm-pulse { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default DMLauncher;
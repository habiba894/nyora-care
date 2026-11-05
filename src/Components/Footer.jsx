import { useState } from "react";
import { ArrowUp, ArrowUpRight, Leaf, Mail } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/nyora.care/",
  facebook: "https://www.facebook.com/share/g/1CDXxUFCcs/",
  tiktok: "https://www.tiktok.com/@nyora.care",
  whatsapp: "https://wa.me/201036156158",
};

const CONTACT_EMAIL = "malakhaboula@gmail.com";

const FOOTER_LINKS = {
  shop: [
    { name: "Shop", ar: "المتجر", href: "/shop" },
    { name: "Cart", ar: "السلة", href: "/cart" },
  ],
  explore: [
    { name: "Home", ar: "الرئيسية", href: "/" },
    { name: "Checkout", ar: "إتمام الطلب", href: "/checkout" },
  ],
};

/* SAME FLOWER SVG USED IN THE FOOTER LOGO */
const FlowerIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 40 48"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 43C13.5 35 17.5 27 22.5 20C26 15 29 10 31 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15.2 35.5C9.8 35.8 6.9 32.5 8.4 28.8C12.9 29.1 15.5 31.5 15.2 35.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M17.2 31C21.8 31.5 25 29.1 24.8 25C20.5 25.2 17.6 27.2 17.2 31Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M20.3 25C15.4 25.1 12.7 22.2 13.9 18.6C18.1 18.9 20.8 21.1 20.3 25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M22.8 20.8C27.2 21.1 30 18.6 29.7 14.7C25.6 14.8 23.2 17 22.8 20.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M26.3 15.5C22.5 15.2 20.4 12.7 21.4 9.8C24.8 10.1 26.8 12 26.3 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M28.2 11.7C31.8 11.8 34 9.6 33.7 6.4C30.3 6.5 28.4 8.4 28.2 11.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M30.5 7.3C27.8 6.6 26.8 4.4 27.9 2.8C30.4 3.1 31.5 5 30.5 7.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const FooterLogo = ({ isArabic }) => (
  <Link
    to="/"
    aria-label={isArabic ? "الصفحة الرئيسية لنيورا بيوتي" : "Nyora Beauty home"}
    className="group inline-flex items-center gap-3"
  >
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A66D78] shadow-[0_6px_18px_rgba(166,109,120,0.16)] transition duration-500 group-hover:rotate-[-5deg] group-hover:scale-105">
      <span className="absolute left-[6px] top-[9px] z-10 font-display text-[27px] font-medium leading-none tracking-[-0.05em] text-white">
        N
      </span>

      <FlowerIcon className="absolute right-[2px] top-[3px] h-[36px] w-[28px] text-white" />
    </span>

    <span className="flex flex-col leading-none">
      <span className="font-display text-[37px] font-medium tracking-[-0.045em] text-[#493438] transition-colors duration-300 group-hover:text-[#A66D78]">
        {isArabic ? "نيورا" : "Nyora"}
      </span>
      <span className="mt-1 text-[9px] font-semibold tracking-[0.42em] text-[#A66D78]">
        {isArabic ? "بيوتي" : "BEAUTY"}
      </span>
    </span>
  </Link>
);

const SocialLink = ({ href, label, Icon, size }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Visit Nyora Beauty on ${label}`}
    title={label}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCCFC9] bg-[#F8F4EF] text-[#79686A] transition-all duration-300 hover:-translate-y-1 hover:border-[#A66D78] hover:bg-[#A66D78] hover:text-white hover:shadow-[0_8px_20px_rgba(166,109,120,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
  >
    <Icon size={size} aria-hidden="true" />
  </a>
);

const FooterHeading = ({ children, isArabic }) => (
  <div className="mb-5">
    <h3
      className={`text-[20px] font-normal text-[#493438] ${
        isArabic ? "font-sans" : "font-display"
      }`}
    >
      {children}
    </h3>
    <span className="mt-2.5 block h-[2px] w-7 rounded-full bg-[#A66D78]" />
  </div>
);

const FooterLink = ({ to, children, isArabic }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-2 text-[14px] text-[#79686A] transition-colors duration-300 hover:text-[#A66D78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A66D78]"
  >
    <span>{children}</span>
    <ArrowUpRight
      size={13}
      strokeWidth={1.5}
      aria-hidden="true"
      className={`opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
        isArabic ? "translate-x-1 rotate-180" : "-translate-x-1"
      }`}
    />
  </Link>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  const isArabic = i18n.language.startsWith("ar");

  const handleOurStory = (event) => {
    event.preventDefault();

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollToOurStory: true } });

      window.setTimeout(() => {
        document
          .getElementById("our-story")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);

      return;
    }

    document
      .getElementById("our-story")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    // Connect an email service before enabling newsletter subscriptions.
  };

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      lang={isArabic ? "ar" : "en"}
      className="relative overflow-hidden border-t border-[#DCCFC9] bg-[#EDE3DD] px-5 pb-5 pt-12 sm:px-8 sm:pb-7 sm:pt-14 lg:px-14 lg:pt-16"
    >
      {/* BACKGROUND DETAILS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#A66D78]/[0.06] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-24 h-80 w-80 rounded-full bg-[#493438]/[0.035] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1500px]">
        {/* TOP STRIP */}
        <div className="mb-10 flex flex-col items-start gap-4 border-b border-[#DCCFC9] pb-7 sm:mb-12 sm:flex-row sm:items-center sm:justify-between sm:pb-8">
          <div className="flex items-center gap-3">
            {/* FLOWER: reused SVG from FooterLogo */}
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8F4EF] text-[#A66D78]">
              <FlowerIcon className="h-8 w-7" />
            </span>

            <div>
              <p className="text-[15px] font-medium text-[#493438] sm:text-[16px]">
                {isArabic
                  ? "جمال مستوحى من الطبيعة"
                  : "Beauty, inspired by nature"}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#79686A] sm:text-[13px]">
                {isArabic
                  ? "طقوس عناية بسيطة بتفاصيل مميزة"
                  : "Thoughtful care in every little detail"}
              </p>
            </div>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            dir="ltr"
            className="inline-flex w-fit items-center gap-2 text-[13px] text-[#79686A] transition-colors hover:text-[#A66D78] sm:-translate-x-9"
          >
            <Mail size={15} strokeWidth={1.5} />
            <span>{CONTACT_EMAIL}</span>
          </a>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-[1.35fr_0.7fr_0.8fr_1.15fr] lg:gap-12 xl:gap-16">
          {/* BRAND */}
          <div>
            <FooterLogo isArabic={isArabic} />

            <p className="mt-5 max-w-[320px] text-[14px] leading-[1.9] text-[#79686A]">
              {isArabic
                ? "نيورا بيوتي مش مجرد منتجات، دي حكاية وشغف ووعد بالجمال مستوحى من الطبيعة."
                : "Nyora Beauty is more than products. It's a story, a ritual, and a promise inspired by nature."}
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <SocialLink href={SOCIAL_LINKS.instagram} label="Instagram" Icon={FaInstagram} size={17} />
              <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook" Icon={FaFacebook} size={17} />
              <SocialLink href={SOCIAL_LINKS.tiktok} label="TikTok" Icon={FaTiktok} size={16} />
              <SocialLink href={SOCIAL_LINKS.whatsapp} label="WhatsApp" Icon={FaWhatsapp} size={18} />
            </div>
          </div>

          {/* SHOP */}
          <div>
            <FooterHeading isArabic={isArabic}>
              {isArabic ? "تسوّقي" : "Shop"}
            </FooterHeading>

            <ul className="space-y-3.5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.name}>
                  <FooterLink to={link.href} isArabic={isArabic}>
                    {isArabic ? link.ar : link.name}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* EXPLORE */}
          <div>
            <FooterHeading isArabic={isArabic}>
              {isArabic ? "اكتشفي نيورا" : "Explore"}
            </FooterHeading>

            <ul className="space-y-3.5">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.name}>
                  <FooterLink to={link.href} isArabic={isArabic}>
                    {isArabic ? link.ar : link.name}
                  </FooterLink>
                </li>
              ))}

              <li>
                <a
                  href="/#our-story"
                  onClick={handleOurStory}
                  className="group inline-flex items-center gap-2 text-[14px] text-[#79686A] transition-colors duration-300 hover:text-[#A66D78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A66D78]"
                >
                  <span>{isArabic ? "قصتنا" : "Our Story"}</span>
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={`opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                      isArabic ? "translate-x-1 rotate-180" : "-translate-x-1"
                    }`}
                  />
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <FooterHeading isArabic={isArabic}>
              {isArabic ? "خليكي دايمًا مع نيورا" : "Stay in the Nyora world"}
            </FooterHeading>

            <p className="max-w-[320px] text-[14px] leading-[1.9] text-[#79686A]">
              {isArabic
                ? "اكتشفي أحدث المنتجات ونصائح العناية وكل جديد من نيورا."
                : "Discover new arrivals, beauty tips, and little updates from Nyora."}
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-4 flex w-full max-w-[330px] items-center gap-1 rounded-full border border-[#D8C7BF] bg-[#F8F4EF] p-1 transition-colors duration-300 focus-within:border-[#A66D78]"
            >
              <label htmlFor="footer-email" className="sr-only">
                {isArabic ? "بريدك الإلكتروني" : "Your email address"}
              </label>

              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={isArabic ? "بريدك الإلكتروني" : "Your email address"}
                dir={isArabic ? "rtl" : "ltr"}
                className="min-w-0 w-full border-0 bg-transparent px-3 py-2.5 text-[12px] text-[#493438] outline-none placeholder:text-[#A89A96] focus:border-0 focus:outline-none focus:ring-0"
              />

              <button
                type="submit"
                className="flex shrink-0 items-center gap-1 rounded-full bg-[#493438] px-3.5 py-2.5 text-[11px] font-medium text-white transition-all duration-300 hover:bg-[#A66D78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
              >
                {isArabic ? "اشتركي" : "Subscribe"}
                <ArrowUpRight size={13} aria-hidden="true" />
              </button>
            </form>

            <p className="mt-2.5 max-w-[310px] text-[11px] leading-[1.8] text-[#79686A]">
              {isArabic
                ? "الاشتراك في القائمة البريدية هيتفعّل بعد ربط خدمة البريد الإلكتروني."
                : "Newsletter sign-up will be enabled once an email service is connected."}
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 border-t border-[#DCCFC9] pt-5 sm:mt-14 sm:pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-center text-[12px] leading-6 text-[#79686A] sm:text-start">
              © {new Date().getFullYear()}{" "}
              <span className="font-medium text-[#493438]">Nyora Beauty</span>
              . {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>

            {/* INSTAPAY + BACK TO TOP */}
            <div className="flex items-center gap-3">
              <img
                src="/instapay.png"
                alt="InstaPay"
                title="InstaPay"
                loading="lazy"
                className="h-8 w-[52px] rounded-md border border-[#DCCFC9] bg-[#F8F4EF] object-contain p-1"
              />

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label={isArabic ? "العودة إلى أعلى الصفحة" : "Back to top"}
                title={isArabic ? "العودة للأعلى" : "Back to top"}
                className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D8C7BF] bg-[#F8F4EF] text-[#A66D78] transition-all duration-300 hover:-translate-y-1 hover:border-[#493438] hover:bg-[#493438] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
              >
                <ArrowUp
                  size={16}
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useTranslation } from "react-i18next";
import SearchOverlay from "./SearchOverlay";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Languages,
} from "lucide-react";

const shopMenu = [
  { key: "face", href: "/shop?category=Face" },
  { key: "lips", href: "/shop?category=Lips" },
  { key: "body", href: "/shop?category=Body" },
  { key: "hair", href: "/shop?category=Hair" },
];

const Logo = ({ isArabic }) => (
  <Link
    to="/"
    className="group flex shrink-0 items-center gap-2"
    aria-label={isArabic ? "نيورا بيوتي" : "Nyora Beauty"}
  >
    <span className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#A66D78] shadow-[0_4px_12px_rgba(166,109,120,0.13)] transition-transform duration-300 group-hover:scale-[1.02]">
      <span className="absolute left-[8px] top-[9px] z-10 font-serif text-[28px] font-normal leading-none text-white">
        N
      </span>

      <svg
        viewBox="0 0 40 48"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className="absolute right-[3px] top-[3px] h-[36px] w-[28px] text-white transition-transform duration-300 group-hover:-rotate-2"
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
    </span>

    <span className="flex flex-col leading-none">
      <span
        dir={isArabic ? "rtl" : "ltr"}
        className={`font-display text-[26px] font-semibold tracking-[-0.025em] text-[#493438] sm:text-[28px] ${
          isArabic ? "font-sans" : ""
        }`}
      >
        {isArabic ? "نيورا" : "Nyora"}
      </span>

      <span className="mt-1 text-[7px] font-bold uppercase tracking-[0.36em] text-[#A66D78]">
        {isArabic ? "بيوتي" : "BEAUTY"}
      </span>
    </span>
  </Link>
);

const iconButton =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#493438] transition-colors duration-300 hover:bg-[#EDE3DD] hover:text-[#A66D78]";

const LanguageButton = ({ onClick, isArabic }) => (
  <button
    type="button"
    onClick={onClick}
    className={iconButton}
    aria-label={isArabic ? "التغيير إلى الإنجليزية" : "Switch to Arabic"}
    title={isArabic ? "English" : "العربية"}
  >
    <Languages size={20} strokeWidth={1.6} />
  </button>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { cartCount, wishlist = [] } = useStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isArabic = i18n.language?.startsWith("ar") ?? false;
  const isHome = location.pathname === "/";

  const active =
    location.pathname === "/wishlist"
      ? "Wishlist"
      : location.pathname === "/cart"
        ? "Cart"
        : location.pathname.startsWith("/shop") ||
            location.pathname.startsWith("/product")
          ? "Shop"
          : isHome
            ? "Home"
            : "";

  const changeLanguage = () => {
    const nextLanguage = isArabic ? "en" : "ar";
    i18n.changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
  };

  const closeMenus = () => {
    setOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleOurStory = (event) => {
    event.preventDefault();
    closeMenus();

    if (location.pathname === "/") {
      document.getElementById("our-story")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigate("/");

    window.setTimeout(() => {
      document.getElementById("our-story")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const linkClass = (name) => `
    relative flex items-center gap-1.5 px-3 py-2 text-[14px] font-normal
    tracking-[0.015em] transition-colors duration-300
    ${
      active === name
        ? "text-[#493438]"
        : "text-[#493438] hover:text-[#A66D78]"
    }
  `;

  const SearchControl = () => (
    <div
      className={`relative z-20 flex h-9 shrink-0 items-center justify-center transition-[width] duration-300 ${
        searchOpen ? "w-[250px]" : "w-9"
      }`}
    >
      {!searchOpen && (
        <button
          type="button"
          onClick={() => {
            setSearchOpen(true);
            setOpen(false);
          }}
          className={iconButton}
          aria-label={t("nav.search")}
          aria-expanded={searchOpen}
        >
          <Search size={20} strokeWidth={1.5} />
        </button>
      )}

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );

  const WishlistControl = () => (
    <Link
      to="/wishlist"
      onClick={closeMenus}
      aria-label={t("nav.wishlist")}
      title={t("nav.wishlist")}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#493438] transition-colors duration-300 hover:bg-[#EDE3DD] hover:text-[#A66D78]"
    >
      <Heart size={20} strokeWidth={1.5} />

      {wishlist.length > 0 && (
        <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#A66D78] px-1 text-[8px] font-semibold text-white">
          {wishlist.length}
        </span>
      )}
    </Link>
  );

  const CartControl = () => (
    <Link
      to="/cart"
      onClick={closeMenus}
      aria-label={t("nav.cart")}
      title={t("nav.cart")}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#493438] transition-colors duration-300 hover:bg-[#EDE3DD] hover:text-[#A66D78]"
    >
      <ShoppingBag size={20} strokeWidth={1.5} />

      {cartCount > 0 && (
        <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#A66D78] px-1 text-[8px] font-semibold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <header
      dir={isArabic ? "rtl" : "ltr"}
      className="fixed inset-x-0 top-0 z-[100] px-3 pt-2.5 sm:px-5 lg:px-7"
    >
      <nav
        className={`
          relative mx-auto flex max-w-[1380px] items-center justify-between
          rounded-full border border-[#E3D7D1]
          bg-[#F8F4EF]/95 px-3 backdrop-blur-xl
          transition-all duration-300 sm:px-5 lg:px-6
          ${
            scrolled
              ? "h-[65px] shadow-[0_7px_22px_rgba(73,52,56,0.055)]"
              : "h-[72px] shadow-[0_6px_20px_rgba(73,52,56,0.045)]"
          }
        `}
      >
        <div className="shrink-0">
          <Logo isArabic={isArabic} />
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          <Link
            to="/"
            onClick={closeMenus}
            className={linkClass("Home")}
          >
            {t("nav.home")}

            {active === "Home" && (
              <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#A66D78]" />
            )}
          </Link>

          <div className="group relative">
            <Link
              to="/shop"
              onClick={closeMenus}
              className={linkClass("Shop")}
            >
              {t("nav.shop")}

              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:rotate-180"
              />
            </Link>

            <div className="invisible absolute left-1/2 top-full w-[210px] -translate-x-1/2 pt-2.5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <div className="rounded-[20px] border border-[#E3D7D1] bg-[#F8F4EF] p-2 shadow-[0_14px_35px_rgba(73,52,56,0.09)]">
                {shopMenu.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={closeMenus}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[#EDE3DD]"
                  >
                    <span className="text-[12px] text-[#493438]">
                      {t(`nav.${item.key}`)}
                    </span>

                    <span className="text-[#A66D78]">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <a
            href="#our-story"
            onClick={handleOurStory}
            className={linkClass("Our Story")}
          >
            {t("nav.ourStory")}
          </a>
        </div>

        <div
          dir="ltr"
          className="relative flex shrink-0 items-center gap-0"
        >
          {isArabic ? (
            <>
              <CartControl />
              <WishlistControl />

              <LanguageButton
                onClick={changeLanguage}
                isArabic={isArabic}
              />

              <SearchControl />
            </>
          ) : (
            <>
              <SearchControl />

              <LanguageButton
                onClick={changeLanguage}
                isArabic={isArabic}
              />

              <WishlistControl />
              <CartControl />
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen((previous) => !previous);
              setSearchOpen(false);
            }}
            className={`${iconButton} lg:hidden`}
            aria-label={isArabic ? "القائمة" : "Menu"}
            aria-expanded={open}
          >
            {open ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-[1380px] rounded-[22px] border border-[#E3D7D1] bg-[#F8F4EF]/95 p-3.5 shadow-[0_14px_35px_rgba(73,52,56,0.09)] backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-0.5">
            <Link
              to="/"
              onClick={closeMenus}
              className="rounded-xl px-3.5 py-2 font-display text-[20px] text-[#493438] transition-colors hover:bg-[#EDE3DD]"
            >
              {t("nav.home")}
            </Link>

            <Link
              to="/shop"
              onClick={closeMenus}
              className="rounded-xl px-3.5 py-2 font-display text-[20px] text-[#493438] transition-colors hover:bg-[#EDE3DD]"
            >
              {t("nav.shop")}
            </Link>

            <a
              href="#our-story"
              onClick={handleOurStory}
              className="rounded-xl px-3.5 py-2 font-display text-[20px] text-[#493438] transition-colors hover:bg-[#EDE3DD]"
            >
              {t("nav.ourStory")}
            </a>

            <Link
              to="/wishlist"
              onClick={closeMenus}
              className="flex items-center justify-between rounded-xl px-3.5 py-2 font-display text-[20px] text-[#493438] transition-colors hover:bg-[#EDE3DD]"
            >
              <span>{t("nav.wishlist")}</span>

              {wishlist.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A66D78] px-1 font-sans text-[10px] font-semibold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={closeMenus}
              className="flex items-center justify-between rounded-xl px-3.5 py-2 font-display text-[20px] text-[#493438] transition-colors hover:bg-[#EDE3DD]"
            >
              <span>{t("nav.cart")}</span>

              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A66D78] px-1 font-sans text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="mt-1.5 flex items-center justify-between rounded-xl border border-[#E3D7D1] px-3.5 py-1.5">
              <span className="text-[13px] text-[#79686A]">
                {isArabic ? "تغيير اللغة" : "Change language"}
              </span>

              <LanguageButton
                onClick={changeLanguage}
                isArabic={isArabic}
              />
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-4 gap-2 border-t border-[#E3D7D1] pt-2.5">
            {shopMenu.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                onClick={closeMenus}
                className="rounded-full bg-[#EDE3DD] py-2 text-center text-[10px] font-medium text-[#A66D78] transition-colors hover:bg-[#E3D7D1]"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

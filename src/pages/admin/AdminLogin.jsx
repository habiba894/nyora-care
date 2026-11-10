import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

/* Used ONLY inside the logo */
function BotanicalMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 40 48"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 43C13.5 35 17.5 27 22.5 20C26 15 29 10 31 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.2 35.5C9.8 35.8 6.9 32.5 8.4 28.8C12.9 29.1 15.5 31.5 15.2 35.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M17.2 31C21.8 31.5 25 29.1 24.8 25C20.5 25.2 17.6 27.2 17.2 31Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20.3 25C15.4 25.1 12.7 22.2 13.9 18.6C18.1 18.9 20.8 21.1 20.3 25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M22.8 20.8C27.2 21.1 30 18.6 29.7 14.7C25.6 14.8 23.2 17 22.8 20.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M26.3 15.5C22.5 15.2 20.4 12.7 21.4 9.8C24.8 10.1 26.8 12 26.3 15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M28.2 11.7C31.8 11.8 34 9.6 33.7 6.4C30.3 6.5 28.4 8.4 28.2 11.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M30.5 7.3C27.8 6.6 26.8 4.4 27.9 2.8C30.4 3.1 31.5 5 30.5 7.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Used for the form icon */
function LeafMark({ className = "", strokeWidth = 1.3 }) {
  return (
    <svg
      viewBox="30 50 625 610"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M40 650C140 590 200 550 262 500C330 445 380 400 420 350C460 295 500 250 535 195"
          vectorEffect="non-scaling-stroke"
        />

        <path vectorEffect="non-scaling-stroke" d="M255 492Q334 401 308 283Q229 374 255 492Z" />
        <path vectorEffect="non-scaling-stroke" d="M270 506Q373 541 470 492Q367 457 270 506Z" />
        <path vectorEffect="non-scaling-stroke" d="M408 347Q470 255 437 150Q375 242 408 347Z" />
        <path vectorEffect="non-scaling-stroke" d="M426 353Q532 365 612 294Q506 282 426 353Z" />
        <path vectorEffect="non-scaling-stroke" d="M530 204Q632 169 642 62Q540 97 530 204Z" />

        <g opacity="0.4">
          <path vectorEffect="non-scaling-stroke" d="M255 492L292 346" />
          <path vectorEffect="non-scaling-stroke" d="M270 506L410 496" />
          <path vectorEffect="non-scaling-stroke" d="M408 347L428 209" />
          <path vectorEffect="non-scaling-stroke" d="M426 353L556 312" />
          <path vectorEffect="non-scaling-stroke" d="M530 204L608 105" />
        </g>
      </g>
    </svg>
  );
}

function NyoraLogo() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#A66D78] shadow-[0_8px_24px_rgba(84,45,58,0.16)]">
        <span className="absolute left-[10px] top-[12px] z-10 font-serif text-[35px] leading-none text-white">
          N
        </span>

        <BotanicalMark className="absolute right-[4px] top-[4px] h-[43px] w-[32px] text-white" />
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[35px] font-semibold tracking-[-0.045em] text-[#493438]">
          Nyora
        </span>
        <span className="mt-1.5 pl-1 text-[9px] font-semibold uppercase tracking-[0.48em] text-[#A66D78]">
          BEAUTY
        </span>
      </span>
    </div>
  );
}

function GoldDivider({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C9A27E]" />
      <span className="h-2 w-2 rotate-45 bg-[#B98D60]" />
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C9A27E]" />
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      if (!data.token || !data.admin) {
        throw new Error(
          "The server returned an invalid login response."
        );
      }

      sessionStorage.setItem("nyoraAdminToken", data.token);
      sessionStorage.setItem(
        "nyoraAdmin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check that the backend is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-[15px] border border-[#E4D3CA] bg-white/65 py-[16px] pl-[49px] pr-12 text-[14px] text-[#493438] outline-none transition duration-300 placeholder:text-[#AA9995] hover:border-[#C7A3A4] focus:border-[#A66D78] focus:bg-white/90 focus:ring-4 focus:ring-[#A66D78]/10";

  return (
    <main
      dir="ltr"
      className="admin-login-bg relative isolate flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#F8EDE5] px-4 py-7 sm:px-7 lg:px-10 lg:py-8"
    >
      {/* Mobile only: leaves on both sides, image keeps its natural proportions */}
      <div aria-hidden="true" className="admin-leaf admin-leaf-left md:hidden" />
      <div aria-hidden="true" className="admin-leaf admin-leaf-right md:hidden" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#F8EDE5]/15 via-[#FFF9F4]/10 to-[#F8EDE5]/15"
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-5 sm:gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 xl:gap-24">

        {/* Brand introduction */}
        <section className="flex flex-col items-center justify-center px-3 py-2 sm:px-8 lg:items-start lg:px-0 lg:py-12">

          <div className="animate-[fadeIn_.8s_ease-out_both] lg:-translate-y-10">
            <NyoraLogo />
          </div>

          {/* Desktop introduction */}
          <div className="mt-10 hidden lg:mt-24 lg:block lg:-translate-y-14">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.38em] text-[#A66D78]">
              Admin Access
            </p>

            <h1 className="max-w-[470px] font-serif text-[44px] font-normal leading-[1.15] tracking-[-0.025em] text-[#493438] xl:text-[48px]">
              Where Beauty
              <br />
              Meets Vision
            </h1>

            <p className="mt-5 max-w-[390px] font-serif text-[14px] font-normal italic leading-[1.8] text-[#806C70]">
              Manage your store, track your orders,
              <br />
              and keep your beauty journey growing.
            </p>

            <GoldDivider className="mt-7" />
          </div>
        </section>

        {/* Login form */}
        <section className="w-full animate-[fadeIn_.8s_.12s_ease-out_both]">
          <div className="mx-auto w-full max-w-[650px] rounded-[26px] border border-white/80 bg-[#FFFAF6]/80 px-5 py-7 shadow-[0_28px_90px_rgba(84,45,58,0.16)] backdrop-blur-[6px] sm:rounded-[34px] sm:px-10 sm:py-10 sm:backdrop-blur-[14px] md:px-14 md:py-12 lg:-translate-x-12 lg:rounded-[38px] lg:px-10 lg:py-12 xl:-translate-x-16 xl:px-[58px] xl:py-[52px]">

            {/* Leaf icon */}
            <div className="mb-5 flex justify-center sm:mb-6">
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#E8D3C8]/80 bg-[#F9EDE7]/75 text-[#B5687C] sm:h-[58px] sm:w-[58px]">
                <LeafMark className="h-[29px] w-[29px] sm:h-[32px] sm:w-[32px]" strokeWidth={1.3} />
              </div>
            </div>

            <div className="text-center">
              <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#A66D78] sm:text-[11px]">
                Private Access
              </p>

              <h2 className="mt-3 font-serif text-[27px] font-normal leading-tight tracking-[-0.02em] text-[#493438] sm:text-[34px] md:text-[38px]">
                Welcome Back
              </h2>

              <GoldDivider className="mx-auto mt-5 justify-center" />

              <p className="mx-auto mt-5 max-w-[365px] font-serif text-[13px] leading-[1.9] text-[#806C70] sm:mt-6 sm:text-[15px]">
                Your store is waiting for you. Sign in to manage
                your products and orders.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5 text-left sm:mt-9 sm:space-y-6"
            >
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2.5 block text-[12px] font-medium text-[#493438] sm:text-[13px]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-[17px] top-1/2 -translate-y-1/2 text-[#A66D78]"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2.5 block text-[12px] font-medium text-[#493438] sm:text-[13px]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-[17px] top-1/2 -translate-y-1/2 text-[#A66D78]"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#A66D78] transition hover:bg-[#F7E9E5]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={1.6} />
                    ) : (
                      <Eye size={18} strokeWidth={1.6} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-4 rounded-[15px] bg-gradient-to-r from-[#542D3A] via-[#693748] to-[#7A4455] px-5 py-[16px] text-[10px] font-medium uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(84,45,58,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_17px_34px_rgba(84,45,58,0.3)] focus:outline-none focus:ring-4 focus:ring-[#A66D78]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-[17px] sm:py-[19px] sm:text-[12px] sm:tracking-[0.19em]"
              >
                <span>
                  {loading ? "Signing in..." : "Sign in to dashboard"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-[#E9DCD5]/90 pt-5 sm:mt-9 sm:pt-6">
              <div className="flex items-center justify-center gap-2.5 text-[#8C7777]">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.4}
                  className="shrink-0 text-[#A66D78]"
                />

                <p className="text-center text-[9px] leading-5 sm:text-[11px]">
                  Reserved for authorized Nyora Beauty administrators.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="relative mt-5 w-full px-4 text-center lg:absolute lg:bottom-3 lg:left-0 lg:right-0 lg:mt-0">
        <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#987E7B]/90 sm:text-[9px] sm:tracking-[0.22em]">
          © {new Date().getFullYear()} Nyora Beauty · Administration
        </p>
      </footer>

      <style>{`
        /* Tablet + desktop: the full background image, as before */
        .admin-login-bg {
          background-image: url('/Login-background.png');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }

        /* Mobile: no stretched image, leaves frame both sides instead */
        @media (max-width: 767px) {
          .admin-login-bg {
            background-image: none;
          }
        }

        .admin-leaf {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 58%;
          z-index: -10;
          pointer-events: none;
          background-image: url('/Login-background.png');
          background-repeat: no-repeat;
          background-size: auto 100%;
        }

        .admin-leaf-left {
          left: 0;
          background-position: left center;
          -webkit-mask-image: linear-gradient(to right, #000 55%, transparent 100%);
          mask-image: linear-gradient(to right, #000 55%, transparent 100%);
        }

                .admin-leaf-left::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            circle 340px at 0 0,
            rgba(242, 213, 201, 0.95) 0%,
            rgba(244, 218, 207, 0.85) 40%,
            rgba(246, 226, 216, 0) 100%
          );
        }
        .admin-leaf-right {
          right: 0;
          background-position: right center;
          -webkit-mask-image: linear-gradient(to left, #000 55%, transparent 100%);
          mask-image: linear-gradient(to left, #000 55%, transparent 100%);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
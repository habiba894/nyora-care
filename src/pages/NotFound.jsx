import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-[75vh] items-center bg-[#F8F4EF] px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1100px] text-center">

        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A66D78]">
          Nyora Beauty
        </p>

        <h1
          className="mt-5 font-display font-normal leading-[0.85] tracking-[-0.04em] text-[#493438]"
          style={{ fontSize: "clamp(7rem, 18vw, 14rem)" }}
        >
          404
        </h1>

        <h2 className="mt-2 font-display text-[32px] font-normal leading-[1.1] text-[#493438] sm:text-[40px]">
          This page wandered off.
        </h2>

        <p className="mx-auto mt-4 max-w-[430px] text-[15px] leading-[1.7] text-[#79686A]">
          We couldn't find the page you were looking for.
          Let's get you back to something beautiful.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-full bg-[#493438] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#62474D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
          >
            <ArrowLeft size={15} strokeWidth={1.6} />
            Back to home
          </Link>

          <Link
            to="/shop"
            className="inline-flex rounded-full border border-[#493438] px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#493438] transition-all duration-300 hover:bg-[#493438] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66D78]"
          >
            Shop products
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
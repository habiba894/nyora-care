
import HeroSection from "../Components/HeroSection";
import Features from "../Components/Features";
import IngredientLab from "../Components/IngrediantLab";
import BrandStory from "../Components/BrandStory";
import ProductShowcase from "../Components/ProductShowcase";
import Testimonials from "../Components/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Features />
      <IngredientLab />
      <BrandStory />
      <ProductShowcase />
      <Testimonials />
    </>
  );
}

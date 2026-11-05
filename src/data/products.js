import lipScrub from "../assets/Products/lipscrub.png";
import hairBalm from "../assets/Products/hairbalm.png";
import faceMask from "../assets/Products/face-mask.png";
import lipBalm from "../assets/Products/lip-balm.png";
import bodyButter from "../assets/Products/Body-butter.png";

// group = the shop filter (matches the Navbar menu: Face / Lips / Body / Hair)
export const groups = ["Face", "Lips", "Body", "Hair"];

// tagline (optional) = short line shown above the description
// description = the caption paragraph
// ingredients = list, shown separately under the description
export const products = [
  {
    id: 1,
    name: "Strawberry Lip Scrub",
    group: "Lips",
    category: "Lip Care",
    price: 90,
    image: lipScrub,
    position: "50% 50%",
    reviews: 40,
    sizes: ["30ml", "50ml"],
    tagline: "Smooth. Polish. Glow. ",
    description:
      "A gentle lip scrub that buffs away dry, flaky skin, leaving your lips soft, smooth, and beautifully renewed.",
    ingredients: [], // TODO: waiting for the ingredients list
  },
  {
    id: 2,
    name: "Hair Balm",
    group: "Hair",
    category: "Hair Care",
    price: 180,
    image: hairBalm,
    position: "55% 50%",
    reviews: 120,
    sizes: ["100ml", "200ml"],
    tagline: "",
    description:
      "A luxurious hair balm designed to nourish dry, frizzy hair, tame flyaways, and leave your strands soft, smooth, and naturally glossy — without the heavy feel.",
    ingredients: [
      "Shea butter",
      "Cocoa butter",
      "Jojoba oil",
      "Coconut oil",
      "Marrow oil",
      "Sweet almond oil",
      "Pumpkin oil",
      "Beeswax",
    ],
  },
  {
    id: 3,
    name: "Face Mask",
    group: "Face",
    category: "Face Care",
    price: 80,
    image: faceMask,
    position: "50% 50%",
    reviews: 70,
    sizes: ["50ml"],
    tagline: "Purify. Refine. Glow. ",
    description:
      "A clarifying clay mask that absorbs excess oil, unclogs pores, and leaves skin fresh, smooth, and balanced.",
    ingredients: [
      "Kaolin clay",
      "Bentonite clay",
      "Salicylic acid",
      "Charcoal",
      "Blue indigo",
      "Glycerin",
      "Grape seed oil",
    ],
  },
  {
    id: 4,
    name: "Lip Balm",
    group: "Lips",
    category: "Lip Care",
    price: 70,
    image: lipBalm,
    position: "50% 50%",
    reviews: 95,
    sizes: ["15ml"],
    tagline: "",
    description:
      "A nourishing lip balm enriched with jojoba, grapeseed, coconut & castor oils to deeply soften, smooth, and protect your lips, leaving them beautifully supple with a natural shine.",
    ingredients: [
      "Cocoa butter",
      "Shea butter",
      "Vaseline",
      "Grape seed oil",
      "Coconut oil",
      "Castor oil",
      "Jojoba oil",
      "Beeswax",
    ],
  },
  {
    id: 5,
    name: "Body Butter",
    group: "Body",
    category: "Body Care",
    price: 220,
    image: bodyButter,
    position: "78% 50%",
    reviews: 70,
    sizes: ["100ml", "200ml"],
    tagline: "Rich nourishment. Silky-soft skin. ",
    description:
      "A fast-absorbing body butter that deeply hydrates, softens, and leaves your skin smooth without a greasy feel.",
    ingredients: [
      "Shea butter",
      "Mango butter",
      "Jojoba oil",
      "Sweet almond oil",
      "Aloe vera",
      "Panthenol",
      "Glycerin",
    ],
  },
];
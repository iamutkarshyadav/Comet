import { z } from "zod";

export const ProductSizeSchema = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);
export type ProductSize = z.infer<typeof ProductSizeSchema>;

export const ProductCategorySchema = z.enum([
  "all",
  "outerwear",
  "knitwear",
  "t-shirts",
  "trousers",
  "accessories",
]);
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  tagline: z.string(),
  description: z.string(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  category: ProductCategorySchema,
  sizes: z.array(ProductSizeSchema),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
    })
  ),
  images: z.array(z.string().url().or(z.string())),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  isNewArrival: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  inStock: z.boolean().default(true),
});
export type Product = z.infer<typeof ProductSchema>;

export const CartItemSchema = z.object({
  product: ProductSchema,
  selectedSize: ProductSizeSchema,
  selectedColor: z.string(),
  quantity: z.number().int().positive(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const OrderCheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart cannot be empty"),
  customer: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(3, "Shipping address is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(2, "Postal code is required"),
    country: z.string().min(2, "Country is required"),
  }),
});
export type OrderCheckout = z.infer<typeof OrderCheckoutSchema>;

// Seed enterprise catalog data
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Cashmere Oversized Trench",
    tagline: "Double-faced Mongolian wool with sculptural lapels",
    description: "Tailored from 100% Mongolian pure cashmere, this overcoat introduces an effortless, fluid silhouette with relaxed raglan sleeves and hand-finished horn buttons.",
    price: 480,
    compareAtPrice: 580,
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Oatmeal Melange", hex: "#D6C7B2" },
      { name: "Obsidian Black", hex: "#18181B" },
      { name: "Camel", hex: "#9C7A5B" },
    ],
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 42,
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
  },
  {
    id: "prod-002",
    name: "Architectural Heavyweight Knit",
    tagline: "700GSM organic cotton ribbed sweater",
    description: "Engineered for structured drape with substantial weight. Features a dropped shoulder cut, reinforced collar, and ribbed cuffs built to maintain form wash after wash.",
    price: 195,
    compareAtPrice: 240,
    category: "knitwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Raw Ecru", hex: "#EAE6DF" },
      { name: "Deep Sage", hex: "#4B5548" },
      { name: "Midnight Navy", hex: "#1E293B" },
    ],
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 78,
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
  },
  {
    id: "prod-003",
    name: "Structured Pleated Trouser",
    tagline: "Wide-leg Japanese wool-blend with double front pleats",
    description: "Modern high-rise trouser designed with double front inverted pleats, concealed zip fly, and an expansive flowing leg line that drapes crisply over loafers or sneakers.",
    price: 220,
    compareAtPrice: undefined,
    category: "trousers",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal Grey", hex: "#334155" },
      { name: "Sandstone", hex: "#CBD5E1" },
      { name: "Black", hex: "#0F172A" },
    ],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 31,
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
  },
  {
    id: "prod-004",
    name: "Heavyweight Boxy Graphic Tee",
    tagline: "280GSM combed cotton jersey with micro-typography",
    description: "Compact spun premium cotton knit pre-shrunk with garment wash. Featuring subtle tonal typography on the back collar and a modern relaxed drop silhouette.",
    price: 85,
    compareAtPrice: 110,
    category: "t-shirts",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Washed Black", hex: "#27272A" },
      { name: "Bone White", hex: "#F4F4F5" },
      { name: "Espresso", hex: "#3D2B1F" },
    ],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 114,
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
  },
  {
    id: "prod-005",
    name: "Full-Grain Leather Crossbody",
    tagline: "Italian vegetable-tanned leather with brushed nickel hardware",
    description: "Minimalist geometric geometry crafted with hand-painted beveled edges, magnetic concealed closures, and an adjustable webbing strap.",
    price: 310,
    compareAtPrice: 360,
    category: "accessories",
    sizes: ["M"],
    colors: [
      { name: "Cognac Brown", hex: "#78350F" },
      { name: "Matte Black", hex: "#18181B" },
    ],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.95,
    reviewCount: 56,
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
  },
  {
    id: "prod-006",
    name: "Insulated Modular Puffer",
    tagline: "Water-repellent ripstop shell with RDS certified down fill",
    description: "Ultralight insulation rated to -15°C with removable hood, storm cuffs, and fleece-lined handwarmer pockets. Designed for city and alpine versatility.",
    price: 390,
    compareAtPrice: undefined,
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Alpine Sage", hex: "#52796F" },
      { name: "Slate", hex: "#475569" },
      { name: "Pitch Black", hex: "#09090B" },
    ],
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.85,
    reviewCount: 39,
    isNewArrival: false,
    isFeatured: false,
    inStock: true,
  },
];

// Reusable Client API methods for Web & Mobile
export const api = {
  getProducts: async (category?: ProductCategory): Promise<Product[]> => {
    if (!category || category === "all") return SAMPLE_PRODUCTS;
    return SAMPLE_PRODUCTS.filter((p) => p.category === category);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    return SAMPLE_PRODUCTS.find((p) => p.id === id);
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    return SAMPLE_PRODUCTS.filter((p) => p.isFeatured);
  },

  validateOrder: (order: unknown): { success: boolean; data?: OrderCheckout; errors?: string[] } => {
    const result = OrderCheckoutSchema.safeParse(order);
    if (!result.success) {
      return {
        success: false,
        errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return { success: true, data: result.data };
  },
};

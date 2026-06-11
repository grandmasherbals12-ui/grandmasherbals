export type ShowcaseItem = {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  notes?: string[];
};

export type ShowcaseSection = {
  key: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  highlights?: string[];
  images?: string[];
  items?: ShowcaseItem[];
  ctaHref?: string;
  ctaLabel?: string;
};

export const boomMaxSection: ShowcaseSection = {
  key: "boom-max",
  eyebrow: "Men's Vitality Collection",
  title: "BOOM BOOM MAX",
  subtitle: "Strength. Confidence. Vitality.",
  description:
    "Not every man is looking for intensity. Many are looking for consistency. BOOM BOOM MAX was developed for men seeking a smoother vitality experience designed to complement active lifestyles, personal wellness goals, and everyday performance.",
  highlights: [
    "Daily Energy & Drive",
    "Confidence & Presence",
    "Mood & Motivation",
    "Healthy Circulation Support",
    "Endurance & Stamina",
    "Mental Focus & Clarity",
  ],
  images: ["/boommax-1.png", "/boommax-2.png"],
  ctaHref: "/shop?browse=adult-enhancement",
  ctaLabel: "View collection",
};

export const peachFlowSection: ShowcaseSection = {
  key: "peach-flow",
  eyebrow: "Women's Vitality Collection",
  title: "PEACH FLOW",
  subtitle: "Confidence. Balance. Radiance.",
  description:
    "PEACH FLOW was thoughtfully created for women who want to feel vibrant, confident, balanced, and connected to their best selves. Crafted from carefully selected flowers, fruits, herbs, roots, and botanicals, it was designed to complement self-care rituals, active lifestyles, and everyday wellness routines.",
  highlights: [
    "Daily Vitality & Energy",
    "Emotional Wellness",
    "Mood & Mindset",
    "Healthy Circulation Support",
    "Hydration & Balance",
    "Beauty From Within",
  ],
  images: ["/peachflow-1.png", "/peachflow-2.png"],
  ctaHref: "/shop?browse=adult-enhancement",
  ctaLabel: "View collection",
};

export const herbalIvSection: ShowcaseSection = {
  key: "herbal-iv",
  eyebrow: "Herbal Infused Vitality",
  title: "HERBAL IV",
  subtitle: "Refresh. Replenish. Revitalize.",
  description:
    "Crafted from thoughtful consideration, botanical tradition, and modern wellness research, HERBAL IV is Grandma's Herbals' signature collection of herbal infused vitality blends developed to elevate the everyday wellness experience.",
  overlayTitle: "Bespoke Formulated Compounds",
  overlaySubtitle: "Rejuvenating mind. body. spirit. soul",
  highlights: [
    "Everyday Hydration",
    "Vitality & Wellness",
    "Mood & Mindset",
    "Daily Energy",
    "Mental Clarity",
    "Active Lifestyle Recovery",
  ],
  images: ["/herbal-iv-1.png", "/herbal-iv-2.png", "/herbal-iv-3.png", "/herbal-iv-4.png"],
  ctaHref: "/shop?browse=herbal-iv",
  ctaLabel: "View collection",
};

export const tropicalReviveSection: ShowcaseSection = {
  key: "tropical-revive",
  eyebrow: "Botanical Vitality Blend",
  title: "TROPICAL REVIVE",
  subtitle: "Bright. Vibrant. Refreshing.",
  description:
    "Tropical Revive is a botanical vitality blend crafted from hibiscus, strawberry, pomegranate, and lime. This refreshing infusion combines floral notes, bright fruit flavors, and citrus accents into a vibrant wellness experience designed to complement active lifestyles and daily wellness routines.",
  highlights: ["Hibiscus", "Strawberry", "Pomegranate", "Lime"],
};

export const berryBalanceSection: ShowcaseSection = {
  key: "berry-balance",
  eyebrow: "Botanical Vitality Blend",
  title: "BERRY BALANCE",
  subtitle: "Calm. Colorful. Balanced.",
  description:
    "Berry Balance combines elderberry, blueberry, butterfly pea flower, and lavender into a beautifully crafted botanical vitality blend designed for moments of focus, creativity, relaxation, and self-care.",
  highlights: ["Elderberry", "Blueberry", "Butterfly Pea Flower", "Lavender"],
};

export const citrusRestoreSection: ShowcaseSection = {
  key: "citrus-restore",
  eyebrow: "Botanical Vitality Blend",
  title: "CITRUS RESTORE",
  subtitle: "Clean. Bright. Energizing.",
  description:
    "Citrus Restore blends orange, lemon, ginger, and turmeric into a refreshing botanical vitality experience inspired by nature's most vibrant ingredients. This blend is ideal for mornings, active lifestyles, and wellness-focused routines.",
  highlights: ["Orange", "Lemon", "Ginger", "Turmeric"],
};

export const dailyHydrateSection: ShowcaseSection = {
  key: "daily-hydrate",
  eyebrow: "Botanical Vitality Blend",
  title: "DAILY HYDRATE",
  subtitle: "Pure. Refreshing. Essential.",
  description:
    "Daily Hydrate was thoughtfully developed to deliver a refreshing botanical vitality experience inspired by coconut, ginger, soursop, and lime. Every sip is designed to transform ordinary hydration into a daily act of self-care.",
  overlayTitle: "Organic Wellness",
  overlaySubtitle: "Grown in nature. Guided by Wisdom.",
  highlights: ["Coconut", "Ginger", "Soursop", "Lime"],
};

export const notTodaySections: ShowcaseSection[] = [
  {
    key: "not-today-1",
    eyebrow: "Alcohol Cravings",
    title: "NOT TODAY",
    subtitle: "Choose Tomorrow.",
    description:
      "NOT TODAY Alcohol Cravings was developed for individuals committed to making mindful choices and supporting healthier daily habits.",
    highlights: ["Craving Management", "Mood Balance", "Stress Support", "Intentional Living"],
    images: ["/not-today-1.png"],
  },
  {
    key: "not-today-2",
    eyebrow: "Men's Wellness",
    title: "NOT TODAY",
    subtitle: "Comfort. Confidence. Flow.",
    description:
      "NOT TODAY Flow Restored was developed for men seeking support for everyday comfort, confidence, and healthy aging wellness routines.",
    highlights: ["Men's Wellness", "Confidence & Comfort", "Daily Vitality", "Active Living"],
    images: ["/not-today-2.png"],
  },
  {
    key: "not-today-3",
    eyebrow: "Headache Support",
    title: "NOT TODAY",
    subtitle: "Keep Moving Forward.",
    description:
      "NOT TODAY Headache Support was created for individuals seeking wellness support when occasional tension and daily stress become distractions.",
    highlights: ["Daily Comfort", "Mental Ease", "Stress Support", "Focus & Productivity"],
    images: ["/not-today-3.png"],
  },
  {
    key: "not-today-4",
    eyebrow: "Sleep & Stress",
    title: "NOT TODAY",
    subtitle: "Unplug. Unwind. Restore.",
    description:
      "NOT TODAY Sleep & Stress was developed for individuals seeking a more peaceful evening routine and a calmer transition into rest.",
    highlights: ["Evening Relaxation", "Stress Management", "Calm Mindset", "Wellness Balance"],
    images: ["/not-today-4.png"],
  },
  {
    key: "not-today-5",
    eyebrow: "Appetite & Weight",
    title: "NOT TODAY",
    subtitle: "Less Hunger. More Control. Feel Lighter.",
    description:
      "NOT TODAY Appetite & Weight was designed for individuals committed to making healthier food choices and maintaining greater awareness of daily eating habits.",
    highlights: ["Appetite Awareness", "Portion Control Goals", "Healthy Habit Formation", "Daily Discipline"],
    images: ["/not-today-5.png"],
  },
  {
    key: "not-today-6",
    eyebrow: "Cannabis Cravings",
    title: "NOT TODAY",
    subtitle: "Choose Clarity. Choose Control.",
    description:
      "NOT TODAY Cannabis Cravings was developed for individuals seeking support while creating healthier habits, improving focus, and strengthening personal discipline.",
    highlights: ["Focus & Mental Clarity", "Mood & Mindset", "Stress Management", "Personal Discipline"],
    images: ["/not-today-6.png"],
  },
  {
    key: "not-today-7",
    eyebrow: "Joint Pain & Stiffness",
    title: "NOT TODAY",
    subtitle: "Move With Confidence.",
    description:
      "NOT TODAY Joint & Stiffness Support was developed for active individuals seeking to maintain mobility, flexibility, and movement throughout their day.",
    highlights: ["Mobility & Flexibility", "Active Lifestyles", "Daily Movement", "Movement Confidence"],
    images: ["/not-today-7.png"],
  },
  {
    key: "not-today-8",
    eyebrow: "Sinus & Allergy",
    title: "NOT TODAY",
    subtitle: "Breathe Easy. Live Fully.",
    description:
      "NOT TODAY Sinus & Allergy was crafted for individuals seeking seasonal wellness support and daily respiratory comfort.",
    highlights: ["Seasonal Wellness", "Clearer Breathing Comfort", "Active Living", "Refreshing Balance"],
    images: ["/not-today-8.png"],
  },
  {
    key: "not-today-9",
    eyebrow: "Sugar Cravings",
    title: "NOT TODAY",
    subtitle: "Break The Cycle.",
    description:
      "NOT TODAY Sugar Cravings was developed for individuals seeking support while reducing unnecessary snacking and creating healthier eating patterns.",
    highlights: ["Reduced Sweet Cravings", "Better Food Decisions", "Daily Discipline", "Healthier Habits"],
    images: ["/not-today-9.png"],
  },
  {
    key: "not-today-tobacco",
    eyebrow: "Tobacco Cravings",
    title: "NOT TODAY",
    subtitle: "Choose Freedom. Choose Clarity.",
    description:
      "NOT TODAY Tobacco Cravings was developed for individuals committed to creating healthier habits, improving focus, and strengthening personal discipline away from tobacco dependency.",
    highlights: ["Focus & Mental Clarity", "Mood & Mindset", "Stress Management", "Personal Discipline"],
    images: ["/not-today-10.png"],
  },
];

export const merchandiseImages = [
  "/merchandise-1.png",
  "/merchandise-2.png",
  "/merchandise-3.png",
  "/merchandise-4.png",
  "/merchandise-5.png",
  "/merchandise-6.png",
  "/merchandise-7.png",
  "/merchandise-8.png",
  "/merchandise-9.png",
];

export const scentSections: ShowcaseSection[] = [
  {
    key: "scent-1",
    eyebrow: "Aromatherapy & Candles",
    title: "Frankincense • Ylang Ylang • Vanilla",
    subtitle: "A warm, luxurious, resinous fragrance.",
    description:
      "Hand-poured soy aromatherapy candle with soft sacred frankincense, exotic floral ylang ylang, and creamy vanilla undertones. Ideal for evening relaxation, prayer, meditation, self-care rituals, bath time, reading, and unwinding after a long day.",
    highlights: ["Grounding", "Sophisticated", "Romantic", "Meditative", "Comforting"],
    images: ["/scent-1.png"],
  },
  {
    key: "scent-2",
    eyebrow: "Aromatherapy & Candles",
    title: "Citrus • Magnolia • Lime",
    subtitle: "Fresh citrus opens into soft magnolia petals.",
    description:
      "Hand-poured soy aromatherapy candle with vibrant lime and sweet orange notes that unfold into a clean, uplifting floral-citrus experience. Ideal for morning routines, kitchens, offices, entryways, spring gatherings, and uplifting moods.",
    highlights: ["Refreshing", "Clean", "Energizing", "Cheerful", "Airy"],
    images: ["/scent-2.png"],
  },
  {
    key: "scent-3",
    eyebrow: "Aromatherapy & Candles",
    title: "Clove • Rose • Lemon",
    subtitle: "Elegant, vintage, and timeless.",
    description:
      "Hand-poured soy aromatherapy candle with spicy clove buds, velvety rose petals, and bright lemon — a fragrance that feels both vintage and timeless. Ideal for dinner parties, guest rooms, intimate gatherings, tea time, and special occasions.",
    highlights: ["Elegant", "Romantic", "Vintage", "Inviting", "Sophisticated"],
    images: ["/scent-3.png"],
  },
  {
    key: "scent-4",
    eyebrow: "Aromatherapy & Candles",
    title: "Mint • Cinnamon • Lavender",
    subtitle: "Cooling mint, soft lavender, warm cinnamon.",
    description:
      "Hand-poured soy aromatherapy candle with cooling mint that awakens the senses, lavender that softens the experience, and cinnamon that adds warmth and depth. Ideal for bedrooms, wellness spaces, yoga studios, massage rooms, and spa environments.",
    highlights: ["Relaxing", "Clean", "Balanced", "Herbal", "Restorative"],
    images: ["/scent-4.png"],
  },
];

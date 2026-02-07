// Settings type definitions for admin-configurable site settings

export interface BrandSettings {
    shopName: string;
    logoUrl?: string;
    fontFamily: 'serif' | 'sans-serif' | 'monospace' | 'cursive';
    brandColor: string;
    glowEnabled: boolean;
}

export interface HeroSettings {
    visible: boolean;
    backgroundImage: string;
    heading: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
}

export enum SectionType {
    TEXT = 'text',
    IMAGE = 'image',
    TEXT_IMAGE = 'text_image',
    CATEGORY_GRID = 'category_grid',
    FEATURED_PRODUCTS = 'featured_products',
    TRUST_MESSAGING = 'trust_messaging'
}

export interface ContentSection {
    id: string;
    type: SectionType;
    title: string;
    content: string;
    imageUrl?: string;
    order: number;
    visible: boolean;
}

export interface SiteSettings {
    brand: BrandSettings;
    hero: HeroSettings;
    sections: ContentSection[];
}

// Default settings
export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
    shopName: 'Vanitha Gold Covering',
    logoUrl: '',
    fontFamily: 'serif',
    brandColor: '#D4AF37',
    glowEnabled: true
};

export const DEFAULT_HERO_SETTINGS: HeroSettings = {
    visible: true,
    backgroundImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
    heading: 'Diwali Special Offers',
    subheading: 'Premium Impon & Gold Covering Collections. Experience the traditional glow of South India.',
    primaryButtonText: 'Shop Now',
    primaryButtonLink: '/catalog',
    secondaryButtonText: 'Impon Arrivals',
    secondaryButtonLink: '/catalog?category=Chains'
};

export const DEFAULT_SECTIONS: ContentSection[] = [
    {
        id: 'category-grid',
        type: SectionType.CATEGORY_GRID,
        title: 'Shop by Category',
        content: 'Browse Collections',
        order: 0,
        visible: true
    },
    {
        id: 'featured-products',
        type: SectionType.FEATURED_PRODUCTS,
        title: 'Curated Selections',
        content: 'Browse All Designs',
        order: 1,
        visible: true
    },
    {
        id: 'trust-messaging',
        type: SectionType.TRUST_MESSAGING,
        title: 'Crafted with Tradition',
        content: 'Every piece in our collection is meticulously handcrafted by artisans using ancient techniques, ensuring you wear not just jewellery, but a piece of heritage.',
        order: 2,
        visible: true
    }
];

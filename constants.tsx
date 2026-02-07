
import { Category, Material, Product } from './types';

export const SHOP_INFO = {
    name: 'Vanitha Covering',
    address: 'Near Bus Stand, Gandhi Poonga Road, Aranthangi – 614616',
    phone: '9080509976',
    email: 'mrtamilp@gmail.com',
    whatsapp: '9080509976',
    instagram: 'vanithacovering_aranthangi' // Placeholder ID
};

const USER_IMAGES = [
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/OIP---Copy---Copy-imagetourl.cloud-1770289716905-93l08h.jpeg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/OIP--2----Copy-imagetourl.cloud-1770289716916-1bcy3u.jpeg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/WhatsApp-Image-2025-08-29-at-14-43-48_64bdb9df-imagetourl.cloud-1770289716876-sx7bff.jpg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/WhatsApp-Image-2025-08-29-at-14-44-18_457a4c78-imagetourl.cloud-1770289716896-ar77yo.jpg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/WhatsApp-Image-2025-08-29-at-14-45-51_f766af44-imagetourl.cloud-1770289716863-vwe9p4.jpg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/WhatsApp-Image-2025-08-29-at-14-42-46_8574ba17-imagetourl.cloud-1770289716908-t82qks.jpg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/WhatsApp-Image-2025-08-30-at-15-58-17_3d05bf6e-imagetourl.cloud-1770289716825-tluv5u.jpg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/WhatsApp-Image-2025-08-29-at-12-50-50_8bf262f6---C-imagetourl.cloud-1770289716889-0yu8y0.jpg',
    'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/OIP--1--imagetourl.cloud-1770289716769-ph7jme.jpeg'
];

const NOW = Date.now();
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Traditional Impon Ring',
        category: Category.RINGS,
        material: Material.IMPON,
        price: 450,
        weight: 4.5,
        image: USER_IMAGES[4],
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Traditional five-metal alloy ring. Good for health and skin-friendly.',
        tags: ['Skin Friendly']
    },
    {
        id: '2',
        name: 'Long Mop Chain',
        category: Category.CHAINS,
        material: Material.COVERING,
        price: 850,
        weight: 12.0,
        image: USER_IMAGES[8],
        isBogo: true,
        isOutofStock: false,
        createdAt: NOW - (ONE_WEEK * 2),
        description: 'High quality gold covering chain suitable for daily wear. Buy 1 Get 1 Free.'
    },
    {
        id: '3',
        name: 'Traditional Bangle Set',
        category: Category.BANGLES,
        material: Material.STONE,
        price: 1200,
        weight: 24.0,
        image: USER_IMAGES[3],
        isBogo: true,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Exquisite stone-studded bangle set for weddings and festivals.'
    },
    {
        id: '4',
        name: 'Daily Wear Bangles',
        category: Category.BANGLES,
        material: Material.COVERING,
        price: 600,
        weight: 18.0,
        image: USER_IMAGES[1],
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW - ONE_WEEK,
        description: 'Elegant daily wear bangles with long-lasting gold plating.'
    },
    {
        id: '5',
        name: 'Stone Studded Necklace',
        category: Category.NECKLACES,
        material: Material.STONE,
        price: 2500,
        weight: 45.0,
        image: USER_IMAGES[5],
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Handcrafted stone necklace that captures traditional beauty.'
    },
    {
        id: '6',
        name: 'Classic Jhumka Earrings',
        category: Category.EARRINGS,
        material: Material.IMPON,
        price: 350,
        weight: 10.0,
        image: USER_IMAGES[0],
        isBogo: true,
        isOutofStock: false,
        createdAt: NOW - (ONE_WEEK * 3),
        description: 'Traditional Impon jhumkas, hypoallergenic and perfect for all skin types.'
    },
    {
        id: '7',
        name: 'Bridal Bangle Collection',
        category: Category.RENTAL,
        material: Material.STONE,
        price: 1450,
        weight: 28.5,
        image: USER_IMAGES[6],
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Heavily stone-studded bridal bangles available for rental.'
    },
    {
        id: '8',
        name: 'Gold Plated Necklace Set',
        category: Category.NECKLACES,
        material: Material.COVERING,
        price: 2100,
        weight: 35.0,
        image: USER_IMAGES[2],
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Complete necklace set with matching earrings.'
    },
    {
        id: '9',
        name: 'Handcrafted Earrings',
        category: Category.EARRINGS,
        material: Material.STONE,
        price: 250,
        weight: 6.0,
        image: USER_IMAGES[7],
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Simple and elegant earrings for everyday sophistication.'
    },
    {
        id: '10',
        name: '👑 Royal Bridal Gold Covering Necklace Set',
        category: Category.BRIDAL_NECKLACE_SETS,
        material: Material.STONE,
        price: 4500,
        weight: 120.0,
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1974&auto=format&fit=crop',
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'A majestic bridal set featuring a heavy necklace and matching accessories. Perfect for a royal wedding look.',
        tags: ['Bridal', 'Premium']
    },
    {
        id: '11',
        name: '✨ Premium Stone Bangles Collection',
        category: Category.BANGLES_COLLECTION,
        material: Material.STONE,
        price: 1800,
        weight: 45.0,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb0ce33e?q=80&w=2070&auto=format&fit=crop',
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Exquisite stone-embedded bangles that add a touch of sparkle to any outfit.',
        tags: ['Best Seller']
    },
    {
        id: '12',
        name: '🦚 Traditional Peacock Design Long Haram Set',
        category: Category.LONG_HARAM_CHAINS,
        material: Material.COVERING,
        price: 3200,
        weight: 85.0,
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2070&auto=format&fit=crop',
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Beautifully crafted long haram set with traditional peacock motifs.',
        tags: ['Traditional']
    },
    {
        id: '13',
        name: '🦚 Classic Peacock Motif Long Chains (Set Collection)',
        category: Category.LONG_HARAM_CHAINS,
        material: Material.COVERING,
        price: 2800,
        weight: 70.0,
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop',
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Elegant long chains featuring classic peacock designs, perfect for layering.',
        tags: ['New Arrival']
    },
    {
        id: '14',
        name: '🙏 Traditional Temple & Floral Pendant Designs',
        category: Category.TRADITIONAL_PENDANT_DESIGNS,
        material: Material.IMPON,
        price: 950,
        weight: 15.0,
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1974&auto=format&fit=crop',
        isBogo: false,
        isOutofStock: false,
        createdAt: NOW,
        description: 'Intricately designed temple and floral pendants, showcasing spiritual and natural beauty.',
        tags: ['Temple Jewellery']
    }
];

export const CARE_TIPS = [
    {
        titleEn: 'Keep Dry',
        titleTa: 'உலர்வாக வைத்திருங்கள்',
        descEn: 'Avoid wearing your jewellery in the pool or shower.',
        descTa: 'குளிக்கும்போதோ அல்லது நீச்சல் குளத்திலோ நகைகளை அணிய வேண்டாம்.'
    },
    {
        titleEn: 'Avoid Perfumes',
        titleTa: 'வாசனை திரவியங்களை தவிர்க்கவும்',
        descEn: 'Apply lotions and perfumes before putting on your jewellery.',
        descTa: 'நகைகளை அணிவதற்கு முன்பே லோஷன் மற்றும் சென்ட் தடவவும்.'
    },
    {
        titleEn: 'Proper Storage',
        titleTa: 'முறையாக சேமிக்கவும்',
        descEn: 'Store in a clean, dry, airtight plastic cover.',
        descTa: 'சுத்தமான மற்றும் காற்று புகாத பிளாஸ்டிக் கவரில் சேமிக்கவும்.'
    },
    {
        titleEn: 'Clean Gently',
        titleTa: 'மென்மையாக துடைக்கவும்',
        descEn: 'Wipe with a soft cotton cloth after use to remove sweat.',
        descTa: 'பயன்படுத்திய பிறகு மென்மையான பருத்தி துணியால் துடைக்கவும்.'
    }
];

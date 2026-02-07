export enum Category {
  RINGS = 'Rings',
  CHAINS = 'Chains',
  BANGLES = 'Bangles',
  EARRINGS = 'Earrings',
  NECKLACES = 'Necklaces',
  RENTAL = 'Rental Service',
  BRIDAL_NECKLACE_SETS = 'Bridal Necklace Sets',
  LONG_HARAM_CHAINS = 'Long Haram Chains',
  BANGLES_COLLECTION = 'Bangles Collection',
  TRADITIONAL_PENDANT_DESIGNS = 'Traditional Pendant Designs'
}

export enum Material {
  IMPON = 'Impon',
  COVERING = 'Gold Covering',
  STONE = 'Stone Studded'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  material: Material;
  price: number;
  weight: number;
  image: string;
  isBogo: boolean;
  isOutofStock: boolean;
  description: string;
  createdAt: number; // Timestamp for "New Arrival" logic
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}
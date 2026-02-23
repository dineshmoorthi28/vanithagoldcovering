export interface Product {
  id: number;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  oldPrice: number;
  status: string;
  image: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  about_image: string;
  about_text: string;
  shop_name: string;
  logo_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  instagram_url: string;
}

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  product_id: number | null;
  product_name?: string;
  created_at: string;
}

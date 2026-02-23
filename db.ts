import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('jewellery.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    otp TEXT,
    otp_expiry DATETIME
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    slug TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    original_price REAL,
    image_url TEXT,
    category_id INTEGER,
    sub_category TEXT,
    is_featured BOOLEAN DEFAULT 0,
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    banner_text TEXT,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT,
    message TEXT,
    product_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS site_content (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data
const seed = () => {
  const adminExists = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
  const hashedPassword = bcrypt.hashSync('Rumy223', 10);

  if (!adminExists) {
    db.prepare('INSERT INTO admin (username, password, email) VALUES (?, ?, ?)').run('admin', hashedPassword, 'mrtamilp@gmail.com');
  } else {
    // Force update the password and email in case they were changed in code
    db.prepare('UPDATE admin SET password = ?, email = ? WHERE username = ?').run(hashedPassword, 'mrtamilp@gmail.com', 'admin');
  }

  const categories = [
    { name: 'Necklace', slug: 'necklace' },
    { name: 'Bangles', slug: 'bangles' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bridal Sets', slug: 'bridal-sets' },
    { name: 'Rings', slug: 'rings' }
  ];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
  categories.forEach(cat => insertCategory.run(cat.name, cat.slug));

  // Get category IDs
  const getCatId = (slug: string) => (db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug) as any)?.id;

  // Clear existing products to ensure fresh start
  db.prepare('DELETE FROM products').run();

  const initialProducts = [
    {
      name: 'Ruby & White Stone Jhumkas',
      description: 'Traditional gold plated jhumka earrings with ruby and white stones. Perfect for festive occasions.',
      price: 450,
      oldPrice: 850,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/4330e25b-485b-4004-a551-befa35737e0a.jpg',
      category_id: getCatId('earrings'),
      is_featured: 1
    },
    {
      name: 'Emerald & Ruby Jhumkas',
      description: 'Exquisite gold covering jhumkas with emerald and ruby stone work. Authentic traditional look.',
      price: 480,
      oldPrice: 900,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/1653e535-be26-4a01-8c78-5c0942326826.jpeg',
      category_id: getCatId('earrings'),
      is_featured: 0
    },
    {
      name: 'Thick Gold Designer Chain',
      description: 'Premium gold covering heavy designer chain. Durable and high-quality finish.',
      price: 1250,
      oldPrice: 2500,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/cd17ecb9-35af-4fca-ba70-e90100bf5dac.jpeg',
      category_id: getCatId('necklace'),
      is_featured: 0
    },
    {
      name: 'Traditional Mango Haram Set',
      description: 'Grand mango-style long haram set with matching earrings. A must-have for bridal collections.',
      price: 1850,
      oldPrice: 3500,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/ee31f285-60a6-427b-95c7-19970575e90b.jpeg',
      category_id: getCatId('bridal-sets'),
      is_featured: 1
    },
    {
      name: 'Floral Designer Bangles (Set of 4)',
      description: 'Set of 4 intricate floral design gold covering bangles. Elegant and stylish.',
      price: 650,
      oldPrice: 1200,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/60bd58a0-b181-465d-bec8-42089a63f7ad.jpg',
      category_id: getCatId('bangles'),
      is_featured: 1
    },
    {
      name: 'Multi-Stone Studded Bangles',
      description: 'Premium gold covering bangles with multi-color stone accents. Vibrant and beautiful.',
      price: 750,
      oldPrice: 1400,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/753481b2-4da2-42a5-92d9-03888ce9d5a4.jpg',
      category_id: getCatId('bangles'),
      is_featured: 0
    },
    {
      name: 'Grand Bridal Long Haram',
      description: 'Long traditional haram set perfect for weddings and special occasions. Rich gold look.',
      price: 2200,
      oldPrice: 4200,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/8b7d8ea5-40d9-4f36-967d-7b0b9a3576e0.jpg',
      category_id: getCatId('bridal-sets'),
      is_featured: 0
    },
    {
      name: 'Gold Rings Collection',
      description: 'Variety of adjustable gold covering rings with unique patterns and designs.',
      price: 150,
      oldPrice: 300,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/7913200a-9ca2-4284-b47b-5f0beb3a93d3.jpg',
      category_id: getCatId('rings'),
      is_featured: 0
    },
    {
      name: 'Stone Pendant Choker',
      description: 'Elegant gold covering choker with a stone-studded pendant. Modern yet traditional.',
      price: 550,
      oldPrice: 1100,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/620e3d62-71db-477b-9c6c-8c59494fdadf.jpg',
      category_id: getCatId('necklace'),
      is_featured: 1
    },
    {
      name: 'Designer Gold Bangles Display',
      description: 'Premium gold covering bangles with intricate designer patterns shown on a display stand.',
      price: 850,
      oldPrice: 1600,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/1e9c5513-4059-42f7-85eb-b07fd8bb8984.jpg',
      category_id: getCatId('bangles'),
      is_featured: 0
    },
    {
      name: 'White Stone Necklace Set',
      description: 'Sophisticated silver-finish necklace set with sparkling white stones. Perfect for receptions.',
      price: 1450,
      oldPrice: 2800,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/eb5287da-7fcb-416a-8ed0-9cb9c8718234.jpg',
      category_id: getCatId('necklace'),
      is_featured: 1
    },
    {
      name: 'Traditional Gold Bangles Set',
      description: 'Classic gold covering bangles for a timeless traditional look.',
      price: 950,
      oldPrice: 1800,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/6d499089-f5d7-4eab-bf6b-0354e5890a88.jpeg',
      category_id: getCatId('bangles'),
      is_featured: 0
    },
    {
      name: 'Stone Studded Jhumka Earrings',
      description: 'Beautiful gold covering earrings with high-quality stone work.',
      price: 350,
      oldPrice: 700,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/0169b3b7-3b66-4b73-a357-d0e709bac20a.jpeg',
      category_id: getCatId('earrings'),
      is_featured: 0
    },
    {
      name: 'Bridal Gold Long Haram Set',
      description: 'Exquisite bridal haram set for the perfect wedding day look.',
      price: 2500,
      oldPrice: 4800,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/ec060c2a-c79e-4cc8-9c55-96c3de774695.jpeg',
      category_id: getCatId('bridal-sets'),
      is_featured: 1
    },
    {
      name: 'Designer Gold Chain Necklace',
      description: 'Stylish gold covering chain with a modern designer touch.',
      price: 650,
      oldPrice: 1200,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/8c63e050-8fa0-478d-a8e8-e025ac78366b.jpeg',
      category_id: getCatId('necklace'),
      is_featured: 0
    },
    {
      name: 'Gold Covering Bangles Collection',
      description: 'Elegant gold covering bangles for daily and festive wear.',
      price: 550,
      oldPrice: 1000,
      image: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/df0cdb35-d712-4e96-8eea-07306f3db79c.jpg',
      category_id: getCatId('bangles'),
      is_featured: 0
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, original_price, image_url, category_id, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  initialProducts.forEach(p => {
    insertProduct.run(p.name, p.description, p.price, p.oldPrice, p.image, p.category_id, p.is_featured);
  });

  const initialContent = [
    { key: 'hero_title', value: 'Vanitha Premium Traditional Gold Covering Jewellery' },
    { key: 'hero_subtitle', value: 'Specialist in Impon and Panchaloha South Indian Traditional Jewellery. Experience the elegance of tradition with our exquisite collection.' },
    { key: 'hero_image', value: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/ec060c2a-c79e-4cc8-9c55-96c3de774695.jpeg' },
    { key: 'about_image', value: 'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/1e9c5513-4059-42f7-85eb-b07fd8bb8984.jpg' },
    { key: 'about_text', value: 'Vanitha Covering is a specialist in traditional South Indian jewellery. We specialize in Impon (Five Metals) and Panchaloha jewellery, crafted with precision to give you the authentic gold look at an affordable price.' },
    { key: 'shop_name', value: 'Vanitha Gold Covering' },
    { key: 'logo_url', value: '' },
    { key: 'contact_phone', value: '9080509976' },
    { key: 'contact_email', value: 'mrtamilp@gmail.com' },
    { key: 'contact_address', value: 'Near Bus Stand, Gandhi Poonga Road, Aranthangi – 614616' },
    { key: 'instagram_url', value: 'https://www.instagram.com/vanitha52517' }
  ];

  const insertContent = db.prepare('INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)');
  initialContent.forEach(item => insertContent.run(item.key, item.value));
};

seed();

export default db;

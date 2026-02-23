import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'vanitha-secret-key';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));
  app.use(express.static(path.join(__dirname, 'public')));

  // Multer setup for image uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username) as any;

    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Forgot Password - Send OTP
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE email = ?').get(email) as any;

    if (!admin) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const otp = randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    db.prepare('UPDATE admin SET otp = ?, otp_expiry = ? WHERE email = ?').run(otp, expiry, email);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mrtamilp@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password-here'
      }
    });

    try {
      await transporter.sendMail({
        from: '"Vanitha Covering" <mrtamilp@gmail.com>',
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #450a0a;">Vanitha Covering</h2>
            <p>Your OTP for password reset is:</p>
            <h1 style="color: #ca8a04; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
      });
      res.json({ message: 'OTP sent to email' });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ error: 'Failed to send OTP email' });
    }
  });

  // Verify OTP
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE email = ? AND otp = ?').get(email, otp) as any;

    if (!admin) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const now = new Date();
    if (new Date(admin.otp_expiry) < now) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    res.json({ message: 'OTP verified' });
  });

  // Reset Password
  app.post('/api/auth/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Verify OTP again for security
    const admin = db.prepare('SELECT * FROM admin WHERE email = ? AND otp = ?').get(email, otp) as any;

    if (!admin) {
      return res.status(400).json({ error: 'Invalid verification' });
    }

    const now = new Date();
    if (new Date(admin.otp_expiry) < now) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?').run(hashedPassword, email);

    res.json({ message: 'Password reset successful' });
  });

  app.post('/api/auth/change-password', authenticateToken, (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE id = ?').get(req.user.id) as any;

    if (admin && bcrypt.compareSync(currentPassword, admin.password)) {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      db.prepare('UPDATE admin SET password = ? WHERE id = ?').run(hashedNewPassword, req.user.id);
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ error: 'Incorrect current password' });
    }
  });

  // Products

  app.get('/api/products', (req, res) => {
    try {
      const categorySlug = req.query.category;
      let query = `
        SELECT p.id, p.name, c.name as category, p.sub_category as subCategory, p.price, p.original_price as oldPrice, 
               CASE WHEN p.is_featured = 1 THEN 'Featured' ELSE 'Standard' END as status,
               p.image_url as image, p.description
        FROM products p 
        JOIN categories c ON p.category_id = c.id
      `;

      const params: any[] = [];
      if (categorySlug) {
        query += ' WHERE c.slug = ?';
        params.push(categorySlug);
      }

      const products = db.prepare(query).all(...params);
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.post('/api/products', authenticateToken, upload.single('image'), (req, res) => {
    try {
      const { name, description, price, oldPrice, category, subCategory, status, image: bodyImage } = req.body;
      const image_url = req.file ? `/uploads/${req.file.filename}` : (bodyImage || '');

      const parsedPrice = parseFloat(price) || 0;
      const parsedOldPrice = parseFloat(oldPrice) || 0;

      // Look up category ID
      const categoryRow = db.prepare('SELECT id FROM categories WHERE name = ?').get(category) as any;
      const category_id = categoryRow ? categoryRow.id : null;

      const result = db.prepare(`
        INSERT INTO products (name, description, price, original_price, image_url, category_id, sub_category, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, description, parsedPrice, parsedOldPrice, image_url, category_id, subCategory || null, status === 'Featured' ? 1 : 0);

      res.json({ id: result.lastInsertRowid });
    } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.put('/api/products/:id', authenticateToken, upload.single('image'), (req, res) => {
    try {
      const { name, description, price, oldPrice, category, subCategory, status, image: bodyImage } = req.body;
      const id = req.params.id;

      const parsedPrice = parseFloat(price) || 0;
      const parsedOldPrice = parseFloat(oldPrice) || 0;

      // Look up category ID
      const categoryRow = db.prepare('SELECT id FROM categories WHERE name = ?').get(category) as any;
      const category_id = categoryRow ? categoryRow.id : null;

      let query = 'UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, category_id = ?, sub_category = ?, is_featured = ?';
      const params: any[] = [name, description, parsedPrice, parsedOldPrice, category_id, subCategory || null, status === 'Featured' ? 1 : 0];

      if (req.file) {
        query += ', image_url = ?';
        params.push(`/uploads/${req.file.filename}`);
      } else if (bodyImage) {
        query += ', image_url = ?';
        params.push(bodyImage);
      }

      query += ' WHERE id = ?';
      params.push(id);

      const result = db.prepare(query).run(...params);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product updated' });
    } catch (error: any) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.delete('/api/products/:id', authenticateToken, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted' });
  });

  // Categories
  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  // Site Content
  app.get('/api/content', (req, res) => {
    const content = db.prepare('SELECT * FROM site_content').all();
    const contentMap = content.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.json(contentMap);
  });

  app.post('/api/content', authenticateToken, (req, res) => {
    const updates = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)');
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        stmt.run(key, value);
      }
    });
    transaction(updates);
    res.json({ message: 'Content updated' });
  });

  // Enquiries
  app.post('/api/enquiries', (req, res) => {
    const { name, phone, email, message, product_id } = req.body;
    db.prepare(`
      INSERT INTO enquiries (name, phone, email, message, product_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, phone, email, message, product_id || null);
    res.json({ message: 'Enquiry sent' });
  });

  app.get('/api/enquiries', authenticateToken, (req, res) => {
    const enquiries = db.prepare(`
      SELECT e.*, p.name as product_name 
      FROM enquiries e 
      LEFT JOIN products p ON e.product_id = p.id 
      ORDER BY e.created_at DESC
    `).all();
    res.json(enquiries);
  });

  // Stats
  app.get('/api/stats', authenticateToken, (req, res) => {
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const enquiryCount = db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as any;
    res.json({
      totalProducts: productCount.count,
      totalEnquiries: enquiryCount.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

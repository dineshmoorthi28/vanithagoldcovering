import Database from 'better-sqlite3';
const db = new Database('jewellery.db');
try {
    db.exec("ALTER TABLE products ADD COLUMN sub_category TEXT;");
    console.log("Successfully added sub_category column to products table.");
} catch (err) {
    if (err.message.includes("duplicate column name")) {
        console.log("sub_category column already exists.");
    } else {
        console.error("Error migrating database:", err.message);
    }
} finally {
    db.close();
}

import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Product, Category, User, Order } from '../types/Objects';

SQLite.enablePromise(true);

const listCategoty: Category[] = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Smartphone' },
  { id: 3, name: 'Tablet' },
  { id: 4, name: 'Phụ kiện' },
];
// Use stable remote placeholder images for seeded products so they display
// correctly across devices and fresh installs. If you prefer local bundled
// images, store them in the app bundle and reference them with `require` in
// the UI (not as plain strings in the DB).
const listProduct: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro M3',
    price: 35000000,
    categoryId: 1,
    image:
      'https://p.turbosquid.com/ts-thumb/kn/jAJUe7/1U/silver01/jpg/1699476656/1920x1080/fit_q87/a73a49ba74ddddba4d2a3309f50d29b94362be02/silver01.jpg',
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    price: 28000000,
    categoryId: 2,
    image:
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_2__5_2_1_1_1_1_2_1_1.jpg',
  },
  {
    id: 3,
    name: 'iPad Pro 12.9"',
    price: 25000000,
    categoryId: 3,
    image: 'https://baotinmobile.vn/uploads/2023/02/ipad2021m1lte4-400x400.jpg',
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    price: 5500000,
    categoryId: 4,
    image:
      'https://cdn.tgdd.vn/Products/Images/54/315014/tai-nghe-bluetooth-airpods-pro-2nd-gen-usb-c-charge-apple-1-750x500.jpg',
  },
  {
    id: 5,
    name: 'Dell XPS 15',
    price: 32000000,
    categoryId: 1,
    image:
      'https://laptopaz.vn/media/product/2484_laptopaz_dell_xps_9520_2.jpg',
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24 Ultra',
    price: 24000000,
    categoryId: 2,
    image:
      'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-xam-1-750x500.jpg',
  },
  {
    id: 7,
    name: 'Surface Pro 9',
    price: 22000000,
    categoryId: 3,
    image:
      'https://vhost53003.vhostcdn.com/wp-content/uploads/2022/10/microsoft-surface-pro-9-5.jpg',
  },
  {
    id: 8,
    name: 'Magic Mouse 3',
    price: 2500000,
    categoryId: 4,
    image:
      'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/h/chuot-apple-magic-mouse-3-mxk63.png',
  },
];
const listUser: User[] = [
  { id: 1, username: 'admin', password: '123456', role: 'admin' },
  { id: 2, username: 'testUser', password: '123456', role: 'user' },
];
// Status of order include: Cart, Pending, Confirmed, Shipping, Completed, Cancelled
const listOrder: Order[] = [
  {
    id: 1,
    status: 'cart',
    qty: 1,
    totalPrice: undefined,
    productId: 1,
    userId: 2,
  },
  {
    id: 2,
    status: 'cart',
    qty: 1,
    totalPrice: undefined,
    productId: 2,
    userId: 2,
  },
  {
    id: 3,
    status: 'pending',
    qty: 1,
    totalPrice: undefined,
    productId: 1,
    userId: 2,
  },
];

export const getDb = async (): Promise<SQLiteDatabase> => {
  const db = await SQLite.openDatabase({
    name: 'MyDatabase.sql',
    location: 'default',
  });
  return db;
};

export const initDatabase = async () => {
  try {
    const db = await getDb();
    // IMPORTANT: Uncomment these lines ONCE to reset database and get all 8 products
    // After running once, comment them again to preserve data
    // await db.executeSql( `DROP TABLE IF EXISTS orders`)
    // await db.executeSql( `DROP TABLE IF EXISTS products`)
    // await db.executeSql( `DROP TABLE IF EXISTS categories`)
    // await db.executeSql( `DROP TABLE IF EXISTS users`)
    await db.executeSql(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                name TEXT
            );`);
    await db.executeSql(`
            CREATE TABLE IF NOT EXISTS products(
                id INTEGER PRIMARY KEY,
                name TEXT,
                price REAL,
                image TEXT,
                categoryId INTEGER,
                FOREIGN KEY (categoryId) REFERENCES categories(id)
            );`);
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT
            );`,
    );
    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                status TEXT,
                qty REAL,
                totalPrice INTEGER,
                productId INTEGER,
                userId INTEGER,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (productId) REFERENCES products(id)
            );`,
    );
    for (const category of listCategoty) {
      await db.executeSql(
        `INSERT OR REPLACE INTO categories (id, name) VALUES (?, ?);`,
        [category.id, category.name],
      );
    }
    // Sử dụng INSERT OR REPLACE cho sản phẩm. Điều này đảm bảo 8 sản phẩm mẫu
    // luôn tồn tại và được cập nhật mà không xóa các sản phẩm do người dùng tạo
    // mỗi khi khởi động lại ứng dụng.
    for (const product of listProduct) {
      await db.executeSql(
        `INSERT OR REPLACE INTO products (id, name, price, image, categoryId) VALUES (?, ?, ?, ?, ?);`,
        [
          product.id,
          product.name,
          product.price,
          product.image,
          product.categoryId,
        ],
      );
    }
    for (const user of listUser) {
      await db.executeSql(
        `INSERT OR REPLACE INTO users (id, username, password, role) VALUES (?, ?, ?, ?);`,
        [user.id, user.username, user.password, user.role],
      );
    }
    for (const order of listOrder) {
      await db.executeSql(
        `INSERT OR REPLACE INTO orders (id, status, qty, totalPrice, productId, userId) VALUES (?, ?, ?, ?, ?,?);`,
        [
          order.id,
          order.status,
          order.qty,
          order.totalPrice,
          order.productId,
          order.userId,
        ],
      );
    }
    console.log(`✅ Database initialized/seeded.`);
    return;
  } catch (err) {
    console.error('❌ initDatabase outer error:', err);
    throw err;
  }
};

import SQLite,{SQLiteDatabase} from 'react-native-sqlite-storage';
import { Product, Category, User, Order } from '../types/Objects';

SQLite.enablePromise(true);

const listCategoty: Category[] = [{id: 1, name: 'Áo'},{id: 2, name: 'Quần'},{id: 3, name: 'Giày'},{id: 4, name: 'Túi'},];
const listProduct: Product[] = [
    {id:1, name: 'Áo ngắn tay', price: 100000, categoryId:1, image:'file:///data/user/0/com.learning/cache/rn_image_picker_lib_temp_1882660d-a707-4141-9106-a7a29b485615.jpg'},
    {id:2, name: 'Quần tây đen', price: 200000, categoryId:2, image:'file:///data/user/0/com.learning/cache/rn_image_picker_lib_temp_1882660d-a707-4141-9106-a7a29b485615.jpg'},
    {id:3, name: 'Giày vải', price: 150000, categoryId:3, image:'file:///data/user/0/com.learning/cache/rn_image_picker_lib_temp_1882660d-a707-4141-9106-a7a29b485615.jpg'},
    {id:4, name: 'Túi da cá sấu', price: 500000, categoryId:4, image:'file:///data/user/0/com.learning/cache/rn_image_picker_lib_temp_1882660d-a707-4141-9106-a7a29b485615.jpg'},
];
const listUser:User[]=[
    {id:1, username:'admin', password:'123456', role:'admin'},
    {id:2, username:'testUser', password:'123456', role:'user'},
] 
// Status of order include: Cart, Pending, Confirmed, Shipping, Completed, Cancelled
const listOrder:Order[]=[
    {id:1, status: 'cart', qty: 1, totalPrice:undefined, productId:1, userId:2},
    {id:2, status: 'cart', qty: 1, totalPrice:undefined, productId:2, userId:2},
    {id:3, status: 'pending', qty: 1, totalPrice:undefined, productId:1, userId:2},
]

export const getDb = async () : Promise<SQLiteDatabase> =>{
    const db = await SQLite.openDatabase({name: 'MyDatabase.sql', location: 'default'});
    return db;
}

export const initDatabase = async ()=>{
    try {
        const db = await getDb();
        // await db.executeSql( `drop table products`)
        // await db.executeSql( `drop table categories`)
        // await db.executeSql( `drop table users`)
        // await db.executeSql( `drop table orders`)
        await db.executeSql( `
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                name TEXT
            );`,
        );
        await db.executeSql(`
            CREATE TABLE IF NOT EXISTS products(
                id INTEGER PRIMARY KEY,
                name TEXT,
                price REAL,
                image TEXT,
                categoryId INTEGER,
                FOREIGN KEY (categoryID) REFERENCES categories(id)
            );`,
        );
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
                `INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?);`,
                [category.id, category.name],
            );
        };
        for (const product of listProduct) {
            await db.executeSql(
                `INSERT OR IGNORE INTO products (id, name, price, image, categoryId) VALUES (?, ?, ?, ?, ?);`,
                [product.id, product.name, product.price, product.image, product.categoryId],
            );
        };
        for (const user of listUser) {
            await db.executeSql(
                `INSERT OR IGNORE INTO users (id, username, password, role) VALUES (?, ?, ?, ?);`,
                [user.id, user.username, user.password, user.role],
            );
        };
        for (const order of listOrder) {
            await db.executeSql(
                `INSERT OR IGNORE INTO orders (id, status, qty, totalPrice, productId, userId) VALUES (?, ?, ?, ?, ?,?);`,
                [order.id, order.status, order.qty, order.totalPrice, order.productId, order.userId],
            );
        };
        console.log('✅ Database initialized');
        return;
    }
    catch(err){
        console.error('❌ initDatabase outer error:', err);
        throw err;
    }
}

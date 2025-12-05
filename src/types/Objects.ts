export type Product = {id: number, name: string, price: number, categoryId: number, image: string };
export type Category = {id: number,name : string};
export type User = {id:number, username: string, password:string, role:string};
export type Order = {id:number, status:string, qty:number,totalPrice?:number, productId:number, userId:number};
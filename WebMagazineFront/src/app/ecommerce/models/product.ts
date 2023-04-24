export class Product {
    id: number;
    name: string;
    description: string;
    descripcionLarga: string;
    price: number;
    imageUrl: string;

    constructor(id:number, name: string, description: string, descripcionLarga: string, price: number, imageUrl: string){
        this.id = id;
        this.name = name;
        this.description = description;
        this.descripcionLarga= descripcionLarga;
        this.price = price;
        this.imageUrl = imageUrl;    
    }
}

export class Direccion {
    idDireccion!: string;
    ciudad: string;
    calle: string;
    numero: string;
    piso!: string;
    puerta!: string;
    codigoPostal: string;

    constructor(ciudad: string, calle: string, numero: string, piso: string, puerta: string, codigoPostal: string){
        this.ciudad = ciudad;
        this.calle = calle;
        this.numero = numero;
        this.piso = piso;
        this.puerta = puerta;
        this.codigoPostal = codigoPostal;
    }
}

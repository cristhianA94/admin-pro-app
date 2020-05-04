export class Usuario {

    constructor(
        public nombres: string,
        public email: string,
        public password: string,
        public apellidos?: string,
        public img?: string,
        public role?: string,
        public google?: boolean,
        public _id?: string
    ){}
    
}

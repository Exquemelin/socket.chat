class Usuarios {

    constructor() {

        this.personas = []

    };

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala } // Es un objeto json

        this.personas.push(persona);

        return this.personas;

    };

    getPersona(id) {

        let persona = this.personas.filter(persona => { return persona.id === id; })[0]; // filter devuelve un array con todas las coincidencias, pero nos interesa solo la primera

        return persona;

    };

    getPersonas() {

        return this.personas;

    };

    getPersonasPorSala(sala) {

        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;

    };

    borrarPersona(id) {

        // Almacenamos la persona borrada en una variable para devolverla
        let personaBorrada = this.getPersona(id);

        // Vamos a obtener un nuevo array con las personas que no tengan ese id
        this.personas = this.personas.filter(persona => {

            // nos devuelve un arreglo con todas las personas que no tengan ese id
            return persona.id != id

        })

        return personaBorrada;

    };

};


module.exports = {
    Usuarios,
};
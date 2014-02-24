//School.js



//Herencia
function Alumno(){

	this.matricula = null;
}

Alumno.prototype.setMatricula = function(matricula) {

	this.matricula = matricula;
}

Alumno.prototype.getMatricula = function() {

	return this.matricula ;
}


function Persona(){

	this.nombre = null;
	//this.apellido = null;
}

Persona.prototype.setNombre = function(nombre) {

	this.nombre = nombre;
}

Persona.prototype.getNombre = function() {

	return this.nombre ;
}


var p = new Persona();
var a = new Alumno();


console.debug(p);
console.debug(a);

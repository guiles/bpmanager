//School Spec
describe("Prueba de Clases con Herencia", function() {
 
    var persona;
    var alumno;
 
    beforeEach(function() {
        persona = new Persona();
        alumno = new Alumno();
    });
 
    it("Debe ser igual el set que el get", function() {
		
		var nombre = 'PEPE';
		persona.setNombre(nombre)        ;
        
        expect( persona.getNombre() ).toBe( nombre );
    });


    it("Debe ser igual el set que el get", function() {
		
		var nombre = 'PEPER';
		alumno.setNombre(nombre)        ;
        
        expect( alumno.getNombre() ).toBe( nombre );
    });
    
});

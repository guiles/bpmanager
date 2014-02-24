//Object Spect

describe("Prueba de Clases con Herencia", function() {
 
    var obj1;
    
    beforeEach(function() {
        obj1 = Object.create(a);
        
    });
 
    it("Creo el objeto", function() {
		
		var nombre = 'HOLA';
		obj1.hi('guachin');
        expect( obj1 ).toBeDefined();

        expect( obj1.hi('guachin') ).toBe( 'higuachin' );
    });

    it("Verifico que funcione el metodo hi", function() {
        
        expect( obj1.hi('guachin') ).toBe( 'higuachin' );
    });

    //it("Debe ser igual el set que el get", function() {
		
	//	var nombre = 'PEPER';
	//	alumno.setNombre(nombre)        ;
        
    //   expect( alumno.getNombre() ).toBe( nombre );
    //});
    
});
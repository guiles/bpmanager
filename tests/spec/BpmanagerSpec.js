//BpmanagerSpec.js

describe("BPManager", function() {
 
    var bpmanager;
    
    beforeEach(function() {

        bpmanager = TESIS.Manager;
        
    });
 
    it("Verifico que este creado", function() {
		
	    	expect( bpmanager ).toBeDefined();
            console.log(bpmanager);
	        
    });

    it("Apenas lo creo el listado de tareas tiene que estar vacio", function() {
        
        expect( bpmanager.getCurrentPrimitiveTasks().length ).toBe(0);
    });
    

    it("Suscribo una tarea FillInput al Manager", function() {
        
        bpmanager.addPrimitiveTask(0,'FillInputTask','','');
        console.debug(bpmanager.getCurrentPrimitiveTasks());
        expect( bpmanager.getCurrentPrimitiveTasks().length ).toBe(1);
        expect( bpmanager.getCurrentPrimitiveTasks()[0].msg ).toBe('FillInputTask');
    });

	it("Vacio la lista de tareas", function() {
        
        bpmanager.clearCurrentPrimitiveTasks();
        expect( bpmanager.getCurrentPrimitiveTasks().length ).toBe(0);
        
    });


});
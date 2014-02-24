//BpmanagerSpec.js

describe("BPManager", function() {
 
    var bpmanager;
    
    beforeEach(function() {

        bpmanager = new BPManager();
        
    });
 
    it("Verifico que este creado", function() {
		
	    	expect( bpmanager ).toBeDefined();
	        
    });

    it("Apenas lo creo el listado de tareas tiene que estar vacio", function() {
        
        expect( bpmanager.currentPrimitiveTasks.length ).toBe(0);
    });
    

    it("Apenas lo creo el listado de tareas tiene que estar vacio", function() {
        
        expect( bpmanager.currentPrimitiveTasks.length ).toBe(0);
    });


    it("Suscribo una tarea FillInput al Manager", function() {
        
        bpmanager.addPrimitiveTask(0,'FillInputTask','','');
        expect( bpmanager.currentPrimitiveTasks.length ).toBe(1);
        expect( bpmanager.currentPrimitiveTasks[0].msg ).toBe('FillInputTask');
    });

	it("Vacio la lista de tareas", function() {
        
        bpmanager.clearPrimitiveTasks();
        expect( bpmanager.currentPrimitiveTasks.length ).toBe(0);
        
    });


});
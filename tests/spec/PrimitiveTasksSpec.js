//PrimitiveTasksSpec.js
describe("Primitive Tasks", function() {
 
    var fillInputTask;
    var selectOptionTask;
    var textAreaTask;
    
    beforeEach(function() {

        fillInputTask = new FillInputTask();
        selectOptionTask = new SelectOptionTask();
    	textAreaTask = new TextAreaTask();;    
    });
 
    it("Verifico que se instancio el objeto FillInputTask", function() {
		
	    	expect( fillInputTask ).toBeDefined();
	        
    });

    it("Verifico que sea Herencia", function() {
        
        expect( fillInputTask.msg ).toBe('FillInputTask');
    });
    
    it("Verifico que se instancio el objeto SelectOptionTask", function() {
		
	    	expect( selectOptionTask ).toBeDefined();
	        
    });

    it("Verifico que sea Herencia", function() {
        
        expect( selectOptionTask.msg ).toBe('SelectOptionTask');
    });

	it("Verifico que se instancio el objeto TextAreaTask", function() {
		
	    	expect( textAreaTask ).toBeDefined();
	        
    });

    it("Verifico que sea Herencia", function() {
        
        expect( textAreaTask.msg ).toBe('TextAreaTask');
    });


});
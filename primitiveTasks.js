//primitiveTasks

function PrimitiveTask(id,xPath,value){ //Constructor
this.xPath = xPath;
this.value = value;
this.state = 0;
this.type = 0;
this.id = id;
this.msg = "PrimitiveTask"
}

PrimitiveTask.prototype.getState = function(){ 
return this.state;
}

PrimitiveTask.prototype.setState = function(aState){ 
this.state= aState;
}

PrimitiveTask.prototype.execute = function(){

var iterator = document.evaluate(this.xPath,document,null,0,null);
var node = iterator.iterateNext();
    node.value= this.value;
  
  	this.finalizo();

	return node;
}

PrimitiveTask.prototype.finalizo = function(){

	this.setState(1);  // No se para que uso esto si lo saco del array o modifico el estado

	var event = new CustomEvent("taskFinished", {detail: {taskId: this.id , message: this.msg,
					time: new Date(),},bubbles: true,cancelable: true});

	document.dispatchEvent(event);
}

//Herencia --> PrimitiveTask
function FillInputTask(id,xPath,value){
    PrimitiveTask.call(this,id,xPath,value);
    this.msg = "FillInputTask"
}
FillInputTask.prototype = new PrimitiveTask();

//Herencia --> PrimitiveTask
function SelectOptionTask(id,xPath,value){
    PrimitiveTask.call(this,id,xPath,value);
    this.msg = "SelectOptionTask"
}
SelectOptionTask.prototype = new PrimitiveTask();

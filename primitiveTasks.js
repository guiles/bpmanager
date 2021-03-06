/**
 * Clases Primitivas
 *
 * @module Primitive Tasks
 */

////Esto esta mal, la funcion es global
//primitiveTasks
 /**
 * 
 * PrimitiveTask
 * @class PrimitiveTask
 * @constructor
 */
function PrimitiveTask(id,xPath,value,tipo){ //Constructor

this.tipo = tipo;    
this.xPath = xPath;
this.value = value;
this.state = 0;
//this.type = 0;
this.id = id;
this.msg = "PrimitiveTask"
}
/**
 * 
 * @method getState
 */
PrimitiveTask.prototype.getState = function(){ 
return this.state;
}
/**
 * 
 * @method setState
 */
PrimitiveTask.prototype.setState = function(aState){ 
this.state= aState;
}
/**
 * 
 * @method execute
 */
PrimitiveTask.prototype.execute = function(){

    var iterator = document.evaluate(this.xPath,document,null,0,null);
    var node = iterator.iterateNext();
    //Supongo que todas las tareas son manuales ( o sea, ingreso valor)
    console.debug(node);
   
    if(this.tipo == 1){ //Si es Manual, pide valor

            node.focus();
            //node.style.color = "red";
            var value = prompt("Ingrese Valor","");
            node.value= value;

    }else{

        node.value= this.value;            

    }

    
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
/**
 * 
 * FillInputTask
 * @class FillInputTask
 * @extends PrimitiveTask
 */
function FillInputTask(id,xPath,value,tipo){
    PrimitiveTask.call(this,id,xPath,value,tipo);
    this.msg = "FillInputTask";
}
FillInputTask.prototype = new PrimitiveTask();

//Herencia --> PrimitiveTask : En este caso sobreescribo el metodo ejecutar porque tiene distinto comportamiento
/**
 * 
 * CheckBoxTask
 * @class CheckBoxTask
 * @constructor
 */
function CheckBoxTask(id,xPath,value,tipo){
    PrimitiveTask.call(this,id,xPath,value,tipo);
    this.msg = "CheckBoxTask";

}
CheckBoxTask.prototype = new PrimitiveTask();

CheckBoxTask.prototype.execute = function(){

var iterator = document.evaluate(this.xPath,document,null,0,null);
var node = iterator.iterateNext();
    node.checked= true;
  
    this.finalizo();

    return node;
}

//Herencia --> PrimitiveTask : En este caso sobreescribo el metodo ejecutar porque tiene distinto comportamiento
function RadioTask(id,xPath,value,tipo){
    PrimitiveTask.call(this,id,xPath,value,tipo);
    this.msg = "RadioTask";

}
RadioTask.prototype = new PrimitiveTask();

RadioTask.prototype.execute = function(){

var iterator = document.evaluate(this.xPath,document,null,0,null);
var node = iterator.iterateNext();
    node.checked= true;
  
    this.finalizo();

    return node;
}


//Herencia --> PrimitiveTask
function SelectOptionTask(id,xPath,value,tipo){
    PrimitiveTask.call(this,id,xPath,value,tipo);
    this.msg = "SelectOptionTask";
}
SelectOptionTask.prototype = new PrimitiveTask();

//Herencia --> PrimitiveTask
function TextAreaTask(id,xPath,value,tipo){
    PrimitiveTask.call(this,id,xPath,value,tipo);
    this.msg = "TextAreaTask";
}
TextAreaTask.prototype = new PrimitiveTask();

//module.exports.PrimitiveTask = new PrimitiveTask();
//module.exports.FillInputTask = new FillInputTask();
//module.exports.TextAreaTask = new TextAreaTask();
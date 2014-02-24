//bpmanager.js
// Registro el Listener de "tarea finalizada"
document.addEventListener("taskFinished", executeNext, false);

// Metodo que selecciona tareas del array del Manager
// y las ejecuta secuencialmente
function executeNext(e) {
	var taskId = e.detail.taskId;

	console.debug("Evento: "+e.currentTarget.nodeName+", "
	+e.detail.time.toLocaleString()+": "+e.detail.message);

	//Busca la tarea y la pone como lista y ejecuta la proxima tarea
	//Esto es una variable global
     var task =   BPMN.getNextTask();
     task.execute();
}



//Prototipo BPMANAGER - Parecido al patron Observer
function BPManager(){ 
this.currentPrimitiveTasks = []; //Array de las tareas a realizar cuando se ejecuta el Manager
this.primitiveTasks = ['FillInputTask','SelectOptionTask','TextAreaTask','CheckBoxTask']; //Un array de tareas que puede realizar
}

//El metodo initialize agrega al array de tareas primitivas
BPManager.prototype.initialize =  function(){

}

BPManager.prototype.getNextTask = function(){ //Me trae la proxima tarea pendiente
    for (var i=0;i < this.currentPrimitiveTasks.length;i++){
       
        if(this.currentPrimitiveTasks[i].getState() == 0 ) return this.currentPrimitiveTasks[i];
    }
}


//Este metodo lo que haria es instanciar la clase que corresponde y lo agrega al listado de tareas que va a realizar 
//el manager una vez que le diga execute.
BPManager.prototype.addPrimitiveTask =  function(aId,aPrimitiveTaskType,xPath,value,msg){

		//Instancia y agrega al array de tareas
		switch(aPrimitiveTaskType)
		{
		case 'FillInputTask':
		  
		  this.subscribe( this.createFillInputTask(aId,xPath,value,msg) );
		  
		  break;
		case 'SelectOptionTask':

		  this.subscribe( this.createSelectOptionTask(aId,xPath,value,msg) );

		  break;
		case 'TextAreaTask':

		  this.subscribe( this.createSelectOptionTask(aId,xPath,value,msg) );

		  break;  

		 case 'CheckBoxTask':

		  this.subscribe( this.createCheckBoxTask(aId,xPath,value,msg) );

		  break;   
		  case 'RadioTask':

		  this.subscribe( this.createRadioTask(aId,xPath,value,msg) );

		  break; 
		  
		default:
		  return false;
		}

}

BPManager.prototype.createFillInputTask = function(aId,xPath,value,aMsg){

return  new FillInputTask(aId,xPath,value,aMsg);

}

BPManager.prototype.createSelectOptionTask = function(aId,xPath,value,aMsg){
return new SelectOptionTask(aId,xPath,value,aMsg);
}

BPManager.prototype.createTextAreaTask = function(aId,xPath,value,aMsg){
return new TextAreaTask(aId,xPath,value,aMsg);
}

BPManager.prototype.createCheckBoxTask = function(aId,xPath,value,aMsg){
return new CheckBoxTask(aId,xPath,value,aMsg);
}

BPManager.prototype.createRadioTask = function(aId,xPath,value,aMsg){
return new RadioTask(aId,xPath,value,aMsg);
}

BPManager.prototype.subscribe = function(aPrimitiveTask){ //Este metodo por ahora solo agrega el objeto
this.currentPrimitiveTasks.push(aPrimitiveTask);
}

BPManager.prototype.getPrimitiveTasks = function(){ //Este metodo por ahora solo agrega el objeto
return this.primitiveTasks;
}

BPManager.prototype.clearPrimitiveTasks = function(){ 
this.currentPrimitiveTasks=[];
}

BPManager.prototype.execute = function(){ //Este no lo uso
	for (var i=0;i < this.currentPrimitiveTasks.length;i++){
	this.currentPrimitiveTasks[i].execute();
	}
}

BPManager.prototype.start = function(){
	
	if(this.currentPrimitiveTasks.length > 0)
	this.currentPrimitiveTasks[0].execute();
	
}
//END BPMANAGER

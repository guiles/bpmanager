
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
this.primitiveTasks = ['FillInputTask','SelectOptionTask']; //Un array de tareas que puede realizar
}

//El metodo initialize agrega al array de tareas primitivas
BPManager.prototype.initialize =  function(){

}

BPManager.prototype.getNextTask = function(){ //Me trae la proxima tarea pendiente
    for (var i=0;i < this.currentPrimitiveTasks.length;i++){
    
    console.debug("estado de la tarea:"); 
    console.debug(this.currentPrimitiveTasks[i].getState());
    
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

BPManager.prototype.subscribe = function(aPrimitiveTask){ //Este metodo por ahora solo agrega el objeto
this.currentPrimitiveTasks.push(aPrimitiveTask);
}

BPManager.prototype.getPrimitiveTasks = function(){ //Este metodo por ahora solo agrega el objeto
return this.primitiveTasks;
}

BPManager.prototype.clearPrimitiveTasks = function(){ 

//console.debug(this.getPrimitiveTasks());

this.primitiveTasks=[];
}

BPManager.prototype.execute = function(){
	for (var i=0;i < this.currentPrimitiveTasks.length;i++){

	//console.debug("<-----");
	//console.debug(this.currentPrimitiveTasks[i]);
	//console.debug("----->");

	this.currentPrimitiveTasks[i].execute();
	}
}

BPManager.prototype.start = function(){
	
	if(this.currentPrimitiveTasks.length > 0)
	this.currentPrimitiveTasks[0].execute();
	
}
//END BPMANAGER

/*
bpm = new BPManager();

bpm.addPrimitiveTask(1,'FillInputTask','//*[@id="my_input"]',"Buenos Aires");
bpm.addPrimitiveTask(2,'FillInputTask','//*[@id="my_input2"]',"Buenos Aires 2");
bpm.addPrimitiveTask(3,'SelectOptionTask','//*[@id="my_option"]',"DOS" );
bpm.addPrimitiveTask(4,'SelectOptionTask','//*[@id="my_option2"]',"CUATRO" );



//bpm.execute();
bpm.start();
//console.debug(bpm.getPrimitiveTasks());
//console.debug(bpm.currentPrimitiveTasks);
*/
//}
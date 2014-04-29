//bpmanager.js
//var document = window.document;
document.addEventListener("taskFinished", executeNext, false);
// Metodo que selecciona tareas del array del Manager
// y las ejecuta secuencialmente
function executeNext(e) {
	//var taskId = e.detail.taskId;
	console.debug("Evento: "+e.currentTarget.nodeName+", "
	+e.detail.time.toLocaleString()+": "+e.detail.message);
	//Busca la tarea y la pone como lista y ejecuta la proxima tarea
	//Esto es una variable global
    // var task = TESIS.Manager.getNextTask();
    // task.execute();
    TESIS.Manager.getNextTask().execute();
}
//Module y Factory Pattern 
TESIS.Manager = (function () {
	"use strict";
    var currentPrimitiveTasks = []; //Array de las tareas a realizar cuando se ejecuta el Manager
    var primitiveTasks = ['FillInputTask','SelectOptionTask','TextAreaTask','CheckBoxTask']; //Un array de tareas que puede realizar

        function subscribe(aPrimitiveTask){ //Este metodo por ahora solo agrega el objeto 
         currentPrimitiveTasks.push(aPrimitiveTask);
        }

        function createFillInputTask(aId,xPath,value,aMsg,aTipo){
        return  new FillInputTask(aId,xPath,value,aMsg,aTipo);
        }
        function createSelectOptionTask(aId,xPath,value,aMsg,aTipo){
        return new SelectOptionTask(aId,xPath,value,aMsg,aTipo);
        }

        function createTextAreaTask(aId,xPath,value,aMsg,aTipo){
        return new TextAreaTask(aId,xPath,value,aMsg,aTipo);
        }

        function createCheckBoxTask(aId,xPath,value,aMsg,aTipo){
        return new CheckBoxTask(aId,xPath,value,aMsg,aTipo);
        }

        function createRadioTask(aId,xPath,value,aMsg,aTipo){
        return new RadioTask(aId,xPath,value,aMsg,aTipo);
        }
        
    	return {
      
           	getNextTask : function(){ //Me trae la proxima tarea pendiente
           		var i;
            	for (i=0;i < currentPrimitiveTasks.length;i=i+1){
                       if(currentPrimitiveTasks[i].getState() === 0 ) { return currentPrimitiveTasks[i]; }
            	}
        	}
            
            ,execute: function(){ //Este no lo uso
            	var i;
                for (i=0;i < currentPrimitiveTasks.length;i=i+1){
                currentPrimitiveTasks[i].execute();
                }
        	} 
        	,start: function(){
                if(currentPrimitiveTasks.length > 0){currentPrimitiveTasks[0].execute();}
                currentPrimitiveTasks[0].execute();
        	}       
        	,clearCurrentPrimitiveTasks: function(){
                currentPrimitiveTasks=[];
        	}
        	,addPrimitiveTask :  function(aId,aPrimitiveTaskType,xPath,value,msg,tipo){
            //Este metodo reemplaza al switch
	    	var lookup = 
	    	{ FillInputTask: createFillInputTask(aId,xPath,value,msg,tipo)
	    	, SelectOptionTask: createSelectOptionTask(aId,xPath,value,msg,tipo)
	    	, TextAreaTask: createTextAreaTask(aId,xPath,value,msg,tipo)
	    	, CheckBoxTask: createCheckBoxTask(aId,xPath,value,msg,tipo) } 
	    	, def = null ;

	    	lookup[aPrimitiveTaskType] ? subscribe(lookup[aPrimitiveTaskType]) : def();
		   
            } 
        	
        	,addPrimitiveTaskOld:  function(aId,aPrimitiveTaskType,xPath,value,msg,tipo){

        	//Instancia y agrega al array de tareas
        	switch(aPrimitiveTaskType)
        	{
        	case 'FillInputTask':
        	  
        	  subscribe( createFillInputTask(aId,xPath,value,msg,tipo) );
        	  
        	break;

        	case 'SelectOptionTask':

                  subscribe( createSelectOptionTask(aId,xPath,value,msg,tipo) );

          	break;
        	case 'TextAreaTask':

                  subscribe( createTextAreaTask(aId,xPath,value,msg,tipo) );

          	break;  

         	case 'CheckBoxTask':

                   subscribe( createCheckBoxTask(aId,xPath,value,msg,tipo) );

          	break;   
          	case 'RadioTask':

                  subscribe( createRadioTask(aId,xPath,value,msg,tipo) );

          	break; 
        	default:
        	  return false;
                }
        	}
        	,getCurrentPrimitiveTasks: function(){
        	return currentPrimitiveTasks;
        	}	
        //===
    };
}());

//module.exports.TESIS.Manager =  TESIS.Manager;
//var bpmanager = ESIS.Manager;
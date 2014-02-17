//recorder.js

var JSON_RECORDER = new Array(); //Array de Objetos, variable global para guardar el JSON
var BPMN = new BPManager(); //Deberia ser Singleton y variable global

/*
Eventos que voy a tratar:
onChange: select, text, textarea
onClick: select, text, textarea
onFocus: select, text, textarea
onSelect: text, textarea
*/

//document.addEventListener("change", registroEventoInput , false); 
//document.addEventListener("click", registroEventoClic , false); 

//Listener de eventos cuando cambia el foco, recolecta datos relacionados.
function registroEventoChange(event){

var el_id = event.target.id;
var el_value = event.target.value;

//Si tiene id le pongo el xPath //*[@id="THE_ID"]
if(el_id){
var sxPath = '//*[@id="'+el_id+'"]';
}else{ //Si no tiene ID tengo que ver la manera de sacar el absoluto
	//console.debug("no tiene id, saco el absoluto");
}


//Guardo en el JSON compartido que sirve para el recorder.
//Diferencio los tipos de nodos, ahi le envio el tipo de tarea que recolecto.
switch(event.target.nodeName)
{
		case 'SELECT':
			var obj = new Object();
			obj.type = "SelectOptionTask";
			obj.xPath  = sxPath;
			obj.value = el_value;

			JSON_RECORDER.push(obj);		 
		    
		    console.debug("Evento SELECT");		  
		    console.debug(obj);

		  break;
		case 'INPUT':
		
			var obj = new Object();
			obj.type = "FillInputTask";
			obj.xPath  = sxPath;
			obj.value = el_value;
			
			JSON_RECORDER.push(obj);		 
			
			console.debug("Evento INPUT");		  
			console.debug(obj);		  

		  break;
		default:

		  break;
		}
}


function registroEventoClic(event){

console.debug("Registro evento:"+event.target);
console.debug(event.target);

var el_id = event.target.id;
var el_value = event.target.value;

	//Si tiene id le pongo el xPath //*[@id="THE_ID"]
	if(el_id){
	var sxPath = '//*[@id="'+el_id+'"]';

	}else{

		console.debug("no tiene id, saco el absoluto");
	}

}




window.onload = function(){

//Recorder.js

	//Inserto el DIV al final del HTML
	var div_recorder = document.createElement("div");

	var table_recorder = document.createElement("table")
	var tBody_recorder = document.createElement("tbody");

	var iRecord_recorder = document.createElement("input");
	iRecord_recorder.setAttribute('type','button');
	iRecord_recorder.setAttribute('value','Record');
	iRecord_recorder.setAttribute('id','start_record');

	var iStop_recorder = document.createElement("input");
	iStop_recorder.setAttribute('type','button');
	iStop_recorder.setAttribute('value','Stop');
	iStop_recorder.setAttribute('id','stop_record');

	var iPlay_recorder = document.createElement("input");
	iPlay_recorder.setAttribute('type','button');
	iPlay_recorder.setAttribute('value','Play');
	iPlay_recorder.setAttribute('id','play_procedure');

	var td1_recorder = document.createElement("td");
	td1_recorder.appendChild(iRecord_recorder);
	
	var td2_recorder = document.createElement("td");
	td2_recorder.appendChild(iStop_recorder);
	
	var td3_recorder = document.createElement("td");
	td3_recorder.appendChild(iPlay_recorder);

	var tr_recorder = document.createElement("tr");
	tr_recorder.appendChild(td1_recorder);
	tr_recorder.appendChild(td2_recorder);
	tr_recorder.appendChild(td3_recorder);

	tBody_recorder.appendChild(tr_recorder);
    
    table_recorder.appendChild(tBody_recorder);

    div_recorder.appendChild(table_recorder);


	var body = document.getElementsByTagName('body')[0];
	console.debug("Agrego DIV al body");
	
	body.appendChild(div_recorder); 

// Agrego Listeners para los botones
iRecord_recorder.addEventListener("click",RecordManager, false); 
iStop_recorder.addEventListener("click",RecordManager, false); 
iPlay_recorder.addEventListener("click",PlayProcedure, false); 

//END DIV al final del HTML

console.debug("Init");
//Agrego el evento al boton
//var record_button = document.getElementById("start_record");
//record_button.addEventListener("click",RecordManager, false); 

//var record_button = document.getElementById("stop_record");
//record_button.addEventListener("click",RecordManager, false); 

	function RecordManager(e){ //Esto deberia estar dentro del plugin, y desacoplado de la pagina
		
		if(e.target.id=="start_record"){
		console.debug("empieza a grabar");
		document.addEventListener("change", registroEventoChange , false); 
		document.addEventListener("click", registroEventoClic , false); 
		}
		if(e.target.id=="stop_record"){
		console.debug("termino de grabar");
		document.removeEventListener("change", registroEventoChange , false); 
		document.removeEventListener("click", registroEventoClic , false); 	
		
		}
	}


//Play Procedure
//var play_procedure_button = document.getElementById("play_procedure");
//play_procedure_button.addEventListener("click",PlayProcedure, false); 

	function PlayProcedure(){
		console.log("Ejecuta estas tareas");
		//console.debug(JSON_RECORDER);

		//Clear Tasks
		BPMN.clearPrimitiveTasks();
		for (var i=0;i < JSON_RECORDER.length;i++){
		//Tengo que saber que tipo de elemento para saber que agregar
		BPMN.addPrimitiveTask(i,JSON_RECORDER[i].type,JSON_RECORDER[i].xPath,JSON_RECORDER[i].value );
		};

	//Cada vez que grabo, tengo que resetear el array

	//Ejecuta lo grabado
//	console.debug(BPMN);
	BPMN.start();

	}

}

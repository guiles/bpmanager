
//recorder.js


//var JSON_RECORDER = new Array(); //Array de Objetos, variable global para guardar el JSON
var BPMN = new BPManager(); //Deberia ser Singleton y variable global

/*
Eventos que voy a tratar:
onChange: select, text, textarea
onClick: select, text, textarea
onFocus: select, text, textarea
onSelect: text, textarea
*/

//Funciones adicionales para sacar el xPath abolsuto
function createXPathFromElement(elm) { 
    var allNodes = document.getElementsByTagName('*'); 
    for (segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) 
    { 
        if (elm.hasAttribute('id')) { 
                var uniqueIdCount = 0; 
                for (var n=0;n < allNodes.length;n++) { 
                    if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++; 
                    if (uniqueIdCount > 1) break; 
                }; 
                if ( uniqueIdCount == 1) { 
                    segs.unshift('id("' + elm.getAttribute('id') + '")'); 
                    return segs.join('/'); 
                } else { 
                    segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]'); 
                } 
        } else if (elm.hasAttribute('class')) { 
            segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]'); 
        } else { 
            for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
                if (sib.localName == elm.localName)  i++; }; 
                segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
        }; 
    }; 
    return segs.length ? '/' + segs.join('/') : null; 
}; 

function lookupElementByXPath(path) { 
    var evaluator = new XPathEvaluator(); 
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
    return  result.singleNodeValue; 
} 

//document.addEventListener("change", registroEventoInput , false); 
//document.addEventListener("click", registroEventoClic , false); 

//Listener de eventos cuando cambia el foco, recolecta datos relacionados.
function registroEventoChange(event){
//Temporal, para asignarle si es tarea automatica, deberia ir en la consola
var tipo = 0;

//if( confirm("Tipo de tarea Automatica") ) tipo = 1;

var el_id = event.target.id;
var el_value = event.target.value;

//Si tiene id le pongo el xPath //*[@id="THE_ID"]
if(el_id){
var sxPath = '//*[@id="'+el_id+'"]';
}else{ //Si no tiene ID tengo que ver la manera de sacar el absoluto
	
	console.debug("no tiene id, saco el absoluto, uso el ejemplo de stack");
	var sxPath = createXPathFromElement(event.target) ;
	console.debug(sxPath);
}
function funcion(){
	//alert(this.id);
	var temp = localStorage.getItem(this.id);
	//lo paso a objeto para poder trabajarlo
	var temp1 = JSON.parse(temp);
	console.debug(temp1);
	
	temp1.tipo = 0;
	if(this.checked) temp1.tipo = 1;
	
	localStorage.setItem(this.id,JSON.stringify(temp1));
	console.debug(temp1);
	//alert(this.checked);
//	localStorage.setItem(1,temp1);

};
//Funcion temporal para registrar los eventos en el html 
function writer(id,text){

			var table_consola = document.getElementById("table_consola");
			

			var tr = document.createElement('tr');   

    		var td1 = document.createElement('td');
    		var td2 = document.createElement('td');
			var td3 = document.createElement('td');

    		var text1 = document.createTextNode(text);
    		var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.id = id;
			checkbox.onchange = funcion;
			
			var id_text = document.createTextNode(id);

			td1.appendChild(id_text);
 			td2.appendChild(text1);
    		td3.appendChild(checkbox);
    		tr.appendChild(td1);
    		tr.appendChild(td2);
			tr.appendChild(td3);
    		
    		table_consola.appendChild(tr);
	

}

//Guardo en el JSON compartido que sirve para el recorder.
//Diferencio los tipos de nodos, ahi le envio el tipo de tarea que recolecto.
//Me parece que seria mejor que tome el nombre del elemento y no tengo que usar el switch
switch(event.target.nodeName)
{
		case 'SELECT':
			var obj = new Object();
			obj.type = "SelectOptionTask";
			obj.xPath  = sxPath;
			obj.value = el_value;
			obj.tipo = tipo;

			//JSON_RECORDER.push(obj);		 
		    

			var id_cont = parseInt(localStorage.getItem('contador'));
			
			var id = id_cont+1;
			
			localStorage.setItem(id, JSON.stringify(obj));
			localStorage.setItem('contador',id);

			writer(id,JSON.stringify(obj));
		    console.debug("Evento SELECT");		  
		    console.debug(obj);

		  break;
		case 'INPUT':
		//temporal para ver si funciona

		if(event.target.type=='radio'){ 

			var obj = new Object();
			obj.type = "RadioTask";
			obj.xPath  = sxPath;
			obj.value = el_value;
			obj.tipo = tipo;

		 }else if(event.target.type=='checkbox'){
			var obj = new Object();
			obj.type = "CheckBoxTask";
			obj.xPath  = sxPath;
			obj.value = el_value;
			obj.tipo = tipo;

			
			}else{
			var obj = new Object();
			obj.type = "FillInputTask";
			obj.xPath  = sxPath;
			obj.value = el_value;
			obj.tipo = tipo;
			
			}


		//	JSON_RECORDER.push(obj);		
			
			var id_cont = parseInt(localStorage.getItem('contador'));
			
			var id = id_cont+1;
			
			localStorage.setItem(id, JSON.stringify(obj));
			localStorage.setItem('contador',id);
			writer(id,JSON.stringify(obj));

			console.debug("Evento INPUT");		  
			console.debug(obj);		  

		  break;
		  	case 'TEXTAREA':
		
			var obj = new Object();
			obj.type = "TextAreaTask";
			obj.xPath  = sxPath;
			obj.value = el_value;
			obj.tipo = tipo;
			
			//JSON_RECORDER.push(obj);		 
			
			var id_cont = parseInt(localStorage.getItem('contador'));
			
			var id = id_cont+1;
			
			localStorage.setItem(id, JSON.stringify(obj));
			localStorage.setItem('contador',id);
			console.debug(id);
			
			writer(id,JSON.stringify(obj));
 			
			console.debug("Evento TextArea");		  
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
	
	console.debug("no tiene id, saco el absoluto, uso el ejemplo de stack");
	var sxPath = createXPathFromElement(event.target) ;
	console.debug(sxPath);

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
	iStop_recorder.setAttribute('disabled',true);
	
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

		var start_record = document.getElementById('start_record');
		start_record.disabled = true;
		var stop_record = document.getElementById('stop_record');
		stop_record.disabled = false;

		}
		if(e.target.id=="stop_record"){
		console.debug("termino de grabar");
		document.removeEventListener("change", registroEventoChange , false); 
		document.removeEventListener("click", registroEventoClic , false); 	

		var start_record = document.getElementById('start_record');
		start_record.disabled = false;
		var stop_record = document.getElementById('stop_record');
		stop_record.disabled = true;
		}
	}


//Play Procedure
//var play_procedure_button = document.getElementById("play_procedure");
//play_procedure_button.addEventListener("click",PlayProcedure, false); 

	function PlayProcedure(){
		console.log("Ejecuta estas tareas");
		//console.debug(JSON_RECORDER);
		
		console.debug(localStorage);
		
		//Clear Tasks
		BPMN.clearPrimitiveTasks();
		//for (var i=0;i < JSON_RECORDER.length;i++){
		/*for (var i=0;i < localStorage.length;i++){
		//Tengo que saber que tipo de elemento para saber que agregar
		BPMN.addPrimitiveTask(i,JSON_RECORDER[i].type,JSON_RECORDER[i].xPath,
			JSON_RECORDER[i].value,JSON_RECORDER[i].tipo);

		BPMN.start();
		}*/

		for (var i=0;i < localStorage.length;i++){
			//console.debug(localStorage[i]);


			var key = localStorage.key(i);
    		var value = localStorage[key];
			//console.debug(JSON.parse(value).type);

			var tasks = JSON.parse(value);
			
			if(tasks.type){
				//Tengo que saber que tipo de elemento para saber que agregar
				BPMN.addPrimitiveTask(i,tasks.type,tasks.xPath,
				tasks.value,tasks.tipo);
				
			}

			//console.debug(BPMN.currentPrimitiveTasks);
		
		}
		BPMN.start();

	}




	
//Consola
//Inserto el DIV al final del HTML
function funcion_load(){

console.debug(localStorage);

for (var i=0;i < localStorage.length;i++){
			//console.debug(localStorage[i]);

			var key = localStorage.key(i);
    		var value = localStorage[key];
			//console.debug(JSON.parse(value).type);

			var tasks = JSON.parse(value);
			
			if(tasks.type){
				//Tengo que saber que tipo de elemento para saber que agregar
				BPMN.addPrimitiveTask(i,tasks.type,tasks.xPath,
				tasks.value,tasks.tipo);
				var table_consola = document.getElementById("table_consola");
			

			var tr = document.createElement('tr');   

    		var td1 = document.createElement('td');
    		var td2 = document.createElement('td');
			var td3 = document.createElement('td');

    		var text1 = document.createTextNode(value);
    		var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.id = key;
			//checkbox.onchange = funcion;
			
			var id_text = document.createTextNode(key);

			td1.appendChild(id_text);
 			td2.appendChild(text1);
    		td3.appendChild(checkbox);
    		tr.appendChild(td1);
    		tr.appendChild(td2);
			tr.appendChild(td3);
    		
    		table_consola.appendChild(tr);
			}	
		}
};



//localStorage.clear();
//Si el localStorage esta inicializado muestro contenido
if(localStorage.getItem('1') != null){
alert('Hay tareas guardadas - clic en Load');
console.debug(localStorage);


} 
//if(cont != null)
//localStorage.setItem('contador', cont);


//por ahora borro el localStorage
//localStorage.clear();
localStorage.setItem('contador', 0);

	var div_consola = document.createElement("div");
	div_consola.setAttribute('id','div_consola');
	var hr = document.createElement("hr");
	div_consola.appendChild(hr);

		/*	var save = document.createElement('input');
			save.type = "button";
			save.value = "Save";
			save.id = "save";
			save.onclick = funcion_save;*/

	var load = document.createElement('input');
			load.type = "button";
			load.value = "Load";
			load.id = "load";
			load.onclick = funcion_load;

		var clear = document.createElement('input');
			clear.type = "button";
			clear.value = "Clear";
			clear.id = "clear";
			clear.onclick = function(){
				localStorage.clear(); localStorage.setItem('contador', 0); document.getElementById("table_consola").innerHTML = "";
			 };

	var table = document.createElement('table');
	table.setAttribute('id','table_consola');
	div_consola.appendChild(table);		
	body.appendChild(load);
	body.appendChild(clear);
	body.appendChild(div_consola); 

//Fin Consola





}

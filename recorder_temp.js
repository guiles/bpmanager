//Empiezo creando los elementos JS
/**
 * Tesis Ing. Guillermo A. Caserotto
 *
 * @module Recorder
 * @main recorder
 * Eventos que voy a tratar:
 * onChange: select, text, textarea
 * onClick: select, text, textarea
 * onFocus: select, text, textarea
 * onSelect: text, textarea
 */

 window.onload = function(){

/**  
* @event eventoChange
* Listener de eventos cuando cambia el foco, recolecta datos relacionados.
*/
var eventoChange = function(event){

    	console.debug("Empieza a grabar registroEventoChange");
		//Temporal, para asignarle si es tarea automatica, deberia ir en la consola
		var tipo = 0;
		var el_id = event.target.id;
		var el_value = event.target.value;
		//Si tiene id le pongo el xPath //*[@id="THE_ID"]
		if(el_id){
		var sxPath = '//*[@id="'+el_id+'"]';
		}else{ //Si no tiene ID tengo que ver la manera de sacar el absoluto
		console.debug("no tiene id, saco el absoluto, uso el ejemplo de stack");
		//var sxPath = this.createXPathFromElement(event.target) ;
		console.debug("sxPath");
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

		var id = localStorage.length + 1;

		localStorage.setItem(id, JSON.stringify(obj));
		////TESIS.refresh();

	    break;
		case 'INPUT':
		//temporal para ver si funciona
        console.debug('entra a input');
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

		var id = localStorage.length + 1;
		localStorage.setItem(id, JSON.stringify(obj));
		Recorder.refresh();
		break;
	 	case 'TEXTAREA':

		var obj = new Object();
		obj.type = "TextAreaTask";
		obj.xPath  = sxPath;
		obj.value = el_value;
		obj.tipo = tipo;
		var id = localStorage.length + 1;

		localStorage.setItem(id, JSON.stringify(obj));
	//	//TESIS.writer(id,JSON.stringify(obj),-1);
        break;
		default:

		break;
		}
}

/**
 * @class Recorder
 * @constructor
 */

var Recorder = {

	/**  
	* @method createRecorder   
	* Crea elementos HTML para manejar el recorder
	*/
	createRecorder: function(){

	var iRecord_recorder = document.createElement("input");
	iRecord_recorder.setAttribute('type','button');
	iRecord_recorder.setAttribute('value','Record');
	iRecord_recorder.setAttribute('id','start_record');
	iRecord_recorder.addEventListener("click",this.clickRecord, false); 

	var iStop_recorder = document.createElement("input");
	iStop_recorder.setAttribute('type','button');
	iStop_recorder.setAttribute('value','Stop');
	iStop_recorder.setAttribute('id','stop_record');
	iStop_recorder.setAttribute('disabled',true);
	iStop_recorder.addEventListener("click", this.clickStop , false); 

	var iPlay_recorder = document.createElement("input");
	iPlay_recorder.setAttribute('type','button');
	iPlay_recorder.setAttribute('value','Play');
	iPlay_recorder.setAttribute('id','play_procedure');

	var load = document.createElement('input');
	load.type = "button";
	load.value = "LS";
	load.id = "load";
	//load.onclick = //TESIS.muestraLocalStorage;
     
    var clear = document.createElement('input');
	clear.type = "button";
	clear.value = "Clear";
	clear.id = "clear";
	clear.onclick = function(){
	localStorage.clear(); //localStorage.setItem('contador', 0); 
	document.getElementById("table_consola").innerHTML = "";
	}; 

	var div_consola = document.createElement("div");
	div_consola.id = "div_consola"
	div_consola.style.cssText = "width:100%;height:350px;overflow:auto;";

	var div_consola_header = document.createElement("div");
	div_consola_header.id = "consola_header"
	div_consola_header.style.cssText = "background: url('http://yui.yahooapis.com/3.15.0/build/console/assets/skins/sam/bg.png') repeat-x scroll 0 0 #D8D8DA;  border: 1px solid rgba(0, 0, 0, 0); border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 1ex; display:block;";

	var div_table_consola = document.createElement("div");
	div_table_consola.id =  "div_table_consola";

	var hide_show = document.createElement("input");
	hide_show.type = "button";
	hide_show.value = "Show/Hide";
	hide_show.onclick = function(){ 

	var table_consola = document.getElementById('table_consola');

	if(table_consola.style.display=='block'){
	table_consola.style.cssText = "display:none";
	}else{
	table_consola.style.cssText = "display:block";

	}
	};

	var table_consola = document.createElement("table")
	table_consola.id = "table_consola"
	table_consola.style.cssText = "display:block";


	div_consola_header.appendChild(iRecord_recorder);	
	div_consola_header.appendChild(iStop_recorder);
	div_consola_header.appendChild(iPlay_recorder);
	
	div_consola_header.appendChild(load);
	div_consola_header.appendChild(clear);
	
	div_consola_header.appendChild(hide_show);
	
	div_consola.appendChild(div_consola_header); 
	div_consola.appendChild(div_table_consola);

	div_table_consola.appendChild(table_consola);

	var body = document.getElementsByTagName('body')[0];
	body.appendChild(div_consola); 

	}
	/**  
	* @method createConsoleEditor   
	* Crea elementos HTML para manejar la edicion del recorder
	*/
	,createConsoleEditor: function(){
	/*Overlay*/
	var div_overlay = document.createElement("div");	
	div_overlay.id = "div_overlay1";
	div_overlay.style.cssText=" visibility: hidden;position: absolute;left: 500px;top: 200px; height:200px;text-align:center;z-index: 1000;width:300px;margin: 100px auto;background-color: #fff;border:1px solid #000;padding:15px;text-align:center;";
	var table_edit = document.createElement("table");	
	table_edit.id = "table_edit";
	var tr_id = document.createElement("tr");	
	var td_id = document.createElement("td");
	var td_id_text = document.createElement("td");
	var title_id = document.createTextNode('ID:');
	td_id.appendChild(title_id);
	tr_id.appendChild(td_id);
	tr_id.appendChild(td_id_text);

	var tr_value = document.createElement("tr");	
	var td_value = document.createElement("td");
	var title_value = document.createTextNode('Value:');
	td_value.appendChild(title_value);
	var td_value_text = document.createElement("td");
	var input_value = document.createElement('input');
	input_value.type = "text";
	td_value_text.appendChild(input_value);
	var td_value_hidden = document.createElement("td");
	   var hidden_value = document.createElement('input');
	hidden_value.type = "hidden";
	td_value_hidden.appendChild(hidden_value);

	tr_value.appendChild(td_value);
	tr_value.appendChild(td_value_text);
	tr_value.appendChild(td_value_hidden);

	var tr_manual = document.createElement("tr");	
	var td_manual = document.createElement("td");
	var td_manual_text = document.createElement("td");
	var title_manual = document.createTextNode('Manual:');
	td_manual.appendChild(title_manual);
	var manual_checkbox = document.createElement('input');
	manual_checkbox.type = "checkbox";
	manual_checkbox.value = 0;
	td_manual_text.appendChild(manual_checkbox);

	tr_manual.appendChild(td_manual);
	tr_manual.appendChild(td_manual_text);


	table_edit.appendChild(tr_id);
	table_edit.appendChild(tr_value);
	table_edit.appendChild(tr_manual);

	var save_edit = document.createElement("input");
	save_edit.type = "button";
	save_edit.value = "Save";
	//Tengo dos comporamientos en este metodo, me parece que tengo que dividirlo, espero a hacer el diseño copado del pizarron
	save_edit.onclick = function(){ 
	  
	      //Escondo el div
	      el = document.getElementById("div_overlay1");
	      el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	      //Traigo los datos de la tarea ( Edit o Add)
	      var table_edit = document.getElementById("table_edit");
	      var id = table_edit.rows[0].cells[1].innerHTML;
	       //Temp, si no tiene id creo el objeto, deberia hacerlo siempre y no usar la variable String
	     if(id==''){ 
	      console.debug('Tengo que armar el objeto json con los datos que tengo');
	         
	       //Traigo el contador
	       // var cont = localStorage.getItem('contador');
	        console.debug("----------");

	     // console.debug(cont);
	       // id = parseInt(cont) + 1;
	        id = localStorage.length + 1;

		console.debug(id);
		console.debug("----------");
	        var obj1 = new Object();
	        obj1.type = "TextAreaTask";
	        obj1.xPath  = 'sxPath';
	        obj1.value = 'el_value';
	        obj1.tipo = 1;
	        var obj_value = JSON.stringify(obj1);
	       localStorage.setItem(id,obj_value);
	     }else{
	      var string = table_edit.rows[1].cells[2].firstChild.value;
	      var input_value = table_edit.rows[1].cells[1].firstChild.value; 
	      var checked = table_edit.rows[2].cells[1].firstChild.checked;
	      var obj =  JSON.parse(string);
	      obj.tipo = (checked)? 1 : 0;
	      obj.value = input_value; 
	      var obj_value = JSON.stringify(obj);

	      localStorage.setItem(id,obj_value); 
	     }  
	 
	  
	     //TESIS.refresh();      

	};

	var close_edit = document.createElement("input");
	close_edit.type = "button";
	close_edit.value = "Close";
	close_edit.onclick = function(){ 
	  
	   var close_edit = document.getElementById("table_edit");
	       
	   el = document.getElementById("div_overlay1");
	   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
	   
	   }

		table_edit.appendChild(close_edit);
		table_edit.appendChild(save_edit);
		div_overlay.appendChild(table_edit);

        var div_consola = document.getElementById('div_consola');
		div_consola.appendChild(div_overlay);

		var body = document.getElementsByTagName('body')[0];
		body.appendChild(div_consola);

	}
	,clickRecord: function(){
	 
	 console.debug('empieza a grabar');
     document.addEventListener("change", eventoChange , false); 
     //document.addEventListener("click", function(){ console.debug('clic');} , false); 

     var start_record = document.getElementById('start_record');
	 start_record.disabled = true;
     var stop_record = document.getElementById('stop_record');
     stop_record.disabled = false;
	}
	,clickStop: function(){
	 
	console.debug("termino de grabar");
    document.removeEventListener("change", this.registroEventoChange , false); 
    // document.removeEventListener("click", TESIS.registroEventoClic , false); 
     var start_record = document.getElementById('start_record');
	 start_record.disabled = false;
     var stop_record = document.getElementById('stop_record');
     stop_record.disabled = true;
	}
	,refresh: function(){

		  var table_consola = document.getElementById("table_consola");
  
		  while(table_consola.hasChildNodes())
		  {
		    table_consola.removeChild(table_consola.firstChild);
		  }

		  for (var i=0;i < localStorage.length-1;i++){
		  
		    var key = localStorage.key(i);
		    var value = localStorage[key];

		    this.writer(key,value,-1);
		  }

	}
	,writer: function(id,text,index){

		var table_consola = document.getElementById("table_consola");

		//Inserto registro
		var tr = document.getElementById('table_consola').insertRow(index);
        tr.id= id;
	    var td1 = document.createElement('td');
	    var td2 = document.createElement('td');
	    var td3 = document.createElement('td');
	    var td4 = document.createElement('td');
	    var td5 = document.createElement('td');

	 	var text1 = document.createTextNode(text);
	    var delete_button = document.createElement('input');
		delete_button.type = "button";
		delete_button.value = "X";
		delete_button.onclick = function(x){ 

			if(confirm('Desea borrar el regitro?')){
			var id = this.parentNode.parentNode.id;
			var row = this.parentNode.parentNode.sectionRowIndex;
			document.getElementById('table_consola').deleteRow(row);
			localStorage.removeItem(id);
			}
		};

		var edit_button = document.createElement('input');
		edit_button.type = "button";
		edit_button.value = "E";
		edit_button.onclick = function(){
		//TESIS.Consola.editRow(this); --> Hacerlo
		};

		var add_button = document.createElement('input');
		add_button.type = "button";
		add_button.value = "A";
		add_button.onclick = function(x){
		var id = this.parentNode.parentNode.id;
		var row = this.parentNode.parentNode.sectionRowIndex;
		document.getElementById('table_consola').insertRow(row+1);
		console.debug("agrega tarea!!!");
		//TESIS.Consola.addRow(null); --> Hacerlo

		};
		var id_text = document.createTextNode(id);

		td1.appendChild(id_text);
		td2.appendChild(text1);
		td3.appendChild(add_button);
		td4.appendChild(edit_button);
		td5.appendChild(delete_button);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		}

	,init: function(){
	this.createRecorder();
	this.createConsoleEditor();
	//this.registraEventos();

	}
  }
  Recorder.init();

};

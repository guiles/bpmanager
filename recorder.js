var bpm = {};
bpm.console = {};
var BPMN = new BPManager(); //Deberia ser Singleton y variable global
window.onload = function(){
/*
Eventos que voy a tratar:
onChange: select, text, textarea
onClick: select, text, textarea
onFocus: select, text, textarea
onSelect: text, textarea
*/
//Funciones adicionales para sacar el xPath abolsuto
bpm.createXPathFromElement = function(elm) { 
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

bpm.lookupElementByXPath = function (path) { 
   var evaluator = new XPathEvaluator(); 
   var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
   return  result.singleNodeValue; 
} 


//Escribe los eventos en la consola
bpm.writer = function(id,text,index){

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
//console.debug(x.target.parentNode.parentNode.id);
//var id = x.target.parentNode.parentNode.id;
//var row = x.target.parentNode.parentNode.rowIndex;
var id = this.parentNode.parentNode.id;
var row = this.parentNode.parentNode.sectionRowIndex;
//alert(this.rowIndex);
document.getElementById('table_consola').deleteRow(row);
localStorage.removeItem(id);
//console.debug(this.parentNode.parentNode.sectionRowIndex);

}
};

var edit_button = document.createElement('input');
edit_button.type = "button";
edit_button.value = "E";
edit_button.onclick = function(){
bpm.console.editRow(this);
};

var add_button = document.createElement('input');
add_button.type = "button";
add_button.value = "A";
add_button.onclick = function(x){
//var row = x.target.parentNode.parentNode.rowIndex;
//console.debug(x.target.parentNode.parentNode.rowIndex);
var id = this.parentNode.parentNode.id;
var row = this.parentNode.parentNode.sectionRowIndex;
document.getElementById('table_consola').insertRow(row+1);
bpm.writer(1,'123',row+1);
//overlay1(this);
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


//Listener de eventos cuando cambia el foco, recolecta datos relacionados.
bpm.registroEventoChange = function(event){
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
var sxPath = bpm.createXPathFromElement(event.target) ;
console.debug(sxPath);
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

bpm.writer(id,JSON.stringify(obj),-1);
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
bpm.writer(id,JSON.stringify(obj),-1);

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

bpm.writer(id,JSON.stringify(obj),-1);

console.debug("Evento TextArea");	  
console.debug(obj);	  

 break;
default:

 break;
}
}


bpm.registroEventoClic = function(event){

console.debug("Registro evento:"+event.target);
console.debug(event.target);

var el_id = event.target.id;
var el_value = event.target.value;

//Si tiene id le pongo el xPath //*[@id="THE_ID"]
if(el_id){
var sxPath = '//*[@id="'+el_id+'"]';

}else{

console.debug("no tiene id, saco el absoluto, uso el ejemplo de stack");
var sxPath = bpm.createXPathFromElement(event.target) ;
console.debug(sxPath);

}

}




//window.onload = function(){
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

/*CONSOLA*/

var div_consola = document.createElement("div");
div_consola.id = "consola"
div_consola.style.cssText = "width:100%;height:350px;overflow:auto;";

var div_consola_header = document.createElement("div");
div_consola_header.id = "consola_header"
div_consola_header.style.cssText = "background: url('http://yui.yahooapis.com/3.15.0/build/console/assets/skins/sam/bg.png') repeat-x scroll 0 0 #D8D8DA;  border: 1px solid rgba(0, 0, 0, 0); border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 1ex; display:block;";

var hide_show = document.createElement("input");
hide_show.type = "button";
hide_show.value = "Show/Hide";
hide_show.onclick = function(){ 

var table_consola = document.getElementById('table_consola');
//table_consola.style = "display:none";
console.debug(table_consola);
if(table_consola.style.display=='block'){
table_consola.style.cssText = "display:none";
//alert('none');
}else{
table_consola.style.cssText = "display:block";
//alert('block');

}
};

div_consola_header.appendChild(hide_show);

var title = document.createTextNode(' Console Log');
div_consola_header.appendChild(title);


div_consola.appendChild(div_consola_header); 

var table_consola = document.createElement("table")
table_consola.id = "table_consola"
table_consola.style.cssText = "display:block";

   div_consola.appendChild(table_consola);

var body = document.getElementsByTagName('body')[0];


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
save_edit.onclick = function(){ 
  
   var table_edit = document.getElementById("table_edit");
       
   el = document.getElementById("div_overlay1");
   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
     //  console.debug(table_id.rows[1].cells[2].firstChild.value);

       var id = table_edit.rows[0].cells[1].innerHTML;
      // var string = table_id.rows[1].cells[1].firstChild.value;
       var string = table_edit.rows[1].cells[2].firstChild.value;
       var input_value = table_edit.rows[1].cells[1].firstChild.value; 
       var checked = table_edit.rows[2].cells[1].firstChild.checked;
       var obj =  JSON.parse(string);
       obj.tipo = (checked)? 1 : 0;
       obj.value = input_value; 
        //obj.tipo = checked; 
       console.debug(obj);
       var value = JSON.stringify(obj);
       
     // JSON.stringify(obj)
      // console.debug(id);                                                                                                                                                                                                        
       //console.debug(value);
       
       localStorage.setItem(id,value);
       

       var tr = document.getElementById(id);
      // console.debug(tr);
       tr.cells[0].innerHTML = id;
       tr.cells[1].innerHTML = value;


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

/*<div id="div_overlay">
    <div>
       <table id="table_id" size="50">
           <!--tr id="o_1"-->
               <tr>
               <td>ID:</td><td></td>
           </tr>
           <tr>    
               <td>Value:</td><td><input type="text" value="" /> </td><td><input type="hidden" value="" /> </td>
           </tr>
           <tr>
               <td>Manual:</td><td><input type="checkbox" value="0"/> </td>
           </tr>

       </table>
       <!--input type="button" value="Close" onClick="overlay(this)"></input-->
    <a href='#' onClick="cerrar()">close</a>
       <input type="button" value="Save" onClick="guardar(this)"></input>
    </div>

</div>*/
div_consola.appendChild(div_overlay);
body.appendChild(div_consola); 


/**/



// Agrego Listeners para los botones
//iRecord_recorder.addEventListener("click",RecordManager, false); 
//iStop_recorder.addEventListener("click",RecordManager, false); 
//iPlay_recorder.addEventListener("click",PlayProcedure, false); 

//END DIV al final del HTML

console.debug("Init");
//Agrego el evento al boton
//var record_button = document.getElementById("start_record");
//record_button.addEventListener("click",RecordManager, false); 

//var record_button = document.getElementById("stop_record");
//record_button.addEventListener("click",RecordManager, false); 

bpm.console.editRow = function(x) {
   //el1 = document.getElementById("div_overlay1");
   el = document.getElementById("div_overlay1");
   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
  
    var table_row = x.parentNode.parentNode;   
    var string = table_row.cells[1].innerHTML;
    var obj = JSON.parse(string);
    var table_edit = document.getElementById("table_edit");
    console.debug(table_edit.rows);
    table_edit.rows[0].cells[1].innerHTML = table_row.cells[0].innerHTML;
    table_edit.rows[1].cells[2].firstChild.value = table_row.cells[1].innerHTML;
    table_edit.rows[1].cells[1].firstChild.value = obj.value;

   }

bpm.console.RecordManager =function (e){ //Esto deberia estar dentro del plugin, y desacoplado de la pagina
//alert('clic');
if(e.target.id=="start_record"){
console.debug("empieza a grabar");
document.addEventListener("change", bpm.registroEventoChange , false); 
document.addEventListener("click", bpm.registroEventoClic , false); 

var start_record = document.getElementById('start_record');
start_record.disabled = true;
var stop_record = document.getElementById('stop_record');
stop_record.disabled = false;

}
if(e.target.id=="stop_record"){
console.debug("termino de grabar");
document.removeEventListener("change", bpm.registroEventoChange , false); 
document.removeEventListener("click", bpm.registroEventoClic , false); 

var start_record = document.getElementById('start_record');
start_record.disabled = false;
var stop_record = document.getElementById('stop_record');
stop_record.disabled = true;
}
}


//Play Procedure
//var play_procedure_button = document.getElementById("play_procedure");
//play_procedure_button.addEventListener("click",PlayProcedure, false); 


bpm.console.PlayProcedure = function(){
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
iRecord_recorder.addEventListener("click",bpm.console.RecordManager, false); 
iStop_recorder.addEventListener("click",bpm.console.RecordManager, false); 
iPlay_recorder.addEventListener("click",bpm.console.PlayProcedure, false); 


bpm.muestraLocalStorage = function(){

console.debug(localStorage);
console.debug(bpm);
console.debug(bpm.console);
}



//Consola

//if(cont != null)
//localStorage.setItem('contador', cont);


//por ahora borro el localStorage
//localStorage.clear();
localStorage.setItem('contador', 0);

 var div_consola = document.createElement("div");
div_consola.setAttribute('id','div_consola');
var hr = document.createElement("hr");
div_consola.appendChild(hr);

var save = document.createElement('input');
save.type = "button";
save.value = "Save";
save.id = "save";
//save.onclick = funcion_save;

var load = document.createElement('input');
load.type = "button";
load.value = "LS";
load.id = "load";
load.onclick = bpm.muestraLocalStorage;

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
div_recorder.appendChild(load);
div_recorder.appendChild(clear);
body.appendChild(div_consola); 


if(localStorage.getItem('1') != null){

if(confirm('Hay tareas guardadas - clic en Load---')){

for (var i=0;i < localStorage.length-1;i++){
console.debug(localStorage[i]);

var key = localStorage.key(i);
   	 var value = localStorage[key];
//console.debug(JSON.parse(value).type);

//var tasks = JSON.parse(value);
bpm.writer(key,value,-1);
}
}
}


//*************************//


}
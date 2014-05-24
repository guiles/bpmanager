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


var TESIS = TESIS || {};
TESIS.Consola = {};
TESIS.Manager = {};




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


                    try{
                            console.debug(TESIS.Manager.getNextTask());
                                    TESIS.Manager.getNextTask().execute();                   
                                        }catch(err){
                                                 console.debug("error"+err+"!!!");        
                                        }
                       


    
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
                           console.debug("cantidad de tareas");
                           console.debug(currentPrimitiveTasks.length);
                           var i;
                    for (i = 0;i < currentPrimitiveTasks.length;i=i+1){
                               
                       
                       if(currentPrimitiveTasks[i].getState() === 0 ) { 
                                                
                        return currentPrimitiveTasks[i]; 
                       }else{
                               console.debug("Esto esta mal");
                                                
                       }
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




/**
*/




window.onload = function(){


var css_styles = {
        class_button:"background-color: #24890d;border: 0;border-radius: 2px;color: #fff;font-size: 12px;font-weight: 700;padding: 10px 30px 11px;text-transform: uppercase;vertical-align: bottom;"
};
//Agrego los estilos para el plugin
//@TODO: realizar una clase que maneje y englobe
var css = " .class_button { background-color: #24890d; border: 0; border-radius: 2px; color: #fff; font-size: 12px; font-weight: 700; padding: 10px 30px 11px; text-transform: uppercase;vertical-align: bottom;}  ";
 var   head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');


style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}


head.appendChild(style);


/**  
* Listener de eventos cuando cambia el foco, recolecta datos relacionados.
* @event eventoChange
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
                var sxPath = Recorder.createXPathFromElement(event.target) ;
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


                var id = localStorage.length + 1;


                localStorage.setItem(id, JSON.stringify(obj));
                Recorder.refresh();


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
        //        //TESIS.writer(id,JSON.stringify(obj),-1);
                Recorder.refresh();
        break;
                default:


                break;
                }
}


/**
 * @class Recorder
 */


var Recorder = {


        /**  
        * Crea elementos HTML para manejar el recorder
        * @method createRecorder   
        */
        createRecorder: function(){


/*        var iRecord_recorder = document.createElement("input");
        iRecord_recorder.setAttribute('type','button');
        iRecord_recorder.setAttribute('value','Record');
        iRecord_recorder.setAttribute('id','start_record');
        iRecord_recorder.setAttribute('class','class_button');        
        iRecord_recorder.addEventListener("click",this.clickRecord, false); 
console.debug(iRecord_recorder);*/
        var iStop_recorder = document.createElement("input");
        iStop_recorder.setAttribute('type','button');
        iStop_recorder.setAttribute('value','Stop');
        iStop_recorder.setAttribute('id','stop_record');
        iStop_recorder.setAttribute('disabled',true);
        iStop_recorder.setAttribute('hidden',true);
        iStop_recorder.addEventListener("click", this.clickStop , false); 


        var iPlay_recorder = document.createElement("input");
        iPlay_recorder.setAttribute('type','button');
        iPlay_recorder.setAttribute('value','Play');
        iPlay_recorder.setAttribute('id','play_procedure');
        //iPlay_recorder.setAttribute('class','class_button');        
        iPlay_recorder.addEventListener("click", this.clickPlay , false); 


        var sAddTask = document.createElement('select');
        sAddTask.setAttribute('id','add_task');
         var j;
         var aOptions=['Add Task','Primitive Task','Augmented Task'];
        for (j = 0; j < aOptions.length; j = j + 1) {
                opt = document.createElement('option');
                opt.value = j;
                if(j===0){opt.disabled = true;opt.selected = true;} 
                opt.innerHTML = aOptions[j];
                sAddTask.appendChild(opt);
        }
        sAddTask.addEventListener("change", this.addTask , false); 






        var iRecord_recorder = document.createElement("input");
        iRecord_recorder.setAttribute('type','button');
        iRecord_recorder.setAttribute('value','Record');
        iRecord_recorder.setAttribute('id','start_record');
        //iRecord_recorder.setAttribute('class','class_button');        
        iRecord_recorder.addEventListener("click",this.clickRecord, false); 




        var load = document.createElement('input');
        load.type = "button";
//        load.type = "image";
        //load.src = "./rainbow.gif";
        load.value = "LS";
        load.id = "load";
        //load.setAttribute('class','class_button');        


        load.onclick = function(){  
                                                                console.log("Contenido:");
                                                                console.debug(localStorage);
                                                                console.debug("Tamano:");
                                                                console.debug(localStorage.length);
                                                                //console.debug(TESIS);
                                                                //console.debug(TESIS.Consola);
                                                        };
     
    var clear = document.createElement('input');
        clear.type = "button";
        clear.value = "Clear";
        clear.id = "clear";
        //clear.setAttribute('class','class_button');        
        clear.onclick = function(){
        localStorage.clear(); //localStorage.setItem('contador', 0); 
        document.getElementById("table_consola").innerHTML = "";
        }; 


        
/*patch.0001 - Traigo el primer div del body para ponerlo primero*/
var body   = document.body || document.getElementsByTagName('body')[0];
//var    newpar = document.createElement('p');
//newpar.innerHTML = 'Man, someone just created me!';
var div_consola = document.createElement("div");
//body.insertBefore(div_consola,body.childNodes[0]);
//body.insertBefore(newpar,body.childNodes[0]);
console.debug(document.body.firstChild);


if (document.body.firstChild)
      document.body.insertBefore(div_consola, document.body.firstChild);
    else
      document.body.appendChild(div_consola);
console.debug(document.body.firstChild);
//body.appendChild(div_consola);
//var first = document.body.children[0];
//var childNodes = document.body.childNodes;


//var primero = document.getElementsByTagName("body");
//var div_consola = document.createElement("div");
div_consola.id = "div_consola";
div_consola.style.cssText = "overflow:scroll;    z-index: 300;   position: fixed;        left: 0px;      width: auto;        height: 100%;       border: solid 1px #e1e1e1;      vertical-align: middle;         background: #ffdab9;  text-align: center;";
//console.debug(b[0].childNodes[0]);
//var first_child = b[0].childNodes[0];
        //var body = document.getElementsByTagName('body')[0];
        //body.appendChild(div_consola); 
         /* patch.0001 - Agrego el div_consola */ 
    //document.body.insertBefore(div_consola, first_child);
        //document.body.insertBefore(div_consola, document.body.firstChild);
var b = document.getElementsByTagName("body");
console.debug(b[0].childNodes);
        var div_consola_header = document.createElement("div");
        div_consola_header.id = "consola_header"
        //div_consola_header.style.cssText = "background:  #37abc8;   border: 1px solid rgba(0, 0, 0, 0); border-top-left-radius: 10px; border-top-right-radius: 10px; padding: 1ex; display:block;";
//opacity: 0.67;
        var div_table_consola = document.createElement("div");
        div_table_consola.id =  "div_table_consola";


        var hide_show = document.createElement("input");
        hide_show.type = "button";
        hide_show.value = "Show/Hide";
        hide_show.onclick = function(){ 


        var table_consola = document.getElementById('table_consola');


        if(table_consola.style.display=='block'){
        //table_consola.style.cssText = "display:none";
        }else{
//        table_consola.style.cssText = "display:block";


        }
        };


        var table_consola = document.createElement("table")
        table_consola.id = "table_consola"
        //table_consola.style.cssText = "display:block";




        div_consola_header.appendChild(iRecord_recorder);        
        div_consola_header.appendChild(iStop_recorder);
        div_consola_header.appendChild(iPlay_recorder);        
        div_consola_header.appendChild(load);
        div_consola_header.appendChild(clear);
        //div_consola_header.appendChild(hide_show);
        div_consola_header.appendChild(sAddTask);


        div_consola.appendChild(div_consola_header); 
        div_consola.appendChild(div_table_consola);


        div_table_consola.appendChild(table_consola);


  
        //Agrego la solapa para mostrar/ocultar
        var div_pestana = document.createElement("div");
        div_pestana.id =  "div_pestana"; 
        div_pestana.style.cssText = "display: inline-block;background: #37abc8;opacity: 0.67;position: fixed;right: 0;bottom: 3.2em;z-index: 100;font-size: 14px;font-family: Helvetica, arial, freesans, clean, sans-serif;" ;
        


        var input_label = document.createElement("input");
        input_label.type = "button";
        //input_label.style.cssText ="background-color: #24890d;color: white;display: block;width: 15.1em;padding: 0.3em 0 0.3em 1em;";//padding: 0.3em 0 0.3em 1em;
        input_label.style.cssText = "background-color: #24890d; border: 0; border-radius: 2px; color: #fff; font-size: 12px; font-weight: 700; padding: 10px 30px 11px; text-transform: uppercase;vertical-align: bottom;"
        //var ocultar_mostrar = document.createTextNode('show/hide');
        //input_label.appendChild(ocultar_mostrar);
        //input_label.href="#";
        input_label.value ="show/hide";
        input_label.id ="toc-label";
        input_label.onclick = function(){ 


        var div_consola = document.getElementById('div_consola');
        //window.scrollTo(0,document.body.scrollHeight);
           if(div_consola.style.visibility=='visible'){


                div_consola.style.visibility = "hidden";


                }else{


                div_consola.style.visibility = "visible";


                }
        };


        div_pestana.appendChild(input_label);


 var body = document.getElementsByTagName('body')[0];
        body.appendChild(div_pestana); 
    body.style.marginLeft = "400px";


//        document.body.insertBefore(div_consola, document.body.firstChild);


        }
        /**  
        * Crea elementos HTML para manejar la edicion del recorder
        * @method createConsoleEditor   
        */
        ,createConsoleEditor: function(){
        /*Overlay*/
        var div_overlay = document.createElement("div");        
        div_overlay.id = "div_overlay";
        //div_overlay.style.cssText=" visibility: hidden;position: absolute;left: 500px;top: 200px; height:200px;text-align:center;z-index: 1000;width:300px;margin: 100px auto;background-color: #fff;border:1px solid #000;padding:15px;text-align:center;";
        div_overlay.style.cssText=" visibility: hidden ;position: absolute; left:30; bottom: 0;  right: 0; width: 300px;height: 600px; background-color: #fff;border:1px solid #000; ";


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
        //save_edit.setAttribute('class','class_button');


        //Tengo dos comporamientos en este metodo, me parece que tengo que dividirlo, espero a hacer el diseño copado del pizarron
        save_edit.onclick = function(){ 
                        console.debug('guarda');


              //Escondo el div
              el = document.getElementById("div_overlay");
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
         
          
             Recorder.refresh();      


        };


        var close_edit = document.createElement("input");
        close_edit.type = "button";
        close_edit.value = "Close";
        //close_edit.setAttribute('class','class_button');


        close_edit.onclick = function(){ 
          
           var close_edit = document.getElementById("table_edit");
               
           el = document.getElementById("div_overlay");
           el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
           
           }


                table_edit.appendChild(close_edit);
                table_edit.appendChild(save_edit);
                div_overlay.appendChild(table_edit);


        var div_consola = document.getElementById('div_consola');
       // div_consola.style.visibility = "hidden";
                div_consola.appendChild(div_overlay);


        //        var body = document.getElementsByTagName('body')[0];
        //        body.appendChild(div_consola);




        }
        /**  
        * Muestra ventana para agregar una tarea primitiva o un augmenter
        * @method addTask    
        */
        ,addTask: function() {
                //console.debug();
                var that = this;
                                var save_task = document.createElement("input");
                                save_task.type = "button";
                                save_task.value = "Save";
                                //save_task.setAttribute('class','class_button');


                                save_task.onclick = function(){ 
                                //Podria utilizar otro elemento y no el div overlay  <-- borrar                                           
                            el = document.getElementById("div_overlay");
                            el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                                var temp =  document.getElementById("table_edit");
                            var array_nodes = temp.childNodes;
                        id = localStorage.length + 1;


                        var obj1 = new Object();
                        obj1.type = array_nodes[0].childNodes[1].value;
                        obj1.xPath  = array_nodes[1].childNodes[1].value;
                        obj1.value = array_nodes[2].childNodes[1].value;
                        obj1.tipo = 0; //Tengo que traducir el Yes/No
                        var obj_value = JSON.stringify(obj1);
                               localStorage.setItem(id,obj_value);
                                that.firstChild.selected = true;
                                Recorder.refresh();
                                };
                //instancio la vista ... podria sacar de constantes los elementos basicos
                var add_task = Object.create(inflater);
                add_task.properties = [{type:'selectElement',specs:{label:"Type",choices: ['FillInputTask', 'TextAreaTask']}},
                {type:'inputElement',specs:{label:'xPath',valor:"an xPath",id:"input_xpath"}},
                {type:'inputElement',specs:{label:'Value',valor:"a value for xPath"}}
                ,{type:'selectElement',specs:{label:"Auto",choices: ['Yes', 'No']}}];        
                
                //instancio la vista ... podria sacar de constantes los elementos basicos
                var add_augmenter = Object.create(inflater);
                add_augmenter.properties = [{type:'selectElement',specs:{label:"Type",choices: ['Augmenter 1', 'Augmenter 2']}},
                {type:'inputElement',specs:{label:'xPath',valor:"an xPath"}},
                {type:'inputElement',specs:{label:'Value',valor:"a value for xPath"}}
                ,{type:'selectElement',specs:{label:"Auto",choices: ['Yes', 'No']}}];        
                
                //Agrego el augmenter aca, hacer un metodo nuevo y dividir responsabilidades
                el = document.getElementById("div_overlay");
        el.style.visibility = "visible";           
        var table_edit = document.getElementById("table_edit");


                (this.value === "1") ? view.render(table_edit, add_task.inflate()) : view.render(table_edit, add_augmenter.inflate());


                var close_edit = document.createElement("input");
                close_edit.type = "button";
                close_edit.value = "Close";
                //close_edit.setAttribute('class','class_button');


                close_edit.onclick = function(){ 
          
                   var close_edit = document.getElementById("table_edit");
               
                   el = document.getElementById("div_overlay");
                   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                    that.firstChild.selected = true;
                 };
                 //Agrego al final los dos botones
                table_edit.appendChild(save_task);
                table_edit.appendChild(close_edit);


                  var select_xpath = document.getElementById("input_xpath");


        /*        select_xpath.addEventListener('focus',function(){ var high = new Highlighter(); high.init();},true);
                select_xpath.addEventListener('blur',function(){ var high = new Highlighter(); high.stop();},true);*/
        var select_xpath = document.createElement("input");
                select_xpath.type = "button";
                select_xpath.id = "select_xpath";
                select_xpath.value = "X";
                //select_xpath.setAttribute('class','class_button');


                select_xpath.onclick = function(){ 
          
          
                  //var select_xpath = document.getElementById("select_xpath");


                          //Para ver que ande el highlighter
                  var input_xpath = document.getElementById("input_xpath");
                  // console.debug(input_xpath.parentNode);


                  console.debug('trae input_xpath');
                 var high = new Highlighter();
        
                
                 if(select_xpath.value=='X'){
                                      high.init();
                                      select_xpath.value = "-"
                                      console.debug(input_xpath);


                 }else{
                                      high.stop();
                                      select_xpath.value = "XPathEvaluator"
                 }
                 
                 };


         var input_xpath = document.getElementById("input_xpath");
        // console.debug('nananana');
         var temp = input_xpath.parentNode;


         temp.appendChild(select_xpath);
         console.debug(temp);


        //        table_edit.appendChild(select_xpath);


                //view.render(div_add, add_task.inflate());
                //div_add.appendChild(save_task);
                //div_add.appendChild(close_edit);
                
        }
        /**  
        * si bien esto es repetir codigo, por ahora lo hago asi hasta que tenga un diseño mas copado, (Ver Imagen del Pizarron)
        * Este metodo me parece que no va mas, voy a poner codigo de prueba aca
        * @method Consola.addRow    
        */
        ,addRow: function() {
        var save_edit = document.createElement("input");
                                                        save_edit.type = "button";
                                                        save_edit.value = "Save";
                                                        //Tengo dos comporamientos en este metodo, me parece que tengo que dividirlo, espero a hacer el diseño copado del pizarron
                                                        save_edit.onclick = function(){ 
                                                                        console.debug('guarda');


                                                              //Escondo el div
                                                              el = document.getElementById("div_overlay");
                                                              el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
                                                              //Traigo los datos de la tarea ( Edit o Add)
                                                              var table_edit = document.getElementById("table_edit");
                                                              var id = table_edit.rows[0].cells[1].innerHTML;
                                                               //Temp, si no tiene id creo el objeto, deberia hacerlo siempre y no usar la variable String
                                                             if(id==''){ 
                                                              console.debug('Tengo que armar el objeto json con los datos que tengo');
                                                                id = localStorage.length + 1;


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
                                                         
                                                             Recorder.refresh();      
                                                        };




                //instancio la vista ... podria sacar de constantes los elementos basicos
                var add_task = Object.create(inflater);
                add_task.properties = [{type:'inputElement',specs:{label:'texto1',valor:"value"}},
                {type:'inputElement',specs:{label:'texto2',valor:"value2"}}
                ,{type:'selectElement',specs:{label:"texto3",choices: ['Yes', 'No']}}];        
                
                
           el = document.getElementById("div_overlay");
       el.style.visibility = "visible";           
       var table_edit = document.getElementById("table_edit");


           view.render(table_edit, add_task.inflate());
                var close_edit = document.createElement("input");
                close_edit.type = "button";
                close_edit.value = "Close";
                close_edit.onclick = function(){ 
          
                   var close_edit = document.getElementById("table_edit");
               
                   el = document.getElementById("div_overlay");
                   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
           
                   }
        //table_edit.appendChild(save_edit);
                table_edit.appendChild(close_edit);
                table_edit.appendChild(save_edit);
        /*   el = document.getElementById("div_overlay");
           el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
           el.style.visibility = "visible";
               // var table_row = x.parentNode.parentNode;   
               // var string = table_row.cells[1].innerHTML;
               // var obj = JSON.parse(string);
                var table_edit = document.getElementById("table_edit");
                console.debug(table_edit);
                table_edit.rows[0].cells[1].innerHTML = "";
                table_edit.rows[1].cells[2].firstChild.value = "";
                table_edit.rows[1].cells[1].firstChild.value = "";*/
        }
        /**  
        * si bien esto es repetir codigo, por ahora lo hago asi hasta que tenga un diseño mas copado, (Ver Imagen del Pizarron)
        * @method Consola.editRow    
        */
        ,editRow: function(x) {
           el = document.getElementById("div_overlay");
           el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
          if(x == null){
           // console.debug("agrega la tarea loquillo");


          }else{
                var table_row = x.parentNode.parentNode;   
                var string = table_row.cells[1].innerHTML;
                var obj = JSON.parse(string);
                var table_edit = document.getElementById("table_edit");
                console.debug(table_edit.rows);


                table_edit.rows[0].cells[1].innerHTML = table_row.cells[0].innerHTML;
                table_edit.rows[1].cells[2].firstChild.value = table_row.cells[1].innerHTML;
                table_edit.rows[1].cells[1].firstChild.value = obj.value;
              }
        }
        /**  
        * Dispara el handler de record
        * @method clickRecord   
        */
        ,clickRecord: function(){
        
     var start_record = document.getElementById('start_record');
         if(start_record.value == "Record"){
         console.debug('empieza a grabar');
         document.addEventListener("change", eventoChange , false);   
         start_record.value = "Stop";
                 
         }else if(start_record.value == "Stop"){
         console.debug("termino de grabar");        
     start_record.value = "Record" ;
     document.removeEventListener("change", eventoChange, false); 
         }  
     
        }
        /**  
        * Para de grabar 
        * @method clickStop   
        */
        ,clickStop: function(){
         
        console.debug("termino de grabar");
    document.removeEventListener("change", eventoChange, false); 
    // document.removeEventListener("click", TESIS.registroEventoClic , false); 
     var start_record = document.getElementById('start_record');
         start_record.disabled = false;
     var stop_record = document.getElementById('stop_record');
     stop_record.disabled = true;
        }
        /**  
        * Reproduce 
        * @method clickPlay 
        */
        ,clickPlay: function(){


          console.log("Ejecuta estas tareas");


          for (var i=0;i < localStorage.length;i++){


          var key = localStorage.key(i);
                      var value = localStorage[key];


          var tasks = JSON.parse(value);


            if(tasks.type){ 
            //Tengo que saber que tipo de elemento para saber que agregar
            TESIS.Manager.addPrimitiveTask(i,tasks.type,tasks.xPath,
            tasks.value,tasks.tipo);
            }


          }


          TESIS.Manager.start();
        }
        /**  
        * Actualiza la consola con el localStorage 
        * @method refresh   
        */
        ,refresh: function(){


                  var table_consola = document.getElementById("table_consola");
  
                  while(table_consola.hasChildNodes())
                  {
                    table_consola.removeChild(table_consola.firstChild);
                  }


                  for (var i=0;i < localStorage.length;i++){
                  
                    var key = localStorage.key(i);
                    var value = localStorage[key];
                //Saco solamente el tipo, despues lo puedo sacar por el localStorage <-- borrar
                        
                        var concept = JSON.parse(value).type;


                    //this.writer(key,value,-1);
                    this.writer(key,concept,-1);
                  }


        }
        /**  
        * Escribe en la consola
        * @method writer 
        */
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
                delete_button.setAttribute('class','class_button');


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
                //edit_button.setAttribute('class','class_button');
                edit_button.onclick = function(){
                Recorder.editRow(this);
                };


/*                var add_button = document.createElement('input');
                add_button.type = "button";
                add_button.value = "A";
                add_button.onclick = function(x){
                var id = this.parentNode.parentNode.id;
                var row = this.parentNode.parentNode.sectionRowIndex;
                document.getElementById('table_consola').insertRow(row+1);
                console.debug("agrega tarea!!!");
                Recorder.addRow(null);


                };*/
                var id_text = document.createTextNode(id);


                td1.appendChild(id_text);
                td2.appendChild(text1);
                //td3.appendChild(add_button);
                td4.appendChild(edit_button);
                td5.appendChild(delete_button);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                }
        /**
        * @method lookupElementByXPath
        */
        ,lookupElementByXPath: function (path) { 
           var evaluator = new XPathEvaluator(); 
           var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null); 
           return  result.singleNodeValue; 
        }
        /**
        * @method createXPathFromElement        
        */
        ,createXPathFromElement: function(elm) { 
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
        } 
        ,init: function(){
        this.createRecorder();
        this.createConsoleEditor();
        //this.registraEventos();
        Recorder.refresh();


        }
  }


        /**
        * @class selectElement
        */
        var selectElement = {
        specs:{}
        ,render: function(){
                var div_select = document.createElement('div');
                var label = document.createTextNode(this.specs.label);
            div_select.appendChild(label);
                var input = document.createElement('select');
                  var len = this.specs.choices.length;
                  for (var i = 0; i < len; i++) {
                      var option = document.createElement('option');
                      option.text = this.specs.choices[i];
                      option.value = this.specs.choices[i];
                      input.appendChild(option);
                  }
                    div_select.appendChild(input);


                  return div_select;
        }
        }


        /**
        * @class inputElement
        */


        var inputElement = {
        specs:{}
        ,render: function(){
                //console.debug(this.specs);
                var div_input = document.createElement('div');


                var label = document.createTextNode(this.specs.label);
            div_input.appendChild(label);
                var input = document.createElement('input');
            input.type = 'text';
            input.id = this.specs.id;
            input.value = this.specs.valor;
            div_input.appendChild(input);


            return div_input;
        }
        }
        /**
        * @class view
        */
        var view = {
              render: function(target, elements) {
                      target.innerHTML = "";
                  for (var i = 0; i < elements.length; i++) {
                      target.appendChild(elements[i].render());
                  }
              }
        };


        /**
        * @class inflater
        */
var inflater = {
        properties:[]
        ,elements:[]
        ,inflate: function(){


                this.elements = [];
                for (var i = 0; i < this.properties.length; i++) {
                        //console.debug(i);
                        //console.debug(this.properties[i].type);
                        obj_text = this.properties[i].type;


                        var lookup = { inputElement: Object.create(inputElement)
                                    , selectElement: Object.create(selectElement)
                     } , def = null ;


                    var x = lookup[obj_text] ? lookup[obj_text] : null;
                    x.specs = this.properties[i].specs;


             this.elements.push(x);  
              }


        return this.elements;
        }
}
//Highlighting




function Highlighter(){
//Create a variable that reminds the background color of the trigger element.
this.reminder = '';
}
//Highlight the trigger element on the page.
Highlighter.prototype.highlight = function(event)
{
    this.reminder = event.target.style.backgroundColor;
    event.target.style.backgroundColor = "rgba(255, 255, 0, 0.25)";
    event.target.style.outline = "0.25em solid #FFFF00";
}


//Create the tooltip.
Highlighter.prototype.createTooltip = function (event){
    //console.log("createTooltip() starts.");


    //console.log("The tooltip is generate.");


    var tooltip = document.createElement("div");
    
    //console.log("The tooltip styles are defined.");
    
    tooltip.id = "Tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.top = "0em";
    tooltip.style.right = "0em";
    tooltip.style.padding = "10px";
    tooltip.style.fontFamily = "Arial";
    tooltip.style.fontSize = "large";
    tooltip.style.fontWeight = "bold";
    tooltip.style.color = "#FCFCFC";
    tooltip.style.textAlign = "center";
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.50)";
    tooltip.style.zIndex = "100";
    
    //console.log("The tooltip text is set.");
    
    tooltip.innerHTML = event.target.tagName.toLowerCase().toString();
    
    if(event.target.id != "")
    {
        tooltip.innerHTML = tooltip.innerHTML + "#" + event.target.id;
    }
    
    //Get an error when trying to retrieve all elements of a same class.
    if(event.target.className != "")
    {
        var classes = event.target.className.split(" ");
    
        classes.forEach(
            function (aclass)
            {     
                //Error: The node list of getElementsByClassName() is always undefined.
                tooltip.innerHTML = tooltip.innerHTML + "." + aclass + "(" + document.getElementsByClassName(aclass).lenght + ")";
            }
        );
    }
    
    //console.log("The tooltip is returned.");
    
    return tooltip;
}






//Remove the highlight on the previous selected element.
Highlighter.prototype.init = function ()
{
//Setup a global event for onmouseover.
//console.log("Global handlers are set.");


document.onmouseover = mouseoverHandler;
document.onmouseout = mouseoutHandler;
document.onclick = onClickHandler;


//console.log("Script ends.");
}
//Remove the highlight on the previous selected element.
Highlighter.prototype.stop = function ()
{
//Setup a global event for onmouseover.
//console.log("Global handlers are set.");
document.onmouseover = null;
document.onmouseout = null;
document.onclick = null;


//console.log("Script ends.");
}


//Creates a function to handle the global event.
var mouseoverHandler = function (event)
{
    //console.log("mouseover event is trigger.");


    //console.log("highlight() is called.");    
    var high = new Highlighter();
   high.highlight(event);
    
    //console.log("createTooltip() is called and the callback is append to the event target.");
    
    event.target.appendChild(high.createTooltip(event));
}
//Remove the highlight on the previous selected element.
var mouseoutHandler = function (event)
{
    //console.log("mouseout event is trigger.");
    var high = new Highlighter();
    var tooltip = document.getElementById("Tooltip");


    event.target.removeChild(tooltip);


    event.target.style.backgroundColor = high.reminder;
    event.target.style.outline = "none";
}
   


//Remove the highlight on the previous selected element.
var onClickHandler = function (event)
{
    console.log("onClick event is trigger.");
    var xPath = Recorder.createXPathFromElement(event.target) ;
    var el = document.getElementById("input_xpath");
    el.value = xPath;


    console.debug(xPath);
}








//Inicia el Recorder
  Recorder.init();
};
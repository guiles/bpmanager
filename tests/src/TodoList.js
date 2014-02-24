/**
 * Representa una tarea de la lista de tareas.
 * @param title el título de la tarea
 * @constructor
 */
function Task(title) {
    this.title = title;
    this.alreadyDone = false;
}
 
Task.prototype.isDone = function() {
    return this.alreadyDone;
};
 
Task.prototype.done = function() {
    this.alreadyDone = true;
};
 
 var a = {
   title: 'Hello'
  ,alreadyDone:'A'
  ,isDone: function(){
    console.log('soy el objeto a');
  }

 };
/**
 * Representa una lista de tareas.
 * Puede tener varias tareas, cada una de las cuales estará terminada o pendiente.
 * @constructor
 */
function TodoList() {
    this.tasks = [];
}
 
TodoList.prototype.isEmpty = function() {
    return this.tasks.length === 0;
};
 
TodoList.prototype.addTask = function(title) {
    this.tasks.push(new Task(title));
};
 
TodoList.prototype.size = function() {
    return this.tasks.length;
};
 
TodoList.prototype.task = function(taskIndex) {
    return this.tasks[taskIndex];
};
 
TodoList.prototype.removeTask = function(taskIndex) {
    return this.tasks.splice(taskIndex, 1);
};


//Creo Clase
function Calculadora(){
  this.first = 'Hello';
  this.second = 'World';
};

Calculadora.prototype.sum = function(x, y){
    return x + y;
  };

/*var a = new Calculadora();
console.log(a);
console.log(a.sum(2,4));*/
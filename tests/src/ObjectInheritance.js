
//Testing Objects inheritance
var a = {
	a: 1 //propiedades
	,hi: function (str){ //metodos
		return 'hi'+str;
	}
}; 
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
//console.log(b.a); // 1 (inherited)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null
console.debug(c); 
console.debug(c.hi('guachin')); 


var d = Object.create(null);
// d ---> null
//console.log(d.hasOwnProperty); // undefined, because d doesn't inherit from Object.prototype
var Q = require("q");

/*var first = function (a) {
    var d = Q.defer();
    console.log('First one>>' + a);
//    setTimeout(d.resolve, 1000);
   var c=[];
   var a=12;
   var b=10;
   c[0]=a+b;
   c[1]=a-b;
   console.log("c value1>>"+c[0]);
   console.log("c value2>>"+c[1]);
    d.resolve(c);
	console.log("d.promise value>>"+d.promise);
    return d.promise;
};

var second = function (value) {
    console.log("In second>>>" + value[0]);
    var d = Q.defer();
	var testarray=[];
	var a=20;
	var b=10;
		testarray[0]=a+b;
		testarray[1]=a-b;
		testarray[2]=a*b;
		testarray[3]=a%b;
	 setTimeout(function() {
			d.resolve(testarray);
			}, 3000);
   console.log("promise value"+d.promise);
    return d.promise;
};

// This fuction throws an error which later on we show will be handled
var third = function (value3) {
    var d = Q.defer();
    console.log('Third one1>>>' + value3[0]);
	console.log('Third one2>>>' + value3[1]);
	console.log('Third one3>>>' + value3[2]);
	console.log('Third one4>>>' + value3[3]);
	var a={"testone":1,"testtwo":"abc"};
  console.log("a stringfyvalue"+a);
	console.log("a stringfyvalue"+JSON.stringify(a));
  console.log("promise value"+d.promise);

	d.resolve(a);
	return d.promise;
//    throw new Error('Awww sheeeeiiiit');
};

// This function will not be reached because the previous one is going to fall over.
var fourth = function (value4) {
    var d = Q.defer();
    console.log('Fourth one1>>'+value4.testone);
	console.log('Fourth one2>>'+value4.testtwo);
    setTimeout(d.resolve, 2500);
    return d.promise;
};

first(10)
    .then(second)
    .then(third)
    .then(fourth, function (error) {
        console.log('Something went wrong in 1-3: ' + error.message);
    })
// We are not returning the promise chain, so we need to call done() to ensure unhandled errors are rethrown
   // .done();*/
/*console.log('1');
function dieToss() {
  var d = Q.defer(); 
 /*d.resolve(Math.floor(Math.random() * 6) + 1);
 return d.promise;
 var c=[];
   var a=12;
   var b=10;
   c[0]=a+b;
   c[1]=a-b;
   console.log("c value1>>"+c[0]);
   console.log("c value2>>"+c[1]);
    d.resolve(c);
  console.log("d.promise value>>"+d.promise);
    return d.promise;

}
console.log('2');
dieToss().then(function(toss){
   console.log("value of tosss..."+toss);

});
console.log('3');*/
var getname = function(name){
    var d = Q.defer();
     d.resolve(name);
   return d.promise;
}
var printname = function(printnumber,res){
   console.log("Number "+printnumber);
   var x= res;
   console.log("return value:",x);
}
//printname(6,getname);
getname("monu").then(printname)
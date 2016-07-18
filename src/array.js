
(function(){

var methods = {

    each: function(fn){
        Array.prototype.forEach.call(this, fn);
        return this;
    }
};

Array.prototype.implement(methods);

})();

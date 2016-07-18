
(function(){

    // NAB

    var nab = function() {

    }

    var $ = function(selector) {
        // figure out how to decipher between a selector for a single element vs array
        // var elements = typeof selector == 'string' ? document.querySelectorAll(selector) : selector;
        var elements = typeof selector == 'string' ? document.querySelector(selector) : selector;
        return elements;
    }

    var $$ = function(selector) {
        var elements = typeof selector == 'string' ? document.querySelectorAll(selector) : selector;
        return Array.prototype.slice.call(elements);
    }

    Object.prototype.implement = function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (!this[prop]) {
                    this[prop] = obj[prop];
                } else {
                    console.log(prop + ' exists on this native type');
                }
            }
        }
    }

    window.$ = $;
    window.$$ = $$;
    window.nab = new nab();

})();


(function(){

    // Utils

    var extend = function (obj, props) {
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                if (obj[prop]) alert(prop + ' is already on the native Element object');
                obj[prop] = props[prop];
            }
        }
    }

    var classes = function(className){
        var classNames = (className || '').replace(/\s+/g, ' ').trim().split(' ');
        var uniques = {};
        return classNames.filter(function(className){
            if (className !== '' && !uniques[className]) return uniques[className] = className;
        });
    }

    var collectionHas = function(a, b) {
        for (var i = 0, len = a.length; i < len; i ++) {
            if (a[i] == b) return true;
        }
        return false;
    }

    // CONSTRUCTOR

    var nab = function(selector){
        var elements = typeof selector == 'string' ? document.querySelector(selector) : selector;
        // var elements = typeof selector == 'string' ? document.querySelectorAll(selector) : selector;
        return elements;

        // if (elements) {
        //     elements = typeof elements !== 'string' && !elements.nodeType && typeof elements.length !== 'undefined' ? elements : [elements];
        //     this.length = elements.length
        //     for (var i = 0; i < elements.length; i++) this[i] = elements[i]
        // }

    };

    var $$ = function(selector){
        var elements = typeof selector == 'string' ? document.querySelectorAll(selector) : selector;
        return Array.prototype.slice.call(elements);
    };


    // Nab Methods

    var methods = {

        // DOM WALKERS

        first: function (selector) {
            var matches = this.querySelectorAll(selector || '*');
            // console.log(matches);
            return matches ? matches[0] : null;
        },

        // find: function(selector) {
        find: function (selector) {
            var matches = this.querySelectorAll(selector);
            return matches && matches.length ? Array.prototype.slice.call(matches) : null;
        },

        kids: function(selector) {
            // var matches = this.relative('children', selector);
            // return matches && matches.length ? Array.prototype.slice.call(matches) : null;

            return this.relative('children', selector);
        },

        previous: function (selector) {
            return this.relative('previousSibling', selector);
        },

        next: function (selector) {
            return this.relative('nextSibling', selector);
        },

        parent: function(selector) {
            return this.relative('parentNode', selector);
        },

        relative: function (type, selector) {
            var relative = this[type];
            if (selector) {
                var all = document.querySelectorAll(selector);
                while ((relative = relative[type]) && !collectionHas(all, relative));
            }

            return relative && relative.length ? Array.prototype.slice.call(relative) : (relative || null);
            // return relative;
        },

        // SIZE & POSITION
        
        width: function(){
            return this.offsetWidth;
        },

        height: function(){
            return this.offsetHeight;
        },

        getSize: function(){
            return {
                width: this.width(),
                height: this.height()
            };
        },

        destroy: function(){
            this.parent().removeChild(this);
        },

        // EVENTS

        on: function (eventName, selector, fn) {
            if (arguments.length != 3) {
                var fn = selector;
            }

            if (typeof selector == 'string') {
                // delegation
                this.addEventListener(eventName, function(event) {
                    var possibleTargets = this.querySelectorAll(selector);
                    var target = event.target;

                    for (var i = 0, l = possibleTargets.length; i < l; i++) {
                        var el = target;
                        var p = possibleTargets[i];

                        while (el && el !== this) {
                            if (el === p) {
                                return fn.call(p, event);
                            }

                            el = el.parentNode;
                        }
                    }
                });
            } else {
                this.addEventListener(eventName, fn);
            }
        },

        // off
        // fire


        // MANIPULATION

        html: function(value, text) {
            var prop = text ? ('innerText' in document.createElement('div') ? 'innerText' : 'textContent') : 'innerHTML';

            if (value) {
                this[prop] = typeof value == 'function' ? value(this[prop]) : value;
                return this;
            } else {
                return this[prop];
            }
        },

        text: function(value) {
            return this.html(value, true);
        },

        data: function(name, value){
            // will probably need to add camelize for multi hyphen data attributes
            if (value) {
                this.dataset[name] = value;
                return this;
            } else {
                return this.dataset[name];
            }
        },

        hasClass: function (className) {
            return this.classList.contains(className);
        },

        addClass: function (className) {
            classes(className).forEach(function(name){
                this.classList.add(name);
            }, this);
            return this;
        },

        removeClass: function (className) {
            classes(className).forEach(function(name){
                this.classList.remove(name);
            }, this);
            return this;
        },

        toggleClass: function (className, force) {
            if (force == null) force = !this.hasClass(className);
            return (force) ? this.addClass(className) : this.removeClass(className);
        },

        // DISPLAY TOGGLERS

        show: function (type) {
            this.style.display = type || '';
            return this;
        },

        hide: function () {
            this.style.display = 'none';
            return this;
        },

        toggle: function (callback, type) {
            type = type || '';
            callback = callback || function(){};
            return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : type;
                callback.call(el);
            });
        }
    };

    Array.prototype.each = function(fn){
        Array.prototype.forEach.call(this, fn);
        return this;
    }

    var arrMethods = ['html', 'text', 'data', 'addClass', 'removeClass', 'toggleClass', 'show', 'hide', 'toggle'];
    arrMethods.forEach(function(method){
        Array.prototype[method] = function(){
            var args = arguments;
            this.forEach(function(item){
                item[method].apply(item, args);
            });
            return this;
        }
    });

    extend(Element.prototype, methods);
    extend(HTMLDocument.prototype, {
        on: methods['on'],
        id: function(id){
            return document.getElementById(id);
        }
    });

    window.on = methods['on'];
    window.$ = nab;
    window.nab = nab;
    window.$$ = $$;

})();

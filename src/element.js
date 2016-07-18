
(function(){

    // UTILS

    var classes = function(className) {
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

    var includes = function(arr, item){
        return arr.indexOf(item) != -1;
    }


    // ELEMENT METHODS

    var elementMethods = {

        // DOM WALKERS

        first: function(selector) {
            var matches = this.querySelectorAll(selector || '*');
            return matches ? matches[0] : null;
        },

        find: function(selector) {
            var matches = this.querySelectorAll(selector);
            return matches ? Array.prototype.slice.call(matches) : null;
        },

        kids: function(selector) {
            return this.relative('children', selector);
        },

        previous: function(selector) {
            return this.relative('previousSibling', selector);
        },

        next: function(selector) {
            return this.relative('nextSibling', selector);
        },

        parent: function(selector) {
            return this.relative('parentNode', selector);
        },

        relative: function(type, selector) {
            var relative = this[type];
            if (selector) {
                var all = document.querySelectorAll(selector);
                while ((relative = relative[type]) && !collectionHas(all, relative));
            }

            return relative && relative.length ? Array.prototype.slice.call(relative) : (relative || null);
        },

        // SIZE COORDINATES & POSITION

        width: function() {
            return this.offsetWidth;
        },

        height: function() {
            return this.offsetHeight;
        },

        size: function() {
            return {
                width: this.width(),
                height: this.height()
            };
        },

        offset: function() {
            var rect = this.getBoundingClientRect();
            return {
                left: rect.left + document.body.scrollLeft,
                top: rect.top + document.body.scrollTop
            };
        },

        position: function() {
            return {
                left: this.offsetLeft,
                top: this.offsetTop
            };
        },


        // EVENTS

        on: function(eventName, selector, fn) {
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


        // DOM MANIPULATION

        html: function(value, text) {
            var prop = text ? 'textContent' : 'innerHTML';

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
            name = name.camelCase();
            // name = hyphenatedToCamelCase(name);

            if (value) {
                this.dataset[name] = value;
                return this;
            } else {
                return this.dataset[name];
            }
        },

        clone: function() {
            return this.cloneNode(true);
        },

        destroy: function() {
            this.parent().removeChild(this);
        },

        before: function(html) {
            this.insertAdjacentHTML('beforebegin', html);
            return this;
        },

        after: function(html) {
            this.insertAdjacentHTML('afterend', html);
            return this;
        },

        prepend: function(el) {
            var parent = this.parent();
            parent.insertBefore(el, parent.firstChild);
            return this;
        },

        append: function(el) {
            this.parent().appendChild(el);
            return this;
        },

        empty: function() {
            this.innerHTML = '';
            return this;
        },

        attribute: function(attr, value) {
            if (value) {
                this.setAttribute(attr, value);
                return this;
            } else {
                return this.getAttribute(attr);
            }
        },

        css: function(prop, value) {
            prop = prop.camelCase();
            // prop = hyphenatedToCamelCase(prop);

            if (value && typeof value == 'string') {
                this.style[prop] = value;
                return this;
            } else {
                return getComputedStyle(this)[prop];
            }
        },

        hasClass: function(className) {
            return this.classList.contains(className);
        },

        addClass: function(className) {
            classes(className).forEach(function(name){
                this.classList.add(name);
            }, this);
            return this;
        },

        removeClass: function(className) {
            classes(className).forEach(function(name){
                this.classList.remove(name);
            }, this);
            return this;
        },

        toggleClass: function(className, force) {
            if (force == null) force = !this.hasClass(className);
            return (force) ? this.addClass(className) : this.removeClass(className);
        },

        // DISPLAY TOGGLERS

        show: function(type) {
            this.style.display = type || '';
            return this;
        },

        hide: function() {
            this.style.display = 'none';
            return this;
        },

        toggle: function(callback, type) {
            type = type || '';
            callback = callback || function(){};
            return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : type;
                callback.call(el);
            });
        }
    };


    // ARRAY ELEMENT METHODS
    var eachMethods = ['html', 'text', 'css', 'data', 'attribute', 'empty', 'destroy', 'hasClass', 'addClass', 'removeClass', 'toggleClass', 'show', 'hide', 'toggle'];
    var mappableMethods = ['html', 'text', 'css', 'data', 'hasClass', 'attribute'];

    eachMethods.forEach(function(method){
        Array.prototype[method] = function(){
            var args = arguments;

            if (includes(mappableMethods, method) && args.length == 1) {
                return this.map(function(item){
                    return item[method].apply(item, args);
                });

            } else {
                this.forEach(function(item){
                    item[method].apply(item, args);
                });
                return this;
            }
        }
    });

    Element.prototype.implement(elementMethods);
    HTMLDocument.prototype.implement({
        on: elementMethods.on,
        id: function(id){
            return document.getElementById(id);
        }
    });

    window.on = elementMethods.on;

})();

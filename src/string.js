
(function(){

var methods = {

    contains: function(string, index) {
        return (index ? this.slice(index) : this).indexOf(string) > -1;
    },

    test: function(regex, params) {
        return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
    },

    clean: function() {
        return this.replace(/\s+/g, ' ').trim();
    },

    camelCase: function() {
        return this.hyphenate().replace(/[-_]\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
    },

    hyphenate: function() {
        return this.trim()
            .toLowerCase()
            .replace(/_/g, ' ')             // Replace underscores spaces
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-');        // Replace multiple - with single -
    },

    capitalize: function() {
        return this.replace(/\b[a-z]/g, function(match){
            return match.toUpperCase();
        });
    }

};

String.prototype.implement(methods);

})();

window.Wine = Backbone.Model.extend({
    urlRoot: 'api/wines',

    initialize: function () {
        var checkValidity = function(value, msg) {
            var result = {isValid: true};
            if (value.length <= 0) {
                result.isValid = false;
                result.message = msg;
            }
            return result;
        };

        this.validators = {
            name: function (value) {
                return checkValidity(value, 'You must enter a name');
            },
            grapes: function (value) {
                return checkValidity(value, 'You must enter a grape variety');
            },
            country: function (value) {
                return checkValidity(value, 'You must enter a country');
            }
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {
        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        id: null,
        name: '',
        grapes: '',
        country: 'USA',
        region: 'California',
        year: '',
        description: '',
        picture: null
    }
});

window.WineCollection = Backbone.Collection.extend({
    model: Wine,
    url: 'api/wines'
});

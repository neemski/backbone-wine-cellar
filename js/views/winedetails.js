window.WineView = Backbone.View.extend({
    events: {
        'change': 'handleChange',
        'click .save': 'beforeSave',
        'click .delete': 'deleteWine',
        'change .image-upload': 'uploadImage'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        var templateData = this.model.toJSON();
        var canDelete = true;
        var secondaryLabel = 'Delete';

        if (this.model.isNew()) {
            canDelete = false;
            secondaryLabel = 'Cancel';
        }

        templateData.canDelete = canDelete;
        templateData.secondaryLabel = secondaryLabel;

        var el = this.template(templateData);
        $(this.el).html(el);

        return this;
    },

    handleChange: function(event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function() {
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        // Upload picture file if a new file was dropped in the drop area
        if (this.pictureFile) {
            this.model.set('picture', this.pictureFile.name);
            utils.uploadFile(this.pictureFile, _.bind(function() {
                this.saveWine();
            }, this));
        } else {
            this.saveWine();
        }
        return false;
    },

    saveWine: function() {
        this.model.save(null, {
            success: _.bind(function(model) {
                this.render();
                app.navigate('wines/' + model.id, false);
                utils.showAlert('Success!', 'Wine saved successfully', 'alert-success');
            }, this),
            error: function() {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteWine: function() {
        this.model.destroy({
            success: function() {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    uploadImage: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        this.pictureFile = e.target.files[0];

        // Read the image file from the local file system and display it in the
        // img tag.
        var reader = new FileReader();
        reader.onloadend = function() {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }
});

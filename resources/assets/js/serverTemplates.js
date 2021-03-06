var app = app || {};

(function ($) {
    var SUCCESSFUL = 0;
    var UNTESTED   = 1;
    var FAILED     = 2;
    var TESTING    = 3;

    // FIXME: This seems very wrong
    $('#server_template').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var modal = $(this);
        var title = Lang.get('servers.create');

        $('.btn-danger', modal).hide();
        $('.callout-danger', modal).hide();
        $('.has-error', modal).removeClass('has-error');
        $('.label-danger', modal).remove();
        $('#add-server-command', modal).hide();

        if (button.hasClass('btn-edit')) {
            title = Lang.get('servers.edit');
            $('.btn-danger', modal).show();
        } else {
            $('#server_template_id').val('');
            $('#server_template_name').val('');
            $('#server_template_address').val('');
            $('#server_template_port').val('22');
            $('#add-server-command', modal).show();
        }

        modal.find('.modal-title span').text(title);
    });

    // FIXME: This seems very wrong
    $('#server_template button.btn-delete').on('click', function (event) {
        var target = $(event.currentTarget);
        var icon = target.find('i');
        var dialog = target.parents('.modal');

        icon.addClass('fa-refresh fa-spin').removeClass('fa-trash');
        dialog.find('input').attr('disabled', 'disabled');
        $('button.close', dialog).hide();

        var serverTemplate = app.ServerTemplates.get($('#server_template_id').val());

        serverTemplate.destroy({
            wait: true,
            success: function(model, response, options) {
                dialog.modal('hide');
                $('.callout-danger', dialog).hide();

                icon.removeClass('fa-refresh fa-spin').addClass('fa-trash');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');
            },
            error: function() {
                icon.removeClass('fa-refresh fa-spin').addClass('fa-trash');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');
            }
        });
    });

    // FIXME: This seems very wrong
    $('#server_template button.btn-save').on('click', function (event) {
        var target = $(event.currentTarget);
        var icon = target.find('i');
        var dialog = target.parents('.modal');

        icon.addClass('fa-refresh fa-spin').removeClass('fa-save');
        dialog.find('input').attr('disabled', 'disabled');
        $('button.close', dialog).hide();

        var server_template_id = $('#server_template_id').val();

        if (server_template_id) {
            var serverTemplate = app.ServerTemplates.get(server_template_id);
        } else {
            var serverTemplate = new app.ServerTemplate();
        }

        serverTemplate.save({
            name:         $('#server_template_name').val(),
            ip_address:   $('#server_template_address').val(),
            port:         $('#server_template_port').val(),
            add_commands: $('#server_commands').is(':checked')
        }, {
            wait: true,
            success: function(model, response, options) {
                dialog.modal('hide');
                $('.callout-danger', dialog).hide();

                icon.removeClass('fa-refresh fa-spin').addClass('fa-save');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');

                if (!server_template_id) {
                    app.ServerTemplates.add(response);
                }
            },
            error: function(model, response, options) {
                $('.callout-danger', dialog).show();

                var errors = response.responseJSON;

                $('.has-error', dialog).removeClass('has-error');
                $('.label-danger', dialog).remove();

                $('form input', dialog).each(function (index, element) {
                    element = $(element);

                    var name = element.attr('name');

                    if (typeof errors[name] !== 'undefined') {
                        var parent = element.parents('div.form-group');
                        parent.addClass('has-error');
                        parent.append($('<span>').attr('class', 'label label-danger').text(errors[name]));
                    }
                });

                icon.removeClass('fa-refresh fa-spin').addClass('fa-save');
                $('button.close', dialog).show();
                dialog.find('input').removeAttr('disabled');
            }
        });
    });


    app.ServerTemplate = Backbone.Model.extend({
        urlRoot: '/admin/servers'
    });

    var ServerTemplates = Backbone.Collection.extend({
        model: app.ServerTemplate,
        comparator: function(serverA, serverB) {
            if (serverA.get('name') > serverB.get('name')) {
                return -1; // before
            } else if (serverA.get('name') < serverB.get('name')) {
                return 1; // after
            }

            return 0; // equal
        }
    });

    app.ServerTemplates = new ServerTemplates();

    app.ServerTemplatesTab = Backbone.View.extend({
        el: '#app',
        events: {

        },
        initialize: function() {
            this.$list = $('#server_template_list tbody');

            $('#no_server_templates').show();
            $('#server_template_list').hide();

            this.listenTo(app.ServerTemplates, 'add', this.addOne);
            this.listenTo(app.ServerTemplates, 'reset', this.addAll);
            this.listenTo(app.ServerTemplates, 'remove', this.addAll);
            this.listenTo(app.ServerTemplates, 'all', this.render);

            app.listener.on('serverTemplate:REBELinBLUE\\Deployer\\Events\\ModelChanged', function (data) {
                var serverTemplate = app.ServerTemplates.get(parseInt(data.model.id));

                if (serverTemplate) {
                    serverTemplate.set(data.model);
                }
            });

            app.listener.on('serverTemplate:REBELinBLUE\\Deployer\\Events\\ModelCreated', function (data) {
                if (parseInt(data.model.project_id) === parseInt(app.project_id)) {
                    app.ServerTemplates.add(data.model);
                }
            });

            app.listener.on('serverTemplate:REBELinBLUE\\Deployer\\Events\\ModelTrashed', function (data) {
                var serverTemplate = app.Servers.get(parseInt(data.model.id));

                if (serverTemplate) {
                    app.ServerTemplates.remove(serverTemplate);
                }
            });
        },
        render: function () {
            if (app.ServerTemplates.length) {
                $('#no_server_templates').hide();
                $('#server_template_list').show();
            } else {
                $('#no_server_templates').show();
                $('#server_template_list').hide();
            }
        },
        addOne: function (serverTemplate) {
            var view = new app.ServerTemplateView({
                model: serverTemplate
            });

            this.$list.append(view.render().el);
        },
        addAll: function () {
            this.$list.html('');
            app.ServerTemplates.each(this.addOne, this);
        }
    });

    app.ServerTemplateView = Backbone.View.extend({
        tagName:  'tr',
        events: {
            'click .btn-test': 'testConnection',
            'click .btn-edit': 'editServerTemplate'
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

            this.template = _.template($('#server-template').html());
        },
        render: function () {
            var data = this.model.toJSON();

            data.status_css = 'primary';
            data.icon_css   = 'question';
            data.status     = Lang.get('servers.untested');

            if (parseInt(this.model.get('status')) === SUCCESSFUL) {
                data.status_css = 'success';
                data.icon_css   = 'check';
                data.status     = Lang.get('servers.successful');
            } else if (parseInt(this.model.get('status')) === TESTING) {
                data.status_css = 'warning';
                data.icon_css   = 'spinner fa-pulse';
                data.status     = Lang.get('servers.testing');
            } else if (parseInt(this.model.get('status')) === FAILED) {
                data.status_css = 'danger';
                data.icon_css   = 'warning';
                data.status     = Lang.get('servers.failed');
            }

            this.$el.html(this.template(data));

            return this;
        },
        editServerTemplate: function() {
            // FIXME: Sure this is wrong?
            $('#server_template_id').val(this.model.id);
            $('#server_template_name').val(this.model.get('name'));
            $('#server_template_address').val(this.model.get('ip_address'));
            $('#server_template_port').val(this.model.get('port'));
        },
        testConnection: function() {
            if (parseInt(this.model.get('status')) === TESTING) {
                return;
            }

            this.model.set({
                status: TESTING
            });

            var that = this;
            $.ajax({
                type: 'POST',
                //url: '/projects/' + this.model.get('project_id') + this.model.urlRoot + '/' + this.model.id + '/test'
                url: this.model.urlRoot + '/' + this.model.id + '/test'
            }).fail(function (response) {
                that.model.set({
                    status: FAILED
                });
            });
        }
    });
})(jQuery);

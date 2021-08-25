function KanbanTaskSettings(limits) {
    this.limits = limits;
}

KanbanTaskSettings.prototype.init = function () {
    var $html_template = '<span class="js-maximum-tasks-wrapper gray bold" style="display: none"> / \n' +
            '<span class="js-maximum-tasks-number">&infin;</span>\n' +
            '<input type="text" class="smallest js-maximum-tasks-input" style="display: none">\n' +
        '</span>',
        limits = this.limits;

    $('.t-kanban__list').each(function (indx, el) {
        var $kanban_list = $(el),
            status_id = $kanban_list.find('.t-kanban__list__body').data('kanban-list-status-id'),
            $count_list = $kanban_list.find('.t-kanban__list__count'),
            $new_block = $count_list.after($html_template).siblings('.js-maximum-tasks-wrapper');

        $new_block.find('.js-maximum-tasks-input').attr('name', 'task_limit[' + status_id + ']').data('status-id', status_id);

        if (status_id in limits) {
            $new_block.find('.js-maximum-tasks-number').html(limits[status_id]['limit']);
            if ($count_list.html() > limits[status_id]['limit']) {
                $kanban_list.css('background-color', '#fcc');
            }
        }
        $new_block.show();
    });

    $('.js-maximum-tasks-number').dblclick(function () {
        $(this).hide();
        $(this).siblings('.js-maximum-tasks-input').show().focus();
    });

    $('.js-maximum-tasks-input').keypress(function (e) {
        if (e.which === 13) {
            var $that = $(this),
                url = '?plugin=releases&module=kanban&action=limitSave',
                status_id = $('div[data-kanban-list-status-id="' + $that.data('status-id') + '"]').data('kanban-list-status-id');

            $.post(url, { status_id: status_id, limit: $that.val() })
                .done(function (r) {
                    $that.siblings('.js-maximum-tasks-number').html($that.val()).show();
                    var $kanban_list = $that.parents('.t-kanban__list');

                    if ($kanban_list.find('.t-kanban__list__count').html() > $that.val()) {
                        $kanban_list.css('background-color', '#fcc');
                    }
                    $that.hide();
                })
                .error(function (r) {
                    console.log(r);
                });
        }
    });
};

function KanbanTaskColor(task_id) {
    this.task_id = task_id;
}

KanbanTaskColor.prototype.setColor = function () {
    var $task_wrapper = $('.t-kanban__list__body__item[data-task-id="' + this.task_id + '"]'),
        task_color = $task_wrapper.find('.t-releases-plugin-task-color-setting').data('kanban-task-color').toString();
    if (task_color.length) {
        if (task_color.startsWith('t-')) {
            $task_wrapper.removeClass('t-blue t-white t-gray t-yellow t-green t-red t-purple').addClass(task_color).css('background-color', '');
        } else {
            $task_wrapper.css('background-color', '#' + task_color);
        }
    }
};

$(window).load(function() {
    $('body').on('click', '.kanban-task-link', function () {
        var url = '?plugin=releases&module=kanban&action=settings',
            $kanban_task_link = $(this),
            task_id = $kanban_task_link.data('kanban-task-id');

        $.post(url, {id: task_id})
            .done(function (html) {
                $.waDialog({
                    html: html,
                    onOpen: function($dialog, dialog) {
                        $dialog.on("change", 'input[name="kanban_task_settings[color]"]', function() {
                            $dialog.find('input[name="kanban_task_settings[custom_color]"]').val('');
                        });

                        var $form = $dialog.find('form');
                        $form.on('submit', function(event) {
                            event.preventDefault();
                            var $loading = $dialog.find('.t-loading');

                            $loading.show();
                            $.post($form.attr('action'), $form.serialize(), 'json')
                                .done(function (r) {
                                    if (r.data.status) {
                                        var $wrapper_kanban_task = $kanban_task_link.parent('.t-releases-plugin-task-color-setting'),
                                            $colorbox = $dialog.find('.t-project-settings-colorbox');
                                        $kanban_task_link.parents('.t-kanban__list__body__item').removeClass($colorbox.data('colors'));
                                        $wrapper_kanban_task.data('kanban-task-color', r.data.new_color);
                                        var kanban_task_color = new KanbanTaskColor(task_id);
                                        kanban_task_color.setColor();
                                    } else {
                                        console.log(r);
                                    }
                                })
                                .always(function () {
                                    $loading.hide();
                                    dialog.close();
                                });
                        });
                    },
                });
            })
            .error(function (r) {
                console.log(r);
            });
        return false;
    });
});


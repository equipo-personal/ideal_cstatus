<?php

/**
 * Ejemplo de un hook para agregar un ítem al menú de navegación de un curso.
 *
 * @param settings_navigation $settingsnav El objeto de navegación.
 * @param context $context El contexto en el que se ejecuta.
 */
function block_ideal_cstatus_extend_navigation_course($settingsnav, $context) {
    if ($context->contextlevel == CONTEXT_COURSE) {
        $course_node = $settingsnav->get('courseadmin');
        if ($course_node) {
            $course_node->add(
                get_string('pluginname', 'block_ideal_cstatus'),
               // $url,
                navigation_node::TYPE_CUSTOM,
                null,
                null,
                new pix_icon('i/settings', '')
            );
        }
    }
}



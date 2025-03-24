<?php
namespace block_ideal_cstatus\output;

defined('MOODLE_INTERNAL') || die();

use plugin_renderer_base;
use stdClass;

class renderer extends plugin_renderer_base {
    /**
     * Renderiza todos los círculos.
     *
     * @param array $data Datos a ser renderizados.
     * @return string HTML generado por la plantilla.
     */
    public function render_all_circles(array $data) {
        // Validar la estructura de los datos.
        if (empty($data['circles'])) {
            return $this->output->notification(get_string('nocircles', 'block_ideal_cstatus'), 'notifyproblem');
        }

        try {
            // Renderizar la plantilla y retornar el HTML.
            return $this->render_from_template('block_ideal_cstatus/all_circles', $data);
        } catch (\Exception $e) {
            // Manejar cualquier excepción que ocurra durante el renderizado.
            return $this->render_notification(get_string('renderingerror', 'block_ideal_cstatus') . ': ' . $e->getMessage(), 'notifyproblem');
        }
    }
    /**
     * Renderiza una notificación en caso de error o aviso.
     *
     * @param string $message Mensaje a mostrar.
     * @param string $type Tipo de notificación.
     * @return string HTML de la notificación.
     */
    protected function render_notification($message, $type) {
        return html_writer::tag('div', $message, ['class' => 'notify ' . $type]);
    }
}

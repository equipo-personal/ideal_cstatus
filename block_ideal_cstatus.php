<?php
require_once(__DIR__ . '/classes/render_circles.php');

class block_ideal_cstatus extends block_base {
    public function init() {
        $this->title = get_string('pluginname', 'block_ideal_cstatus');
    }
    public function get_content() {
        global $OUTPUT, $PAGE;


        if ($this->content !== null) {
            return $this->content;
        }
        $PAGE->requires->js_call_amd('block_ideal_cstatus/controller', 'init');
        $this->content = new stdClass();
        $this->content->text = '';
        $this->content->footer = '';
        try {

            ob_start();
            render_circles();
            $rendered_content = ob_get_clean();
            $this->content->text = $rendered_content;
        } catch (Exception $e) {
            $this->content->text = $OUTPUT->notification(get_string('error_rendering', 'block_ideal_cstatus'), 'error');
            error_log('Error rendering circles: ' . $e->getMessage()); 
        }
        return $this->content;
    }
}

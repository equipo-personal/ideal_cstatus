<?php
require_once '../classes/consultas_db.php';
require_once '../../../config.php';
global $DB, $USER, $CFG;

require_once($CFG->dirroot . '/cohort/lib.php');

// Mensajes de estado
$str_enroll_cohorts = json_decode(get_string('str_enroll_in_cohorts', 'block_ideal_cstatus'), true);

try {
    // Validar el parámetro 'id' del template del learning plan
    $id_template_lp = required_param('id', PARAM_INT);
    if (!$id_template_lp) {
        throw new Exception("El ID del template del learning plan no es válido.");
    }

    // Obtener la lista de cohortes disponibles para el template del learning plan
    $list_learning_plans_avalible = cohort_for_templates($id_template_lp);
    if (empty($list_learning_plans_avalible)) {
        throw new Exception("No hay cohortes disponibles para este learning plan.");
    }

    $total_cohorts = count($list_learning_plans_avalible);
    $enrolled_count = 0;

    foreach ($list_learning_plans_avalible as $cohort) {
        try {
            // Verificar si $cohort es un objeto o un arreglo
            if (is_object($cohort)) {
                $id_cohort = $cohort->cohortid;
                $name_lp = $cohort->shortname;
            } else {
                // Si es un arreglo, acceder al índice apropiado
                $id_cohort = isset($cohort['cohortid']) ? $cohort['cohortid'] : null;
                $name_lp = isset($cohort['shortname']) ? $cohort['shortname'] : null;
            }
    
            if (!$id_cohort) {
                throw new Exception("El ID del cohorte no es válido.");
            }
    
            // Verificar si el usuario ya está matriculado en el cohorte
            $user_in_cohort = user_in_cohort($USER->id, $id_cohort);
            if ($user_in_cohort && $user_in_cohort->cohortid == $id_cohort) {
                $enrolled_count++;
                continue; // Ya está matriculado, pasar al siguiente cohorte
            }
    
            // Matricular al usuario en el cohorte
            cohort_add_member($id_cohort, $USER->id);
            $enrolled_count++;
    
            // Mostrar mensaje de éxito para este cohorte
            echo "<div class='h_result_ok' id='id_result_enroll' style='border-radius: 15px; text-align: center;'>";
            echo '<h6 style="margin: 0;">' . $str_enroll_cohorts['0'] . "</h6>";
            echo '<h5 style="background: green; font-weight: bold; margin: 0; text-align: center;">' . $name_lp . "</h5>";
            echo "</div>";
        } catch (Exception $e) {
            // Manejar errores específicos del cohorte
            echo "<div class='h_result_error' style='border-radius: 15px; text-align: center;'>";
            echo '<h6 style="margin: 0; color: red;">Error en el cohorte: ' . $e->getMessage() . "</h6>";
            echo "</div>";
        }
    }
    

    // Verificar si todos los cohortes fueron procesados correctamente
    if ($enrolled_count === $total_cohorts) {
        echo "<div class='h_result_ok' id='id_result_enroll' style='border-radius: 15px; text-align: center;'>";
        echo '<h6 style="margin: 0;">' . $str_enroll_cohorts['2'] . "</h6>";
        echo "</div>";
    }
} catch (Exception $e) {
    // Manejar errores generales
    echo "<div class='h_result_error' style='border-radius: 15px; text-align: center;'>";
    echo '<h6 style="margin: 0; color: red;">Error: ' . $e->getMessage() . "</h6>";
    echo "</div>";
}
echo "AQUI";
?>

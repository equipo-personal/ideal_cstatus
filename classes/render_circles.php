<?php
require_once(__DIR__ . '/renderer.php');
require_once(__DIR__ . '/consultas_db.php');

function get_circle_data($sql, $id_user_search_competence)
{
    global $DB, $OUTPUT,$PAGE;
    try {
        $all_areas = $DB->get_records_sql($sql);
        if (!$all_areas) {
            throw new Exception("No se encontraron áreas en la consulta SQL.");
        }
        $numberOfCircles = count($all_areas);
        $competencias = [];
        $ids_number_competences = [];
        $competencias_user_array = [];
        // Obtenemos las cabeceras de las áreas
        $sql_cabeceras_areas = get_cabeceras();
        $cabeceras = $DB->get_records_sql($sql_cabeceras_areas);
        if (!$cabeceras) {
            throw new Exception("No se encontraron cabeceras en la consulta de competencias.");
        }

        $competencia_ok_for_user = $DB->get_records_sql(select_user_competence_complete($id_user_search_competence, 0));
        foreach ($all_areas as $area) {
            $competencias[] = $area->competenciaa;
        }
        foreach ($competencia_ok_for_user as $competencia_ok) {
            $competencias_user_array[] = $competencia_ok->competencia_ok;
            $ids_number_competences[] = get_idnumber_competence_nivel($competencia_ok->competencia_ok);
        }
        // Procesar cabeceras
        $cabeceras_ok = [];
        foreach ($cabeceras as $cabecera) {
            $cabeceras_ok[] = [
                'id' => $cabecera->id,
                'cabecera' => $cabecera->cabecera
            ];
        }
        return [
            'numberOfCircles' => $numberOfCircles,
            'texts' => json_encode($competencias),
            'name_container_padre' => rand(0, 998),
            'name_container_centro' => rand(999, 1999),
            'competencia_ok_for_user' => json_encode($competencias_user_array),
            'cabeceras' => json_encode($cabeceras_ok),
            'id_number_competences' => json_encode($ids_number_competences),
            'legend' => get_legend(),
        ];
    } catch (Exception $e) {
        error_log('Error en get_circle_data: ' . $e->getMessage());
        return [
            'error' => 'Error al obtener los datos de los círculos. Por favor, inténtalo más tarde.'
        ];
    }
}

function get_id_user_search_competence_admin()
{
    global $USER;
    try {
        return $USER->id;
    } catch (\Throwable $th) {
        return false;
    }
}

function render_circles()
{
    global $CFG, $DB,$PAGE,$USER;
    //require '../block/ideal_cstatus/circles/modal_centro/modal_centro.js';

    require_once($CFG->dirroot . '/user/lib.php');
    global $OUTPUT, $USER;
    try {
        $ids = get_ids_cabeceras_db(get_cabeceras());
        if (!$ids) {
            throw new Exception("No se encontraron cabeceras en la consulta.");
        }

        // Consultas por área
        $consultas = consultas_por_areas($ids);
        $circles_data = [];
        $id_user_search_competence = $USER->id;
        $rol_admin_id = get_string('is_rol_ok', 'block_ideal_cstatus');
        // Si mantiene el rol de ideal_manage podrá acceder
        try {
            // Obtén los roles del usuario
            $role = get_role_user($id_user_search_competence);
            // Asegurar de que el rol 'ideal_manage' existe
            if (isset($role[$rol_admin_id]) && $role[$rol_admin_id]->shortname) {
                $rol = $role[$rol_admin_id]->shortname;
            }
        } catch (Exception $e) {
            error_log('Error en render_circles: ' . $e->getMessage());
        }
        // Verifica si el usuario es admin o tiene el rol 'ideal_manage'
        if (is_siteadmin() || isset($rol) && $rol == $rol_admin_id) {
            try {
                $list_countries = get_list_countries();
                $users_search = get_list_users();
                $templatecontext = ['users_search' => json_encode($users_search)
                    , 'list_countries' => json_encode($list_countries)];

                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['selected_user'])) {
                    $id_user_search_competence = $_POST['selected_user'] ?: $USER->id;
                    $data_user = core_user::get_user($id_user_search_competence);
                    echo "<div style='display: flex; flex-wrap: wrap; align-items: center; gap: 10px;'>";
                    echo "<h2 style='font-size: 1.2em; margin-bottom: 10px;'>" . get_string('user_select', 'block_ideal_cstatus') . "<span style='color:#6398FA;'>" . htmlspecialchars(fullname($data_user)) . "</span></h2>";
                    echo "<h2 style='font-size: 1.2em; margin-bottom: 10px;'>" . get_string('user_select_email', 'block_ideal_cstatus') . "<a href='mailto:" . htmlspecialchars($data_user->email) . "' style='color:blue; text-decoration: underline;'>" . htmlspecialchars($data_user->email) . "</a></h2>";
                    echo "</div>";
                    echo "<a href='../user/profile.php?id=" . $id_user_search_competence . "' style='display: inline-block; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; text-align: center;'>" . get_string('view_profile', 'block_ideal_cstatus') . "</a>";
                }
                echo $OUTPUT->render_from_template('block_ideal_cstatus/menu_manage', $templatecontext);
            } catch (Exception $e) {
                error_log('Error en render_circles: ' . $e->getMessage());
            }
        }

        for ($i = 0; $i < count($ids); $i++) {
            $circle_key = 'circle' . ($i + 1);
            $circle_data = get_circle_data($consultas['consulta' . $i], $id_user_search_competence);

            if (isset($circle_data['error'])) {
                error_log('Error al obtener datos del círculo: ' . $circle_data['error']);
                continue;
            }
            $circles_data[$circle_key] = $circle_data;
        }

        if (empty($circles_data)) {
            throw new Exception("No se pudieron generar los datos de los círculos.");
        }

        $data = ['circles' => $circles_data];
        echo $OUTPUT->render_from_template('block_ideal_cstatus/all_circles', $data);
        #modal centro
        //$courses=list_courses_avalible($id_user_search_competence);
        $learning_plans=list_learning_plans($id_user_search_competence,"%");
        //var_dump($learning_plans);die();
        echo $OUTPUT->render_from_template('block_ideal_cstatus/modal_centro/modal_centro', [
            'template_data' => json_encode($learning_plans),
        ]);
    } catch (Exception $e) {
        error_log('Error en render_circles: ' . $e->getMessage());
    }
}
?>
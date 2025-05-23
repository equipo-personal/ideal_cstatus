<?php
require_once(__DIR__ . '/renderer.php');
require_once(__DIR__ . '/consultas_db.php');

function get_circle_data($sql, $id_user_search_competence)
{
    global $DB;
    try {
        //print_r($sql); //traza sql
        $all_areas = $DB->get_records_sql($sql);//for id
        //print_r(value: $all_areas);
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
            //var_dump(get_string($cabecera->cabecera,'block_ideal_cstatus'));
            $cabeceras_ok[] = [
                'id' => $cabecera->id,
                'cabecera' => get_string($cabecera->cabecera,'block_ideal_cstatus') //cabeceras por lang
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
    $id_user_search_competence = $USER->id;
    $name_user_search_competence=$USER->username;
    $lang_user=get_lang_x_user($id_user_search_competence);
    try {
        $ids = get_ids_cabeceras_db(get_cabeceras());
        if (!$ids) {
            throw new Exception("No se encontraron cabeceras en la consulta.");
        }

        // Consultas por área
        $consultas = consultas_por_areas($ids);
        $circles_data = [];

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
                    $lang_user = get_lang_x_user($id_user_search_competence);
                    $data_user = core_user::get_user($id_user_search_competence);
                    $name_user_search_competence = htmlspecialchars(fullname($data_user), ENT_QUOTES, 'UTF-8');
                    echo "<div class='container_limpiar'>";

                    //echo "<div style='display: flex; flex-wrap: wrap; align-items: center; gap: 10px;'>";
                       echo "<h2 class='item_clear'  style='font-size: 1.2em; margin-bottom: 10px; '>" . get_string('user_select', 'block_ideal_cstatus') ."<a  href='../user/profile.php?id=" . $id_user_search_competence . "' target= '_blank''> <span style='color:#6398FA; '>" . fullname($data_user) . "</span></a></h2>";
                    //echo "</div>";
                    
                        // Botón para limpiar contenido seleccionado
                        echo "<form class='item_clear tooltip' method='POST' style='margin-top: 10px;'>";
                          echo "<button type='submit' name='clear_selection' style=' border: none; border-radius: 5px; cursor: pointer;'>" ."<a>".get_string('limpiar_filtros','block_ideal_cstatus')." </a> " . "<span class='tooltiptext'>".get_string('btn_borrado_filtros','block_ideal_cstatus') ."</span> </button>";
                        echo "</form>";

                        // Botón para refrescar la página con los datos del mismo usuario
                        echo "<form class='item_clear tooltip' method='POST' style='margin-top: 10px;'>";
                           echo "<input type='hidden' name='selected_user' value='" . $id_user_search_competence . "'>";
                           echo "<button  type='submit' style='  border: none; border-radius: 5px; cursor: pointer;'>" ."<a>".get_string('regargar','block_ideal_cstatus')." </a> " ."<span class='tooltiptext'>".get_string('btn_reload_page','block_ideal_cstatus') ."</span></button>";
                        echo "</form>";
                    echo "</div>";

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
        $learning_plans=list_learning_plans($id_user_search_competence,"%");

        $matriz = [];
        foreach ($learning_plans as $i=>$item) {
            //preg_match busquedas por medio de expreciones regulares 
            preg_match('/^(\d+)/', $item->templatename, $matches);//La expresión \d+ significa "una o más cifras numéricas"
            if (!empty($matches[1])) {
                $groupKey = (int)$matches[1];
                $matriz[$groupKey][] = $item;//por num area
            }
        }

        echo $OUTPUT->render_from_template('block_ideal_cstatus/modal_centro/modal_centro', [
            'template_data' => json_encode($matriz),
            'lang_user' => json_encode($lang_user),
            'user_id_search'=>json_encode($id_user_search_competence),
            'user_name_search'=>json_encode($name_user_search_competence,JSON_UNESCAPED_UNICODE),
        ]);
    } catch (Exception $e) {
        error_log('Error en render_circles: ' . $e->getMessage());
    }
}

?>
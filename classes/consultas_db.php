<?php


function get_role_user($id_user) {
    global $DB;
    try {
        $sql = "
            SELECT
                r.shortname
            FROM
                {role} r
            JOIN {role_assignments} ra ON
                ra.roleid = r.id
            WHERE
                ra.userid = :userid
        ";
        return $DB->get_records_sql($sql, ['userid' => $id_user]);
    } catch (Exception $e) {
        error_log("Error al obtener el rol del usuario: " . $e->getMessage());
        return null;
    }
}

function get_legend(){

    $legend = [
        ['name' => 'str_A', 'color' => '#0066FF'],
        ['name' => 'str_D', 'color' => '#FF6600'],
        ['name' => 'str_L', 'color' => '#6600FF'],
        ['name' => 'str_Soft', 'color' => '#C000FF'],
        ['name' => 'str_Ethi', 'color' => '#C000FF'],
    ];

    for ($i = 0; $i < count($legend); $i++) {
        $legend[$i]['name'] = get_string($legend[$i]['name'], 'block_ideal_cstatus');
        $legend[$i]['color'] = get_string($legend[$i]['color'], 'block_ideal_cstatus');
    }
    return json_encode($legend);
}


function get_list_users(){
    global $DB;

    try {
        $sql = "
            SELECT DISTINCT
                u.firstname, u.lastname, u.id, u.email
            FROM
                {user} u
            JOIN {competency_usercomp} cu ON
                cu.userid = u.id
            WHERE cu.proficiency = 1
        ";

        // Obtiene los usuarios
        $users = $DB->get_records_sql($sql);

        // Procesamos los usuarios para crear un array de datos adecuados
        $users_ok = [];
        foreach ($users as $user) {
            // Combina el nombre y apellido en un solo campo para el nombre completo
            $users_ok[] = [
                'id' => $user->id,
                'fullname' => fullname($user), // Usamos la función fullname para generar el nombre completo
                'email' => $user->email
            ];
        }

        return $users_ok;

    } catch (Exception $e) {
        error_log("Error al obtener la lista de usuarios: " . $e->getMessage());
        return [];
    }
}


function get_idnumber_frameword() {
    global $DB;
    try {
        $sql_get_id_frameword = 'SELECT id FROM {competency_framework} WHERE idnumber = 2024';
        $id_frameword = $DB->get_field_sql($sql_get_id_frameword);
        return (int)$id_frameword;
    } catch (Exception $e) {
        error_log("Error al obtener el ID del framework: " . $e->getMessage());
        return 0; // Retorna 0 en caso de error
    }
}

function get_idnumber_competence_nivel($name_competence){
    global $DB;
    try {
        $sql_get_idnumber_competence = "
            SELECT idnumber FROM {competency} WHERE shortname = :shortname
        ";
        return $DB->get_field_sql($sql_get_idnumber_competence, ['shortname' => $name_competence]);
    } catch (Exception $e) {
        error_log("Error al obtener el ID de competencia: " . $e->getMessage());
        return null; // Retorna null en caso de error
    }
}
function select_area_name($num){
    try {
        $sql = "
            SELECT DISTINCT
                c.id,
                c.shortname AS competenciaa
            FROM
                {competency} c
            JOIN {competency_usercomp} cu JOIN {competency_coursecomp} cc 
            WHERE
                c.shortname LIKE '$num. %'
        ";
        return $sql;
    } catch (Exception $e) {
        error_log("Error en la consulta select_area_name: " . $e->getMessage());
        return null;
    }
}
//0 busqueda normal, 1 Admin search user
function select_user_competence_complete($id_user,$search_admin){
    try {
        $id_frameword = get_idnumber_frameword();
        $sql = "
            SELECT DISTINCT
                c.shortname AS competencia_ok
            FROM
                {competency_usercomp} cu
            JOIN {user} u ON
                u.id = cu.userid
            JOIN {competency} c ON
                c.id = cu.competencyid
            JOIN {competency_framework} cf ON
                cf.id = $id_frameword
            WHERE
                cu.proficiency = 1 AND u.id = $id_user;
        ";
        return $sql;
    } catch (Exception $e) {
        error_log("Error al seleccionar competencias completas del usuario: " . $e->getMessage());
        return null;
    }
}

function get_cabeceras(){
    try {
        $id_frameword = get_idnumber_frameword();
        $sql = "
            SELECT DISTINCT
                c.id,
                c.shortname AS cabecera
            FROM
                {competency} c
            WHERE
                c.path = '/0/' AND c.competencyframeworkid = $id_frameword
            ORDER BY
                `c`.`id` ASC
        ";
        return $sql;
    } catch (Exception $e) {
        error_log("Error al obtener las cabeceras: " . $e->getMessage());
        return null;
    }
}

function get_ids_cabeceras_db($sql){
    global $DB;
    try {
        $datos = $DB->get_records_sql($sql, null);
        $ids = [];

        foreach ($datos as $dato) {
            $ids[] = $dato->id;
        }

        // Invertimos los últimos dos campos por las áreas 7 y 6
        $count = count($ids);
        if ($count >= 2) {
            $temp = $ids[$count - 1];
            $ids[$count - 1] = $ids[$count - 2];
            $ids[$count - 2] = $temp;
        }
        return $ids;
    } catch (Exception $e) {
        error_log("Error al obtener IDs de cabeceras: " . $e->getMessage());
        return [];
    }
}

function consultas_por_areas($id_parentid){
    $consultas = [];
    try {
        $id_frameword = get_idnumber_frameword();
        for ($i = 0; $i < count($id_parentid); $i++) {
            $id = $id_parentid[$i];

            $consultas['consulta' . $i] = "
                SELECT DISTINCT
                    c.id,
                    LEFT(c.shortname, 4) AS competenciaa
                FROM
                    {competency} c
                WHERE
                    c.parentid = $id AND c.competencyframeworkid = $id_frameword
            ";
        }
        return $consultas;
    } catch (Exception $e) {
        error_log("Error al generar consultas por áreas: " . $e->getMessage());
        return [];
    }
}

function get_competencias_por_area() {
    try {
        $id_frameword = get_idnumber_frameword();
        $ids = get_ids_cabeceras_db(get_cabeceras());

        $sub_cabeceras_sql_ = [];

        for ($i = 0; $i < count($ids); $i++) {
            $id = $ids[$i];

            $sub_cabeceras_sql_[$i] = "
                SELECT DISTINCT
                    c.id
                FROM
                    {competency} c
                WHERE
                    c.parentid = $id AND c.competencyframeworkid = $id_frameword
            ";
        }
        return $sub_cabeceras_sql_;
    } catch (Exception $e) {
        error_log("Error al obtener competencias por área: " . $e->getMessage());
        return [];
    }
}

function get_ids(){
    global $DB;
    try {
        $consultas_sub_cabeceras = get_competencias_por_area();
        $ids_consultas = [];

        for ($i = 0; $i < count($consultas_sub_cabeceras) - 2; $i++) {
            $ids_consultas['consulta' . $i] = $DB->get_records_sql($consultas_sub_cabeceras[$i], null);
        }
        return $ids_consultas;
    } catch (Exception $e) {
        error_log("Error al obtener IDs: " . $e->getMessage());
        return [];
    }
}
?>

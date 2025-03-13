<?php
function get_course_for_competenci($competencyid){
    global $DB;
    $sql="
    SELECT
        cc.courseid,
        cc.competencyid,
        c.fullname
    FROM
        {competency_coursecomp} cc
    JOIN {course} c ON
        c.id = cc.courseid
    WHERE
        competencyid = $competencyid AND c.visible = 1;
    ";
    try {
        $course=[];
        $course=$DB->get_records_sql($sql);
        return $course;
    }catch (dml_exception $e) {
        error_log( $e->getMessage()); 
        return false; 
    }
}
function list_courses_avalible($id_user) {
    $paths_categori = get_competenci_and_id_category_main();

    if (empty($paths_categori)) {
        echo "No se encontraron categorías o competencias disponibles.";
        return;
    }
    $competenci_proficiency = [];
    $all_competenci = [];

 // Obtener competencias aprobadas por el usuario por categoría
    try {
        foreach ($paths_categori as $path) {
            $competenci_proficiency[$path->id] = get_competency_aprobadas($path->id, $id_user);
        }        

        // Obtener todas las competencias disponibles por categoría
        foreach ($paths_categori as $path) {
            $all_competenci[$path->id] = get_all_competencies_area($path->id);
        }
       //var_dump($all_competenci);

       foreach ($paths_categori as $path) {
        // Obtener todas las competencias del área
        $all_competencies = get_all_competencies_area($path->id);
        
        foreach ($all_competencies as $competency) {
            // Verificar si la competencia está aprobada
            $is_approved = isset($competenci_proficiency[$path->id][$competency->id]);
    
            $competencies_with_status[$path->id][$competency->id] = [
                'id' => $competency->id,
                'shortname' => get_string($competency->shortname,'block_ideal_cstatus'),
                'approved' => $is_approved ? get_string('Completed', 'block_ideal_cstatus') : get_string('Pending', 'block_ideal_cstatus'),
            ];
        }
    }

        return $competencies_with_status;
    }catch (dml_exception $e) {
        error_log( $e->getMessage()); 
        return false; 
    }  
}
//new 19/12
function get_competenci_and_id_category_main(){
    global $DB;
    $sql="
        SELECT
            c.id
        FROM
            {competency} c
        WHERE
        c.path LIKE '/0/' AND c.competencyframeworkid =".get_idnumber_frameword()."
    ";
    try {
        $competency_id=[];
        $competency_id=$DB->get_records_sql($sql);
        return $competency_id;
    } catch (dml_exception $e) {
        error_log( $e->getMessage()); 
        return false; 
    }
}
//Usuarios con competencias aprobadas
function get_competency_aprobadas($path, $id_user) {
    global $DB;
    $sql = "
        SELECT
            cu.competencyid as id
        FROM {user} u
        JOIN {competency_usercomp} cu ON cu.userid = u.id
        JOIN {competency} c ON cu.competencyid = c.id
        WHERE c.path LIKE '/0/$path/%' AND u.id = :userid
    ";
    try{
        $params = ['userid' => $id_user];
        $competences_user_proficiency = $DB->get_records_sql($sql, $params);
        return $competences_user_proficiency;
    }catch (dml_exception $e) {
        error_log( $e->getMessage()); 
        return false; 
    }
}
function get_all_competencies_area($path){
    global $DB;
    // Validamos que el parámetro $path no esté vacío
    if (empty($path)) {
        return false; // Retornamos false si el parámetro no es válido.
    }
    $sql = "
        SELECT DISTINCT
            c.id,
            c.shortname
        FROM
            {competency} c
        WHERE
            path LIKE '/0/$path/%' AND path NOT LIKE '/0/';
    ";
    try {
        $competences_for_area = $DB->get_records_sql($sql);
        if ($competences_for_area === false) {
            return false;
        }
        return $competences_for_area; // Retornamos los registros obtenidos.
    } catch (dml_exception $e) {
        error_log( $e->getMessage()); 
        return false; 
    }
}
// add 19/12
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
SELECT 
    u.id,
    u.firstname,
    u.lastname,
    u.email,
    u.country
FROM
    {user} u
JOIN {competency_usercomp} cu ON
    cu.userid = u.id
WHERE
    cu.proficiency = 1
GROUP BY
    u.id, u.firstname, u.lastname, u.email
    ORDER BY `u`.`firstname` ASC;
        ";

        // Obtiene los usuarios
        $users = $DB->get_records_sql($sql);

        // Procesamos los usuarios para crear un array de datos adecuados
        $users_ok = [];
        foreach ($users as $user) {
            $users_ok[] = [
                'id' => $user->id,
                'fullname' => fullname($user), // Usamos la función fullname para generar el nombre completo
                'email' => $user->email,
                'country' => $user->country
            ];
        }
        return $users_ok;

    } catch (Exception $e) {
        error_log("Error al obtener la lista de usuarios: " . $e->getMessage());
        return [];
    }
}

function get_list_countries(){
    global $DB;

    try {
        $sql = "
SELECT DISTINCT
    country
FROM
    {user}
WHERE
    country NOT LIKE ''
ORDER BY
    {user}.`country` ASC
                ";
    $countries = $DB->get_records_sql($sql);
    $countries_ok = [];

    foreach ($countries as $country) {
        $countries_ok[] = $country->country." (".get_string($country->country, 'countries').")";
    }
    $countries_ok[] = get_string('all_users', 'block_ideal_cstatus');
    $countries_ok[] = get_string('users_not_country', 'block_ideal_cstatus');
    return $countries_ok;
    } catch (Exception $e) {
        error_log("Error al obtener la lista de paises: " . $e->getMessage());
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
                    c.id,
                    c.shortname
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
function learning_for_competency($id_competency){
    global $DB;
    $sql="
        SELECT
            ct.id AS id_template,
            ct.shortname,
            cttc.templateid,
            cttc.competencyid AS id_compe_template
        FROM
            {competency_template} ct
        JOIN {competency_templatecomp} cttc ON
            ct.id = cttc.templateid
        WHERE
            cttc.competencyid = :id_competency
    ";
    try {
        $params = ['id_competency' => $id_competency];
        $result = $DB->get_records_sql($sql, $params);
        return $result;
    } catch (dml_exception $e) {
        error_log($e->getMessage());
        return false;
    }
}

function get_cohort_per_id_template($id_template_cohort, $lang_profile_user){
    global $DB;
    $sql="
        SELECT
            ctc.id AS id_template_cohort,
            ctc.templateid AS id_template_id,
            ctc.cohortid,
            c.name,
            c.idnumber
        FROM
            {competency_templatecohort} ctc
        JOIN {cohort} c ON
            c.id = ctc.cohortid AND ctc.templateid = :id_template_cohort
        WHERE
            c.idnumber LIKE :lang_profile_user
    ";
    try {
        $params = [
            'id_template_cohort' => $id_template_cohort,
            'lang_profile_user' => '%' . $lang_profile_user . '%'
        ];
        $result = $DB->get_records_sql($sql, $params);
        return $result;
    } catch (dml_exception $e) {
        error_log($e->getMessage());
        return false;
    }
}

function user_in_cohort($id_user, $cohort_id) {
    global $DB;
    $sql = "
        SELECT
            cohortid
        FROM
            {cohort_members}
        WHERE
            cohortid = :cohort_id AND userid = :id_user
    ";
    try {
        $params = [
            'cohort_id' => $cohort_id,
            'id_user' => $id_user
        ];
        $result = $DB->get_records_sql($sql, $params);
        return $result;
    } catch (dml_exception $e) {
        error_log($e->getMessage());
        return false;
    }
}

?>

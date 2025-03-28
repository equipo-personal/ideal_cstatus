<!--
Para la matriculacion en los cohortes, es necesario asignar dichos cohortes a los learning plans
si esta agg a un learning plan, se genra una plantilla en mdl_competency_templatecohort que busca su templateid y lo asigna con un cohortid
-->

<?php
require_once '../classes/consultas_db.php';
require_once '../../../config.php';
global $DB, $USER, $CFG;

require_once ($CFG->dirroot.'/cohort/lib.php');
$id_cohort="";
try {
    $id_template_lp = required_param('id', PARAM_INT);
    //== Ensure $id_competence_for_url is valid
    if (!$id_template_lp) {
        throw new Exception(get_string('idcompetencyinvalid','block_ideal_cstatus'));
    }
    //var_dump($id_template_lp);die(); //OK
    $list_learning_plans_avalible = cohort_for_templates(9);
    if (!empty($list_learning_plans_avalible)) {
            //== Loop through cohorts available for the learning plan template
            foreach ($list_learning_plans_avalible as $cohor) {
                try {
                    $id_cohort = $cohor->cohortid;
                    $name_cohort = $cohor->name;
                    echo"</br>";
                    //var_dump($id_cohort." ".$name_cohort);
                    echo"</br>";
                    if ($id_cohort) {
                        $user_in_cohor_ = user_in_cohort($USER->id, $id_cohort);
                        //== Check if user is in cohort
                        //print_r($id_cohort);
                        //== Check if user is already in the cohort
                        if (isset($user_in_cohor_[$id_cohort]) && $user_in_cohor_[$id_cohort]->cohortid == $id_cohort) {
                            echo '<br>' . get_string('userincohort','block_ideal_cstatus') . $name_cohort;
                        } else {
                            echo get_string('usernotinscrip','block_ideal_cstatus') . $name_cohort;
                            //$ultimos_caracteres_name_cohort = substr($name_cohort, -2);
                            //== Matriculate user in the cohort based on the country in the user's profile
                            if ($id_cohort) {
                                cohort_add_member($id_cohort, $USER->id);
                                echo '<br>' . get_string('userininscrip','block_ideal_cstatus'). $name_cohort . get_string('onemoment','block_ideal_cstatus') . '<br>';
                            }
                        }
                    } else {
                        echo '<br>' .get_string('cohortnoavalible','block_ideal_cstatus');
                    }
                } catch (Exception $e) {
                    //== Handle exceptions and display error message
                    echo 'Error: ' . $e->getMessage();
                }
            }
        
    } 
    if(!$id_cohort){
        echo '<br>' .get_string('cohortnoavalible','block_ideal_cstatus');
    }
} catch (Exception $e) {
    //== Handle exceptions and display error message
    echo 'Error: ' . $e->getMessage();
}
?>

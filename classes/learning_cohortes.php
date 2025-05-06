<!--
Para la matriculacion en los cohortes, es necesario asignar dichos cohortes a los learning plans
si esta agg a un learning plan, se genra una plantilla en mdl_competency_templatecohort que busca su templateid y lo asigna con un cohortid
-->

<?php
require_once '../classes/consultas_db.php';
require_once '../../../config.php';
global $USER, $CFG;
// 0:OK 1:ERROR 2: enroll
$str_enroll_cohorts = json_decode(get_string('str_enroll_in_cohorts', 'block_ideal_cstatus'), true);

require_once($CFG->dirroot . '/cohort/lib.php');
$id_cohort;
$name_lp = "";
try {
    $id_template_lp = required_param('id', PARAM_INT);
    $id_user=required_param('userid', PARAM_INT);

    if($USER->id!=$id_user){
        echo "<div class='h_result_ok' id='id_result_enroll';> ";
        echo '<h4 >' . $str_enroll_cohorts['6']. '</h4>';  
        echo "<h5 class='lp_name' style='border-radius: 25px;  background: yellow; font-weight: bold';>" . get_string('isadminuser','block_ideal_cstatus') . "</h5>";                                                 
        echo "</div>";
        return;
    }
    $learningplan = name_template_lp($id_template_lp);
    //== Ensure $id_competence_for_url is valid
    if (!$id_template_lp) {
        throw new Exception("error in id");
    }
   
    //echo $id_template_lp ."</br>";
    $list_learning_plans_avalible = cohort_for_templates($id_template_lp);
    $user_in_lp_template =user_in_lp_template($USER->id,$id_template_lp);
    $lenght_list_lp = count($list_learning_plans_avalible);
    $count_lp = 0;
    $count_cohort = 0;

    if ($list_learning_plans_avalible) {

        //== Loop through cohorts available for the learning plan template
        foreach ($list_learning_plans_avalible as $cohor) {
            try {
                $id_cohort = $cohor->cohortid;
                $name_lp = $cohor->shortname;
                    if (!isset($user_in_cohor_)) {
                        $user_in_cohor_ = [];
                    }

                    $user_in_cohor_[$id_cohort] = user_in_cohort($USER->id, $id_cohort);

                    if ($user_in_cohor_[$id_cohort]->cohortid === $id_cohort && $user_in_lp_template) {
          
                        $count_lp++;
                        if ($count_lp === $lenght_list_lp) {
                            echo "<div class='h_result_ok' id='id_result_enroll';> ";
                            echo '<h6 >' . $str_enroll_cohorts['2'] . "<h5 class='lp_name' style='border-radius: 25px;  background: green; font-weight: bold';>" . $learningplan->shortname . "</h5>" . '</h6>';
                            echo "</div>";
                        }
                    } else  {
                        $count_cohort++;
                        if (!($user_in_cohor_[$id_cohort] && $user_in_cohor_[$id_cohort]->cohortid == $id_cohort)){

                            //== Matriculate user in the cohort based on the country in the user's profile
                            cohort_add_member($id_cohort, $USER->id);
                            if ($count_cohort === $lenght_list_lp) {
                                echo "<div class='h_result_ok' id='id_result_enroll';> ";
                                echo '<h6 >' . $str_enroll_cohorts['0'] . "<h5 class='lp_name' style='background: green; font-weight: bold';>" . $learningplan->shortname . "</h5>" . '</h6>';
                                echo '<h6 >' . $str_enroll_cohorts['3']. '</h6>';                             
                                echo "</div>";
                            }
                        }else{

                            if ($count_cohort === $lenght_list_lp) {
                                echo "<div class='h_result_ok' id='id_result_enroll';> ";
                                echo '<h6 >' . $str_enroll_cohorts['2'] . "<h5 class='lp_name' style='border-radius: 25px;  background: yellow; font-weight: bold';>" . $learningplan->shortname . "</h5>" . '</h6>';
                                echo '<h6 >' . $str_enroll_cohorts['3']. '</h6>';                                                     
                                echo "</div>";
                            }
                        }
                    }
            } catch (Exception $e) {
                echo 'Error: ' . $e->getMessage();
            }
        }
    } else {//no hay cohortes disponibles para su matriculacion 
        echo "<div class='h_result_ok' id='id_result_enroll' style='border-radius: 15px; text-align: center;'> ";
        echo '<h6>' . $str_enroll_cohorts['1'] . "</h6>";
        echo '<h5 class="lp_name" style="border-radius: 25px;  background: red; font-weight: bold; text-align: center;">' . $learningplan->shortname . "</h5>";
        echo '<h6 >' . $str_enroll_cohorts['4']. '</h6>';                             
        echo "</div>";
    }
} catch (Exception $e) {
    echo "<div class='h_result_ok' id='id_result_enroll' style='border-radius: 15px; text-align: center;'> ";
    echo '<h6 ">' . $str_enroll_cohorts['1'] . "</h6>";
    echo "<h7 class='lp_name' style='color:red;'>".$str_enroll_cohorts['5'] . $e->getMessage() ."</h7>";
    echo '<h5 style="border-radius: 25px;  background: red; font-weight: bold; text-align: center;">' . $learningplan->shortname . "</h5>";
    echo '<h6 >' . $str_enroll_cohorts['4']. '</h6>'; 

    echo "</div>";
}
?>
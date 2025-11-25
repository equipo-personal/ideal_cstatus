<?php
    global $PAGE, $OUTPUT;
require_once('../../config.php');
require_once('classes/renderer.php');
require_once('classes/consultas_db.php');
require_once($CFG->dirroot . '/cohort/lib.php');

    require_login();
    // $PAGE->set_context(context_system::instance());

    // Define the page URL
    $url = new moodle_url('/blocks/ideal_cstatus/certificate_view.php');

    // Set the URL for the page
    $PAGE->set_url($url);

    // Continue with the rest of the page setup
    $PAGE->set_context(context_system::instance());

    // Render the page header
    echo $OUTPUT->header();

    echo "<head>
        <title>".get_string('certificate_title', 'block_ideal_cstatus')."</title>
        <link rel='stylesheet' type='text/css' href='amd/css/certificate_style.css'>
    </head>";
    // Obtener el ID del usuario actual.
    $id_user=$USER->id;
    $languages=[
        'en'=>'English (en)',
        'es'=>'Español (es)',
        'fr'=>'Français (fr)',
        'lv'=>'Latviešu (lv)',
    ];
    // $renderer = $PAGE->get_renderer('block_ideal_cstatus');
    // Renderizar la plantilla usando el renderer.
    try{
        $data_renderer=get_competencies_for_user_and_status($id_user);
        $aux=1;
        $lvl_color="";
        $cohorts_ECDPL=get_cohort("ECDPL-",$id_user);
        $cohorts_ECDE=get_cohort("ECDE-",$id_user);

        $cohort_enrol_user_ECDE=[];//cohortes en los que esta el usuario
        $strs_msj = [
                get_string('processing','block_ideal_cstatus'),
                get_string('confirm','core'),
                get_string('cancel','core'),
                get_string('userininscrip','block_ideal_cstatus'),
                get_string('usernotinscrip','block_ideal_cstatus')
            ];
        foreach ($cohorts_ECDE as $cohorts_){
            $cohort_enrol_user_ECDE[]=user_in_cohort($id_user,$cohorts_->id);
        }
//==========================TABLA 1===============================
        echo "<h2><img style='width:40px' src='templates/media/img/certificate.png'>    ".get_string('certificate_title', 'block_ideal_cstatus')."</h2>";
        echo "<div class='certificate_container'>";
        echo "<table class='table_certificate'>";
        echo "<tbody >";
        // echo "<head><tr><th colspan='10'>".get_string('certificate_title', 'block_ideal_cstatus')."</th></tr></head>";
        echo "<head><tr><th colspan='10' style='margin:0 auto; text-align:center; padding:5px'>".get_string('cerft_AD_title','block_ideal_cstatus')."</th></tr></head>";
        $class_to_change_color="";
        $aux_stop="";
        $competencies_AD_pss=0;
        $competencies_AD_pss_avalible_for_user=0;
            foreach($data_renderer as $data){
                if($aux_stop!=$aux){//cerrar area
                    echo"</tr>";}
                        if($data->is_title_area=="1"){//es un titulo de area
                            $aux_stop=$data->shortname[0];
                            
                            if($aux_stop==6){break;}//limitar hasta area 5

                            echo"<tr class='area_row'>";//abrir fila area
                            echo "<th class='title_area'>".get_string($data->shortname,'block_ideal_cstatus')."</th>";//titulo area
                            $aux=intval($aux_stop);

                        }elseif($data->str_lvl=='title' && $data->is_title_area!="1"){//es un titulo de subarea
                            $class_to_change_color="_".substr($data->shortname,0,3);
                            $class_to_change_color=preg_replace('/\./', '_', $class_to_change_color);

                            echo "<td class='title_subarea ". htmlspecialchars($class_to_change_color)."'>".$data->shortname."</td>";
                        }

                        if($data->str_lvl=='#FF6600'  || $data->str_lvl=='#0066FF' && $data->is_title_area!="1"){//competency A
                            if($data->competency_proficiency=="approved"){
                                $competencies_AD_pss_avalible_for_user=$competencies_AD_pss_avalible_for_user+1;
                                $lvl_color="style='color:".$data->str_lvl.";'";
                                //Cambiar el color de fondo y texto de la subárea correspondiente
                                echo "
                                <style>
                                    .".htmlspecialchars($class_to_change_color)." {
                                        background: ".$data->str_lvl.";
                                        color:white;
                                        font-weight:bold;
                                    }
                                </style>";
                            }else{$lvl_color="";}
                                echo "<td class='$data->str_lvl competency' $lvl_color>".get_string($data->shortname,'block_ideal_cstatus')."</td>";
                            $competencies_AD_pss=$competencies_AD_pss+1;
                        }
            }
        echo "<tfoot><tr><th colspan='10' style='margin:0 auto; text-align:center; padding:5px'><button class='btn btn-primary' id='enroll_cohort_AD'>".get_string('enroll_cohort_cert', 'block_ideal_cstatus')."</button>"."</th></tr></tfoot>";
          //MODAL 1
        echo "
        <div id='enrollModal' style='display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5);'>
            <div style='background:#fff; margin:8% auto; padding:20px; border-radius:6px; width:90%; max-width:480px; box-shadow:0 2px 10px rgba(0,0,0,0.3);'>
            <h2 class='title-moda-cerf'>".get_string('cerft_AD_title','block_ideal_cstatus')."</h2>"."
            <p class='msj_cert' style='margin-top:0;'>".get_string('subtitle_modal_enroll_ECDE','block_ideal_cstatus')."</p>";
            $has_available = false;

            // Primero comprobamos si hay cohortes disponibles
            foreach ($cohorts_ECDE as $cohort) {
                if ($cohort->matriculado == 0) {
                    $has_available = true;
                    break;
                }
            }
            if ($has_available) {
                echo "<p>" . get_string('select_cert_cohort','block_ideal_cstatus') . "</p>";
                echo "<select class='select_to_cohot_certf_1'>";
                foreach ($cohorts_ECDE as $cohort) {
                    if ($cohort->matriculado == 0) {

                        echo "<option value='" . htmlspecialchars($cohort->id) . "'>" .
                                //htmlspecialchars($cohort->name) .
                                htmlspecialchars(string: $languages[substr($cohort->name,-2)]) .
                            "</option>";
                    }
                }
                echo "</select>";
            }

            // Mostrar cohortes ya matriculados
            $has_enrolled = false;
            foreach ($cohorts_ECDE as $cohort) {
                if ($cohort->matriculado == 1) {
                    if (!$has_enrolled) {
                        echo "<div>";
                        echo "<strong>" . get_string('already_enrolled_in','block_ideal_cstatus') . "</strong><br>";
                        echo "<ul>";
                        $has_enrolled = true;
                    }
                    // echo "<li>" . htmlspecialchars($cohort->name) . "</li>";
                    echo "<li>" . htmlspecialchars(string: $languages[substr($cohort->name,-2)]) . "</li>";
                }
            }
            echo "<div class='container_btns' style='margin:0 auto;'>";
            if ($has_available) {
                echo "</ul>";

            }

            if($has_available){
                echo "
                    <button class='btn btn-primary' 
                            id='confirmEnroll2' 
                            style='margin-right:8px;' 
                            onclick='confirmEnroll(
                                " . intval($USER->id) . ", 
                                " . json_encode($strs_msj) . ", 
                                \".select_to_cohot_certf_1\"
                            )'>
                        " . get_string('confirm', 'core') . "
                    </button>
                ";
            }
                echo"<button class='btn btn-secondary' id='cancelEnroll'>".get_string('cancel','core')."</button>
            </div>
            </div>
        </div>";
        echo "
            <script>
                (function(){

                    var openBtn = document.getElementById('enroll_cohort_AD');
                    var modal = document.getElementById('enrollModal');
                    var cancel = document.getElementById('cancelEnroll');
                    var confirmBtn = document.getElementById('confirmEnroll');

                    if(openBtn){
                        openBtn.addEventListener('click', function(e){
                            e.preventDefault();
                            modal.style.display = 'block';
                        });
                    }

                    if(cancel){
                        cancel.addEventListener('click', function(){
                            modal.style.display = 'none';
                        });
                    }

                    window.addEventListener('click', function(e){
                        if(e.target === modal){
                            modal.style.display = 'none';
                        }
                    });

                })();
            </script>";
        echo "</tbody>";
        echo "</table>";
//=================FIN TABLA 1========================================
//=================TABLA 2========================================
        echo "<table class='table_certificate'>";
        echo "<tbody>";
        // echo "<head><tr><th colspan='10'>".get_string('certificate_title', 'block_ideal_cstatus')."</th></tr></head>";
        echo "<head><tr><th colspan='10' style='margin:0 auto; text-align:center; padding:5px'>".get_string('cerft_L_title','block_ideal_cstatus')."</th></tr></head>";

        $class_to_change_color="";
            foreach($data_renderer as $data){
                if($aux_stop!=$aux){//cerrar area
                    echo"</tr>";}

                        if($data->is_title_area=="1"){//es un titulo de area
                            $aux_stop=$data->shortname[0];
                            if($aux_stop==6){break;}//limitar hasta area 5

                            echo"<tr class='area_row'>";//abrir fila area
                            echo "<th class='title_area'>".get_string($data->shortname,'block_ideal_cstatus')."</th>";//titulo area
                            $aux=intval($aux_stop);

                        }
                        if($data->str_lvl=='title' && $data->is_title_area!="1"){//es un titulo de subarea
                            $class_to_change_color="_".substr($data->shortname,0,3)."_L";
                            $class_to_change_color=preg_replace('/\./', '_', $class_to_change_color);
                            if(substr($data->shortname,0,1)>5){
                                $class_to_change_color=$class_to_change_color . " other_level";
                            }
                            echo "<td class='title_subarea ". htmlspecialchars($class_to_change_color)."'>".$data->shortname."</td>";
                        }

                        if($data->str_lvl==='#6600FF' && $data->is_title_area!="1"){//competency L
                            if($data->competency_proficiency=="approved"){

                                $lvl_color="style='color:".$data->str_lvl.";'";
                                //Cambiar el color de fondo y texto de la subárea correspondiente
                                echo "
                                <style>
                                    .".htmlspecialchars($class_to_change_color)."{
                                        background: ".$data->str_lvl.";
                                        color:white;
                                        font-weight:bold;
                                    }
                                </style>";
                            }else{
                                $lvl_color="";
                            }
                            echo "<td class='$data->str_lvl competency' $lvl_color>".get_string($data->shortname,'block_ideal_cstatus')."</td>";
                        }elseif($data->more_lvl==="#C000FF" && $data->competency_proficiency==="approved"){
                            // echo"<pre>";var_dump(substr($class_to_change_color, 7,16));echo"</pre>";
                                $lvl_color="style='color:".$data->more_lvl.";'";
                                echo "
                                <style>
                                    .".htmlspecialchars(substr($class_to_change_color, 0,6)).".".substr($class_to_change_color, 7,16)." {
                                        background: ".$data->more_lvl.";
                                        color:white;
                                        font-weight:bold;
                                    }
                                </style>";
                        }
            }

        echo "<tfoot><tr><th colspan='10' style='margin:0 auto; text-align:center; padding:5px'>";
            if($competencies_AD_pss=$competencies_AD_pss_avalible_for_user){
                echo "<button class='btn btn-primary' id='enroll_cohort_L'>".get_string('enroll_cohort_cert', 'block_ideal_cstatus')."</button>";
            }else{
                echo"<div class='btn-primary' style='position: relative;display: flow;border-radius: 25px;'>
                    <p'>
                        <strong style='color:red;font-size: x-large;'>!   </strong>"
                        .get_string('necesario','block_ideal_cstatus')."
                    </p>
                </div>";
            }            
            echo "</th></tr></tfoot>";
      //MODAL 2
        echo "
        <div id='enrollModal2' style='display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5);'>
            <div style='background:#fff; margin:8% auto; padding:20px; border-radius:6px; width:90%; max-width:480px; box-shadow:0 2px 10px rgba(0,0,0,0.3);'>
            <h2 class='title-moda-cerf'>".get_string('cerft_L_title','block_ideal_cstatus')."</h2>"."
            <p class='msj_cert' style='margin-top:0;'>".get_string('subtitle_modal_enroll_ECDE','block_ideal_cstatus')."</p>";
            $has_available = false;
            // Primero comprobamos si hay cohortes disponibles
            foreach ($cohorts_ECDPL as $cohort) {
                if ($cohort->matriculado == 0) {
                    $has_available = true;
                    break;
                }
            }

            if ($has_available) {
                echo "<p>" . get_string('select_cert_cohort','block_ideal_cstatus') . "</p>";
                echo "<select class='select_to_cohot_certf_2'>";
                foreach ($cohorts_ECDPL as $cohort) {
                    if ($cohort->matriculado == 0) {
                        echo "<option value='" . htmlspecialchars($cohort->id) . "'>" .
                                // htmlspecialchars($cohort->name) .
                                htmlspecialchars(string: $languages[substr($cohort->name,-2)]) .
                            "</option>";
                    }
                }
                echo "</select>";
            }

            // Mostrar cohortes ya matriculados
            $has_enrolled = false;
            foreach ($cohorts_ECDPL as $cohort) {
                if ($cohort->matriculado == 1) {
                    if (!$has_enrolled) {
                        echo "<div>";
                        echo "<strong>" . get_string('already_enrolled_in','block_ideal_cstatus') . "</strong><br>";
                        echo "<ul>";
                        $has_enrolled = true;
                    }
                    // echo "<li>" . htmlspecialchars($cohort->name) . "</li>";
                    echo "<li>" . htmlspecialchars(string: $languages[substr($cohort->name,-2)]) . "</li>";
                }
            }
            echo "<div class='container_btns' style='margin:0 auto;'>";
            if ($has_available) {
                echo "</ul>";
            }

            if($has_available){
                echo "
                    <button class='btn btn-primary' 
                            id='confirmEnroll2' 
                            style='margin-right:8px;' 
                            onclick='confirmEnroll(
                                " . intval($USER->id) . ", 
                                " . json_encode($strs_msj) . ", 
                                \".select_to_cohot_certf_2\"
                            )'>
                        " . get_string('confirm', 'core') . "
                    </button>
                ";
            }
                echo"<button class='btn btn-secondary' id='cancelEnroll2'>".get_string('cancel','core')."</button>
            </div>
            </div>
        </div>";
        echo "
            <script>
                (function(){

                    var openBtn = document.getElementById('enroll_cohort_L');
                    var modal = document.getElementById('enrollModal2');
                    var cancel = document.getElementById('cancelEnroll2');
                    var confirmBtn = document.getElementById('confirmEnroll2');
                   

                    if(openBtn){
                        openBtn.addEventListener('click', function(e){
                            e.preventDefault();
                            modal.style.display = 'block';
                        });
                    }

                    if(cancel){
                        cancel.addEventListener('click', function(){
                            modal.style.display = 'none';
                        });
                    }

                    window.addEventListener('click', function(e){
                        if(e.target === modal){
                            modal.style.display = 'none';
                        }
                    });
                })();
            </script>";
        echo "</tbody>";
        echo "</table>";
        echo "</div>";
//=================FIN TABLA 2========================================
        //=======================LEYENDA===============================
        echo "
            <div id='legend_container'>
                <div id='description_legend'>

                    <h3>".get_string('lvl','block_ideal_cstatus')."</h3>

                    <div class='legend_row'>
                    <div class='legend_box' style='height:30px;width:30px;background:".get_string('#0066FF','block_ideal_cstatus').";'></div>
                    <div>".get_string('str_A','block_ideal_cstatus')."</div>
                    </div>

                    <div class='legend_row'>
                    <div class='legend_box' style='height:30px;width:30px;background:".get_string('#FF6600','block_ideal_cstatus').";'></div>
                    <div>".get_string('str_D','block_ideal_cstatus')."</div>
                    </div>

                    <div class='legend_row'>
                    <div class='legend_box' style='height:30px;width:30px;background:".get_string('#6600FF','block_ideal_cstatus').";'></div>
                    <div>".get_string('str_L','block_ideal_cstatus')."</div>
                    </div>

                    <!--<div class='legend_row'>
                    <div class='legend_box' style='height:30px;width:30px;background:".get_string('#C000FF','block_ideal_cstatus').";'></div>
                    <div>".get_string('str_Soft','block_ideal_cstatus').", ".get_string('str_Ethi','block_ideal_cstatus')." & ".get_string('str_IA','block_ideal_cstatus')."</div>
                    </div>-->

                </div>
            </div>
        ";

        //=========================================================
    }catch(Exception $e){
        echo $OUTPUT->notification('error render cerft');
    }
        $PAGE->requires->js_call_amd('block_ideal_cstatus/controller_list', 'init');

        try {
            ob_start();

        } catch (Exception $e) {
            echo $OUTPUT->notification('error render cerft');
            error_log('Error rendering circles: ' . $e->getMessage()); 
            error_log('User ID: ' . $USER->id . ' | Error details: ' . $e->getMessage());
        }

echo $OUTPUT->footer();
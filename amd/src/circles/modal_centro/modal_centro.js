
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const centro_circle = document.getElementsByClassName('circle_center_modal');
        if (!centro_circle) {
            console.error("Missing 'circle_center_modal'.");
            return;
        }
        try {
            if (centro_circle.length > 0) {
                // Crear una lista de IDs, utilizacion de var para que la ocupacion de la variable sea de funcion, no de bloque
                var ids = [];
                for (var i = 0; i < centro_circle.length; i++) {
                    var id = centro_circle[i].id; // Obtener el ID del elemento
                    if (id) {
                        ids.push(id); // Añadir el ID a la lista si existe
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }

        try {
            for (var i = 0; i < ids.length; i++) {
                let id = ids[i]; // Usa `let` para que el alcance sea de bloque
                let circle_centro_for_id = document.getElementById(id);
                if (circle_centro_for_id) {
                    circle_centro_for_id.addEventListener('click', function () {
                        showModal(id);
                    });
                } else {
                    console.error("Elemento con ID " + id + " no encontrado.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, 1000); // Ajusta el tiempo según lo necesario
});

// Función para abrir el modal 
function showModal(id) {
    const modal = document.getElementById('myModal');
    try {
        modal.style.display = 'block';
        loadLearningsPlans(id);
    } catch (error) {
        console.error(error);
        closeModal();
    }

}
function closeModal() {
    const modal = document.getElementById('myModal');

    try {
        modal.style.display = 'none';
        removetagsModal();
    } catch (error) {
        console.error(error);
    }
}

function removetagsModal() {
    let img = document.getElementById('all_competence_complete_img');
    let title_h5 = document.getElementById('title_modal_');

    let title_ = modal_txt_title;


    let title = document.querySelector('.title_modal');
    const canvas = document.getElementById('confettiCanvas');
    title.innerHTML = " ";

    try {
        const rows = document.querySelectorAll('tr.tr_competency');
        if (rows) {
            rows.forEach(function (row) {
                // Eliminar todos los hijos de la fila
                while (row.firstChild) {
                    row.removeChild(row.firstChild);
                }
                row.remove();
            });
        }

        const noContentRow = document.getElementById('no_content');
        if (noContentRow) {
            while (noContentRow.firstChild) {
                noContentRow.removeChild(noContentRow.firstChild);
            }
            noContentRow.remove();
        }

        if (img) {
            let padre = img.parentNode;
            padre.removeChild(img);
            canvas.style.visibility = 'hidden';
        }

        let lista_learning_plans = Array.prototype.slice.call(document.getElementsByClassName("lista_cursos"), 0);

        for (element of lista_learning_plans) {
            element.remove();
        }
        // Elimina todos los nodos de texto dentro de title_h5
        while (title_h5.firstChild) {
            title_h5.removeChild(title_h5.firstChild);
        }
        // Agrega el nuevo texto
        title_h5.appendChild(document.createTextNode(title_));
    } catch (error) {
        console.error(error);
        closeModal();
    }
}

function set_lang_filtre_modal(lang_user) {

    try {
        var list_languages = document.getElementById('list_languages');
        if (!list_languages) {
            throw new Error("'list_languages' element not found.");
        }

        // Clear existing options to avoid duplicates
        while (list_languages.firstChild) {
            list_languages.removeChild(list_languages.firstChild);
        }

        // Add language options
        var languages = lang_user === "en" ? ["en"] : [lang_user,"en"];
        languages.forEach(function (lang) {
            var option = document.createElement("option");
            option.id = lang;
            option.value = lang;
            var text = document.createTextNode(lang);
            option.appendChild(text);
            list_languages.appendChild(option);
        });

        list_languages.style.visibility = "visible";
    } catch (error) {
        console.error("Error in set_lang_filtre_modal:", error);
    }
}

function filterLanguages() {
    var selectedValue = document.getElementById('list_languages').value;
    var elements = document.querySelectorAll('.tr_competency');

    elements.forEach(function (element) {
        if (element.id === selectedValue) {
            element.style.display = 'table-row';
        } else {
            element.style.display = 'none';
        }
    });
}

function registrar_o_no(str_registered_) {
    const listLanguages = document.getElementById('list_languages');
    var count_register=0;
    if (listLanguages) {
        listLanguages.addEventListener('change', function () {
            const rows = document.querySelectorAll('#table_competency .tr_competency');
            const selectedValue = listLanguages.value;
            filterLanguages(); // Llama a la función para filtrar las filas según el idioma seleccionado
            rows.forEach(row => {
                const tdMatriculado = row.querySelector('.td_matriculado');
                if (tdMatriculado.textContent.trim() === str_registered_) {
                    //
                }else{
                    count_register=+count_register+1;
                    if(count_register>1){
                        row.style.display = 'none';
                    }
                }
            });
        });
        if (count_register === 0) {
            const rows = document.querySelectorAll('#table_competency .tr_competency');
            rows.forEach((row, index) => {
                const tdMatriculado = row.querySelector('.td_matriculado');
                if(tdMatriculado.textContent.trim() !== str_registered_){
                    if (index !== 0) {
                        row.style.display = 'none'; // Oculta todos los elementos excepto el primero
                    }
                }
            });
        }
    } else {
        console.error("'list_languages' element not found.");
    }
}

async function loadLearningsPlans(id) {
    id = id.slice(-1);
    var cabecera = document.querySelector(`#cabecera_` + id).textContent;
    var cabecera_modal = document.querySelector('.title_modal');
    var text = document.createTextNode(cabecera);
    cabecera_modal.appendChild(text);

    try {
        const learning_plans_ = window.learning_plans;
        var lang_user=window.lang_user_; /*lenguaje del usuario seleccionado*/
        set_lang_filtre_modal(lang_user); /*add option de idiomas learning */
        const str_completed_ = window.str_completed;
        const str_proccess_ = window.str_in_progress;
        const str_registered_ = window.str_registered;
        const str_not_registered_ = window.str_not_registered;
        const str_not_learningP_ = window.str_not_learningP;
        let learning_plans = []; 

        for (const [key, value] of Object.entries(learning_plans_)) {
            var name_template_lp_l = String(value.templatename);//nombre de template LP
            var id_compe_relacionadas_template_lp_se = name_template_lp_l.slice(0, 1); //id por el cual se filtrara las competencias

                if (value.lang_lp === "en" || value.lang_lp===lang_user) {
                    if(id === id_compe_relacionadas_template_lp_se ){
                        let newLearningPlan = {
                            templateid: value.templateid,
                            templatename: value.templatename,
                            num_competencies: value.num_competencies,
                            matriculado: value.matriculado,
                            lvl: value.lvl,
                            learningplanname: value.learningplanname,
                            learningplanid: value.learningplanid,
                            competency_completed: value.competency_completed,
                            lang_lp: value.lang_lp,
                        };
                        learning_plans.push(newLearningPlan);
                    }
                }
        }

        if (!learning_plans || typeof learning_plans !== "object") {
            throw new Error("El objeto 'learning_plans' no está definido o no es válido.");
        }
        // Verificamos que el elemento del DOM exista antes de usarlo.
        const div_modal_content = document.getElementById('modal-content');
        if (!div_modal_content) {
            throw new Error("'modal-content' no existe.");
        }
        if (learning_plans) {

            for (const [key, learningP] of Object.entries(learning_plans)) {
                var level_competency = String(learningP.lvl);
                var name_template_lp_l = String(learningP.templatename);

                const learning_a = document.createElement('a');
                //const course_a = document.createElement('a');
                //course_a.className="course_a";
                const nivel_div = document.createElement('div');
                const table_competency = document.getElementById('table_competency');

                learning_a.className = "learning_a";
                learning_a.textContent = `${learningP.templatename} `;
                text = document.createTextNode(`${learningP.lvl} `);
                nivel_div.className = "img_level";
                //Verificamos que Nivel mantiene A,D,L y O(otros o 6 y 7)
                switch (learningP.lvl) {
                    case 'A':
                        var text = document.createTextNode("A");
                        nivel_div.id = "img_level_" + level_competency;
                        nivel_div.style.borderRadius = "50%";
                        nivel_div.appendChild(text);
                        break;
                    case 'D':
                        text = document.createTextNode("D");
                        nivel_div.id = "img_level_" + level_competency;
                        nivel_div.style.borderRadius = "50%";
                        nivel_div.appendChild(text);
                        break;
                    case 'L':
                        text = document.createTextNode("L");
                        nivel_div.id = "img_level_" + level_competency;
                        nivel_div.style.borderRadius = "50%";
                        nivel_div.appendChild(text);
                        break;
                    case 'AD':
                            text = document.createTextNode("AD");
                            nivel_div.id = "img_level_AD";
                            nivel_div.style.background = "linear-gradient(to right, #0466ff 50%, #ff6601 50%)";
                            nivel_div.style.borderRadius = "50%";
                            nivel_div.appendChild(text);
                            break;
                    default:
                        nivel_div.id = "img_level_O";
                        text = document.createTextNode("O");
                        nivel_div.style.borderRadius = "50%";
                        nivel_div.appendChild(text);
                        break;
   
                }
                var appro_txt;
                if (parseInt(learningP.num_competencies) === parseInt(learningP.competency_completed)) {
                    if(learningP.matriculado === "1"){
                     appro_txt = document.createTextNode(str_completed_ +" "+ `${learningP.competency_completed}`+'/'+`${learningP.num_competencies}`);
                    }else {
                        //appro_txt = document.createTextNode("PATATA"+" "+ `${learningP.competency_completed}`+'/'+`${learningP.num_competencies}`);
                         appro_txt = document.createTextNode( `${learningP.competency_completed}`+'/'+`${learningP.num_competencies}`);
                    }
                } else if (parseInt(learningP.num_competencies) > parseInt(learningP.competency_completed)) {
                     appro_txt = document.createTextNode(`${learningP.competency_completed}`+'/'+`${learningP.num_competencies}`);
                     if (learningP.matriculado === "1") {
                        appro_txt = document.createTextNode(str_proccess_+" "+`${learningP.competency_completed}`+'/'+`${learningP.num_competencies}`);
                    }
                }
                learning_a.style.color = "black";
                learning_a.target = "_blank";

                const tr_3 = document.createElement('tr');
                tr_3.id = `${learningP.lang_lp}`;
                tr_3.className = "tr_competency";
                const td_competency = document.createElement('td');
                const div_icon_compe = document.createElement('div');
                div_icon_compe.className = "div_icon_compe";
                td_competency.appendChild(learning_a);



                const td_lcompleto = document.createElement('td');
                td_lcompleto.appendChild(appro_txt);

                td_lcompleto.className = "status_competency";

                const td_lvl = document.createElement('td');
                td_lvl.classList = "td_nivel";
                td_lvl.appendChild(nivel_div);
                // console.log(`${learningP.shortname} ` );
                approved_competency = false;
                tr_3.appendChild(td_competency);
                tr_3.appendChild(td_lcompleto);
                tr_3.appendChild(td_lvl);

                const tr_4 = document.createElement('tr');
                tr_4.id = `${learningP.shortname} `;
                tr_4.className = "tr_matriculado";
                const td_matriculado = document.createElement('td');
                tr_4.appendChild(td_matriculado);
                td_matriculado.className = "td_matriculado";
                //VOY POR AQUI
                var a_regitrado=document.createElement("a");

                if (`${learningP.matriculado}` == "1") {
                    var matriculado_txt = document.createTextNode(str_registered_);
                    a_regitrado.appendChild(matriculado_txt);
                } else {
                    var matriculado_txt = document.createTextNode(str_not_registered_);
                    a_regitrado.appendChild(matriculado_txt);
                    a_regitrado.href=`../blocks/ideal_cstatus/classes/learning_cohortes.php?id=${learningP.templateid}`;
                }
                td_matriculado.appendChild(a_regitrado);
                tr_3.appendChild(td_matriculado);
                table_competency.appendChild(tr_3);
            };
            if (learning_plans.length === 0) {
                const table_competency = document.getElementById('table_competency');
                if (table_competency) {
                    const tr_no_content = document.createElement('tr');
                    tr_no_content.className = "no_content";
                    tr_no_content.id = "no_content";
                    const td_no_content = document.createElement('td');
                    td_no_content.colSpan = "3"; // Ajusta el número de columnas según tu tabla
                    td_no_content.textContent = str_not_learningP_;
                    tr_no_content.appendChild(td_no_content);
                    table_competency.appendChild(tr_no_content);
                }
            }
        }
        filterLanguages();
        registrar_o_no(str_registered_);

        /*var statusCompetencies = document.querySelectorAll(".status_competency");
         // Obtén el número de elementos
         var count = statusCompetencies.length;
         let status_count=0;
         try {
             // Recorre los elementos para obtener el texto de cada uno
             statusCompetencies.forEach((element, index) => {
                 let status=`${element.textContent.trim()}`;
                 if(status=="Completado" || status=="Completed"){
                     status_count++;
                 }
             });
 
             if(status_count==count){
                 const img = document.createElement('img');
                 img.src = "../blocks/ideal_cstatus/templates/media/img/all_complete_2.png";
                 img.id = "all_competence_complete_img";
                 const div_contaimner_canvas = document.getElementById('all_complete');
                 div_contaimner_canvas.appendChild(img);
                 const canvas=document.querySelector('#confettiCanvas');
                 canvas.style.visibility='visible';
             }
         } catch (error) {
             console.error(error);
         }*/
    } catch (error) {
        console.error('loadLearningsPlans', error);
    }
}


function get_and_set_cabecera(compe_circle) {
    let cabecera = document.querySelector(`#cabecera_` + compe_circle).textContent;
    try {
        let cabecera_modal = document.querySelector('.title_modal');
        var text = document.createTextNode(cabecera);

        cabecera_modal.appendChild(text);

    } catch (error) {
        console.error(error);
    }
}

/**/

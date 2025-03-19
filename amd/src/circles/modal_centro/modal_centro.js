
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
        removeCourses();
    } catch (error) {
        console.error(error);
    }
}

function removeCourses() {
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

        let lista_cursos_p = Array.prototype.slice.call(document.getElementsByClassName("lista_cursos"), 0);

        for (element of lista_cursos_p) {
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

async function loadLearningsPlans(id) {
    id = id.slice(-1);
    var cabecera = document.querySelector(`#cabecera_` + id).textContent;
    var cabecera_modal = document.querySelector('.title_modal');
    var text = document.createTextNode(cabecera);
    cabecera_modal.appendChild(text);

    try {
        const learning_plans_ = window.learning_plans;
        let learning_plans = []; // Declarar el array fuera del bucle

        for (const [key, value] of Object.entries(learning_plans_)) {
            var name_template_lp_l = String(value.templatename);
            var name_template_lp_lo = name_template_lp_l.slice(0, 1);
            var name_template_lp_se = name_template_lp_l.slice(4, 5);
            var name_template_lp_se2 = name_template_lp_l.slice(1, 2);


            if (id == name_template_lp_lo || id == name_template_lp_se || id == name_template_lp_se2) {

                // Crear un nuevo objeto con los campos deseados
                let newLearningPlan = {
                    templateid: value.templateid,
                    templatename: value.templatename,
                    num_competencies: value.num_competencies,
                    matriculado: value.matriculado,
                    lvl: value.lvl,
                    learningplanname: value.learningplanname,
                    learningplanid: value.learningplanid,
                    competency_completed: value.competency_completed,
                };

                // Agregar el nuevo objeto al array
                learning_plans.push(newLearningPlan);
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
                /* console.error(`Key: ${key}, Template ID: ${learningP.templateid}`);
                 console.error(`Key: ${key}, templatename: ${learningP.templatename}`);
                 console.error(`Key: ${key}, learningplanid: ${learningP.learningplanid}`);
                 console.error(`Key: ${key}, learningplanname: ${learningP.learningplanname}`);
                 console.error(`Key: ${key}, matriculado: ${learningP.matriculado}`);
                 console.error(`Key: ${key}, num_competencies: ${learningP.num_competencies}`);
                 console.error(`Key: ${key}, competency_completed: ${learningP.competency_completed}`);
                 console.error(`Key: ${key}, lvl: ${learningP.lvl}`);
                 console.log('-----------------------------');*/
                var level_competency = String(learningP.lvl);
                var name_template_lp_l = String(learningP.templatename);
                var name_template_lp_lo = name_template_lp_l.slice(0, 1);
                var name_template_lp_se = name_template_lp_l.slice(4, 5);

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
                switch (level_competency) {
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
                    case 'O':
                        nivel_div.id = "img_level_" + level_competency;
                        text = document.createTextNode("O");
                        nivel_div.style.borderRadius = "50%";
                        nivel_div.appendChild(text);
                        break;
                    default:

                        break;
                }
                if (parseInt(learningP.num_competencies) === parseInt(learningP.competency_completed)) {
                    var appro_txt = document.createTextNode(`Completado ` + `${learningP.num_competencies}` + `/` + `${learningP.competency_completed}`);
                } else if (parseInt(learningP.num_competencies) > parseInt(learningP.competency_completed)) {
                    var appro_txt = document.createTextNode(`En Proceso ` + `${learningP.num_competencies}` + `/` + `${learningP.competency_completed}`);
                }

                learning_a.style.color = "black";
                learning_a.target = "_blank";

                const tr_3 = document.createElement('tr');
                tr_3.id = `${learningP.shortname} `;
                tr_3.className = "tr_competency";
                const td_competency = document.createElement('td');
                const div_icon_compe = document.createElement('div');
                div_icon_compe.className = "div_icon_compe";
                td_competency.appendChild(learning_a);
                //add icon atd competencie
                const img_icon_ir = document.createElement('i');
                const a_icon_ir = document.createElement('a');

                if (`${learningP.approved}` !== 'Completado' && `${learningP.approved}` !== 'Completed') {
                    let avanzar_txt_ = avanzar_txt;
                    a_icon_ir.className = "fas fa-forward";
                    let p_txt = document.createElement('p');
                    p_txt.className = "p_txt";
                    let txt = document.createTextNode(avanzar_txt_);
                    txt.className = "txt_icon_ir";
                    p_txt.appendChild(txt);
                    //div_icon_compe.appendChild(p_txt);
                }

                // td_competency.appendChild(a_icon_ir);
                img_icon_ir.id = "img_ir_competence";
                a_icon_ir.href = `../blocks/ideal_cstatus/classes/learning_cohortes.php?id=${learningP.id}`;
                a_icon_ir.target = "_blank";
                a_icon_ir.id = "img_ir_competence";

                const td_lcompleto = document.createElement('td');
                td_lcompleto.appendChild(appro_txt);

                td_lcompleto.className = "status_competency";

                const td_lvl = document.createElement('td');
                td_lvl.classList = "td_nivel";
                td_lvl.appendChild(nivel_div);
                //ESTOY AQUI
                // console.log(`${learningP.shortname} ` );
                approved_competency = false;
                tr_3.appendChild(td_competency);

                //td_icon.appendChild(a_icon_ir);
                //div_icon_compe.appendChild(a_icon_ir);
                const td_icon = document.createElement('td');
                td_icon.className = "td_icon";
                td_icon.appendChild(div_icon_compe);
                td_competency.appendChild(td_icon);

                tr_3.appendChild(td_lcompleto);
                tr_3.appendChild(td_lvl);

                const tr_4 = document.createElement('tr');
                tr_4.id = `${learningP.shortname} `;
                tr_4.className = "tr_matriculado";
                const td_matriculado = document.createElement('td');
                tr_4.appendChild(td_matriculado);
                td_matriculado.className = "td_matriculado";
                if (`${learningP.matriculado}` == "1") {
                    var matriculado_txt = document.createTextNode(`Matriculado`);
                } else {
                    var matriculado_txt = document.createTextNode(`No Matriculado`);
                }
                td_matriculado.appendChild(matriculado_txt);
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
                    td_no_content.textContent = "No se encontraron learnings plans.";
                    tr_no_content.appendChild(td_no_content);
                    table_competency.appendChild(tr_no_content);
                }
            }
        }

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

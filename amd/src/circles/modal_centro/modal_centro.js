<<<<<<< HEAD
function get_modal() {
=======



document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
>>>>>>> eea2b9b (lang all partners)
        const centro_circle = document.getElementsByClassName('circle_center_modal');
        var ids = [];
        if (!centro_circle) {
            console.error("Missing 'circle_center_modal'.");
            return;
        }
        try {
            if (centro_circle.length > 0) {
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
}

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
    const modal_centro = document.getElementById('myModal');
    try {
        modal_centro.style.display = 'none';
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

function filterLanguages(lang_user) {
    try {
        var listLanguagesElement = document.getElementById('list_languages');
        if (!listLanguagesElement) {
            throw new Error("'list_languages' element not found.");
        }

        var selectedValue = listLanguagesElement.value;
        var elements = document.querySelectorAll('.tr_competency');
        if (!elements || elements.length === 0) {
            not_learning_plans();
            console.warn("No elements with class 'tr_competency' found.");
        }

        var count_lang_user = 0;
        var count_lang_user_en = 0;

        elements.forEach(function (element) {
             // Logs the number of child elements
            if (element.id === selectedValue) {
                count_lang_user++;
                element.style.display = 'table-row';
                var str_no_lp = document.getElementById("no_content");
                if (str_no_lp) {
                    str_no_lp.style.display = "none";
                }
            } else {
                count_lang_user_en++;
                element.style.display = 'none';
            }
        });
        if(count_lang_user <1 && selectedValue === lang_user){
            not_learning_plans();
        }
    } catch (error) {
        console.error("Error in filterLanguages:", error);
    }
}

// Función para agregar el estado de inscripción a los planes de aprendizaje
// Esta función toma un array de objetos de planes de aprendizaje y agrega la propiedad can_enroll
// a cada objeto según las reglas de negocio definidas
function addEnrollmentStatus(learning_plans) {
    try {
        if (!Array.isArray(learning_plans)) {
            throw new Error("El parámetro 'learning_plans' no es un array válido.");
        }
        const groupedByLang = {};
        const levelOrder = { "A": 1, "AD": 2, "D": 3, "L": 4, "O": 5 };

        // Agrupar por idioma
        learning_plans.forEach(plan => {
            if (!plan || typeof plan !== "object") {
                console.warn("Elemento inválido en 'learning_plans':", plan);
                return;
            }
            if (!groupedByLang[plan.lang_lp]) {
                groupedByLang[plan.lang_lp] = [];
            }
            groupedByLang[plan.lang_lp].push(plan);
        });

        Object.keys(groupedByLang).forEach(lang => {
            let plans = groupedByLang[lang];

            // Ordenar por nivel según levelOrder
            plans.sort((a, b) => {
                return (levelOrder[a.lvl] || 999) - (levelOrder[b.lvl] || 999);
            });
            let previousCompleted = true;

            let anyEnrolled = plans.some(plan => parseInt(plan.matriculado, 10) === 1);

            // Si no hay matriculados, permitir inscripción en el primero
            if (!anyEnrolled && plans.length > 0) {
                plans[0].can_enroll = 1;
            }

            plans.forEach(plan => {
                plan.can_enroll = plan.can_enroll || 0;

                if (previousCompleted) {
                    plan.can_enroll = 1;
                }else{
                    plan.can_enroll = 0;
                    return;
                }

                const isEnrolled = parseInt(plan.matriculado, 10) === 1;
                const competencies = parseInt(plan.num_competencies, 10);
                const completed = parseInt(plan.competency_completed, 10);

                if (isNaN(competencies) || isNaN(completed)) {
                    console.warn("Datos inválidos en el plan:", plan);
                }
                //console.warn("is_enroll: "+isEnrolled  +"  competencies: "+competencies +" completed: "+completed);
                previousCompleted=true;                
                if (!isEnrolled || completed!==competencies ) {
                    previousCompleted = false;
                    return;
                }
            });
        });

        //  rsultado final ordenado por idioma y nivel
        const orderedFlatArray = [];
        Object.keys(groupedByLang)
            .sort() // orden alfabético de idiomas
            .forEach(lang => {
                orderedFlatArray.push(...groupedByLang[lang]);
            });
        return orderedFlatArray;
    } catch (error) {
        console.error("Error en 'addEnrollmentStatus':", error);
        return [];
    }
}

// Función para filtrar los planes de aprendizaje por idioma del usuario
function filtre_lp_lang_area(learning_plans_, id, lang_user) {
    let learning_plans = [];

    try {
        if (!learning_plans_ || typeof learning_plans_ !== "object") {
        throw new Error("error in objet");
        }
        if (!id || typeof id !== "string") {
        throw new Error("El parámetro 'id' no está definido o no es válido.");
        }
        if (!lang_user || typeof lang_user !== "string") {
        throw new Error("El parámetro 'lang_user' no está definido o no es válido.");
        }

        const plans_by_id = learning_plans_[id];
        if (!plans_by_id || typeof plans_by_id !== "object") {
            console.warn(`no lp for id:  '${id}'`);
            return [];
        }

        for (const [key, value] of Object.entries(learning_plans_[id])) {
            if (!value || typeof value !== "object") {
                console.warn(`El valor de la entrada '${key}' no es un objeto válido.`);

                continue;
            }

            if (value.lang_lp === "en" || value.lang_lp === lang_user) {
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
                    can_enroll: value.can_enroll,
                };
                learning_plans.push(newLearningPlan);
            }
        }
        learning_plans.sort((a, b) => a.templatename.localeCompare(b.templatename)); // ordenado de manera ASc
        return learning_plans;
    } catch (error) {
        console.error(error); 
        return learning_plans["--"];
    }
}

// Función para mostrar el modal de inscripción en el plan de aprendizaje
function modal_enrol_in_lp(a_regitrado,lp_enroled,lp_template_id,id_user_search_competence_){
    a_regitrado.addEventListener('click', async function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        // Verificar si el modal ya existe
        if (document.getElementById('enrollCohortModal')) {
            return;
        }
        try {
            // Realizar una solicitud fetch para obtener el contenido del curso
            if(lp_enroled==="1"){//lp_enroled
                const response = await fetch(`../blocks/ideal_cstatus/classes/learning_cohortes.php?id=${lp_template_id}&userid=${id_user_search_competence_}`);//lp_template_id
            if (!response.ok) {
                throw new Error('Error al cargar el contenido');
            }
            const courseContent = await response.text();
            // Crear el modal
            const modal = document.createElement('div');
            modal.id = 'enrollCohortModal';
            modal.style.top="30%";
            modal.style.left="30%";
            modal.style.position = 'fixed';
            modal.style.width = '40%';
            modal.style.height="20%";
            modal.style.backgroundColor = '#fff';
            modal.style.zIndex = '100000';
            modal.style.overflowY = 'auto';
            modal.style.borderRadius = '8px';
            modal.style.boxShadow = '#6a90b2 0px 4px 8px';
            modal.style.padding = '20px';
            modal.style.margin = '0 auto';
            modal.style.textAlign="center";
            modal.style.backgroundColor="rgb(198 217 227 / 97%)";
            modal.style.display="flex";
            modal.style.flexDirection="column";
            modal.style.flexWrap="nowarap";
            modal.style.justifyContent="center";
            modal.style.minHeight="140px";

            // Botón para cerrar el modal
            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.padding = '10px 15px';
            closeButton.style.backgroundColor = '#77c7e3';
            closeButton.style.color = 'black';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.zIndex = '10000';
            closeButton.style.fontWeight = 'bold';

            closeButton.addEventListener('click', function () {
                document.body.removeChild(modal);
            });
            document.addEventListener('click', function (event) {
                try {
                    const modalBehind = document.getElementById('myModal');
                    if (!modalBehind || modalBehind.style.display === 'none') {
                        if (event.target.id !== 'enrollCohortModal' && !document.getElementById('enrollCohortModal').contains(event.target)) {
                            document.body.removeChild(modal);
                        }
                    }
                } catch (error) {
                    console.error('Error in click event listener:', error);
                }
            });
            // Insertar el contenido de los lp en modal
            const contentContainer = document.createElement('div');
            contentContainer.innerHTML = courseContent;
            modal.appendChild(closeButton);
            modal.appendChild(contentContainer);
            document.body.appendChild(modal);
        }
        } catch (error) {
            console.error('Error al cargar el contenido del curso:', error);
        }
    });
}
//crgar lp al modal
async function loadLearningsPlans(id) {
    id = id.slice(-1);//id del circulo seleccionado, cada circulo tiene como nombre circle_centro_X, con el slice se coge el ultimo caracter de este id
    var cabecera = document.querySelector(`#cabecera_` + id).textContent;//titulo de la area
    var cabecera_modal = document.querySelector('.title_modal');
    var text = document.createTextNode(cabecera);
    cabecera_modal.appendChild(text);//add nombre de area en modals
    try {
        var id_user_search_competence_=window.user_id_search_; //variable del renderer
        const learning_plans_ = window.learning_plans;//variable del renderer
        var lang_user=window.lang_user_; /*lenguaje del usuario seleccionado*/
        try { set_lang_filtre_modal(lang_user);  } catch (err) { console.error("Error set_lang_filtre_modal: ", err); }

        //set_lang_filtre_modal(lang_user); /*add option de idiomas learning */
        const str_completed_ = window.str_completed;
        const str_proccess_ = window.str_in_progress;
        const str_registered_ = window.str_registered;
        const str_not_registered_ = window.str_not_registered;
        const tr_not_learningP_tooltip_ = window.tr_not_learningP_tooltip;
        let learning_plans = []; 
        learning_plans=filtre_lp_lang_area(learning_plans_,id,lang_user);
        const updatedLearningPlans = addEnrollmentStatus(learning_plans);
   
        if (!learning_plans || typeof learning_plans !== "object") {
            throw new Error("El objeto 'learning_plans' no está definido o no es válido.");
        }
=======
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
    title.innerHTML=" ";
    
    try {
        const rows = document.querySelectorAll('tr.tr_competency');
        if(rows){
        rows.forEach(function(row) {
            // Eliminar todos los hijos de la fila
            while (row.firstChild) {
                row.removeChild(row.firstChild);
            }
                row.remove();
            });
        }

        if (img) {
            let padre = img.parentNode;
            padre.removeChild(img);
            canvas.style.visibility='hidden';
        }

        let lista_cursos_p = Array.prototype.slice.call(document.getElementsByClassName("lista_cursos"), 0);

        for(element of lista_cursos_p){
            element.remove();
        }  
            // Elimina todos los nodos de texto dentro de title_h5
            while (title_h5.firstChild) {
                title_h5.removeChild(title_h5.firstChild);
            }
            title_h5.appendChild(document.createTextNode(title_));
    } catch (error) {
        console.error(error);   
        closeModal();        
    }
}

async function loadCourses(id) {

    try {
        const courses = window.course;
        const datas = window.data;


        if (!courses || typeof courses !== "object") {
            throw new Error("El objeto 'courses' no está definido o no es válido.");
        }
        const renamedCourses = {}; // Nuevo objeto con las claves renombradas
        let index = 1;
        // invertir 6 y 7
        Object.keys(courses).forEach(function (key) {
            if (index <= 7) { 
                let newKey = `centro_circle_${index}`;
                if (index === 6) {
                    newKey = `centro_circle_${index + 1}`;
                }
                if (index === 7) {
                    newKey = `centro_circle_${index - 1}`;
                }
                renamedCourses[newKey] = courses[key]; // Asignamos el valor con la nueva clave
                index++;
            } else {
                console.warn(error);
            }
        });

>>>>>>> eea2b9b (lang all partners)
        // Verificamos que el elemento del DOM exista antes de usarlo.
        const div_modal_content = document.getElementById('modal-content');
        if (!div_modal_content) {
            throw new Error("'modal-content' no existe.");
        }
<<<<<<< HEAD
        if (updatedLearningPlans) {
            for (const [key, learningP] of Object.entries(updatedLearningPlans)) {
                var level_competency = String(learningP.lvl);
                const learning_a = document.createElement('a');
                const nivel_div = document.createElement('div');
                const table_competency = document.getElementById('table_competency');
                learning_a.className = "learning_a";
                learning_a.textContent = `${learningP.templatename} `;
                text = document.createTextNode(`${learningP.lvl} `);
                nivel_div.className = "img_level";
                //Verificamos que Nivel mantiene A,D,L y O(otros o 6,7 y 8)
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
                var a_regitrado=document.createElement("a");                
                if (`${learningP.matriculado}` === "1") {
                    var matriculado_txt = document.createTextNode(str_registered_);
                    a_regitrado.appendChild(matriculado_txt);
                } else {
                    var matriculado_txt = document.createTextNode(str_not_registered_);
                    a_regitrado.appendChild(matriculado_txt);
                    if(`${learningP.can_enroll}`==="1"){
                        a_regitrado.style.color="blue";
                        a_regitrado.className="tooltip";
                        var span_tooltip=document.createElement('span');
                        var txt_span_tooltip=tr_not_learningP_tooltip_;
                        var tooltipText = document.createTextNode(txt_span_tooltip);
                        span_tooltip.appendChild(tooltipText);
                        span_tooltip.className = "tooltiptext";
                        a_regitrado.appendChild(span_tooltip);
                    }else{
                        a_regitrado.removeAttribute("href");
                        a_regitrado.style.cursor = "default"; 
                    }
                }
                td_matriculado.appendChild(a_regitrado);
                tr_3.appendChild(td_matriculado);
                table_competency.appendChild(tr_3);
                if(`${learningP.can_enroll}`==="1"){//set href in lp not enroll
                    modal_enrol_in_lp(a_regitrado,`${learningP.can_enroll}`,`${learningP.templateid}`,id_user_search_competence_)
                }
            };
            filterLanguages(lang_user);
        }
    } catch (error) {
        console.error('loadLearningsPlans', error);
    }
}

//agrega el msj al modal central si no hy lp disponibles
function not_learning_plans() {
    const str_not_learningP_ = window.str_not_learningP;
    const table_competency = document.getElementById('table_competency');
    try {
        if (!table_competency) {
            console.error("'table_competency' element not found.");
            return;
        }
        // Si el msj ya esta en el modal no se muestra una vez mas
        if (document.getElementById('no_content')) {
            console.warn("The 'no_content' message is already displayed.");
            return;
        }
        const tr_no_content = document.createElement('tr');    
        tr_no_content.className = "no_content";
        tr_no_content.id = "no_content";
        const td_no_content = document.createElement('td');
        td_no_content.colSpan = "3"; // Adjust the number of columns according to your table
        td_no_content.textContent = str_not_learningP_;
        tr_no_content.appendChild(td_no_content);
        table_competency.appendChild(tr_no_content);
        var approved_competency=true;

        // Validamos si hay cursos disponibles para el ID proporcionado.
        if (renamedCourses[id]) {
            get_and_set_cabecera(id.slice(14,15));
            Object.values(renamedCourses[id]).some(course => {
                let level_competency=`${course.shortname} `;
                let compe_circle=level_competency.slice(0,1);
                level_competency=level_competency.slice(3,4);

                const competency_a = document.createElement('a');
                const course_a = document.createElement('a');
                course_a.className="course_a";
                const  nivel_div= document.createElement('div');
                const table_competency = document.getElementById('table_competency');

                if(compe_circle<6){
                    if(level_competency!=" "){
                        competency_a.className = "competency_a";
                        competency_a.textContent = `${course.shortname} `;
                    }
                }else{
                    competency_a.className = "competency_a";
                    competency_a.textContent = `${course.shortname} `;
                    text=document.createTextNode("O");
                    nivel_div.className = "img_level";
                    nivel_div.style.background="#C000FF";
                    nivel_div.style.borderRadius="50%";
                    nivel_div.appendChild(text);
                }
                //Verificamos que Nivel mantiene A,D,L y O(otros o 6 y 7)
                switch(level_competency){
                    case 'A':
                        var text=document.createTextNode("A");
                        nivel_div.className = "img_level";
                        nivel_div.style.background="rgb(0 102 255 / 77%)";
                        nivel_div.style.borderRadius="50%";
                        nivel_div.appendChild(text);
                    break;
                    case 'D':
                         text=document.createTextNode("D");
                         nivel_div.className = "img_level";
                         nivel_div.style.background="rgb(255 102 0 / 77%)";
                         nivel_div.style.borderRadius="50%";
                         nivel_div.appendChild(text);
                    break;
                    case 'L':
                        text=document.createTextNode("L");
                        nivel_div.className = "img_level";
                        nivel_div.style.background="rgb(102 0 255 / 77%)";
                        nivel_div.style.borderRadius="50%";
                        nivel_div.appendChild(text);
                    break;
                    default :

                    break;
                }
                let appro_txt=document.createTextNode(`${course.approved}`);
                competency_a.style.color = "black";
                competency_a.target = "_blank";

                const tr_3 = document.createElement('tr');
                tr_3.id=`${course.shortname} `;
                tr_3.className="tr_competency";
                const td_competency = document.createElement('td');
                const div_icon_compe = document.createElement('div');
                div_icon_compe.className="div_icon_compe";
                td_competency.appendChild(competency_a);
                //add icon atd competencie
                const img_icon_ir= document.createElement('i');
                const a_icon_ir= document.createElement('a');

                if(`${course.approved}` !== 'Completado' && `${course.approved}` !== 'Completed'){
                    let avanzar_txt_=avanzar_txt;
                    a_icon_ir.className="fas fa-forward";
                    let p_txt=document.createElement('p');
                    p_txt.className="p_txt";
                    let txt=document.createTextNode(avanzar_txt_);
                    txt.className="txt_icon_ir";
                    p_txt.appendChild(txt);
                    div_icon_compe.appendChild(p_txt);
                }
                //traza console.error(`${course.id}`);

                td_competency.appendChild(a_icon_ir);
                img_icon_ir.id="img_ir_competence";
                a_icon_ir.href = `../blocks/ideal_cstatus/classes/learning_cohortes.php?id=${course.id}`;
                a_icon_ir.target="_blank";
                a_icon_ir.id="img_ir_competence";

                const td_lcompleto = document.createElement('td');
                td_lcompleto.appendChild(appro_txt);

                td_lcompleto.className="status_competency";
                
                const td_lvl= document.createElement('td');
                td_lvl.classList="td_nivel";
                td_lvl.appendChild(nivel_div);
                //ESTOY AQUI
               // console.log(`${course.shortname} ` );
                approved_competency=false;
                tr_3.appendChild(td_competency);

                //td_icon.appendChild(a_icon_ir);
                div_icon_compe.appendChild(a_icon_ir);
                const td_icon = document.createElement('td');
                td_icon.className="td_icon";
                td_icon.appendChild(div_icon_compe);
                td_competency.appendChild(td_icon);

                tr_3.appendChild(td_lcompleto);
                tr_3.appendChild(td_lvl);

                if(level_competency!=" " || compe_circle>5){
                    table_competency.appendChild(tr_3);
                }
                //Detenemos si no ha completado competencias segun el nivel
                if(course.approved!=="Complete" && course.approved!=="Completado" &&course.shortname.slice(3,4)!==" "){
                    if(course.shortname.slice(3,4)=="L"){
                        return true;
                    }
                }
            });
        } else {
            console.error(`centro_circle_${id}.`);
        }
        var statusCompetencies = document.querySelectorAll(".status_competency");
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
        }
    } catch (error) {
        console.error('loadCourses', error);
    }
}


function get_and_set_cabecera(compe_circle){
    let cabecera =document.querySelector(`#cabecera_`+compe_circle).textContent;
    try {
        let cabecera_modal=document.querySelector('.title_modal');
        var text=document.createTextNode(cabecera);
        
        cabecera_modal.appendChild(text);

>>>>>>> eea2b9b (lang all partners)
    } catch (error) {
        console.error(error);
    }
}


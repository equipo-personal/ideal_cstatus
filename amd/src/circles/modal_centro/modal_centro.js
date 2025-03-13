


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
        loadCourses(id);
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

        // Verificamos que el elemento del DOM exista antes de usarlo.
        const div_modal_content = document.getElementById('modal-content');
        if (!div_modal_content) {
            throw new Error("'modal-content' no existe.");
        }
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

    } catch (error) {
        console.error(error);
    }
}

/**/ 

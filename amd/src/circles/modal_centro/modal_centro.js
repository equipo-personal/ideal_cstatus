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
            for (let i = 0; i < ids.length; i++) {
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
    }, 600); // Ajusta el tiempo según lo necesario
});

// Función para abrir el modal 
function showModal(id) {
    const modal = document.getElementById('myModal');
    try {
        modal.style.display = 'block';
        loadCourses(id);
    } catch (error) {
        console.error(error);            
    }
}

// Función para cerrar el modal
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
    let img = document.getElementById('img_no_avalible_courses');
    
    try {
        const rows = document.querySelectorAll('tr.tr_competency');
        if(rows){
        rows.forEach(function(row) {
            // Eliminar todos los hijos de la fila
            while (row.firstChild) {
                row.removeChild(row.firstChild);
            }
            // Finalmente, eliminar la fila en sí
            row.remove();
        });
    }
        if (img) {
            // Si la imagen existe, obtener su nodo padre y eliminarla
            let padre = img.parentNode;
            padre.removeChild(img);
        }
        let lista_cursos_p = Array.prototype.slice.call(document.getElementsByClassName("lista_cursos"), 0);
        for(element of lista_cursos_p){
            element.remove();
          }  
    } catch (error) {
        console.error(error);   
        closeModal();        
    }
}

async function loadCourses(id) {
    try {
        const courses = window.course;
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
                console.warn(`Se omitió la clave ${key} porque supera el límite de 7.`);
            }
        });

        // Verificamos que el elemento del DOM exista antes de usarlo.
        const div_modal_content = document.getElementById('modal-content');
        if (!div_modal_content) {
            throw new Error("El elemento con id 'modal-content' no existe.");
        }
        // Validamos si hay cursos disponibles para el ID proporcionado.
        if (renamedCourses[id]) {
            renamedCourses[id].forEach(function (course) {
                // Creamos la URL del curso.
                const URL_curse = `/ideal/course/view.php?id=${course.id_curso}`;
                const URL_competency = `/ideal/admin/tool/lp/coursecompetencies.php?courseid=${course.id_curso}`;
                //datos tabla modal
                const competency_a = document.createElement('a');
                const course_a = document.createElement('a');
                course_a.className="course_a";
                const img_ = document.createElement('img');
                const table_competency = document.getElementById('table_competency');

                // Configuramos el enlace del curso.
                competency_a.className = "competency_a";
                competency_a.textContent = `${course.shortname} `;
                let level_competency=`${course.shortname} `;
                level_competency=level_competency.slice(3,4);
                
                console.warn(level_competency);
                switch(level_competency){
                    case 'A':
                        img_.src = '../blocks/ideal_cstatus/templates/media/img/A.png';
                        img_.className = "img_level";
                        img_.style.background="rgb(0 102 255 / 77%)";
                        img_.style.borderRadius="50%";
                    break;
                    case 'D':
                        img_.src = '../blocks/ideal_cstatus/templates/media/img/D.png';
                        img_.className = "img_level";
                        img_.style.background="rgb(255 102 0 / 77%)";
                        img_.style.borderRadius="50%";
                    break;
                    case 'L':
                        img_.src = '../blocks/ideal_cstatus/templates/media/img/L.png';
                        img_.className = "img_level";
                        img_.style.background="rgb(102 0 255 / 77%)";
                        img_.style.borderRadius="50%";
                    break;
                    default :
                        img_.src = '../blocks/ideal_cstatus/templates/media/img/O.png';
                        img_.className = "img_level";
                        img_.style.background="#C000FF";
                        img_.style.borderRadius="50%";
                    breack;
                }
                // Configuramos la imagen del enlace.
                course_a.textContent = `${course.fullname}`;
                course_a.href = URL_curse;
                course_a.style.color = "black";
                course_a.target = "_blank";
                competency_a.href = URL_competency;
                competency_a.style.color = "black";
                competency_a.target = "_blank";

                const tr_3 = document.createElement('tr');
                tr_3.id=`${course.shortname} `;
                tr_3.className="tr_competency";
                const td_competency = document.createElement('td');
                td_competency.appendChild(competency_a);
                const td_course = document.createElement('td');
                td_course.appendChild(course_a);
                const td_img= document.createElement('td');
                td_img.appendChild(img_);

                tr_3.appendChild(td_competency);
                tr_3.appendChild(td_course);
                tr_3.appendChild(td_img);
                table_competency.appendChild(tr_3);
            });
        } else {
            console.error(`centro_circle_${id}.`);
        }

        // Verificamos si se deben mostrar los cursos completados. si no es asi se mostrara una imagen
        const img_pss = all_course_complete();
        if (!img_pss) {
            const img = document.createElement('img');
            img.src = "../blocks/ideal_cstatus/templates/media/img/nofound.png";
            img.id = "img_no_avalible_courses";
            div_modal_content.appendChild(img);
        }
    } catch (error) {
        // Capturamos errores y mostramos mensajes descriptivos.
        console.error('loadCourses', error);
    }
}

function all_course_complete() {
    const element = document.getElementById('modal-content');
    try {
        // Comprueba si existe el elemento y si contiene etiquetas <a>
        if (element && element.getElementsByTagName('a').length > 0) {
            return true; // Hay enlaces <a>
        } else {
            return false; // No hay enlaces <a>
        }
    } catch (error) {
        console.error('all_course_complete', error);
    }
}

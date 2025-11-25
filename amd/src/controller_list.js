define(['jquery'], function($) {
    return {
        init: function() {
            //const title_error = document.getElementById('message_not_found');

            try {
                // Cargar el script circles.js
                let lastOpened = null;

                // Guardar textos originales y recortar a 4 caracteres al inicio
                document.querySelectorAll('.title_subarea').forEach(el => {
                    el.setAttribute('data-fulltext', el.textContent.trim());
                    el.textContent = el.textContent.trim().substring(0, 4);
                });

                document.querySelectorAll('.title_subarea').forEach(sub => {
                    sub.addEventListener('click', function () {

                        // Si hay uno abierto y no es el mismo, ocultarlo y recortar título
                        if (lastOpened && lastOpened !== this) {
                            let toHide = lastOpened.nextElementSibling;
                            while (toHide && !toHide.classList.contains('title_subarea') && !toHide.classList.contains('title_area')) {
                                if (toHide.classList.contains('competency')) {
                                    toHide.style.display = 'none';
                                }
                                toHide = toHide.nextElementSibling;
                            }
                            // Restaurar texto corto
                            lastOpened.textContent = lastOpened.getAttribute('data-fulltext').substring(0, 4);
                        }

                        // Alternar el actual
                        let next = this.nextElementSibling;
                        let isOpening = false;

                        while (next && !next.classList.contains('title_subarea') && !next.classList.contains('title_area')) {
                            if (next.classList.contains('competency')) {
                                let shouldShow = next.style.display === 'none' || next.style.display === '';
                                next.style.display = shouldShow ? 'table-cell' : 'none';
                                if (shouldShow) isOpening = true;
                            }
                            next = next.nextElementSibling;
                        }

                        // Mostrar texto completo si se abre, si se cierra volver a 4 caracteres
                        if (isOpening) {
                            this.textContent = this.getAttribute('data-fulltext');
                            lastOpened = this;
                        } else {
                            this.textContent = this.getAttribute('data-fulltext').substring(0, 4);
                            lastOpened = null;
                        }
                    });
                });

            const contenedor = document.querySelector('.certificate_container');
            //bajar tabla al extender td
            const observer = new ResizeObserver(() => {
                contenedor.style.flexWrap = 'wrap';
            });

            document.querySelectorAll('.certificate_container table').forEach(table => {
                observer.observe(table);
            });

            } catch (err) {
                console.error("Error inicialización script: ", err);
                showError();
            }

            function showError() {
                alert('Se ha producido un error al cargar la vista de competencias. Por favor, inténtelo de nuevo más tarde.');
            }
        }
    };
});

function confirmEnroll(userid,strs,select_arg) {
    var modal = document.getElementById('enrollModal');

    var confirmBtn = document.getElementById('confirmEnroll');
    if(!confirmBtn){
       var confirmBtn = document.getElementById('confirmEnroll2'); 
    }
    
    // Deshabilitar botón y mostrar mensaje de procesamiento
    confirmBtn.disabled = true;
    confirmBtn.textContent = strs[0];

    // Obtener el cohorte seleccionado
    var select = document.querySelector(select_arg);

    var cohort_id = select.value;
    var cohort_name   = select.options[select.selectedIndex].text; 

    // Función para mostrar modal de mensaje dinámico
    function showMessageModal(message, success = true) {
        const msgModal = document.createElement('div');
        msgModal.style.position = 'fixed';
        msgModal.style.zIndex = '9999';
        msgModal.style.left = '0';
        msgModal.style.top = '0';
        msgModal.style.width = '100%';
        msgModal.style.height = '100%';
        msgModal.style.background = 'rgba(0,0,0,0.5)';
        msgModal.style.display = 'flex';
        msgModal.style.justifyContent = 'center';
        msgModal.style.alignItems = 'center';

        const content = document.createElement('div');
        content.style.background = '#fff';
        content.style.padding = '20px';
        content.style.borderRadius = '6px';
        content.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        content.style.maxWidth = '400px';
        content.style.textAlign = 'center';

        const msg = document.createElement('p');
        msg.textContent = message;
        msg.style.color = success ? 'green' : 'red';
        msg.style.marginBottom = '15px';
        content.appendChild(msg);

        const btn = document.createElement('button');
        btn.textContent = strs[1];
        btn.setAttribute('class','btn btn-primary')
        btn.style.padding = '8px 12px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function() {
            document.body.removeChild(msgModal);
            if (success) window.location.reload();
        });
        content.appendChild(btn);

        msgModal.appendChild(content);
        document.body.appendChild(msgModal);
    }

    // Llamada fetch para inscribir
    fetch('ajax/enroll_cohort_cerf.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userid, cohort_id: cohort_id })
    })
    .then(r => r.json())
    .then(res => {
        modal.style.display = 'none';
        if (res.success) {
            showMessageModal(strs[3]+cohort_name, true);
        } else {
            showMessageModal(strs[4]+cohort_name, false);
        }
    })
    .catch(err => {
        console.error(err);
        showMessageModal('Error 500', false);
    })
    .finally(() => {
        confirmBtn.disabled = false;
        confirmBtn.textContent = strs[1];
    });
}


define(['jquery'], function($) {
    return {
        init: function() {
            const title_error = document.getElementById('message_not_found');

            try {
                // Cargar el script circles.js
                $.getScript(M.cfg.wwwroot + "/blocks/ideal_cstatus/amd/src/circles/circles.js")
                    .done(function(script, textStatus) {
                        try {
                            // Llamar a las funciones de los círculos correctamente
                            circle_1();
                            circle_2();
                            circle_3();
                            circle_4();
                            circle_5();
                            circle_6();
                            circle_7();

                        } catch (err) {
                            console.error("Error: ", err);
                            showError();
                        }
                    })
                    .fail(function(jqxhr, settings, exception) {
                        console.error("Error script circles.js: ", exception);
                        showError();
                    });
            } catch (err) {
                console.error("Error inicialización script: ", err);
                showError();
            }

            function showError() {
                const container_error_ = document.getElementById('container_main');
                const container_error = document.createElement('div');
                container_error_.appendChild(container_error);
                container_error.style.backgroundImage = "url('" + M.cfg.wwwroot + "/blocks/ideal_cstatus/templates/media/img/error.png')";
                container_error.style.backgroundRepeat = "no-repeat";
                container_error.style.backgroundPosition = "center";
                container_error.style.backgroundSize = "contain";
                container_error.style.minHeight = "300px";
                container_error.style.zIndex = "1000";
                // Crear el título del error
                let title_error = document.createElement('h1');
                let txt_=document.getElementById('message_not_found').textContent;
                title_error.textContent = txt_;
                title_error.style.textAlign = "center";
                title_error.style.fontSize = "2rem";
                title_error.style.fontFamily = "Arial, sans-serif";
                title_error.style.fontWeight = "bold";
                title_error.style.color = "white";
                container_error.appendChild(title_error);
            }
        }
    };
});

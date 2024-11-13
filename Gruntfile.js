module.exports = function(grunt) {
    // Configuración de Grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Tarea para minificar JS
        uglify: {
            options: {
                mangle: false // No cambiar los nombres de las variables
            },
            my_target: {
                files: {
                    'amd/build/controller.min.js': ['amd/src/controller.js']
                }
            }
        },

        // Tarea para minificar CSS
        cssmin: {
            target: {
                files: {
                    'amd/build/styles.min.css': ['amd/css/styles.css'] // Ruta de destino y origen de los archivos CSS
                }
            }
        },

        // Vigilar cambios en archivos JS y CSS
        watch: {
            scripts: {
                files: ['amd/src/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
            styles: {
                files: ['amd/css/*.css'], // Asegurarse de que la ruta es correcta
                tasks: ['cssmin'],
                options: {
                    spawn: false,
                },
            }
        },

        // Limpiar la carpeta de compilación
        clean: {
            build: ['amd/build/']
        }
    });

    // Cargar las tareas de Grunt
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Registrar las tareas por defecto
    grunt.registerTask('default', ['clean', 'uglify', 'cssmin']);
};

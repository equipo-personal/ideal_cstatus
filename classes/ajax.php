<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_circle = $_POST['id_circle'];

    // Ahora puedes usar $id_circle para obtener los datos que necesitas
    $learning_plans = list_learning_plans($id_user_search_competence, $id_circle);

    // Puedes devolver una respuesta si es necesario
    echo "Datos obtenidos para id_circle: " . $id_circle;
}
?>
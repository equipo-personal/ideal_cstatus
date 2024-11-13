<?php
defined('MOODLE_INTERNAL') || die();

$capabilities = [
    'block/ideal_cstatus:ideal_manage' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_SYSTEM	,
        'archetypes' => [
            'manager' => CAP_ALLOW,
        ],
    ],
];


/*

INSERT INTO `mdl_capabilities` (`id`, `name`, `captype`, `contextlevel`, `component`, `riskbitmask`) VALUES (NULL, 'block/ideal_cstatus:ideal_manage ', 'read', '10', 'block_ideal_cstatus\r\n', '3');
*/
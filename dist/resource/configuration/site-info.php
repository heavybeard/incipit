<?php
/**
 * TEMPLATE
 * Set the template for routes
 *
 * ===========================================================================
 */
?>

<?php
/** 
 * DOMAINS
 * Set domain and environment
 */
$domains = array(
    'www.incipit.local'                  => 'LOCAL',
        'incipit.local'                  => 'LOCAL',
    'development.incipit.dom'            => 'DEV',
        'quality.incipit.dom'            => 'QUA',
    'www.incipit.dom'                    => 'PROD',
        'incipit.dom'                    => 'PROD',
);
/** ENVIRONMENT */
defined('ENVIRONMENT')
    or define('ENVIRONMENT', getEnvironment($domains, $_SERVER['SERVER_NAME']));


/**
 * COMMON
 * Set commons site info
 */
$commons = array(
    'name' => 'Incipit',
    'description' => 'This framework is created for init a new web standard project. GRUNT and SCSS frontend based. PHP and MySQL backend base.',
    'separator' => '|',
    'application' => array(
    ),
);


/**
 * PAGES
 * Associated route => template
 */
$pages = array(
    /** Index */
    '/'                    => array(
        'tpl'   => 'blank',
        'view'  => 'index',
        'title' => 'Homepage',
    ),

    /** Parent */
    '/parent'             => array(
        'tpl'   => 'blank',
        'view'  => 'parent',
        'title' => 'Parent',
    ),
    '/parent/child'       => array(
        'tpl'   => 'blank',
        'view'  => 'child',
        'title' => 'Child',
    ),
    '/parent/child/depth' => array(
        'tpl'   => 'blank',
        'view'  => 'depth',
        'title' => 'Depth',
    ),

    /** Errors */
    '404'                 => array(
        'tpl'   => 'blank',
        'view'  => '404',
        'title' => 'Errore 404',
    ),
);
?>

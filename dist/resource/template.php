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
 * TEMPLATES
 * Associated route => template
 */
$templates = array(
    /** Index */
    '/'                    => array(
        'tpl'   => 'blank',
        'view'  => 'index',
    ),

    /** Parent */
    '/parent'             => array(
        'tpl'   => 'blank',
        'view'  => 'parent',
    ),
    '/parent/child'       => array(
        'tpl'   => 'blank',
        'view'  => 'child',
    ),
    '/parent/child/depth' => array(
        'tpl'   => 'blank',
        'view'  => 'depth',
    ),

    /** Errors */
    '404'                 => array(
        'tpl'   => 'blank',
        'view'  => '404',
    ),
);
?>

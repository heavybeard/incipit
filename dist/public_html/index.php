<?php
/**
 * INDEX
 * All start here with a routing system
 *
 * ===========================================================================
 */
?>

<?php
/**
 * REQUIRED
 * Includes functional required files
 */
require_once('..\resource\library\functions.php');
require_once('..\resource\config.php');
require_once('..\resource\template.php');

/**
 * URI
 * Set the current uri
 */
defined('CURRENT_URI')
    or define('CURRENT_URI', getCurrentUri());

/**
 * REQUIRE BASE TEMPLATE
 */
require_once TEMPLATES_PATH . '\base.tpl.php';
?>

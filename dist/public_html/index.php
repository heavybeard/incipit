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
require_once('..\resource\library\core.php');
require_once('..\resource\config.php');

/**
 * URI
 * Set the current uri
 */
defined('CURRENT_URI')
    or define('CURRENT_URI', getCurrentUri());

/**
 * REQUIRE BASE TEMPLATE
 */
require_once HTML . '\base.tpl.php';
?>

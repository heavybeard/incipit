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
 * ROUTES
 * Set the current routes
 */
$base_url = getCurrentUri();
$routes = getRoutes();

/**
 * REQUIRE BASE TEMPLATE
 */
require_once TEMPLATES_PATH . '\base.tpl.php';
?>

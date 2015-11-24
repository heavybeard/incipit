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
require_once dirname(dirname(__FILE__)) . '/resource/library/core.php';
require_once dirname(dirname(__FILE__)) . '/resource/config.php';

/**
 * URI
 * Set the current uri
 */
defined('CURRENT_URI')
    or define('CURRENT_URI', getCurrentUri());

/**
 * REQUIRE BASE TEMPLATE
 */
require_once HTML . 'base.tpl.php';
?>

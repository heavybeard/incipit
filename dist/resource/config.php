<?php
/**
 * CONFIG
 * Set the config variables
 * Use it for all configurations
 *
 * ===========================================================================
 */
?>

<?php
/** RESOURCE PATH */
$dirname = dirname(__FILE__);
defined('RESOURCE')
    or define('RESOURCE', $dirname);

/** PASSWORD */
require_once 'configuration/password.php';

/** DATABASE */
require_once 'configuration/database.php';

/** MODULE */
require_once 'configuration/module.php';

/** SITEINFO */
require_once 'configuration/site-info.php';

/**
 * DEBUG MODE
 * Activate debug mode only with password
 */
if (isset($_COOKIE['DEBUGmodeON']) && $_COOKIE['DEBUGmodeON'] == $password) {
    ini_set('error_reporting', 'true');
    error_reporting(E_ALL|E_STRCT);
}
?>

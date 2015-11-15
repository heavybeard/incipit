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
defined('RESOURCE')
    or define('RESOURCE', dirname(__FILE__));

/** PASSWORD */
require_once 'configuration/password.php';

/** DATABASE */
require_once 'configuration/database.php';

/** SITEINFO */
require_once 'configuration/site-info.php';

/** MODULE */
require_once 'configuration/module.php';

/**
 * DEBUG MODE
 * Activate debug mode only with password
 */
if (isset($_COOKIE['DEBUGmodeON']) && $_COOKIE['DEBUGmodeON'] == $password) {
    ini_set('error_reporting', 'true');
    error_reporting(E_ALL|E_STRCT);
}
?>

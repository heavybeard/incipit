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

/** PASSWORD */
require_once 'password.php';

/** DATABASE */
require_once 'database.php';

/** DOMAINS */
$domains = array(
    'www.webproject.local'                  => 'LOCAL',
        'webproject.local'                  => 'LOCAL',
    'webproject.development.mydomain.dom'   => 'DEV',
        'quality.mydomain.dom'              => 'QUA',
    'www.webproject.dom'                    => 'PROD',
        'webproject.dom'                    => 'PROD',
);

/** ENVIRONMENT */
$environment = getEnvironment($domains, $_SERVER['SERVER_NAME']);

/** SITE COMMON URLS */
$urls = array(
    'baseUrl' => 'http://webproject.com'
);

/** ASSET PATH */
$path = array(
    'style'     => '/asset/style',
    'script'    => '/asset/script',
    'image'     => '/asset/image',
);

/** LIBRARY */
defined('LIBRARY_PATH')
    or define('LIBRARY_PATH', realpath(dirname(__FILE__) . '\library'));
/** TEMPLATE */
defined('TEMPLATES_PATH')
    or define('TEMPLATES_PATH', realpath(dirname(__FILE__) . '\template'));
/** VIEW */
defined('VIEWS_PATH')
    or define('VIEWS_PATH', realpath(dirname(__FILE__) . '\view'));

/** ASSETS */
defined('CSS_PATH')
    or define('CSS_PATH', $path['style']);
defined('JS_PATH')
    or define('JS_PATH', $path['script']);
defined('IMG_PATH')
    or define('IMG_PATH', $path['image']);

/**
 * DEBUG MODE
 * Activate debug mode only with password
 */
if ($_COOKIE['DEBUGmodeON'] == $password) {
    ini_set('error_reporting', 'true');
    error_reporting(E_ALL|E_STRCT);
}
?>

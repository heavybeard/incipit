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
    'www.incipit.local'                  => 'LOCAL',
        'incipit.local'                  => 'LOCAL',
    'development.incipit.dom'            => 'DEV',
        'quality.incipit.dom'            => 'QUA',
    'www.incipit.dom'                    => 'PROD',
        'incipit.dom'                    => 'PROD',
);

/** ENVIRONMENT */
$environment = getEnvironment($domains, $_SERVER['SERVER_NAME']);

/** SITE COMMON URLS */
$urls = array(
    'baseUrl' => 'http://incipit.com'
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
if (isset($_COOKIE['DEBUGmodeON']) && $_COOKIE['DEBUGmodeON'] == $password) {
    ini_set('error_reporting', 'true');
    error_reporting(E_ALL|E_STRCT);
}

/**
 * MULTIPAGE
 * Set true if is multipage - false if is onepage
 */
defined('MULTIPAGE')
    or define('MULTIPAGE', true);
?>

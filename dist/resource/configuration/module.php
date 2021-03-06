<?php
/**
 * MODULE
 * Set the config variables
 *
 * ===========================================================================
 */
?>

<?php
/** RESOURCE */
defined('LIBRARY_PATH')
    or define('LIBRARY_PATH', RESOURCE . '/library/');
defined('HTML')
    or define('HTML', RESOURCE . '/html/');
defined('TEMPLATES_PATH')
    or define('TEMPLATES_PATH', RESOURCE . '/html/template/');
defined('CONTENTS_PATH')
    or define('CONTENTS_PATH', RESOURCE . '/html/content/');
defined('VIEWS_PATH')
    or define('VIEWS_PATH', RESOURCE . '/html/view/');

/** DEFAULT PUBLIC_HTML */
defined('CSS_PATH')
    or define('CSS_PATH', '/asset/style/');
defined('JS_PATH')
    or define('JS_PATH', '/asset/script/');
defined('JSON_PATH')
    or define('JSON_PATH', '/asset/json/');
defined('IMG_PATH')
    or define('IMG_PATH', '/asset/image/');
defined('VIDEO_PATH')
    or define('VIDEO_PATH', '/asset/video/');
defined('OBJ_PATH')
    or define('OBJ_PATH', '/asset/object/');

/** WEBAPP PUBLIC_HTML */
defined('WEBAPP_ICON_PATH')
    or define('WEBAPP_ICON_PATH', '/asset/image/wepapp/icon/');
defined('WEBAPP_STARTUP_PATH')
    or define('WEBAPP_STARTUP_PATH', '/asset/image/webapp/startup/');

/**
 * MULTIPAGE
 * Set true if is multipage - false if is onepage
 */
defined('MULTIPAGE')
    or define('MULTIPAGE', true);
 ?>

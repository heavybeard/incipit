<?php
/**
 * FUNCTIONS
 * All custom functions used in all sites
 *
 * ===========================================================================
 */
?>

<?php
/** USEFUL */
require_once 'useful.php';


/**
 * SET ENVIRONMENT
 * Set the current environment
 *
 * @param string
 * @return string
 */
function getEnvironment($all_domain, $server_name) {
    $d = $all_domain;
    $s_n = $server_name;

    return $d[$s_n];
}


/**
 * GET CURRENT URI
 * The following function will strip the script name from URL
 *
 * @return string
 */
function getCurrentUri() {
    $basepath = implode('/', array_slice(explode('/', $_SERVER['SCRIPT_NAME']), 0, -1)) . '/';
    $uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));

    if (strstr($uri, '?'))
        $uri = substr($uri, 0, strpos($uri, '?'));
    $uri = '/' . trim($uri, '/');

    return $uri;
}


/**
 * GET CURRENT URI
 * Explode in array the baseurl by '/' char
 *
 * @param string
 * @return array
 */
function getRoutes() {
    global $base_url;
    $routes = explode('/', $base_url);

    /** remove the first */
    array_shift($routes);

    return $routes;
}


/**
 * THE REQUIRED PARTS
 * Includes the views
 *
 */
function the_head() {
    require_once TEMPLATES_PATH . '\require\head.tpl.php';
}
function the_foot() {
    require_once TEMPLATES_PATH . '\require\foot.tpl.php';
}


/**
 * THE VIEW
 * Includes the chosen uri's view
 * 
 * @param string
 */
function the_view($URI = CURRENT_URI) {
    global $templates;

    if (isset($templates[$URI])) {
        if (MULTIPAGE) {
            $TEMPLATE    = $templates[$URI]['tpl'];
            $VIEW        = $templates[$URI]['view'];

            require_once TEMPLATES_PATH . '\tpl\\' . $TEMPLATE . '.tpl.php';
        } else {
            $templates_exclude = arrayExclude($templates, array('404'));
            foreach ($templates_exclude as $uri => $info) {
                $TEMPLATE    = $info['tpl'];
                $VIEW        = $info['view'];

                require TEMPLATES_PATH . '\tpl\\' . $TEMPLATE . '.tpl.php';
            }
        }
    } else {
        header("HTTP/1.0 404 Not Found");
        $TEMPLATE    = $templates['404']['tpl'];
        $VIEW        = $templates['404']['view'];

        require_once TEMPLATES_PATH . '\tpl\\' . $TEMPLATE . '.tpl.php';
    }
}
?>

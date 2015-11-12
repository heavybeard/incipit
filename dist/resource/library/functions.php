<?php
/**
 * FUNCTIONS
 * All custom functions used in all sites
 *
 * ===========================================================================
 */
?>

<?php
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
 * THE VIEW
 * Includes the viewS
 *
 * @param string
 */
function the_head() {
    require_once TEMPLATES_PATH . '\require\head.tpl.php';
}
function the_foot() {
    require_once TEMPLATES_PATH . '\require\foot.tpl.php';
}
function the_view() {
    global $templates, $routes;
    $temp_templates = $templates;

    for ($i = 0; $i < count($routes); $i++) {
        if (isset($temp_templates[$routes[$i]])) {
            if (end($routes) == $routes[$i] && isset($temp_templates[$routes[$i]]['root'])) {
                $temp_templates = $temp_templates[$routes[$i]]['root'];
                $VIEW = $routes[$i];
            } else {
                $temp_templates = $temp_templates[$routes[$i]];
                $VIEW = $routes[$i];
            }
        } else {
            $temp_templates = $templates['404'];
            $VIEW = '404';
        }
    }

    require_once TEMPLATES_PATH . '\tpl\\' . $temp_templates . '.tpl.php';
}
?>

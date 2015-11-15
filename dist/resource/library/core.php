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
require_once 'plugin/useful.php';


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
function rq_head() {
    require_once HTML . '\require\head.tpl.php';
}
function rq_foot() {
    require_once HTML . '\require\foot.tpl.php';
}


/**
 * REQUIRE VIEW
 * Require the chosen uri's view
 * 
 * @param string
 */
function rq_view($URI = CURRENT_URI) {
    global $pages;

    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            $TEMPLATE    = $pages[$URI]['tpl'];
            $VIEW        = $pages[$URI]['view'];

            require_once TEMPLATES_PATH . $TEMPLATE . '.tpl.php';
        } else {
            $pages_exclude = arrayExclude($pages, array('404'));
            foreach ($pages_exclude as $uri => $page) {
                $TEMPLATE    = $page['tpl'];
                $VIEW        = $page['view'];

                require TEMPLATES_PATH . $TEMPLATE . '.tpl.php';
            }
        }
    } else {
        header("HTTP/1.0 404 Not Found");
        $TEMPLATE    = $pages['404']['tpl'];
        $VIEW        = $pages['404']['view'];

        require_once TEMPLATES_PATH . $TEMPLATE . '.tpl.php';
    }
}


/**
 * REQUIRE CONTENT
 * Require the chosen content
 * 
 * @param string
 */
function rq_content($CONTENT) {
    require_once VIEWS_PATH . $CONTENT . '.tpl.php';
}


/**
 * THE SITE
 * Includes the chosen site info
 *
 * @param string
 */
function the_site($INFO) {
    global $commons;

    echo $commons[$INFO];
}

/**
 * THE TITLE
 * Includes the chosen uri's title
 *
 * @param string
 */
function the_title($URI = CURRENT_URI) {
    global $pages, $commons;

    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            echo $pages[$URI]['title'] . ' ' . $commons['separator'] . ' ';
        } else {
            echo '';
        }
    } else {
        echo $pages['404']['title'] . ' ' . $commons['separator'] . ' ';
    }
}
?>

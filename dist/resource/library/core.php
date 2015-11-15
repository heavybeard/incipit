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
    if (is_404()) {
        header('HTTP/1.0 404 Not Found');
    }
    require_once HTML . '\require\head.tpl.php';
}
function rq_foot() {
    require_once HTML . '\require\foot.tpl.php';
}
function rq_part($PART) {
    require_once HTML . '\require\part\\' . $PART . '.tpl.php';
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
 * IS 404
 *
 * @param string
 */
function is_404($URI = CURRENT_URI) {
    global $pages;

    if (isset($pages[$URI])) {
        return false;
    } else {
        return true;
    }
}


/**
 * THE SITE
 * Echo the chosen site info
 *
 * @param string
 */
function the_site($INFO) {
    global $commons;

    echo $commons[$INFO];
}


/**
 * THE TITLE
 * Echo the chosen uri's title
 *
 * @param string
 */
function the_title($URI = CURRENT_URI) {
    global $pages, $commons;

    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            $temp_title = $pages[$URI]['title'] . ' ' . $commons['separator'] . ' ';
        } else {
            $temp_title = '';
        }
    } else {
        $temp_title = $pages['404']['title'] . ' ' . $commons['separator'] . ' ';
    }

    echo $temp_title;
}


/**
 * THE DESCRIPTION
 * Echo the chosen uri's description
 *
 * @param string
 */
function the_description($URI = CURRENT_URI) {
    global $pages, $commons;

    /** Set the description */
    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            $temp_description = $pages[$URI]['description'];
        } else {
            $temp_description = $commons['description'];
        }
    } else {
        $temp_description = $pages['404']['description'];
    }

    echo $temp_description;
}


/**
 * THE OPENGRAPH
 * Echo the chosen uri's open graph
 *
 * @param string
 */
function the_opengraph($URI = CURRENT_URI) {
    global $pages, $commons;

    /** Merge open graph data */
    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            $temp_opengraph = @array_merge((array)$commons['opengraph'], (array)$pages[$URI]['opengraph']);
        } else {
            $temp_opengraph = $commons['opengraph'];
        }
    } else {
        $temp_opengraph = @array_merge((array)$commons['opengraph'], (array)$pages['404']['opengraph']);
    }

    foreach ($temp_opengraph as $property => $content) {
        echo '<meta property="' . $property .'" content="' . $content . '">';
    }
}


/**
 * THE WEBAPP
 * Echo the chosen webapp data related to chosen uri's
 *
 * @param string
 */
function the_webapp($WEBAPP, $URI = CURRENT_URI) {
    global $pages, $commons;

    /** Merge webapp data */
    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            $temp_webapp = @array_merge((array)$commons['webapp'], (array)$pages[$URI]['webapp']);
        } else {
            $temp_webapp = $commons['webapp'];
        }
    } else {
        $temp_webapp = @array_merge((array)$commons['webapp'], (array)$pages['404']['webapp']);
    }

    echo $temp_webapp[$WEBAPP];
}
?>

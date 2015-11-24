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
 * REQUIRE PLUGIN
 * ===========================================================================
 */

/** USEFUL */
require_once 'plugin/useful.php';



/**
 * GET INFORMATIONS
 * ===========================================================================
 */


/**
 * GET ENVIRONMENT
 * Set the current environment
 *
 * @param array $all_domain list of possible server name
 * @param string $server_name the chosen server name
 * @return string the environment
 */
function getEnvironment($all_domain, $server_name) {
    return $all_domain[$server_name];
}


/**
 * GET CURRENT URI
 * Strip the script name from URL
 *
 * @return string the current uri
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
 * GET CURRENT ROUTES
 * Explode in array the baseurl by '/' char
 *
 * @return array the array of path
 */
function getCurrentRoutes() {
    global $base_url;
    $routes = explode('/', $base_url);

    /** remove the first */
    array_shift($routes);

    return $routes;
}



/**
 * REQUIREDS
 * ===========================================================================
 */


/**
 * REQUIRED HEAD
 * Require the head part
 */
function rq_head() {
    if (is_404()) {
        header('HTTP/1.0 404 Not Found');
    }
    require_once HTML . 'require/head.req.php';
}


/**
 * REQUIRE PAGE
 * Require the foot part
 */
function rq_foot() {
    require_once HTML . 'require/foot.req.php';
}


/**
 * REQUIRE CONTENT
 * Require the chosen content
 * 
 * @param string $CONTENT file name of content
 */
function rq_content($CONTENT) {
    require_once CONTENTS_PATH . $CONTENT . '.cont.php';
}


/**
 * REQUIRE VIEW
 * Require the chosen content
 * 
 * @param string $VIEW file name of view
 * @param array or string $CONTENTS content of the included view
 */
function rq_view($VIEW, $CONTENTS) {
    $THIS_VIEW_CONTENTS = $CONTENTS;
    include VIEWS_PATH . $VIEW . '.view.php';
}


/**
 * REQUIRE PAGE
 * Require the chosen uri's page
 * 
 * @param string $TYPE_PATH the html subfolder type ['view', 'required', 'template']
 * @param string $PATH the name of file
 */
function rq_part($TYPE_PATH, $PART) {
    include HTML . '/' . $TYPE_PATH . '/part/' . $PART . '.part.php';
}


/**
 * REQUIRE PAGE
 * Require the chosen uri's page through templates
 * 
 * @param string $URI the chosen uri [default is the current uri]
 */
function rq_page($URI = CURRENT_URI) {
    global $pages;

    if (isset($pages[$URI])) {
        if (MULTIPAGE) {
            $TEMPLATE    = $pages[$URI]['template'];
            $CONTENT     = $pages[$URI]['content'];

            require_once TEMPLATES_PATH . $TEMPLATE . '.tpl.php';
        } else {
            $pages_exclude = arrayExclude($pages, array('404'));
            foreach ($pages_exclude as $uri => $page) {
                $TEMPLATE    = $page['template'];
                $CONTENT     = $page['content'];

                require TEMPLATES_PATH . $TEMPLATE . '.tpl.php';
            }
        }
    } else {
        $TEMPLATE    = $pages['404']['template'];
        $CONTENT     = $pages['404']['content'];

        require_once TEMPLATES_PATH . $TEMPLATE . '.tpl.php';
    }
}



/**
 * STATEMENT
 * ===========================================================================
 */


/**
 * IS 404
 * Return if the chosen uri is 404
 *
 * @param string $URI the chosen uri [default is the current uri]
 * @return bool
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
 * IS PAGE
 * Return if the chosen uri is the current uri
 *
 * @param string $URI the chosen uri [default is the current uri]
 * @return bool
 */
function is_page($URI) {
    global $pages;

    if (isset($pages[$URI]) && $URI = CURRENT_URI) {
        return true;
    } else {
        return false;
    }
}



/**
 * ECHO
 * ===========================================================================
 */


/**
 * THE SITE
 * Echo the chosen site info
 *
 * @param string $INFO the site info key
 */
function the_site($INFO) {
    global $commons;

    echo $commons[$INFO];
}


/**
 * THE TITLE
 * Echo the chosen uri's title
 *
 * @param string $URI the chosen uri [default is the current uri]
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
 * @param string $URI the chosen uri [default is the current uri]
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
 * @param string $URI the chosen uri [default is the current uri]
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
 * @param string $WEBAPP the webapp info key
 * @param string $URI the chosen uri [default is the current uri]
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

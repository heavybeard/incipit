<?php
/**
 * CACHE
 * Create static file
 *
 * ===========================================================================
 */
?>

<?php
/**
 * SETTING
 * Set file extension, expires, folder and ignored pages
 */
$CACHE_EXTENSION      = '.html';
$CACHE_TIME           = 3600;
$CACHE_FOLDER         = '.cache/';
$IGNORE_PAGES         = array('', '');

/** SET CURRENT URL */
$current_url    = 'http://'.$_SERVER['HTTP_HOST'] . CURRENT_URI . $_SERVER['QUERY_STRING'];

/** CACHE FILE */
$cache_file     = $CACHE_FOLDER . md5($current_url) . $CACHE_EXTENSION;

/** IGNORE */
$ignore = (in_array($current_url, $IGNORE_PAGES)) ? true : false;

/**
 * READ FILE
 * If cached file exist and it's not expired
 */
if (!$ignore && file_exists($cache_file) && time() - $CACHE_TIME < filemtime($cache_file)) {
    readfile($cache_file);
    exit();
}
//ob_start('ob_gzhandler');

/** INSERT HTML HERE */

/** CREATE FOLDER */
if (!is_dir($CACHE_FOLDER)) {
    mkdir($CACHE_FOLDER);
}

/** CREATE FILE */
if(!$ignore){
    $fp = fopen($cache_file, 'w');
    fwrite($fp, ob_get_contents());
    fclose($fp);
}
ob_end_flush();
?>

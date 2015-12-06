<?php
/**
 * IMAGES
 * Manage all picture and img tags and their plugins
 *
 * ===========================================================================
 */
?>

<?php
/**
 * PICTURE
 * Generate the picture tag html
 * @param array sources Array of Object of attribute => value
 * @param object img_attributes Object of attribute => value
 */
function the_picture($sources, $img_attributes) {
    $picture = '';

    /** Init the tag */
    $picture .= '<picture>';
    $picture .= '<!--[if IE 9]><video style="display: none;"><![endif]-->';

    /** Sources with attributes*/
    foreach ($sources as $source) {
        $picture .= html_selfclosed_tag('source', $source);
    }

    /** Close IE9 fix */
    $picture .= '<!--[if IE 9]></video><![endif]-->';

    /** Default image with attribute */
    $picture .= html_selfclosed_tag('img', $img_attributes);
    
    /** Close tag */
    $picture .= '</picture>';

    echo $picture;
}


/**
 * PICTURE WEBP
 * Generate the picture tag html with webp and format fallback
 * @param string path Path of image
 * @param string name Name of image
 * @param object attributes Object of attribute => value
 * @param object source_attributes Object of attribute => value
 * @param string default_format Image format (default is jpg)
 */
function the_picture_webp($path, $name, $attributes, $source_attributes = array(), $default_format = 'jpg') {
    $sources = array(
        array(
            'srcset' => $path . $name . '.webp',
            'type' => 'image/webp',
        )
    );
    $img_attributes = array(
        'src' => $path . $name . '.' . $default_format,
    );

    /** Merge attributes */
    $img_attributes = array_merge($img_attributes, $attributes);
    $sources = array(
        array_merge($sources[0], $source_attributes)
    );

    the_picture($sources, $img_attributes);
}


/**
 * PICTURE LAZYLOAD
 * Generate the picture tag html for lazy loading
 * @param string path Path of image
 * @param string name Name of image
 * @param object attributes Object of attribute => value
 * @param string default_format Image format (default is jpg)
 */
function the_picture_webp_lazyload($path, $name, $attributes, $default_format = 'jpg') {
    $attributes_lazy = array(
        'class' => 'lazyload',
        'src' => 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        'style' => 'padding-bottom: ' . get_image_percent_height('.' . $path . $name . '.' . $default_format),
        'data-src' => $path . $name . '.' . $default_format,
    );
    $source_attributes = array(
        'data-srcset' => $path . $name . '.' . 'webp',
        'srcset' => ''
    );

    /** Merge attributes */
    $attributes_lazy = array_merge($attributes_lazy, $attributes);

    the_picture_webp($path, $name, $attributes_lazy, $source_attributes, $default_format);
}

/**
 * PICTURE LAZYLOAD ZOOM
 * Generate the picture tag html for lazy loading
 * @param string path Path of image
 * @param string name Name of image
 * @param object attributes Object of attribute => value
 * @param string default_format Image format (default is jpg)
 */
function the_picture_webp_lazyload_zoom($path, $name, $attributes, $default_format = 'jpg') {
    $attributes = array_merge($attributes, array('data-action' => 'zoom'));

    the_picture_webp_lazyload($path, $name, $attributes, $default_format = 'jpg');
}
?>

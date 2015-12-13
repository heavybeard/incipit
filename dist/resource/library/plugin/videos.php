<?php
/**
 * VIDEOS
 * Manage video tag and its plugins
 *
 * ===========================================================================
 */
?>

<?php
/**
 * VIDEO
 * Generate the video tag html
 * @param array sources Array of Object of attribute => value
 * @param object video_attributes Object of attribute => value
 */
function video($sources, $video_attributes) {
    $video = '';

    /** Init the tag */
    $video .= '<video ' . html_attributes($video_attributes) . '>';

    /** Sources with attributes*/
    foreach ($sources as $source) {
        $video .= html_selfclosed_tag('source', $source);
    }

    /** Close tag */
    $video .= '</video>';

    echo $video;
}


/**
 * VIDEO ALL SOURCE
 * Generate the video tag html with all format
 * @param string path Path of video
 * @param string name Name of video
 * @param object attributes Object of attribute => value
 */
function video_a($path, $name, $attributes) {
    $sources = array(
        array('src' => $path . $name . '/' . $name . '.webm', 'type'=> 'video/webm'),
        array('src' => $path . $name . '/' . $name . '.ogv', 'type'=> 'video/ogg'),
        array('src' => $path . $name . '/' . $name . '.mp4', 'type'=> 'video/mp4'),
    );

    $video_attributes = $attributes;

    video($sources, $video_attributes);
}


/**
 * VIDEO ALL SOURCE LAZYLOAD
 * Generate the video tag html for lazy loading
 * @param string path Path of image
 * @param string name Name of image
 * @param object attributes Object of attribute => value
 */
function video_al($path, $name, $attributes) {
    $sources = array(
        array('src' => $path . $name . '/' . $name . '.webm', 'type'=> 'video/webm'),
        array('src' => $path . $name . '/' . $name . '.ogv', 'type'=> 'video/ogg'),
        array('src' => $path . $name . '/' . $name . '.mp4', 'type'=> 'video/mp4'),
    );
    $attributes_lazy = array(
        'preload' => 'false',
        'poster' => $path . $name . '/' . $name . '.jpg',
    );

    /** Merge attributes */
    $video_attributes = array_merge($attributes_lazy, $attributes);

    video_a($path, $name, $video_attributes);
}


/**
 * VIDEO ALL SOURCE LAZYLOAD ZOOM
 * Generate the video tag html for lazy loading and zoom
 * @param string path Path of image
 * @param string name Name of image
 * @param object attributes Object of attribute => value
 */
function video_alz($path, $name, $attributes) {
    $sources = array(
        array('src' => $path . $name . '/' . $name . '.webm', 'type'=> 'video/webm'),
        array('src' => $path . $name . '/' . $name . '.ogv', 'type'=> 'video/ogg'),
        array('src' => $path . $name . '/' . $name . '.mp4', 'type'=> 'video/mp4'),
    );
    $attributes_lazy = array(
        'preload' => 'false',
        'poster' => $path . $name . '/' . $name . '.jpg',
        'data-action' => 'zoom',
        'data-play' => 'always',
    );

    /** Merge attributes */
    $video_attributes = array_merge($attributes_lazy, $attributes);

    video_a($path, $name, $video_attributes);
}

/**
 * VIDEO PLAYER
 * Generate the video tag html with custom player
 * @param string path Path of image
 * @param string name Name of image
 * @param object attributes Object of attribute => value
 */
function video_player($path, $name, $attributes) {
    $sources = array(
        array('src' => $path . $name . '/' . $name . '.webm', 'type'=> 'video/webm'),
        array('src' => $path . $name . '/' . $name . '.ogv', 'type'=> 'video/ogg'),
        array('src' => $path . $name . '/' . $name . '.mp4', 'type'=> 'video/mp4'),
    );
    $attributes_player = array(
        'preload' => 'false',
        'poster' => $path . $name . '/' . $name . '.jpg',
        'data-setup' => '',
        'class' => 'video-js',
        'controls' => '',
    );

    /** Merge attributes */
    $video_attributes = array_merge($attributes_player, $attributes);

    video_a($path, $name, $video_attributes);
}
?>

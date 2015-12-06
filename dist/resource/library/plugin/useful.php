<?php
/**
 * USEFUL
 * Functions useful for all
 *
 * ===========================================================================
 */
?>

<?php
/**
 * ARRAY DEPTH
 * How deep is the array
 *
 * @param array $array the chosen array
 * @return int the number of depth
 */
function array_depth(Array $array) {
    $MAX_DEPTH = 1;

    foreach ($array as $value) {
        if (is_array($value)) {
            $depth = array_depth($value) + 1;
            if ($depth > $MAX_DEPTH) {
                $MAX_DEPTH = $depth;
            }
            echo '<pre>'; var_export($value); echo '</pre>';
        }
    }

    return $MAX_DEPTH;
}


/**
 * ARRAY EXCLUDE
 * Exclude the given keys from array
 *
 * @param array $array
 * @param array $excludeKeys a list of string for exclude key->value from array
 * @return array the array with excluded key
 */
function arrayExclude($ARRAY, Array $excludeKeys) {
    foreach($excludeKeys as $key) {
        unset($ARRAY[$key]);
    }
    return $ARRAY;
}


/**
 * THE HTML ATTRIBUTES
 * Print attributes and their value
 * @param object attributes Object of attribute => value
 * @return string
 */
function html_attributes(Array $attributes) {
    $HTML_ATTRIBUTES = '';

    /** Attributes */
    foreach ($attributes as $attribute => $value) {
        $HTML_ATTRIBUTES .= ' ' . $attribute . '="' . $value . '"';
    }

    return $HTML_ATTRIBUTES;
}


/**
 * THE HTML TAG
 * Print html tag with their attributes
 * @param string tag Html tag name
 * @param object attributes Object of attribute => value
 * @param bool new_line True for new line (default is True)
 * @return string
 */
function html_selfclosed_tag($tag, Array $attributes) {
    $HTML_TAG = '';

    /** Tag with attributes  */
    $HTML_TAG .= '<' . $tag . html_attributes($attributes) . '>';

    return $HTML_TAG;
}


/**
 * GET IMAGE PERCENT HEIGHT
 * Calculate the height (in % respect the width) for lazy loaded images
 * @param string image The image path
 * @return string
 */
function get_image_percent_height($image) {
    $PERCENT_HEIGHT = 0;

    /** Extract image infos */
    list($width, $height, $type, $attr) = getimagesize($image);
    $PERCENT_HEIGHT = $height / $width * 100 . '%';

    return $PERCENT_HEIGHT;
}
?>

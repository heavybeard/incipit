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
 * @param array
 * @return num
 */
function array_depth(array $array) {
    $max_depth = 1;

    foreach ($array as $value) {
        if (is_array($value)) {
            $depth = array_depth($value) + 1;
            if ($depth > $max_depth) {
                $max_depth = $depth;
            }
            echo '<pre>'; var_export($value); echo '</pre>';
        }
    }

    return $max_depth;
}


/**
 * ARRAY EXCLUDE
 * Exclude the given keys from array
 *
 * @param array, [key1, ..., keyN]
 * @return array
 */
function arrayExclude($array, Array $excludeKeys) {
    foreach($excludeKeys as $key) {
        unset($array[$key]);
    }
    return $array;
}
?>

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
 * @param array $array
 * @param array $excludeKeys a list of string for exclude key->value from array
 * @return array the array with excluded key
 */
function arrayExclude($array, Array $excludeKeys) {
    foreach($excludeKeys as $key) {
        unset($array[$key]);
    }
    return $array;
}
?>

<?php
/**
 * HEAD
 * The head parts of all files
 *
 * ===========================================================================
 */
?>

<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml" lang="it">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title><?php the_title(); the_site('name'); ?></title>
        <meta name="description" content="<?php the_description(); ?>">

        <?php the_opengraph(); ?>

        <?php rq_part('webapp'); ?>
    </head>
    <body>
        <div id="container">

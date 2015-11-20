<?php
/**
 * WEBAPP
 * The webapp part
 *
 * ===========================================================================
 */
?>

<!-- favicons -->
<link rel="icon" href="<?= WEBAPP_ICON_PATH ?>favicon.png">
<!--[if IE]> <link rel="shortcut icon" href="<?= WEBAPP_ICON_PATH ?>favicon.ico"> <![endif]-->

<!-- browser UI -->
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="<?php the_webapp('statusbar'); ?>">

<!-- set the correct name -->
<meta name="application-name" content="<?php the_webapp('title'); ?>">
<meta name="apple-mobile-web-app-title" content="<?php the_webapp('title'); ?>">

<!-- icon in the highest resolution we need it for -->
<link rel="icon" sizes="228x228" href="<?= WEBAPP_ICON_PATH ?>icon-228x228.png">
<link rel="apple-touch-icon" sizes="228x228" href="<?= WEBAPP_ICON_PATH ?>icon-228x228.png">

<!-- multiple icons for IE11 on Win8 (actual images are 1.8 larger, per MS recommendation) -->
<meta name="msapplication-square70x70logo" content="<?= WEBAPP_ICON_PATH ?>_smalltile.png">
<meta name="msapplication-square150x150logo" content="<?= WEBAPP_ICON_PATH ?>_mediumtile.png">
<meta name="msapplication-wide310x150logo" content="<?= WEBAPP_ICON_PATH ?>_widetile.png">
<meta name="msapplication-square310x310logo" content="<?= WEBAPP_ICON_PATH ?>_largetile.png">

<!-- Tile icon for IE10 on Win8 (144x144 + tile color) -->
<meta name="msapplication-TileImage" content="<?= WEBAPP_ICON_PATH ?>icon-144x144.png">
<meta name="msapplication-TileColor" content="<?php the_webapp('color'); ?>">

<!-- iOS 6 & 7 iPad (retina, portrait) -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-1536x2008.png"
    media="(device-width: 768px) and (device-height: 1024px)
        and (orientation: portrait)
        and (-webkit-device-pixel-ratio: 2)"
    rel="apple-touch-startup-image">

<!-- iOS 6 & 7 iPad (retina, landscape) -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-1496x2048.png"
    media="(device-width: 768px) and (device-height: 1024px)
        and (orientation: landscape)
        and (-webkit-device-pixel-ratio: 2)"
    rel="apple-touch-startup-image">

<!-- iOS 6 iPad (portrait) -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-768x1004.png"
    media="(device-width: 768px) and (device-height: 1024px)
        and (orientation: portrait)
        and (-webkit-device-pixel-ratio: 1)"
    rel="apple-touch-startup-image">

<!-- iOS 6 iPad (landscape) -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-748x1024.png"
    media="(device-width: 768px) and (device-height: 1024px)
        and (orientation: landscape)
        and (-webkit-device-pixel-ratio: 1)"
    rel="apple-touch-startup-image">

<!-- iOS 6 & 7 iPhone 5 -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-640x1096.png"
    media="(device-width: 320px) and (device-height: 568px)
        and (-webkit-device-pixel-ratio: 2)"
    rel="apple-touch-startup-image">

<!-- iOS 6 & 7 iPhone (retina) -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-640x920.png"
    media="(device-width: 320px) and (device-height: 480px)
        and (-webkit-device-pixel-ratio: 2)"
    rel="apple-touch-startup-image">

<!-- iOS 6 iPhone -->
<link href="<?= WEBAPP_STARTUP_PATH ?>apple-touch-startup-image-320x460.png"
    media="(device-width: 320px) and (device-height: 480px)
        and (-webkit-device-pixel-ratio: 1)"
    rel="apple-touch-startup-image">

<!-- Tooltip (Desktop) -->
<meta name="msapplication-tooltip" content="<?php the_webapp('description'); ?>">

<!-- Start url when pinned (Desktop) -->
<meta name="msapplication-starturl" content="<?php the_webapp('starturl'); ?>">

<!-- Color of navigation buttons (back/forward) (Desktop) -->
<meta name="msapplication-navbutton-color" content="<?php the_webapp('color'); ?>">

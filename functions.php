<?php
// FRONT-END ENQUEUES
function enqueue_scripts_fn()
{
// Main css file
wp_enqueue_style('theme-style', get_stylesheet_uri());

// Main js file
wp_enqueue_script('theme-js', get_template_directory_uri() . '/dist/app.min.js', array(), true, true);
}
add_action('wp_enqueue_scripts', 'enqueue_scripts_fn');
<?php
/**
 * UpLift Founders - functions.php
 * Handles theme setups, asset enqueuing, custom post types, and custom navigation walkers.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// --- Theme Setups ---
function uplift_theme_setup() {
    // Add default title-tag support
    add_theme_support( 'title-tag' );

    // Enable post thumbnails support
    add_theme_support( 'post-thumbnails' );

    // Register navigation menu locations
    register_nav_menus( array(
        'primary' => __( 'Primary Header Navigation', 'uplift-founders' ),
        'footer'  => __( 'Footer Navigation', 'uplift-founders' ),
        'mobile'  => __( 'Mobile Overlay Navigation', 'uplift-founders' ),
    ) );
}
add_action( 'after_setup_theme', 'uplift_theme_setup' );

// --- Asset Enqueuing ---
function uplift_enqueue_assets() {
    // Enqueue Google Fonts
    wp_enqueue_style( 'uplift-google-fonts', 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&display=swap', array(), null );

    // Enqueue Tailwind CSS CDN
    wp_enqueue_style( 'uplift-tailwind', 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css', array(), null );

    // Enqueue Custom main.css
    wp_enqueue_style( 'uplift-main-style', get_template_directory_uri() . '/main.css', array(), '1.0.0' );

    // Enqueue theme style.css for WordPress requirements
    wp_enqueue_style( 'uplift-wp-theme-style', get_stylesheet_uri(), array(), '1.0.0' );

    // Enqueue GSAP Core & ScrollTrigger
    wp_enqueue_script( 'gsap-core', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js', array(), null, true );
    wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js', array('gsap-core'), null, true );

    // Enqueue Lenis Smooth Scroll
    wp_enqueue_script( 'lenis-scroll', 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js', array(), null, true );

    // Enqueue Main app.js Script (with dependencies on GSAP and Lenis)
    wp_enqueue_script( 'uplift-app', get_template_directory_uri() . '/app.js', array('gsap-core', 'gsap-scrolltrigger', 'lenis-scroll'), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'uplift_enqueue_assets' );

// --- Custom CPT Registrations ---
function uplift_register_custom_post_types() {
    // Testimonials CPT
    register_post_type( 'testimonial', array(
        'labels'      => array(
            'name'          => __( 'Testimonials', 'uplift-founders' ),
            'singular_name' => __( 'Testimonial', 'uplift-founders' ),
        ),
        'public'      => true,
        'has_archive' => false,
        'supports'    => array( 'title', 'editor', 'thumbnail' ),
        'menu_icon'   => 'dashicons-testimonial',
    ) );

    // Journey Stages CPT
    register_post_type( 'journey_stage', array(
        'labels'      => array(
            'name'          => __( 'Journey Stages', 'uplift-founders' ),
            'singular_name' => __( 'Journey Stage', 'uplift-founders' ),
        ),
        'public'      => true,
        'has_archive' => false,
        'supports'    => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
        'menu_icon'   => 'dashicons-randomize',
    ) );

    // FAQ CPT
    register_post_type( 'faq', array(
        'labels'      => array(
            'name'          => __( 'FAQs', 'uplift-founders' ),
            'singular_name' => __( 'FAQ', 'uplift-founders' ),
        ),
        'public'      => true,
        'has_archive' => false,
        'supports'    => array( 'title', 'editor' ),
        'menu_icon'   => 'dashicons-editor-help',
    ) );

    // Team Members CPT
    register_post_type( 'team_member', array(
        'labels'      => array(
            'name'          => __( 'Team Members', 'uplift-founders' ),
            'singular_name' => __( 'Team Member', 'uplift-founders' ),
        ),
        'public'      => true,
        'has_archive' => false,
        'supports'    => array( 'title', 'editor', 'thumbnail' ),
        'menu_icon'   => 'dashicons-groups',
    ) );
}
add_action( 'init', 'uplift_register_custom_post_types' );

// --- Custom Walkers for Menus (Preserves DOM structure) ---

/**
 * Custom Walker for primary and footer menus (Awwwards-style Rolling Links)
 */
class Uplift_Rolling_Menu_Walker extends Walker_Nav_Menu {
    function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $title = apply_filters( 'the_title', $item->title, $item->ID );
        $url   = ! empty( $item->url ) ? esc_url( $item->url ) : '#';
        
        $theme_location = isset( $args->theme_location ) ? $args->theme_location : 'primary';
        
        if ( $theme_location === 'footer' ) {
            $link_class = 'rolling-link font-accent text-[10px] font-semibold tracking-widest text-neutral-400 uppercase';
        } else {
            $link_class = 'rolling-link font-accent text-xs font-semibold tracking-widest text-neutral-500 uppercase';
        }
        
        $output .= sprintf(
            '<a href="%s" class="%s"><span class="rolling-link-inner"><span class="rolling-link-text">%s</span><span class="rolling-link-text text-[#111111]" aria-hidden="true">%s</span></span></a>',
            $url,
            esc_attr( $link_class ),
            esc_html( $title ),
            esc_html( $title )
        );
    }
    
    function end_el( &$output, $item, $depth = 0, $args = null ) {
        // No </li> tag to preserve flex row formatting
    }
}

/**
 * Custom Walker for fullscreen Mobile navigation drawer overlay
 */
class Uplift_Mobile_Menu_Walker extends Walker_Nav_Menu {
    function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $title = apply_filters( 'the_title', $item->title, $item->ID );
        $url   = ! empty( $item->url ) ? esc_url( $item->url ) : '#';
        
        $output .= sprintf(
            '<div class="mobile-overlay-item overflow-hidden"><a href="%s" class="mobile-overlay-link font-display text-4xl sm:text-5xl text-white font-bold block py-2 uppercase hover:text-[#D2F53C] transition-colors">%s</a></div>',
            $url,
            esc_html( $title )
        );
    }
    
    function end_el( &$output, $item, $depth = 0, $args = null ) {
        // No wrapping li elements
    }
}

// --- Dynamic Fallback Data Generators ---

function uplift_get_default_testimonials() {
    return array(
        array(
            'quote'  => '“The mentorship and operational support from UpLift completely transformed how we scaled our Series A. Yannick and Till have been in the trenches themselves, and it shows.”',
            'author' => 'Ann Sophie Claus',
            'role'   => 'Co-Founder, The Female Company',
            'image'  => get_template_directory_uri() . '/img/testimonial-ann.png'
        ),
        array(
            'quote'  => '“UpLift is not just another network. It’s an elite sparring group. They helped us restructure our leadership team and clear roadblocks we’d been hitting for months.”',
            'author' => 'John Brown',
            'role'   => 'CEO, CloudScale',
            'image'  => get_template_directory_uri() . '/img/testimonial-john.png'
        ),
        array(
            'quote'  => '“As a solo founder, the journey is incredibly lonely. UpLift gave me the community and the tactical strategies to scale from 10 to 80 people without breaking our culture.”',
            'author' => 'Linda Smith',
            'role'   => 'Founder, FinFlow',
            'image'  => get_template_directory_uri() . '/img/testimonial-linda.png'
        )
    );
}

function uplift_get_default_stages() {
    return array(
        array(
            'num'   => '01',
            'title' => 'ALIGNING ON STRATEGY',
            'desc'  => 'We align your leadership, product-market fit, and operational structure to build a rock-solid foundation for massive growth.',
            'image' => get_template_directory_uri() . '/img/stage-1-strategy.png'
        ),
        array(
            'num'   => '02',
            'title' => 'EXECUTIVE LEADERSHIP',
            'desc'  => 'Transition from a hands-on manager to an inspiring visionary leader. Build high-performing, self-sufficient executive teams.',
            'image' => get_template_directory_uri() . '/img/stage-2-leadership.png'
        ),
        array(
            'num'   => '03',
            'title' => 'OPERATIONAL SCALING',
            'desc'  => 'Implement robust growth frameworks, reliable processes, and scalable technology stacks to support rapid, predictable growth.',
            'image' => get_template_directory_uri() . '/img/stage-3-scaling.png'
        ),
        array(
            'num'   => '04',
            'title' => 'COMMUNITY SPARRING',
            'desc'  => 'Gain direct, ongoing access to peer sparring groups, active mentor advisory boards, and private high-impact events.',
            'image' => get_template_directory_uri() . '/img/stage-4-community.png'
        )
    );
}

function uplift_get_default_coaches() {
    return array(
        array(
            'name'  => 'Yannick Frank',
            'role'  => 'Co-Founder & Coach',
            'desc'  => 'Yannick scaled three tech startups to successful exits and coaches on go-to-market and executive alignment.',
            'image' => get_template_directory_uri() . '/img/coach-yannick.png'
        ),
        array(
            'name'  => 'Till Augner',
            'role'  => 'Co-Founder & Coach',
            'desc'  => 'Till is an organizational designer who specializes in scaling product teams and building healthy, high-trust cultures.',
            'image' => get_template_directory_uri() . '/img/coach-till.png'
        )
    );
}

function uplift_get_default_faqs() {
    return array(
        array(
            'question' => 'How is UpLift different from traditional startup accelerators?',
            'answer'   => 'Unlike accelerators that focus on early-stage validation and pitch prep for demo days, UpLift is designed exclusively for late-stage founders (Series A/B) focusing on operational scaling, executive team building, and leadership sparring. We don’t take equity.'
        ),
        array(
            'question' => 'Who are the coaches and how often do we meet?',
            'answer'   => 'All our coaches are seasoned former founders or operators who have scaled companies to €50M+ ARR or exits. Sparring sessions happen bi-weekly, with continuous Slack support and monthly cohort meetups.'
        ),
        array(
            'question' => 'What is the cohort size and startup background requirement?',
            'answer'   => 'Each cohort is strictly capped at 8 founders. To maintain group relevance, we require startups to have at least €1M in funding or ARR, and a minimum team size of 10 people.'
        ),
        array(
            'question' => 'Do you take equity or is this a paid program?',
            'answer'   => 'We charge a flat monthly fee for participation. We do not take equity, ensuring our incentives align entirely with your long-term, non-dilutive founder growth.'
        )
    );
}

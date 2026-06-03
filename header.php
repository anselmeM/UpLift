<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Lucide Icons Font Face (Fallback CSS) -->
    <style>
      @font-face {
        font-family: 'LucideIcons';
        src: url(https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.ttf) format('truetype');
      }
      .lucide {
        font-family: 'LucideIcons'; font-style: normal; font-weight: normal; font-variant: normal;
        text-rendering: auto; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        display: inline-block;
      }
    </style>

    <?php wp_head(); ?>
</head>
<body <?php body_class( 'antialiased font-sans text-neutral-900 bg-[#FAF8F5] selection:bg-[#5D5FEF] selection:text-white' ); ?>>
    <?php wp_body_open(); ?>

    <!-- Custom Cursor -->
    <div class="custom-cursor-dot" aria-hidden="true"></div>
    <div class="custom-cursor-ring" aria-hidden="true"></div>

    <!-- Tactile Noise Grain Overlay -->
    <div class="noise-overlay" aria-hidden="true"></div>

    <!-- Preloader -->
    <div id="preloader" class="flex flex-col items-center justify-center bg-[#FAF8F5] fixed inset-0 z-[9999]">
        <div id="preloader-logo" class="font-display text-8xl font-extrabold text-[#111111] select-none">u.</div>
    </div>

    <!-- Header / Navigation -->
    <header class="py-5 px-4 sm:px-6 lg:px-8 sticky top-0 bg-[#FAF8F5]/80 backdrop-blur-md z-50 border-b border-neutral-200/50" role="banner">
         <nav class="flex justify-between items-center max-w-7xl mx-auto" aria-label="Main Navigation">
            <div class="flex-shrink-0">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-link font-display text-3xl font-black text-[#111111] magnetic-btn inline-block">
                    <span>u.</span>
                </a>
            </div>
            <div class="hidden md:flex space-x-8 items-center">
                <?php
                if ( has_nav_menu( 'primary' ) ) {
                    wp_nav_menu( array(
                        'theme_location' => 'primary',
                        'container'      => false,
                        'items_wrap'     => '%3$s',
                        'walker'         => new Uplift_Rolling_Menu_Walker(),
                        'fallback_cb'    => false,
                    ) );
                } else {
                    // Fallback to original static HTML links
                    ?>
                    <a href="#founders-say" class="rolling-link font-accent text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                        <span class="rolling-link-inner">
                            <span class="rolling-link-text">What Founders Say</span>
                            <span class="rolling-link-text text-[#111111]" aria-hidden="true">What Founders Say</span>
                        </span>
                    </a>
                    <a href="#manifesto" class="rolling-link font-accent text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                        <span class="rolling-link-inner">
                            <span class="rolling-link-text">Manifesto</span>
                            <span class="rolling-link-text text-[#111111]" aria-hidden="true">Manifesto</span>
                        </span>
                    </a>
                    <a href="#about-us" class="rolling-link font-accent text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                        <span class="rolling-link-inner">
                            <span class="rolling-link-text">About Us</span>
                            <span class="rolling-link-text text-[#111111]" aria-hidden="true">About Us</span>
                        </span>
                    </a>
                    <?php
                }
                ?>
            </div>
            <div class="flex-shrink-0">
                <a href="mailto:hello@upliftco.example.com?subject=Inquiry%20from%20Website" class="btn btn-primary bg-[#111111] hover:bg-[#5D5FEF] text-white font-accent text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 magnetic-btn">
                    <span>Get In Touch</span>
                </a>
            </div>
            <div class="md:hidden flex items-center">
                <button id="mobile-menu-button" class="hamburger-btn focus:outline-none w-10 h-10 flex flex-col justify-center items-center relative z-50 magnetic-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu-overlay">
                    <div class="hamburger-line line-top bg-neutral-900 w-6 h-[2px] mb-1.5 transition-all duration-300"></div>
                    <div class="hamburger-line line-bottom bg-neutral-900 w-6 h-[2px] transition-all duration-300"></div>
                </button>
            </div>
        </nav>
    </header>

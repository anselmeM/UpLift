<?php
/**
 * UpLift Founders - footer.php
 * Outputs the footer, mobile navigation overlay, and wp_footer scripts hook.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
?>

    <!-- Footer -->
    <footer class="animate-section py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-200/50 bg-[#FAF8F5]" role="contentinfo">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
             
             <!-- Navigation Links -->
             <div class="animate-element flex space-x-6 order-2 md:order-1 mt-6 md:mt-0">
                 <?php
                 if ( has_nav_menu( 'footer' ) ) {
                     wp_nav_menu( array(
                         'theme_location' => 'footer',
                         'container'      => false,
                         'items_wrap'     => '%3$s',
                         'walker'         => new Uplift_Rolling_Menu_Walker(),
                         'fallback_cb'    => false,
                     ) );
                 } else {
                     // Fallback to original static HTML links
                     ?>
                     <a href="#founders-say" class="rolling-link font-accent text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                         <span class="rolling-link-inner">
                             <span class="rolling-link-text">What Founders Say</span>
                             <span class="rolling-link-text text-[#111111]" aria-hidden="true">What Founders Say</span>
                         </span>
                     </a>
                     <a href="#manifesto" class="rolling-link font-accent text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                         <span class="rolling-link-inner">
                             <span class="rolling-link-text">Manifesto</span>
                             <span class="rolling-link-text text-[#111111]" aria-hidden="true">Manifesto</span>
                         </span>
                     </a>
                     <a href="#about-us" class="rolling-link font-accent text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
                         <span class="rolling-link-inner">
                             <span class="rolling-link-text">About Us</span>
                             <span class="rolling-link-text text-[#111111]" aria-hidden="true">About Us</span>
                         </span>
                     </a>
                     <?php
                 }
                 ?>
             </div>
             
             <!-- Copyright / Signature -->
             <div class="animate-element flex flex-col md:flex-row items-center order-1 md:order-2 space-y-2 md:space-y-0 md:space-x-6 text-center md:text-right">
                 <p class="font-accent text-[10px] text-neutral-400 tracking-widest font-semibold">&copy; <?php echo date( 'Y' ); ?> Uplift Founders</p>
                 <span class="font-display font-black text-sm tracking-tight text-neutral-900 uppercase"><?php bloginfo( 'name' ); ?>.</span>
             </div>
             
        </div>
    </footer>

    <!-- Fullscreen Mobile Menu Overlay -->
    <div id="mobile-menu-overlay" class="fixed inset-0 bg-[#0C0C0E] z-[48] flex flex-col justify-center px-6 sm:px-12 md:hidden" role="navigation" aria-label="Mobile Navigation">
        <div class="flex flex-col space-y-8 text-left max-w-lg mx-auto w-full">
            <span class="font-accent text-neutral-600 text-xs font-bold tracking-widest uppercase mb-2 block">Navigation</span>
            
            <?php
            if ( has_nav_menu( 'mobile' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'mobile',
                    'container'      => false,
                    'items_wrap'     => '%3$s',
                    'walker'         => new Uplift_Mobile_Menu_Walker(),
                    'fallback_cb'    => false,
                ) );
            } elseif ( has_nav_menu( 'primary' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'items_wrap'     => '%3$s',
                    'walker'         => new Uplift_Mobile_Menu_Walker(),
                    'fallback_cb'    => false,
                ) );
            } else {
                // Fallback to original static HTML links
                ?>
                <div class="mobile-overlay-item overflow-hidden">
                    <a href="#founders-say" class="mobile-overlay-link font-display text-4xl sm:text-5xl text-white font-bold block py-2 uppercase hover:text-[#D2F53C] transition-colors">What Founders Say</a>
                </div>
                <div class="mobile-overlay-item overflow-hidden">
                    <a href="#manifesto" class="mobile-overlay-link font-display text-4xl sm:text-5xl text-white font-bold block py-2 uppercase hover:text-[#D2F53C] transition-colors">Manifesto</a>
                </div>
                <div class="mobile-overlay-item overflow-hidden">
                    <a href="#about-us" class="mobile-overlay-link font-display text-4xl sm:text-5xl text-white font-bold block py-2 uppercase hover:text-[#D2F53C] transition-colors">About Us</a>
                </div>
                <?php
            }
            ?>
            
            <div class="pt-8 border-t border-neutral-800 flex flex-col space-y-4">
                <span class="font-accent text-neutral-600 text-[10px] font-bold tracking-widest uppercase">Get In Touch</span>
                <a href="mailto:hello@upliftco.example.com?subject=Inquiry" class="font-display text-xl sm:text-2xl text-[#D2F53C] hover:text-white transition-colors">hello@upliftco.example.com</a>
            </div>
        </div>
    </div>

    <?php wp_footer(); ?>
</body>
</html>

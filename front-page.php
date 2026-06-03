<?php
/**
 * UpLift Founders - front-page.php
 * Main landing page template containing all section layouts and dynamic loop integrations.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

get_header();

// --- Gather Custom Fields with Fallbacks ---
$post_id = get_the_ID();

// Hero Content
$hero_word_1       = get_post_meta( $post_id, 'hero_word_1', true ) ?: 'WE';
$hero_word_2       = get_post_meta( $post_id, 'hero_word_2', true ) ?: 'UP';
$hero_word_2_rest  = get_post_meta( $post_id, 'hero_word_2_rest', true ) ?: 'IFT';
$hero_word_3       = get_post_meta( $post_id, 'hero_word_3', true ) ?: 'FOUNDERS';
$hero_avatar_1     = get_post_meta( $post_id, 'hero_avatar_1', true ) ?: get_template_directory_uri() . '/img/hero-avatar-1.png';
$hero_avatar_2     = get_post_meta( $post_id, 'hero_avatar_2', true ) ?: get_template_directory_uri() . '/img/hero-avatar-2.png';
$hero_subtext      = get_post_meta( $post_id, 'hero_subtext', true ) ?: 'UpLift Founders is a premier advisory and peer sparsing network for high-growth tech startup founders scaling from Series A to exit.';
$hero_button_text  = get_post_meta( $post_id, 'hero_button_text', true ) ?: 'Tell Us About You';
$hero_button_link  = get_post_meta( $post_id, 'hero_button_link', true ) ?: 'mailto:hello@upliftco.example.com?subject=Inquiry%20from%20Website';

// Trust Content
$trust_headline    = get_post_meta( $post_id, 'trust_headline', true ) ?: 'Trusted by founders of high-growth startups.';
$trust_subtext     = get_post_meta( $post_id, 'trust_subtext', true ) ?: 'We partner with ambitious founders who are ready to scale their vision, build robust executive leadership skills, and make a lasting industry impact.';

// Testimonials Loop
$testimonial_query = new WP_Query( array(
    'post_type'      => 'testimonial',
    'posts_per_page' => -1,
    'order'          => 'ASC'
) );
$testimonials = array();
if ( $testimonial_query->have_posts() ) {
    while ( $testimonial_query->have_posts() ) {
        $testimonial_query->the_post();
        $role = get_post_meta( get_the_ID(), 'testimonial_role', true );
        $testimonials[] = array(
            'quote'  => get_the_content(),
            'author' => get_the_title(),
            'role'   => $role,
            'image'  => get_the_post_thumbnail_url( get_the_ID(), 'thumbnail' ) ?: 'https://placehold.co/60x60/cccccc/ffffff?text=Founder'
        );
    }
    wp_reset_postdata();
} else {
    $testimonials = uplift_get_default_testimonials();
}

// Manifesto Content
$manifesto_headline    = get_post_meta( $post_id, 'manifesto_headline', true ) ?: 'Building a successful company can feel like a <span class="font-serif italic font-normal text-neutral-400 lowercase">rollercoaster ride.</span> Compassion alone won\'t get you there.';
$manifesto_subheadline = get_post_meta( $post_id, 'manifesto_subheadline', true ) ?: 'WE WILL.';
$manifesto_image       = get_post_meta( $post_id, 'manifesto_image', true ) ?: get_template_directory_uri() . '/img/approach-growth.png';

// Value Proposition Content
$value_prop_headline   = get_post_meta( $post_id, 'value_prop_headline', true ) ?: 'We empower you to become the founder your company needs to scale faster.';
$value_prop_link_text  = get_post_meta( $post_id, 'value_prop_link_text', true ) ?: 'EXPLORE OUR PROGRAMS';
$value_prop_link_url   = get_post_meta( $post_id, 'value_prop_link_url', true ) ?: '#';
$value_prop_image      = get_post_meta( $post_id, 'value_prop_image', true ) ?: get_template_directory_uri() . '/img/dashboard-mockup.png';

// Journey Stages Loop
$stage_query = new WP_Query( array(
    'post_type'      => 'journey_stage',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC'
) );
$stages = array();
if ( $stage_query->have_posts() ) {
    $count = 1;
    while ( $stage_query->have_posts() ) {
        $stage_query->the_post();
        $stages[] = array(
            'num'   => sprintf( '%02d', $count ),
            'title' => get_the_title(),
            'desc'  => get_the_content(),
            'image' => get_the_post_thumbnail_url( get_the_ID(), 'large' ) ?: 'https://placehold.co/600x400/cccccc/ffffff?text=Stage'
        );
        $count++;
    }
    wp_reset_postdata();
} else {
    $stages = uplift_get_default_stages();
}

// Team Section Content
$team_headline = get_post_meta( $post_id, 'team_headline', true ) ?: 'We\'ve been through it all.';

// Coaches Loop
$team_query = new WP_Query( array(
    'post_type'      => 'team_member',
    'posts_per_page' => -1,
    'order'          => 'ASC'
) );
$coaches = array();
if ( $team_query->have_posts() ) {
    while ( $team_query->have_posts() ) {
        $team_query->the_post();
        $role = get_post_meta( get_the_ID(), 'team_role', true );
        $coaches[] = array(
            'name'  => get_the_title(),
            'role'  => $role,
            'image' => get_the_post_thumbnail_url( get_the_ID(), 'medium' ) ?: 'https://placehold.co/200x200/cccccc/ffffff?text=Coach'
        );
    }
    wp_reset_postdata();
} else {
    $coaches = uplift_get_default_coaches();
}

// Core Pillars (Team Section Sidebar)
$pillar_1_title = get_post_meta( $post_id, 'pillar_1_title', true ) ?: 'Empathy';
$pillar_1_desc  = get_post_meta( $post_id, 'pillar_1_desc', true ) ?: 'We\'ve built organizations ourselves, navigating the exact leadership pressures you experience.';
$pillar_2_title = get_post_meta( $post_id, 'pillar_2_title', true ) ?: 'Experience';
$pillar_2_desc  = get_post_meta( $post_id, 'pillar_2_desc', true ) ?: 'Direct strategic advisory provided to 200+ founders across global growth cycles.';
$pillar_3_title = get_post_meta( $post_id, 'pillar_3_title', true ) ?: 'Availability';
$pillar_3_desc  = get_post_meta( $post_id, 'pillar_3_desc', true ) ?: 'Dedicated 1:1 async coaching channels available whenever urgent hurdles emerge.';

// FAQs Loop
$faq_query = new WP_Query( array(
    'post_type'      => 'faq',
    'posts_per_page' => -1,
    'order'          => 'ASC'
) );
$faqs = array();
if ( $faq_query->have_posts() ) {
    while ( $faq_query->have_posts() ) {
        $faq_query->the_post();
        $faqs[] = array(
            'question' => get_the_title(),
            'answer'   => get_the_content()
        );
    }
    wp_reset_postdata();
} else {
    $faqs = uplift_get_default_faqs();
}

// Final CTA Content
$cta_headline    = get_post_meta( $post_id, 'cta_headline', true ) ?: 'Ready for an uplift?';
$cta_subtext     = get_post_meta( $post_id, 'cta_subtext', true ) ?: 'We\'re on a mission to make scaling a company smoother by empowering founders to become extraordinary leaders. Let\'s work together.';
$cta_button_text = get_post_meta( $post_id, 'cta_button_text', true ) ?: 'Tell Us About You';
$cta_button_link = get_post_meta( $post_id, 'cta_button_link', true ) ?: 'mailto:hello@upliftco.example.com?subject=Inquiry%20from%20Website';
$cta_deco_image_1 = get_post_meta( $post_id, 'cta_deco_image_1', true ) ?: get_template_directory_uri() . '/img/deco-shape-1.png';
$cta_deco_image_2 = get_post_meta( $post_id, 'cta_deco_image_2', true ) ?: get_template_directory_uri() . '/img/deco-shape-2.png';
?>

    <main role="main">
        
        <!-- Hero Section -->
        <section class="hero-section py-24 md:py-36 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto overflow-hidden" role="region" aria-label="Hero Section">
            <div class="hero-headline-wrapper mb-8">
                <h1 id="hero-headline" class="hero-headline font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.95] tracking-tighter">
                    <span class="hero-word"><?php echo esc_html( $hero_word_1 ); ?></span> 
                    <span class="hero-word"><?php echo esc_html( $hero_word_2 ); ?><span class="img-placeholder-wrapper">L<img src="<?php echo esc_url( $hero_avatar_1 ); ?>" alt="Founder photo 1" class="img-placeholder pos-l" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/ffffff?text=F1';"></span><?php echo esc_html( $hero_word_2_rest ); ?></span>
                    <span class="hero-word"><?php echo esc_html( $hero_word_3 ); ?><span class="img-placeholder-wrapper">S<img src="<?php echo esc_url( $hero_avatar_2 ); ?>" alt="Founder photo 2" class="img-placeholder pos-s" onerror="this.onerror=null;this.src='https://placehold.co/80x80/cccccc/ffffff?text=F2';"></span></span>
                </h1>
            </div>
            <p id="hero-subtext" class="font-sans text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                <?php echo esc_html( $hero_subtext ); ?>
            </p>
            <div class="flex justify-center">
                <a href="<?php echo esc_url( $hero_button_link ); ?>" id="hero-button" class="btn btn-primary bg-[#5D5FEF] hover:bg-[#111111] text-white font-accent text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 magnetic-btn">
                    <span><?php echo esc_html( $hero_button_text ); ?></span>
                </a>
            </div>
        </section>

        <!-- Testimonial Slider / Trust Section -->
        <section id="founders-say" class="animate-section py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200/50" role="region" aria-label="Testimonials and Trust">
             <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  
                  <!-- Slider Card Container -->
                  <div id="testimonial-slider" class="animate-element lg:col-span-7 relative overflow-hidden drag-hover-target" role="group" aria-roledescription="carousel" aria-label="Founder Testimonials">
                      <div id="testimonial-wrapper" class="flex" aria-live="polite">
                          
                          <?php foreach ( $testimonials as $index => $t ) : ?>
                              <div class="testimonial-card w-full flex-shrink-0" role="group" aria-label="Slide <?php echo $index + 1; ?> of <?php echo count( $testimonials ); ?>" <?php echo $index > 0 ? 'aria-hidden="true"' : ''; ?>>
                                   <div class="bg-[#FAF8F5] p-8 sm:p-12 rounded-3xl border border-neutral-200/60 h-full flex flex-col justify-between tilt-card">
                                       <p class="text-neutral-800 text-lg sm:text-xl leading-relaxed mb-8 font-sans font-medium tilt-child-3d-md"><?php echo esc_html( $t['quote'] ); ?></p>
                                       <div class="flex items-center space-x-4 border-t border-neutral-200/40 pt-6 tilt-child-3d-sm">
                                           <img src="<?php echo esc_url( $t['image'] ); ?>" alt="<?php echo esc_attr( $t['author'] ); ?>" class="w-12 h-12 rounded-full object-cover border border-neutral-300" onerror="this.onerror=null;this.src='https://placehold.co/60x60/cccccc/ffffff?text=AC';">
                                           <div>
                                               <p class="font-display font-bold text-sm tracking-tight text-neutral-900 uppercase"><?php echo esc_html( $t['author'] ); ?></p>
                                               <p class="font-accent text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mt-0.5"><?php echo esc_html( $t['role'] ); ?></p>
                                           </div>
                                       </div>
                                   </div>
                              </div>
                          <?php endforeach; ?>
                          
                      </div>
                      <div class="mt-8 flex space-x-3">
                          <button id="prev-testimonial" class="testimonial-arrow w-10 h-10 rounded-full border border-neutral-200 hover:bg-[#111111] hover:text-white transition-all flex items-center justify-center magnetic-btn" aria-label="Previous testimonial" aria-controls="testimonial-wrapper">
                              <span>&larr;</span>
                          </button>
                          <button id="next-testimonial" class="testimonial-arrow w-10 h-10 rounded-full border border-neutral-200 hover:bg-[#111111] hover:text-white transition-all flex items-center justify-center magnetic-btn" aria-label="Next testimonial" aria-controls="testimonial-wrapper">
                              <span>&rarr;</span>
                          </button>
                      </div>
                  </div>
                  
                  <!-- Trust Headline Text -->
                  <div class="animate-element lg:col-span-5 text-left lg:pl-8">
                      <h2 class="trust-headline font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-neutral-900 mb-6 leading-[1.05]">
                          <?php echo esc_html( $trust_headline ); ?>
                      </h2>
                      <p class="text-neutral-500 font-sans text-base leading-relaxed">
                          <?php echo esc_html( $trust_subtext ); ?>
                      </p>
                  </div>
                  
              </div>
         </section>

         <!-- Parallax and Compassion Section -->
         <section id="manifesto" class="animate-section py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#0C0C0E] text-white relative overflow-hidden" role="region" aria-label="Our Approach">
             <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
                  
                  <div class="animate-element text-left md:pr-12">
                      <h2 class="we-will-headline font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.05]">
                          <?php echo wp_kses_post( $manifesto_headline ); ?>
                      </h2>
                      <p class="we-will-headline font-display text-5xl sm:text-6xl font-black uppercase tracking-tighter text-[#D2F53C]">
                          <?php echo esc_html( $manifesto_subheadline ); ?>
                      </p>
                  </div>
                  
                  <div class="animate-element image-reveal-wrapper rounded-3xl overflow-hidden aspect-[4/3] max-w-xl mx-auto w-full border border-neutral-800">
                      <div class="h-full w-full flex items-center justify-center bg-neutral-900 overflow-hidden">
                          <img src="<?php echo esc_url( $manifesto_image ); ?>" alt="Business context image showing growth or planning" class="reveal-image w-full h-full object-cover scale-110" onerror="this.onerror=null;this.src='https://placehold.co/400x250/cccccc/ffffff?text=Image+Error';">
                      </div>
                  </div>
                  
             </div>
             
             <!-- Animated Squiggle -->
             <div class="absolute bottom-12 right-12 md:bottom-20 md:right-1/4 opacity-40 z-10">
                  <svg class="squiggle w-36 h-auto" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path id="squiggle-path" d="M 0 15 Q 10 0, 20 15 T 40 15 Q 50 30, 60 15 T 80 15 Q 90 0, 100 15" stroke-linecap="round" stroke-linejoin="round" stroke="#D2F53C" stroke-width="4" fill="none"/></svg>
             </div>
         </section>

         <!-- Value Proposition Section -->
         <section class="animate-section py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/50" role="region" aria-label="Value Proposition">
              <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                   
                   <div class="animate-element text-left">
                        <h2 class="value-prop-headline font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] mb-8 text-neutral-900">
                            <?php echo esc_html( $value_prop_headline ); ?>
                        </h2>
                        <a href="<?php echo esc_url( $value_prop_link_url ); ?>" class="font-accent text-xs font-bold tracking-widest text-[#5D5FEF] hover:text-[#111111] transition-colors flex items-center space-x-2">
                            <span><?php echo esc_html( $value_prop_link_text ); ?></span> <span>&rarr;</span>
                        </a>
                   </div>
                   
                   <div class="animate-element image-reveal-wrapper rounded-3xl overflow-hidden aspect-[4/3] max-w-xl mx-auto w-full border border-neutral-200/60">
                        <div class="h-full w-full bg-neutral-100 overflow-hidden">
                            <img src="<?php echo esc_url( $value_prop_image ); ?>" alt="Mockup of a web application interface" class="reveal-image w-full h-full object-cover scale-110" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';">
                        </div>
                   </div>
                   
              </div>
         </section>

         <!-- Horizontal Scroll Section (Pinned Stages) -->
         <section id="horizontal-scroll-container" class="horizontal-scroll-section bg-[#0C0C0E] relative overflow-hidden" role="region" aria-label="Founder Journey Stages">
             
             <!-- Floating Awwwards Header Timeline -->
             <div class="horiz-scroll-header absolute top-10 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 flex justify-between items-center z-20 text-neutral-500 font-accent uppercase text-xs tracking-widest">
                 <span class="text-neutral-400">Founder Journey Stages</span>
                 <div class="flex items-center space-x-6">
                     <div class="flex space-x-4">
                         <?php foreach ( $stages as $index => $stage ) : ?>
                             <span class="slide-step-num <?php echo $index === 0 ? 'active' : ''; ?> cursor-pointer hover:text-white" data-step="<?php echo $index; ?>"><?php echo esc_html( $stage['num'] ); ?></span>
                         <?php endforeach; ?>
                     </div>
                     <div class="horiz-progress-bar-container bg-neutral-800 w-24 h-[2px] relative overflow-hidden hidden sm:block">
                         <div class="horiz-progress-bar-fill bg-[#D2F53C] absolute top-0 left-0 h-full w-0"></div>
                     </div>
                 </div>
             </div>

             <!-- Horizontal Track -->
             <div id="horizontal-scroll-track" class="horizontal-scroll-track flex h-full">
                 
                 <?php foreach ( $stages as $index => $stage ) : ?>
                     <!-- Stage <?php echo $index + 1; ?> -->
                     <div class="slide flex-shrink-0 w-screen h-screen flex items-center justify-center px-6 sm:px-16">
                          <div class="slide__content bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-md p-8 sm:p-12 md:p-16 rounded-3xl w-full max-w-4xl">
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
                                  <div class="text-left">
                                      <span class="font-accent text-[#D2F53C] text-xs font-bold tracking-widest block mb-4">STAGE <?php echo esc_html( $stage['num'] ); ?></span>
                                      <h2 class="slide__heading font-display text-4xl sm:text-5xl text-white font-bold mb-6"><?php echo esc_html( $stage['title'] ); ?></h2>
                                      <p class="slide__description text-neutral-400 text-sm sm:text-base leading-relaxed mb-0 font-sans">
                                          <?php echo esc_html( $stage['desc'] ); ?>
                                      </p>
                                  </div>
                                  <figure class="slide__img-cont rounded-2xl overflow-hidden aspect-[4/3] w-full border border-neutral-800">
                                      <img class="slide__img w-full h-full object-cover" src="<?php echo esc_url( $stage['image'] ); ?>" alt="<?php echo esc_attr( $stage['title'] ); ?>" onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';">
                                  </figure>
                              </div>
                          </div>
                     </div>
                 <?php endforeach; ?>
                 
             </div>
         </section>

         <!-- Team Section -->
         <section id="about-us" class="animate-section py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-b border-neutral-200/50" role="region" aria-label="Team and Experience">
             <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                  
                  <div class="animate-element lg:col-span-5 text-left">
                      <h2 class="team-headline font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter text-neutral-900 leading-[1.05]">
                          <?php echo esc_html( $team_headline ); ?>
                      </h2>
                  </div>
                  
                  <div class="lg:col-span-7 space-y-12 lg:space-y-16">
                      
                      <!-- Coaches Portraits Grid -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                          
                          <?php foreach ( $coaches as $coach ) : ?>
                              <div class="animate-element scrub-x-element text-left flex flex-col items-start">
                                  <div class="image-reveal-wrapper rounded-3xl overflow-hidden w-40 h-40 border border-neutral-200/60 mb-4">
                                      <img src="<?php echo esc_url( $coach['image'] ); ?>" alt="<?php echo esc_attr( $coach['name'] ); ?> Headshot" class="reveal-image w-full h-full object-cover scale-110" onerror="this.onerror=null;this.src='https://placehold.co/200x200/cccccc/ffffff?text=Coach';">
                                  </div>
                                  <h3 class="font-display font-bold text-xl text-neutral-900 uppercase"><?php echo esc_html( $coach['name'] ); ?></h3>
                                  <p class="font-accent text-[11px] text-neutral-400 font-semibold tracking-widest mt-1 uppercase"><?php echo esc_html( $coach['role'] ); ?></p>
                              </div>
                          <?php endforeach; ?>
                          
                      </div>
                      
                      <!-- Core Pillars Grid -->
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-neutral-200/60 pt-8 sm:pt-12">
                           <div class="animate-element team-info-box tilt-card bg-white border border-neutral-200/60 p-6 rounded-2xl">
                               <h4 class="font-display font-bold text-base text-neutral-900 uppercase mb-2 tilt-child-3d-md"><?php echo esc_html( $pillar_1_title ); ?></h4>
                               <p class="text-sm text-neutral-500 leading-relaxed font-sans tilt-child-3d-sm"><?php echo esc_html( $pillar_1_desc ); ?></p>
                           </div>
                           <div class="animate-element team-info-box tilt-card bg-white border border-neutral-200/60 p-6 rounded-2xl">
                               <h4 class="font-display font-bold text-base text-neutral-900 uppercase mb-2 tilt-child-3d-md"><?php echo esc_html( $pillar_2_title ); ?></h4>
                               <p class="text-sm text-neutral-500 leading-relaxed font-sans tilt-child-3d-sm"><?php echo esc_html( $pillar_2_desc ); ?></p>
                           </div>
                           <div class="animate-element team-info-box tilt-card bg-white border border-neutral-200/60 p-6 rounded-2xl">
                               <h4 class="font-display font-bold text-base text-neutral-900 uppercase mb-2 tilt-child-3d-md"><?php echo esc_html( $pillar_3_title ); ?></h4>
                               <p class="text-sm text-neutral-500 leading-relaxed font-sans tilt-child-3d-sm"><?php echo esc_html( $pillar_3_desc ); ?></p>
                           </div>
                      </div>
                      
                  </div>
             </div>
         </section>

         <!-- FAQs Section -->
         <section class="animate-section py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" role="region" aria-label="Frequently Asked Questions">
              <h2 class="faq-headline animate-element font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter text-left mb-10 md:mb-16 text-neutral-900">
                  FAQs
              </h2>
              <div id="faq-accordion" class="border-t border-neutral-200">
                  
                  <?php foreach ( $faqs as $index => $faq ) : 
                      $faq_index = $index + 1;
                  ?>
                      <!-- Q<?php echo $faq_index; ?> -->
                      <div class="faq-item-js animate-element border-b border-neutral-200 py-5 md:py-6 transition-colors duration-300">
                          <button class="faq-question w-full flex justify-between items-center text-left py-2 font-display text-lg uppercase tracking-tight text-neutral-900 outline-none" aria-expanded="false" aria-controls="faq-answer-<?php echo $faq_index; ?>">
                              <span><?php echo esc_html( $faq['question'] ); ?></span>
                              <span class="faq-icon font-mono text-xl text-[#5D5FEF] transition-transform duration-300">&plus;</span>
                          </button>
                          <div class="faq-answer overflow-hidden max-h-0 opacity-0 px-1" id="faq-answer-<?php echo $faq_index; ?>" role="region">
                               <p class="text-neutral-500 text-sm sm:text-base leading-relaxed pt-4 pb-2 font-sans"><?php echo esc_html( $faq['answer'] ); ?></p>
                          </div>
                      </div>
                  <?php endforeach; ?>
                  
              </div>
         </section>

         <!-- Final CTA Section -->
         <section class="animate-section py-24 md:py-36 px-4 sm:px-6 lg:px-8 bg-[#0C0C0E] text-white relative overflow-hidden" role="region" aria-label="Final Call to Action">
             <img src="<?php echo esc_url( $cta_deco_image_1 ); ?>" alt="Abstract decorative shape" class="absolute top-10 left-10 w-24 h-24 rounded-full opacity-10 hidden md:block transform -rotate-12 select-none" aria-hidden="true" onerror="this.onerror=null;this.src='https://placehold.co/100x100/cccccc/ffffff?text=Deco';">
             <img src="<?php echo esc_url( $cta_deco_image_2 ); ?>" alt="Abstract decorative shape" class="absolute bottom-10 right-10 w-32 h-32 rounded-lg opacity-10 hidden md:block transform rotate-12 select-none" aria-hidden="true" onerror="this.onerror=null;this.src='https://placehold.co/120x120/cccccc/ffffff?text=Deco';">
             
             <div class="max-w-5xl mx-auto text-center relative z-10">
                  <h2 class="final-cta-headline animate-element font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[1.05]">
                      <?php echo esc_html( $cta_headline ); ?>
                  </h2>
                  <p class="animate-element text-lg sm:text-xl text-neutral-400 font-sans max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
                      <?php echo esc_html( $cta_subtext ); ?>
                  </p>
                  <div class="inline-block">
                       <a href="<?php echo esc_url( $cta_button_link ); ?>" class="btn btn-secondary bg-[#D2F53C] hover:bg-white text-black font-accent text-sm font-bold uppercase tracking-widest px-10 py-5 rounded-full transition-all duration-300 magnetic-btn">
                           <span><?php echo esc_html( $cta_button_text ); ?></span>
                       </a>
                  </div>
             </div>
         </section>

     </main>

<?php
get_footer();

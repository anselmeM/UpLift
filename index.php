<?php
/**
 * UpLift Founders - index.php
 * Default fallback template file.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

get_header();
?>

<main class="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
    <?php if ( have_posts() ) : ?>
        <header class="mb-12">
            <h1 class="font-display text-4xl sm:text-5xl font-black uppercase text-neutral-900 leading-none mb-4"><?php single_post_title(); ?></h1>
        </header>

        <div class="space-y-12">
            <?php while ( have_posts() ) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class( 'border-b border-neutral-200/50 pb-8 text-left' ); ?>>
                    <h2 class="font-display text-2xl font-bold uppercase text-neutral-900 mb-3">
                        <a href="<?php the_permalink(); ?>" class="hover:text-[#5D5FEF] transition-colors"><?php the_title(); ?></a>
                    </h2>
                    <div class="text-neutral-500 font-sans text-sm mb-4">
                        <?php echo get_the_date(); ?>
                    </div>
                    <div class="text-neutral-600 font-sans text-base leading-relaxed">
                        <?php the_excerpt(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>

        <div class="mt-12 flex justify-between font-accent text-xs font-bold tracking-widest text-[#5D5FEF]">
            <div><?php previous_posts_link( '&larr; NEWER POSTS' ); ?></div>
            <div><?php next_posts_link( 'OLDER POSTS &rarr;' ); ?></div>
        </div>

    <?php else : ?>
        <header class="mb-8">
            <h1 class="font-display text-4xl font-black uppercase text-neutral-900">Page Not Found</h1>
        </header>
        <p class="text-neutral-500 font-sans text-base leading-relaxed mb-8">The page you are looking for does not exist or has been moved.</p>
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary bg-[#111111] text-white px-6 py-3 rounded-full hover:bg-[#5D5FEF] transition-colors font-accent text-xs font-bold tracking-widest uppercase">Go to Homepage</a>
    <?php endif; ?>
</main>

<?php
get_footer();

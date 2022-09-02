<?php get_header(); ?>

<?php if (have_posts()): ?>
  <?php while (have_posts()): ?>
    <?php the_post(); ?>

    <div class="root">
      <div id="root-react"></div>
      <div id="root-vue"></div>
      <div id="root-svelte"></div>
    </div>

    <?php the_content(); ?>
  <?php endwhile; ?>
<?php endif; ?>

<?php get_footer(); ?>
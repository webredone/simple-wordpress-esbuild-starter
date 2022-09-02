const gulp = require('gulp');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

const { createGulpEsbuild } = require('gulp-esbuild');
const gulpEsbuild = createGulpEsbuild({
  piping: true, // enables piping
});

const sveltePlugin = require('esbuild-svelte');
const vue3Plugin = require('esbuild-plugin-vue-iii').vue3Plugin;

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const minifycss = require('gulp-uglifycss');

const { argv } = require('yargs');

process.env.NODE_ENV = argv.production || 'development';

const shouldMinify = process.env.NODE_ENV === 'production';
const cssOutputStyle = shouldMinify ? 'compressed' : 'expanded';

const SRC = {
  SCSS_THEME: './src/scss/style.scss',
  JS_THEME: './src/js/app.js',
};

const watchPaths = {
  css: {
    theme: [SRC.SCSS_THEME, './src/scss/**/*.scss'],
  },
  js: {
    theme: [SRC.JS_THEME, './src/js/**/*.js'],
  },
  php: './**/*.php',
};

const OUT_DIR = './dist';

// Compiles global SCSS into the [root]/style.css file
function compileGlobalThemeSCSS(done) {
  gulp
    .src(SRC.SCSS_THEME)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(sass.sync({ outputStyle: cssOutputStyle }))
    .pipe(autoprefixer())
    .pipe(gulpif(shouldMinify, gcmq()))
    .pipe(gulpif(shouldMinify, minifycss()))
    .pipe(sourcemaps.write('./dist/css-maps'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
  done();
}

// Handles global JS + React, Svelte and Vue
function compileThemeGlobalJS(done) {
  gulp
    .src(SRC.JS_THEME)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      gulpEsbuild({
        bundle: true,
        outfile: 'app.min.js',
        minify: shouldMinify,
        logLevel: 'info',
        loader: {
          '.js': 'jsx',
        },
        plugins: [sveltePlugin(), vue3Plugin()],
      })
    )
    .pipe(gulp.dest(OUT_DIR));
  done();
}

function serve(done) {
  browserSync.init(
    {
      proxy: 'localhost/esbuildgulp4', // localhost/[htdocs-folder-name]
      injectChanges: true,
    },
    done
  );
}

function watchFiles(done) {
  // --- CSS ---------------------------------------
  gulp.watch(watchPaths.css.theme, gulp.series(compileGlobalThemeSCSS));

  // --- JAVASCRIPT ----------------------------
  gulp.watch(watchPaths.js.theme, gulp.series(compileThemeGlobalJS, reload));

  // Watch for php templates updates
  gulp.watch(watchPaths.php, reload);
}

function reload(done) {
  browserSync.reload();
  done();
}

gulp.task(
  'server',
  gulp.series(compileGlobalThemeSCSS, compileThemeGlobalJS, serve, watchFiles)
);

gulp.task('default', gulp.series(compileGlobalThemeSCSS, compileThemeGlobalJS));

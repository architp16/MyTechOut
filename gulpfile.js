// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const gulp = require("gulp");
const header = require("gulp-header");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const pkg = require('./package.json');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var paths = {
  pages: ['*html']
};

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// Copy index.html to distro folder
gulp.task("copy-html", function()
{
  return gulp.src(paths.pages)
  .pipe(gulp.dest("dist"));
});

// Make code files into node modules for browser
gulp.task("make-modules", function() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    chace: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest("dist"));
});

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function(cb) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/dist/**/*',
      '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
      '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp.src([
      './node_modules/@fortawesome/**/*',
    ])
    .pipe(gulp.dest('./vendor'))

  // jQuery
  gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      './node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Magnific Popup
  gulp.src([
      './node_modules/magnific-popup/dist/*'
    ])
    .pipe(gulp.dest('./vendor/magnific-popup'))

  // Scrollreveal
  gulp.src([
      './node_modules/scrollreveal/dist/*.js'
    ])
    .pipe(gulp.dest('./vendor/scrollreveal'))

  cb();

});

// CSS task
function css() {
  return gulp
    .src("./scss/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js',
      '!./js/contact_me.js',
      '!./js/jqBootstrapValidation.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browsersync.stream());
}

// typeScript task (main.ts)
function typ() {
  return tsProject.src()
  .pipe(tsProject())
  .js.pipe(gulp.dest("dist"));
}

// Tasks
gulp.task("css", css);
gulp.task("js", js);
gulp.task("typ", typ);

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch(["./js/**/*.js", "!./js/*.min.js"], js);
  gulp.watch("./**/*.html", browserSyncReload);
}

// This builds project - in parallel
gulp.task("default", gulp.parallel('vendor', css, js, typ, ["copy-html"], ["make-modules"]));

// dev task
gulp.task("dev", gulp.parallel(watchFiles, browserSync));
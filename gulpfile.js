'use strict';
// input
// sources folder
const sourcesFolder = 'src',
  // output
  // developers build
  devFolder = 'build',
  // public build
  publicFolder = 'public';
// pathes
const path = {
  // sources
  src: {
    root: sourcesFolder + '/',
    // html files
    html: sourcesFolder + '/*.html',
    // scss files
    scss: sourcesFolder + '/scss/*.scss',
    // js files
    // main js
    js: sourcesFolder + '/js/**/*.js',
    // libs js files
    libsJS: sourcesFolder + '/libs/**/*.js',
    // images
    img: sourcesFolder + '/img/**/*.+(jpg|jpeg|png|gif|webp)',
    // not optimized images
    imgNotOptimized:
      sourcesFolder + '/imgNotOptimized/**/*.+(jpg|jpeg|png|gif|webp)',
    // svg
    // single svg files
    svg: sourcesFolder + '/svg/*.svg',
    // svg files to sprite
    svgSprite: sourcesFolder + '/svg/sprite/*.svg',
    // fonts
    // fonts files
    fonts: sourcesFolder + '/fonts/*.+(woff|woff2|ttf|eot|svg)',
    // ttf fonts
    fontsTTF: sourcesFolder + '/fontsTTF/*.ttf',
  },
  // output
  // developers build
  devBuild: {
    // html files
    html: devFolder + '/',
    // css file
    css: devFolder + '/css/',
    // js files
    js: devFolder + '/js/',
    // images
    img: devFolder + '/img/',
    // svg
    svg: devFolder + '/svg/',
    // fonts
    fonts: devFolder + '/fonts/',
  },
  // public build
  publicBuild: {
    // html files
    html: publicFolder + '/',
    // css file
    css: publicFolder + '/css/',
    // js files
    js: publicFolder + '/js/',
    // images
    img: publicFolder + '/img/',
    // svg
    svg: publicFolder + '/svg/',
    // fonts
    fonts: publicFolder + '/fonts/',
  },
  // watch
  watch: {
    // html files
    html: sourcesFolder + '/*.html',
    templateHTML: sourcesFolder + '/template/**/*.html',
    // scss files
    scss: sourcesFolder + '/scss/**/*.scss',
    templateSCSS: sourcesFolder + '/template/**/*.scss',
    libsSCSS: sourcesFolder + '/libs/**/*.scss',
    // js files
    js: sourcesFolder + '/js/**/*.js',
    libsJS: sourcesFolder + '/libs/**/*.js',
    // images
    img: sourcesFolder + '/img/**/*.+(jpg|png|gif|webp)',
    // svg
    svg: sourcesFolder + '/svg/**/*.svg',
  },
  // clean
  clean: {
    // developers build
    devBuild: './' + devFolder + '/',
    // public build
    publicBuild: './' + publicFolder + '/',
  },
};
// gulp
const { src, dest, series, parallel, watch } = require('gulp'),
  // extensions
  browserSync = require('browser-sync').create(),
  fileInclude = require('gulp-file-include'),
  del = require('del'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  // html
  HTMLmin = require('gulp-htmlmin'),
  // css, scss
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  groupMediauQueries = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css'),
  // js
  uglify = require('gulp-uglify-es').default,
  notify = require('gulp-notify'),
  babel = require('gulp-babel'),
  // images
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  // svg
  svgSprite = require('gulp-svg-sprite'),
  // fonts
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2');
//* ----------------------------
//* functions
//* ----------------------------
// call browser-sync
// serving from dev
const callBrowserSync = () => {
  browserSync.init({
    // server settings
    server: {
      // base dir dev folder
      baseDir: path.devBuild.html,
      // false - whithout internet
      online: true,
    },
    // default
    browser: 'chrome', // choose browser
    host: 'localhost',
    port: 3000,
    notify: false,
  });
  browserSync.reload();
};
// serving from public
const callBrowserSyncFromPublic = () => {
  browserSync.init({
    // server settings
    server: {
      // base dir public folder
      baseDir: path.publicBuild.html,
      // false - whithout internet
      online: true,
    },
    // default
    host: 'localhost',
    port: 3000,
    notify: false,
  });
  browserSync.reload();
};
//* ----------------------------
//* dev build
//* ----------------------------
// build html files
const devBuildHTML = () => {
  // path to source folder
  return (
    src(path.src.html)
      // build html files
      .pipe(fileInclude())
      // upload to output folder
      .pipe(dest(path.devBuild.html))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
// build css files
const devBuildCSS = () => {
  // path to source folder
  return (
    src(path.src.scss)
      // scss to css
      .pipe(
        scss({
          outputStyle: 'expanded',
        })
      )
      // group media queries
      .pipe(groupMediauQueries())
      // add autoprefix
      .pipe(autoprefixer())
      // upload css to output folder
      .pipe(dest(path.devBuild.css))
      // clean and compress css
      .pipe(
        cleanCSS({
          level: 2,
        })
      )
      // rename compressed css to min.css
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      // upload min.css to output folder
      .pipe(dest(path.devBuild.css))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
// build js files
// build libs js
const devBuildLibsJS = () => {
  // path to libs js files
  return (
    src(path.src.libsJS)
      // concat to common js file 'scripts.js'
      .pipe(concat('scripts.js'))
      // upload scripts.js to output folder
      .pipe(dest(path.devBuild.js))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
// build js
const devBuildJS = () => {
  // path to source folder
  return (
    src(path.src.js)
      // babel
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      // concat to common js file 'app.js'
      .pipe(concat('app.js'))
      // upload js to output folder
      .pipe(dest(path.devBuild.js))
      // compress js
      .pipe(
        uglify({
          toplevel: true,
        }).on('error', notify.onError())
      )
      // rename compressed js to min.js
      .pipe(
        rename({
          extname: '.min.js',
        })
      )
      // upload min.js to output folder
      .pipe(dest(path.devBuild.js))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
// images
// optimize images
const images = () => {
  // path to source folder
  return (
    src(path.src.imgNotOptimized)
      .pipe(
        // convert images to webp
        webp({
          quality: 70,
        })
      )
      // upload to img folder
      .pipe(dest(path.src.root + '/img/'))
      .pipe(src(path.src.imgNotOptimized))
      // optimize images
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
        ])
      )
      // upload to img folder
      .pipe(dest(path.src.root + '/img/'))
  );
};
// build images
const devBuildImages = () => {
  // path to source folder
  return (
    src(path.src.img)
      // upload to output folder
      .pipe(dest(path.devBuild.img))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
// svg
// svg sprite
const sprite = () => {
  // path to source folder
  return (
    src(path.src.svgSprite)
      .pipe(
        svgSprite({
          mode: {
            stack: {
              // sprite file name
              sprite: '../sprite.svg',
            },
          },
        })
      )
      // upload to output folder
      .pipe(dest(path.src.root + '/svg/'))
  );
};
// build svg
const devBuildSVG = () => {
  // path to source folder
  return (
    src(path.src.svg)
      // upload to output folder
      .pipe(dest(path.devBuild.svg))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
// fonts
// convert fonts ttf to woff and woff2
const fonts = () => {
  src(path.src.fontsTTF)
    .pipe(ttf2woff())
    .pipe(dest(path.src.root + '/fonts/'));
  return src(path.src.fontsTTF)
    .pipe(ttf2woff2())
    .pipe(dest(path.src.root + '/fonts/'));
};
// build fonts
const devBuildFonts = () => {
  // path to source folder
  return (
    src(path.src.fonts)
      // upload to output folder
      .pipe(dest(path.devBuild.fonts))
      // inject changes without refreshing the page
      .pipe(browserSync.stream())
  );
};
//* ----------------------------
//* public build
//* ----------------------------
// build html files
const publicBuildHTML = () => {
  // path to source folder
  return (
    src(path.devBuild.html + '*.html')
      // minify HTML
      .pipe(
        HTMLmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
      // upload to output folder
      .pipe(dest(path.publicBuild.html))
  );
};
// build css files
const publicBuildCSS = () => {
  // path to source folder
  return (
    src(path.devBuild.css + '*.min.css')
      // upload to output folder
      .pipe(dest(path.publicBuild.css))
  );
};
// build js files
const publicBuildJS = () => {
  // path to source folder
  return (
    src([path.devBuild.js + 'scripts.js', path.devBuild.js + 'app.min.js'])
      // upload to output folder
      .pipe(dest(path.publicBuild.js))
  );
};
// build images
const publicBuildImages = () => {
  // path to source folder
  return (
    src(path.devBuild.img + '/**/*.*')
      // upload to output folder
      .pipe(dest(path.publicBuild.img))
  );
};
// build svg
const publicBuildSVG = () => {
  // path to source folder
  return (
    src(path.devBuild.svg + '*.svg')
      // upload to output folder
      .pipe(dest(path.publicBuild.svg))
  );
};
// build fonts
const publicBuildFonts = () => {
  // path to source folder
  return (
    src(path.devBuild.fonts + '*.*')
      // upload to output folder
      .pipe(dest(path.publicBuild.fonts))
  );
};
// watch
const watchFiles = () => {
  watch([path.watch.html, path.watch.templateHTML], devBuildHTML);
  watch(
    [path.watch.scss, path.watch.templateSCSS, path.watch.libsSCSS],
    devBuildCSS
  );
  watch([path.watch.js, path.watch.libsJS], devBuildJS);
  watch([path.watch.svg], devBuildSVG);
  watch([path.watch.img], devBuildImages);
};
// clean
// clean developers build
const devClean = () => {
  return del(path.clean.devBuild);
};
// clean public build
const publicClean = () => {
  return del(path.clean.publicBuild);
};
// build
// developers build by default
let devBuild = series(
  devClean,
  devBuildHTML,
  parallel(
    devBuildCSS,
    devBuildLibsJS,
    devBuildJS,
    devBuildImages,
    devBuildSVG,
    devBuildFonts
  )
);
// public build
let publicBuild = series(
  publicClean,
  parallel(
    publicBuildHTML,
    publicBuildCSS,
    publicBuildJS,
    publicBuildImages,
    publicBuildSVG,
    publicBuildFonts
  ),
  callBrowserSyncFromPublic
);
// watch
let watchProject = series(devBuild, parallel(watchFiles, callBrowserSync));

// exports
exports.devBuild = devBuild;
exports.publicBuild = publicBuild;

exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.devClean = devClean;
exports.publicClean = publicClean;
exports.watchProject = watchProject;
exports.default = watchProject;

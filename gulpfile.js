const { src, dest, watch, parallel, series } = require("gulp")
const scss = require("gulp-sass")(require("sass"))
const csso = require('gulp-csso')
const concat = require("gulp-concat")
const browserSync = require("browser-sync").create()
const uglify = require("gulp-uglify-es").default
const autoprefixer = require("gulp-autoprefixer")
const imagemin = require("gulp-imagemin")
const imageminPngquant = require('imagemin-pngquant')
const svgSprite = require('gulp-svg-sprite')
const combineMedia = require('gulp-combine-media')
const del = require("del")


function syncBrowser() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function stylesSCSS() {
  return src("app/files/scss/**/*.scss")
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true,
      })
    )
    .pipe(combineMedia()) // комбинируем @media запросы
    .pipe(csso()) // сжимаем CSS
    .pipe(dest('app/files/css')) // складываем сжатый файл в папку css
    .pipe(browserSync.stream()) // обновляем страницу
}

function pluginsCSS() {
  return src('app/files/plugins/**/*.css')
    .pipe(concat('components.min.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true,
      })
    )
    .pipe(combineMedia())
    .pipe(csso()) // сжатие CSS
    .pipe(dest('app/files/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'app/files/js/components/**/*.js',
    'app/files/plugins/**/*.js',
    'app/files/js/main.js',
    '!app/files/js/main.min.js',
  ])
    .pipe(concat('main.min.js')) // объединяем всё в 1 файл с названием main.min.js
    .pipe(uglify()) // минифицируем main.min.js
    .pipe(dest('app/files/js')) // кладём в папку js
    .pipe(browserSync.stream()) // обновляем страницу
}

function images() {
  return src("app/files/images/**/*.+(png|jpeg|jpg|svg)")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 60, progressive: true }),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/files/images"));
}

function svg() {
  return src('app/files/images/svg/**/*.svg')
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest('app/files/images'))
}

function watching() {
  watch(['app/files/images/svg/**/*.svg'], svg)
  watch(['app/files/scss/**/*.scss', 'app/templates/**/*.scss'], stylesSCSS)
  watch(['app/files/plugins/**/*.css'], pluginsCSS)
  watch(["app/files/js/**/*.js", "!app/js/main.min.js"], scripts)
  watch(["app/*.html"]).on("change", browserSync.reload)
}

function cleanDist() {
	return del('dist')
}

function build() {
  return src(
    [
      'app/files/css/components.min.css',
      "app/files/css/style.min.css",
      "app/files/js/main.min.js",
      "app/files/fonts/**/*",
      "app/files/favicon/**/*",
      "app/*.html",
    ],
    { 
      base: "app" 
    }
  ).pipe(dest("dist"));
}

exports.scripts = scripts;
exports.watching = watching;
exports.stylesSCSS = stylesSCSS;
exports.pluginsCSS = pluginsCSS
exports.syncBrowser = syncBrowser;
exports.images = images;
exports.cleanDist = cleanDist;
exports.svg = svg;

exports.build = series(cleanDist, images, build);
exports.default = parallel(stylesSCSS, pluginsCSS, scripts, svg, syncBrowser, watching);

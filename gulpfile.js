const { src, dest, watch, parallel, series } = require('gulp')
const scss = require('gulp-sass')
const concat = require('gulp-concat') // files concat
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default // JS minify
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const del = require('del')

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
		},
	})
}

function styles() {
	return src('app/scss/**/*.scss')
		.pipe(scss({ outputStyle: 'compressed' })) // or expanded
		.pipe(concat('style.min.css'))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 10 version'],
				grid: true,
			})
		)
		.pipe(dest('app/css')) // складываем сжатый файл в папку css
		.pipe(browserSync.stream()) // обновляем страницу
}

function scripts() {
	return src(['node_modules/jquery/dist/jquery.js', 'app/js/main.js'])
		.pipe(concat('main.min.js')) // объединяем всё в 1 файл с названием main.min.js
		.pipe(uglify()) // минифицируем main.min.js
		.pipe(dest('app/js')) // кладём в папку js
		.pipe(browserSync.stream()) // обновляем страницу
}

function images() {
	return src('app/images/**/*.+(png|jpeg|jpg|svg)')
		.pipe(
			imagemin([
				imagemin.mozjpeg({ quality: 60, progressive: true }),
				imageminPngquant({ quality: [0.6, 0.8] }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest('dist/images'))
}

function clearDist() {
	return del('dist')
}

function build() {
	return src(
		[
			'app/css/style.min.css',
			'app/js/main.min.js',
			'app/fonts/**/*',
			'app/favicon/**/*',
			'app/*.html',
		],
		{ base: 'app' }
	).pipe(dest('dist'))
}

function watching() {
	watch(['app/scss/**/*.scss'], styles)
	watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts) // следим за всеми, кроме min.js
	watch(['app/*.html']).on('change', browserSync.reload)
}

exports.styles = styles
exports.watching = watching
exports.browsersync = browsersync
exports.scripts = scripts
exports.images = images
exports.clearDist = clearDist

exports.build = series(clearDist, images, build)
exports.default = parallel(styles, scripts, browsersync, watching) // выполнение всего, что нужно, простым указанием команды gulp

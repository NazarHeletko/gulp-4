//Підключення модулів галпу
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');

//Порядок підключення scss файлів
const cssFiles = [
    './src/css/main.scss',
    './src/css/media.scss'
]

//Порядок підключення js файлів
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

//Таск на стилі CSS
function styles(){
    //Шаблон для пошуку файлів CSS
    //Всі файли по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    //об'єднання файлів у один
    .pipe(concat('style.css'))
    //Добавити префікси
    .pipe(autoprefixer('last 2 versions'))
    //Мініфікація CSS
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    //Вихідна папка для стилів
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

//Таск на скрипти JS
function scripts(){
    //Шаблон для пошуку файлів JS
    //Всі файли по шаблону './src/js/**/*.js'
    return gulp.src(jsFiles)
    //об'єднання файлів у один
    .pipe(concat('script.js'))
    //Мініфікація JS
    .pipe(uglify({
        toplevel: true
    }))
    //Вихідна папка для скриптів
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

//Таск на видалення всього в указаній папці
function clean(){
    return del(['build/*'])
}

//Таск на стриснення картинок
function compressImg(){
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('./build/img/'))
}

//Таск на відслідковування змін у файлах
function watch(){
    //Запускається локальний сервер
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', compressImg)
    //Слідкувати за CSS (gulp.watch є вбудованою функцією галпу)
    gulp.watch('./src/css/**/*.scss', styles);
    //Слідкувати за JS (gulp.watch є вбудованою функцією галпу)
    gulp.watch('./src/js/**/*.js', scripts);
    //При зміні в HTML запустити синхронізацію
    gulp.watch("./*.html").on('change', browserSync.reload)
}

//Таск, який викликає функцію styles
gulp.task('styles', styles);

//Таск, який викликає функцію scripts
gulp.task('scripts', scripts);

//Таск, який стискає картинки
gulp.task('compressImg', compressImg);

//Таск, для очистки папки build
gulp.task('del', clean);

//Таск для відслідковування змін
gulp.task('watch', watch);

//Таск для видалення старих файлів у папці build і запуск styles і scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, compressImg)));

//Таск запускає таск build і watch послідовно, щоб постійно моніторити зміну у верстці
gulp.task('dev', gulp.series('build', 'watch'));
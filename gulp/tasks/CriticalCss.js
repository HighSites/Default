import size from 'gulp-size';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
let sass = gulpSass(dartSass);
import avifCss from 'gulp-avif-css';
import webpCss from 'gulp-webpcss';

let SassInline = () => {
    return $.gulp.src($.path.styleInline.src)
        .pipe($.plumber($.conf.plumber))
        .pipe(sass({ includePaths: [$.path.system] }))
        .pipe($.replace("@imgs/", "../" + $.path.imgs.dest_cat))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulpif($.conf.isAvif, avifCss())))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulpif($.conf.noAvif, webpCss())))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, autoprefixer($.conf.autoprefixer)))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, groupCssMediaQueries()))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, size({ title: "Css [pre]size = " })))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulp.dest($.path.style.dest, { sourcemaps: $.conf.isDev })))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, csso()))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, size({ title: "Css [post]size = " })))
        .pipe(rename({ suffix: ".min" }))
        .pipe($.gulp.dest((file) => file.base))
        .pipe($.browserSync.stream())
}

let SassCriticalDublicate = () => {
    return $.gulp.src($.path.styleInline.src)
        .pipe($.plumber($.conf.plumber))
        .pipe(sass({ includePaths: [$.path.system] }))
        .pipe($.replace("@imgs/", "../" + $.path.imgs.dest_cat))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulpif($.conf.isAvif, avifCss())))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, $.gulpif($.conf.noAvif, webpCss())))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, autoprefixer($.conf.autoprefixer)))
        .pipe($.gulpif($.conf.isProd || $.conf.isPreProd, groupCssMediaQueries()))
        .pipe(rename((file) => {
            file.basename=file.dirname;
        }))
        .pipe($.gulp.dest($.path.style.dest+'/inline'))
}

import gulp from 'gulp';

export default gulp.parallel(SassInline, SassCriticalDublicate);
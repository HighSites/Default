import gulp from "gulp";

import conf from './gulp/configs/plugins_configs.js';
import path from './gulp/configs/paths.js';

import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import gulpif from "gulp-if";
import replace from "gulp-replace";
import notify from "gulp-notify";

const Alert = (message) => {
    return notify({
            title:"REMINDER",
            message: message
    });
}

global.$ = {
    gulp: gulp,

    conf: conf,
    path: path,

    plumber: plumber,
    gulpif: gulpif,
    browserSync: browserSync.create(),
    replace: replace,
    Alert: Alert
};

import clear from './gulp/tasks/Clear.js';
import server from './gulp/tasks/Server.js';
import watcher from './gulp/tasks/Watcher.js';
import for_html from './gulp/tasks/Nunjucks.js';
import for_styles from './gulp/tasks/Sass.js';
import for_imgs from './gulp/tasks/Imgs.js';
import for_scripts from './gulp/tasks/Js.js';
import for_fonts from "./gulp/tasks/Fonts.js";
import svgSprite from './gulp/tasks/svgSprite.js';
import zip from './gulp/tasks/Zip.js';
import gitDeploy from './gulp/tasks/GH_deploy.js';


const build = $.gulp.series (
    clear, 
    for_fonts,
    $.gulp.parallel(for_html, for_styles, for_imgs, for_scripts, svgSprite)
);

const dev = $.gulp.series (
    build,
    $.gulp.parallel(watcher, server)
);

const preProd = $.gulp.series (
    build,
    server
);

const prod = $.gulp.series (
    build,
    zip
);

const play = server;

var mode = dev;

if ($.conf.isPlay) 
    mode = play;

if ($.conf.isPreProd) 
    mode = preProd;

if ($.conf.isProd) 
    mode = prod;

export default mode;
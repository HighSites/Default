import for_html from './Nunjucks.js';
import for_styles from './Sass.js';
import for_scripts from './Js.js';
import for_imgs from './Imgs.js';
import svgSprite from './svgSprite.js';

const watcher = () => {
    $.gulp.watch($.path.html.watch, for_html);
    $.gulp.watch($.path.style.watch, for_styles);
    $.gulp.watch($.path.script.watch, for_scripts);
    $.gulp.watch($.path.imgs.watch, for_imgs);
    $.gulp.watch($.path.svgicons.watch, svgSprite);
}

export default watcher;
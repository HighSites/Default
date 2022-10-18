import * as nodePath from 'path';

const projectPath = './project'; // path to project folder
const pathSrc = projectPath + '/dev'; // path to project with development
const pathDest = projectPath + '/prod'; // path to folder with result
const pathFin = projectPath + '/Deploy'; // path to folder with deployment result(current: zip archive)
const pathPages = pathSrc + '/pages'; //path to folder with pages folders
const pathGlob = pathSrc + '/glob'; // path to folder with rules/assets/conf-s for the whole project
const pathSystem = pathGlob + '/system'; // path to files, generated by computer (or copyed from somewhere)
const pathGlobAssets = pathGlob + '/assets'; // path to subfiles, needed all over the project 
// const pathGlobDev = pathGlob + '/rules'; // path to html, sass, js resources needed throught the whole project

const rootName = nodePath.basename(nodePath.resolve());

const css_preproc = "sass";

export default {
    root: pathDest,
    from: pathSrc,
    fin: pathFin,
    system: pathSystem,
    rootName: rootName,
    css_preproc: css_preproc,

    html: {
        src: pathPages + '/*/*.html',
        watch: pathSrc + '/**/*.html',
        dest: pathDest
    },
    
    style: {
        src: pathPages + `/*/*.${css_preproc}`,
        srcNot: pathPages + `/*/!*.${css_preproc}`,
        watch: pathSrc + `/**/*.${css_preproc}`,
        dest: pathDest + '/style',
        system: pathSystem + '/_styles'
    },

    script: {
        src: pathGlob + '/*.js',
        watch: pathSrc + '/**/*.js',
        dest: pathDest + '/js/'
    },

    imgs: {
        src: [pathPages + "/*/media/**/*.*", pathGlobAssets + "/media/**/*.*"],
        get watch() {
            return this.src;
        },
        dest_cat: "media/",
        get dest() {
            return pathDest +`/${this.dest_cat}`
        }
    },

    fonts: {
        src_cat: "/fonts/",
        get src() {
            return pathGlobAssets + "/fonts"
        },
        dest: pathDest + "/fonts/",
        get styleFile() {
            return $.path.style.system + `/_fonts.${$.path.css_preproc}`;
        }
    }, 

    get svgicons() {
        return {
            src: pathGlobAssets + "/svgInSprites/*.svg",
            get watch() {
                return this.src
            },
            dest: this.imgs.dest
        }
    }
}
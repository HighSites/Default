import * as nodePath from 'path';

const ProjectPath = './project';
const pathSrc = ProjectPath + '/dev';
const pathDest = ProjectPath + '/prod';
const pathFin = ProjectPath + '/Deploy';
const pathToMain = pathSrc + '/main';
const pathToSide = pathSrc + '/sups';
const pathToSystem = pathToMain + '/system';

const rootName = nodePath.basename(nodePath.resolve());

const Css_preproc = "sass";

export default {
    root: pathDest,
    from: pathSrc,
    fin: pathFin,
    rootName: rootName,
    css_preproc: Css_preproc,

    html: {
        src: pathToMain + '/*.html',
        watch: pathSrc + '/**/*.html',
        dest: pathDest
    },
    
    style: {
        src: pathToMain + `/*.${Css_preproc}`,
        watch: pathSrc + `/**/*.${Css_preproc}`,
        dest: pathDest + "/css",
        system: pathToSystem + '/_styles'
    },

    script: {
        src: pathToMain + '/*.js',
        watch: pathSrc + '/**/*.js',
        dest: pathDest + '/js/'
    },

    imgs: {
        src: pathToMain + "/media/**/",
        watch: pathToMain + "/media/**/*.*",
        dest_cat: "media/",
        get dest() {
            return pathDest +`/${this.dest_cat}`
        }
    },

    fonts: {
        src_cat: "/fonts/",
        get src() {
            return pathToMain + "/fonts"
        },
        dest: pathDest + "/fonts"
    }, 

    get svgicons() {
        return {
            src: pathToSide + "/svgInSprites/*.svg",
            get watch() {
                return this.src
            },
            dest: this.imgs.dest
        }
    }
}
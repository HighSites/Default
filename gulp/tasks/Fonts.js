import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";
import rename from "gulp-rename";

const otfToTtf = () => {
	return $.gulp.src($.path.fonts.src + "/*.otf")
		.pipe($.plumber($.conf.plumber))
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(rename(function (file) {
			// console.log("DIRNAME: " + file.dirname);
			// console.log("BASENAME: " + file.basename);
			file.dirname += $.path.fonts.src_cat;
			file.basename = file.basename.slice($.path.fonts.src_cat.length - 1);
			// console.log("DIRNAME: " + file.dirname);
			// console.log("BASENAME: " + file.basename);
		}))
		.pipe($.gulp.dest($.path.fonts.src))
}

const ttfToWoff = () => {
	return $.gulp.src($.path.fonts.src + "/*.ttf")
		.pipe($.plumber($.conf.plumber))
		.pipe(fonter({ formats: ['woff'] }))
		.pipe(rename(function (file) {
			// console.log("DIRNAME: " + file.dirname);
			// console.log("BASENAME: " + file.basename);
			file.dirname += $.path.fonts.src_cat;
			file.basename = file.basename.slice($.path.fonts.src_cat.length - 1);
			// console.log("DIRNAME: " + file.dirname);
			// console.log("BASENAME: " + file.basename);
		}))
		.pipe($.gulp.dest($.path.fonts.dest))
		.pipe($.gulp.src($.path.fonts.src + "/*.ttf"))
		.pipe(ttf2woff2())
		.pipe($.gulp.dest($.path.fonts.dest))
}

const fontsStyle = () => {
	let fontsFile = $.path.style.system + `/_fonts.${$.path.css_preproc}`;
	fs.readdir($.path.fonts.dest, function (err, fontsFiles) {
		if (fontsFiles) {
			if (!fs.existsSync(fontsFile)) {
				fs.writeFile(fontsFile, '', cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					let fontFileName = fontsFiles[i].split('.')[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
						let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
						let weightCompilance = {
							'thin': 100,
							'extralight': 200,
							'ultralight': 200,
							'light': 300,
							'lite': 300,
							'medium': 500,
							'semibold': 600,
							'bold': 700,
							'extrabold': 800,
							'heavy': 800,
							'black': 900
						};
						fontWeight = weightCompilance[fontWeight] || 400;
						if ($.path.css_preproc[$.path.css_preproc.length - 3] == 'a')
							fs.appendFile(fontsFile, `@font-face\n\tfont-family: ${fontName}\n\tfont-display: swap\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff")\n\tfont-weight: ${fontWeight}\n\tfont-style: normal\r\n`, cb);
						else fs.appendFile(fontsFile, `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				$.Alert("File 'sass/fonts.sass' already exists. To update it remove the file from catalog");
			}
		}
	});
	return $.gulp.src($.path.from);
	function cb() { };
}

import gulp from 'gulp';

export default gulp.series(otfToTtf, ttfToWoff, fontsStyle);

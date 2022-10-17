import path from './paths.js';

const configGH = {
	token: "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", // can be found in GH account -> Settings -> Personal access tokens
    toHide: "**/_!*.*",
    toShow: "",
    whatsNew: "",
    dest: path.fin + '/ghPages',
    mode: 1
        // 1: just 'prod'
        // 2: 'prod' + 'src'
        // 3: 'prod' + ''src' + gulp
};

export default configGH;
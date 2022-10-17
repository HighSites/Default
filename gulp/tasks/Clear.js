import del from 'del';

const clear = () => {
    if($.conf.isDev)
        return del([$.path.root+"/*/", "!"+$.path.imgs.dest]);
    return del($.path.root);
}

export default clear;
const fs = require("fs");
const path = require("path");

class FileOperation {
    /**
     * 递归的创建文件夹
     * @param {*} dirPath 必须为一个相对于盘的绝对路径
     */
    mkDirRecursively(dirPath) {
        let dirStack = dirPath.split(/\\/),
            depth = dirStack.length,
            ct = 1,
            curPath = dirStack[0];

        while (ct < depth) {
            curPath = path.join(curPath, dirStack[ct]);
            !fs.existsSync(curPath) && fs.mkdirSync(curPath);
            ct++;
        }
    }

    /**
     * 同步方法  删除一个文件夹  -r
     * @param {*要删除的文件夹} dir 
     * @param {*callback} cb 
     */
    rmdirSync(dir, deleteSelf = true) {
        (function() {
            function iterator(url, dirs) {
                let stat = fs.statSync(url);
                if (stat.isDirectory()) {
                    dirs.unshift(url); //收集目录
                    inner(url, dirs);
                } else if (stat.isFile()) {
                    fs.unlinkSync(url); //直接删除文件
                }
            }

            function inner(path, dirs) {
                let arr = fs.readdirSync(path);
                for (let i = 0, el; el = arr[i++];) { //eslint-disable-line
                    iterator(path + "/" + el, dirs);
                }
            }
            return function(dir) {
                let dirs = [];

                try {
                    iterator(dir, dirs);
                    !deleteSelf && dirs.shift(); //如果不要删除自身，就把自己给移出来
                    for (let i = 0, el; el = dirs[i++];) { //eslint-disable-line
                        fs.rmdirSync(el); //一次性删除所有收集到的目录
                    }
                } catch (e) { //如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
                    if (e.code !== "ENOENT") {
                        throw e;
                    }
                }
            };
        })()(dir, deleteSelf);
    }

    /**
     * 将单个文件从src复制至dest
     * @param {*源文件地址} src 
     * @param {*目标文件地址} dest 
     */
    copySingleFile(src, dest, encode = null) {
        try {
            fs.writeFileSync(dest, fs.readFileSync(src, encode), encode);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * 将单个大文件从src复制至dest
     * @param {*源文件地址} src 
     * @param {*目标文件地址} dest 
     */
    copyBigSingleFile(src, dest, encode = null) {
        fs.createReadStream(src, encode).pipe(fs.createWriteStream(dest, encode));
    }

    /**
     * 将整个文件夹复制至目标路径
     * @param {*} src 
     * @param {*} dest 
     */
    copyDirSync(src, dest, exclude) {
        let dirs = [], //收集src下所有目录
            files = [],
            i; //收集src下所有文件

        try {
            iterator(src, dirs, files); //递归获取目录和文件

            dirs.shift();
            for (i = 0; i < dirs.length; i++) {
                let subfix = dirs[i].split(src).pop(),
                    destDir = path.join(dest, subfix);

                try {
                    !fs.existsSync(destDir) && fs.mkdirSync(destDir);
                } catch (e) {
                    console.log(e)
                }
            }

            for (i = 0; i < files.length; i++) {
                let subfix = files[i].split(src).pop();
                this.copySingleFile(files[i], path.join(dest, subfix));
            }

        } catch (e) { //如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
            if (e.code !== "ENOENT") {
                throw e;
            }
        }

        function iterator(url, dirs, files) {
            let stat = fs.statSync(url);
            if (stat.isDirectory()) {
                if (!(exclude && exclude.test(url))) {
                    dirs.push(url);
                    inner(url, dirs, files);
                }
            } else if (stat.isFile()) {
                if (!(exclude && exclude.test(url))) {
                    files.push(url);
                }
            }
        }

        function inner(path, dirs, files) {
            let arr = fs.readdirSync(path);
            for (let i = 0, el; el = arr[i++];) { //eslint-disable-line
                iterator(path + "\\" + el, dirs, files);
            }
        }
    }

}

module.exports = new FileOperation();
#!/usr/bin/env node

//dependencies
const program = require("commander"); //a tool to parse command interface arguments
const fs = require("fs");
const fo = require("../src/utils/fileOperations");
const path = require("path");
const https = require("https");
const child_process = require("child_process");
const configFileName = "user.config.js";
let cwd = process.cwd();
const args = process.argv;
const debug = fasle;

program
    .version(require('../package').version, '-v, --version')
    .usage('<command> [options],use order(r-cli -h) for help information');

program
    .command("init")
    .description('generate user.config.js')
    .action(init);

function init() {
    if (hasConfig()) {
        generateProject();
    } else {
        copyConfig();
    }
}

function hasConfig() {
    return fs.existsSync(path.join(cwd, configFileName));
}

function copyConfig() {
    log(`没有发现${configFileName}配置文件，正在为您生成`);
    fo.copySingleFile(path.join(__dirname, "../src/config/user.config.js"), path.join(cwd, configFileName));
}

function generateProject() {
    //首先将webpack配置移植过去
    fo.copyDirSync(path.join(__dirname, "../webpack-config"), cwd, debug ? /node_modules|dist/ : null);

    let config;
    try {
        config = require(path.join(cwd, configFileName));
    } catch (e) {
        throw new Error("配置文件语法错误" + e.message);
    }

    //然后根据配置项生成页面模板
    createPages(config);
    //然后根据css模板插入各个界面js TODO:

    //然后删除根节点下的配置文件，将其复制一份至config文件夹下 
    fo.copySingleFile(path.join(cwd, configFileName), path.join(cwd, "config", configFileName));
    fs.unlinkSync(path.join(cwd, configFileName));

    //然后开始安装依赖   
    install()
        .catch(e => {
            throw e;
        });
}


function createPages(config) {
    let prop;
    const DEFAULT_TEMPLATE = "none";
    const TEMPLATE_SRC = "../src/templates";
    const TEMPLATE_DEST = "src/modules"
    for (prop in config.pages) {
        let template = config.pages[prop].template,
            templateDirPath,
            templateDestPath = path.join(cwd, TEMPLATE_DEST, prop);

        if (!fs.existsSync(templateDirPath)) {
            template = DEFAULT_TEMPLATE;
        }

        templateDirPath = path.join(__dirname, TEMPLATE_SRC, template);

        !fs.existsSync(templateDestPath) && fs.mkdirSync(templateDestPath);
        //拷贝js模板
        fo.copySingleFile(path.join(templateDirPath, `${template}.js`), path.join(templateDestPath, `${prop}.js`));
        //拷贝html
        fo.copySingleFile(path.join(templateDirPath, `${template}.html`), path.join(templateDestPath, `${prop}.html`));
        // fo.copyDirSync(templateDirPath, path.join(cwd, TEMPLATE_DEST, prop));
    }
}


function install() {
    return new Promise((resolve, reject) => {
        //首先检查是否联网，通过get npm首页来判断
        isOffLine()
            // 检查cnpm是否安装  
            .then(isCnpmInstalled)
            // 使用cnpm安装   
            .then(installDependencies)
            .then(buildDll)
            .then(() => {
                console.log("指令:");
                console.log("调试环境: npm run dev");
                console.log("生产环境: npm run build");
                console.log("编译dll: npm run dll");
                resolve();
            })
            .catch(reject);
    });

}

function isOffLine() {
    return new Promise((resolve, reject) => {
        log(`检查网络连接状态`);
        https
            .get("https://www.npmjs.com", res => {
                res.on("data", () => {});
                res.on("end", () => {
                    log(`网络通畅`);
                    resolve();
                });
            })
            .on("error", err => {
                console.log(`无法连接至npmjs.com`);
                console.log("");
                switch (err.code) {
                    case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
                        {
                            console.log(`兄弟，你忘记登录了。`);
                        }
                        break;
                    case "ENOTFOUND":
                        {
                            console.log("检查一下是不是忘记插网线了啊");
                        }
                        break;
                    default:
                        {
                            console.log("网络错误");
                        }
                }
                reject(err);
            });
    });
}

function isCnpmInstalled() {
    return new Promise((resolve, reject) => {
        try {
            child_process.execSync(`cnpm -v`);
            log(`cnpm已经安装`);
            resolve();
        } catch (e) {
            log(`cnpm未安装,安装中,请稍等...(安装过程注意保持网络通畅)`);
            try {
                child_process.execSync(`npm i cnpm -g`);
                log(`cnpm安装完毕`);
                resolve();
            } catch (e) {
                reject(new Error(`cnpm安装过程中出现错误，请手动安装后重试`));
            }
        }
    });
}

function installDependencies() {
    return new Promise((resolve, reject) => {
        try {
            log("安装依赖中");
            child_process.execSync(`cnpm i`, { cwd });
            log("依赖安装完毕");
            resolve();
        } catch (e) {
            reject(new Error(`执行cnpm install时发生错误，请尝试手动安装`));
        }
    });
}

function buildDll() {
    log("正在编译dll");
    child_process.execSync(`npm run dll`, { cwd });
    log("dll编译完成");
}

function log(msg) {
    console.log("");
    console.info(`[Log]:${msg}`);
    console.log("");
}

program.parse(args);
//DEBUG:
if (debug) {
    cwd = path.join(__dirname, "../test");
    init();
}
//DEBUG:
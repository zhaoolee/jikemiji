const moment = require("moment");
const fse = require('fs-extra');
const path = require("path");


// 定义写入的目录
const path_dir = path.join(__dirname, "jikemiji-md");


let need_update_article = "jikemiji-md"

process.stdin.setEncoding('utf8');

// 读取用户输入
async function readlineSync() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise((resolve, reject) => {
        readline.question(``, data => {
            readline.close();
            resolve(data)
        })
    });
}
async function create_article_md(article_id, article_url, article_name) {

    let article_content = `---
title: ${article_name}
---











## 本文永久更新地址(欢迎来读留言,写评论):

[${encodeURI(article_url)}](${encodeURI(article_url)})
`;
    const options = {
        mode: 0o2775
    }
    fse.ensureDirSync(path_dir, options)
    console.log("aritcle_content==>>", article_content, "<==");
    fse.writeFileSync(path.join(path_dir, `${article_id}.md`), article_content);

}

// entry point
async function main() {
    // 当前日期
    let current_date = moment().format("YYYY-MM-DD");
    // 13位时间戳
    let timestamp = Date.parse(new Date());
    console.log("请输入文章名(如果懒得填直接回车):")
    let article_name = await readlineSync();
    let article_id = `${current_date}-${article_name}-${timestamp}`;
    let article_url = `https://www.v2fy.com/p/${article_id}`
    console.log(`新文章url=>${article_url}<==`);
    // 创建新文章

    create_article_md(article_id, article_url, article_name);



}

main();




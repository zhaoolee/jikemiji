const Rsync = require("rsync");

const path = require("path");

const chmodr = require('chmodr');

const fs = require("fs");

const fse = require("fs-extra");

// 项目文件夹名
const main_dir_name = "jikemiji";

// markdown文件夹名
const md_dir_name = "jikemiji-md";

// 需要排除的md文件

const need_update_article = "jikemiji-md"

const exclude_md_files = [];

// 自定义
const target_url =
  "https://www.v2fy.com/asset/0i/" + main_dir_name + "/" + md_dir_name + "/";

console.log("target_url::", target_url);
const target_path = "/usr/share/nginx/v2fy.com/asset/0i";

// 将本目录同步服务器
async function update_data() {
  await new Promise((resolve, reject) => {
    // Build the command
    var rsync = new Rsync()
      .shell("ssh")
      .flags({
        a: true,
        z: true,
        v: true
      })
      .delete()
      .progress()
      .compress()
      .exclude([".*/", "up.js"])
      .output(
        function (data) {
          // do things like parse progress
          console.log("=传输数据=>>", data.toString());
        },
        function (data) {
          // do things like parse error output
          console.log("=数据传输报错=>>", data.toString());
        }
      )
      .source(path.join(__dirname))
      .destination("root@v2fy.com:" + target_path);

    // Execute the command
    rsync.execute(function (error, code, cmd) {
      console.log("error", error);
      console.log("code", code);
      console.log("cmd", cmd);
      resolve();
    });
  }).then(() => { });
}

// 检测尾部出处
async function check_copyright(md_file_path_name, md_file_name) {

  let md_file_content = fse.readFileSync(md_file_path_name);

  // 移除.md

  md_file_name = md_file_name.substring(0,md_file_name.indexOf("."));

  let article_url = `https://www.v2fy.com/p/${md_file_name}`;




  let copyright_info =`
## 本文永久更新地址(欢迎来读留言,写评论):

[${encodeURI(article_url)}](${encodeURI(article_url)})
`;


  // 如果存在url, 什么都不用干
  if(md_file_content.indexOf(article_url) >=0){


  }else{

    md_file_content = md_file_content+copyright_info;


    
    fse.writeFileSync(md_file_path_name, md_file_content);
    console.log("添加底部信息成功")

    
  }
}


// 获取md文件

async function get_md_file_list() {
  // 读取当前当前目录下的.md文件
  let root = path.join(__dirname, need_update_article);
  console.log(root);
  let all_files = fs.readdirSync(root);
  let all_md_files = [];

  // 获取md文件列表
  all_files.map((file_name, file_index) => {
    if (file_name.endsWith(".md")) {
      // md文件不包含在排除列表中
      if (exclude_md_files.indexOf(file_name) === -1) {
        all_md_files.push(file_name);
      }
    }
  });

  // 获取需要同步的文章

  // 如果不存在file_md5.json 则创建
  



  fse.writeJsonSync(path.join(__dirname, "md_files.json"),{"md_files": all_md_files})
  // 将 need_update_aritcle中的所有文件移动到jikemiji-md
  let src_file_list = fse.readdirSync(path.join(__dirname, need_update_article), { withFileTypes: true });
  console.log(src_file_list);
  console.log(src_file_list);
  for (let i = 0, src_file_list_length = src_file_list.length; i < src_file_list_length; i++) {
    console.log(src_file_list[i]["name"]);
    // 对于文中不包含文章链接的md,需要在尾部添加出处
    if(src_file_list[i]["name"].endsWith(".md")){
      await check_copyright(path.join(__dirname, need_update_article, src_file_list[i]["name"]), src_file_list[i]["name"]);
    }
    
    // if(src_file_list[i]["name"] !== ".gitkeep"){
    //   fse.moveSync(path.join(__dirname, need_update_article, src_file_list[i]["name"]), path.join(__dirname, md_dir_name, src_file_list[i]["name"]), { overwrite: true })
    // }

    
  }
  // 执行同步数据工作

  // 改权限
  await md_and_img_chmodr(path.join(__dirname, md_dir_name));
  // 先同步数据到服务端
  await update_data();

  return all_md_files;
}

function before_get_md_file_list() {
  // 读取当前当前目录下的.md文件
  let root = path.join(__dirname, md_dir_name);
  console.log(root);
  let all_files = fs.readdirSync(root);
  let all_md_files = [];

  // 获取md文件列表
  all_files.map((file_name, file_index) => {
    if (file_name.endsWith(".md")) {
      // md文件不包含在排除列表中
      if (exclude_md_files.indexOf(file_name) === -1) {
        all_md_files.push(file_name);
      }
    }
  });
  return all_md_files;
}

// 将md文件内容替换为https内容
function local_file_href_2_https_href(md_file_name) {

  console.log("分析md==>>", md_file_name);
  const whole_md_file_path = path.join(__dirname, md_dir_name, md_file_name);

  let file_content = fs.readFileSync(whole_md_file_path).toString();
  let img_addr_re = /\!\[.*\]\(.*\)/g;

  let md_img_addr_list = file_content.match(img_addr_re);

  if (md_img_addr_list === null) {
    md_img_addr_list = []

  }

  for (let img_index = 0; img_index < md_img_addr_list.length; img_index++) {
    let tmp_md_img_addr = md_img_addr_list[img_index];

    let img_addr = tmp_md_img_addr.match(/\((.*)\)/)[1];

    let img_desc = tmp_md_img_addr.match(/\[(.*)\]/)[1];

    if (img_addr.indexOf("http") !== 0) {
      let new_img_addr = target_url + img_addr;

      new_tmp_md_img_addr = "![" + img_desc + "](" + new_img_addr + ")";

      file_content = file_content.replace(tmp_md_img_addr, new_tmp_md_img_addr);

      console.log("准备替换==>", tmp_md_img_addr, "为==>>", new_tmp_md_img_addr)
    } else {
      console.log("略过==>>", img_addr);


    }
  }

  console.log(file_content);

  fs.writeFileSync(whole_md_file_path, file_content, { encoding: "utf8" })

  // file_content = file_content.replace(/\!\[.*\]\(.*\)/g, target_url+'$1');

  // console.log(md_img_addr_list, "--->>", img_addr);
}

// 将Markdown文件中本地图片链接替换为网络图片链接
async function local_href_2_https_href() {
  let md_file_list = await get_md_file_list();

  console.log("md_file_list==>>", md_file_list);
  // md_file_list = ["kr-000046.md"];


  for (let i = 0; i < md_file_list.length; i++) {
    console.log("=读取=>>", md_file_list[i]);
    local_file_href_2_https_href(md_file_list[i]);
  }
}

async function md_and_img_chmodr(path) {
  await new Promise((resolve, reject) => {
    chmodr(path, 0o777, (err) => {
      if (err) {
        console.log('Failed to execute chmod', err);
      } else {
        console.log('Success');
        resolve();
      }
    });
  })
}


async function main() {

  await local_href_2_https_href();

}

main();

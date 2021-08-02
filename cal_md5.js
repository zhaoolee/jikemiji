const path = require('path');
const fs = require('fs-extra');
const crypto = require('crypto');


async function cal_md_file_md5(file_path) {

    const md5 = await new Promise((resolve, reject)=>{
        const stream = fs.createReadStream(file_path);
        const hash = crypto.createHash('md5');
    
        stream.on('data', chunk => {
            hash.update(chunk, 'utf8');
        });
    
        stream.on('end', () => {
            const md5 = hash.digest('hex');
            console.log(file_path, md5);
            resolve(md5);
        });

    })

    return md5;
}


async function main() {

    // 获取所有md文件
    let md_dir = "jikemiji-md"
    let root = path.join(__dirname, md_dir);
    let exclude_md_files = [];
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

    // writeJsonSync
    if(fs.existsSync(path.join(__dirname, 'md_file_md5.json')) === false){
        fs.writeJSONSync(path.join(__dirname, 'md_file_md5.json'),
            {
                "had_change_file": [],
                "file_md5": {}
            }
        )

    }


    console.log('==all_md_files==>', all_md_files);

    // 读取file_md5

    let md_file_md5_json = fs.readJsonSync(path.join(__dirname, 'md_file_md5.json'));

    old_file_md5 =  md_file_md5_json['file_md5'];


    new_file_md5 = {};

    let had_change_file = [];

    old_file_md5_keys = Object.keys(old_file_md5);

    for(let i = 0, all_md_files_len = all_md_files.length ; i < all_md_files_len; i++) {
        let file_path = path.join(__dirname, md_dir, all_md_files[i])
        let file_path_md5_code = await cal_md_file_md5(file_path);

        new_file_md5[all_md_files[i]] = file_path_md5_code;


        
        // 如果old_file_md5中不存在key, file_path直接记录到had_change_file
        if(old_file_md5_keys.indexOf(all_md_files[i]) === -1){

            had_change_file.push(file_path)

        }
        

        // 如果old_file_md5中存在key, 但md5值对不上, file_path直接记录到had_change_file

        if(old_file_md5_keys.indexOf(all_md_files[i]) > -1){

            let old_md5_code = old_file_md5[all_md_files[i]];

            if(old_md5_code !== file_path_md5_code){
                had_change_file.push(file_path)
            }
            
        }


    }

    // 将new_file_md5 写入 md_file_md5.json

    md_file_md5_json["file_md5"] = new_file_md5;

    md_file_md5_json["had_change_file"] = had_change_file;


    fs.writeJSONSync(path.join(__dirname, 'md_file_md5.json'),md_file_md5_json)






}

main()
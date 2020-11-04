---
title: 《资源》获取Pixiv最新插画
---

[https://www.pixiv.net](https://www.pixiv.net)


数据接口:

https://www.pixiv.net/ranking.php

| 参数  |  取值  | 含义 | 
| --- | --- | --- |
| mode | daily |  每日 / 每周 / 每月
| content | illust | 插画
| p | 1,2,3 | 负责翻页 | 
| format | json | json格式 |


以每月的插画排行榜为例


```
https://www.pixiv.net/ranking.php?mode=monthly&content=illust&p=1&format=json
```

我们只需要给p参数是持续加1就好了,编写脚本,完成爬虫

![](https://www.v2fy.com/asset/pixiv/pixiv460.gif)

(提取方式在文末)

## 放几张图

![](https://www.v2fy.com/asset/pixiv/1.jpg)

![](https://www.v2fy.com/asset/pixiv/2.jpg)

![](https://www.v2fy.com/asset/pixiv/3.jpg)

![](https://www.v2fy.com/asset/pixiv/4.jpg)

![](https://www.v2fy.com/asset/pixiv/5.jpg)

![](https://www.v2fy.com/asset/pixiv/6.jpg)

![](https://www.v2fy.com/asset/pixiv/7.jpg)

![](https://www.v2fy.com/asset/pixiv/8.jpg)

![](https://www.v2fy.com/asset/pixiv/9.jpg)

![](https://www.v2fy.com/asset/pixiv/10.jpg)

![](https://www.v2fy.com/asset/pixiv/11.png)

![](https://www.v2fy.com/asset/pixiv/12.png)

![](https://www.v2fy.com/asset/pixiv/13.png)

![](https://www.v2fy.com/asset/pixiv/14.png)

![](https://www.v2fy.com/asset/pixiv/15.png)

实现源码


```javascript
const request = require('superagent');
const fs = require('fs-extra');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const download = require('download');
const axios = require('axios');


// 下载图片
async function download_img(imgAndName) {
  let path_and_name = path.join(__dirname, "images", imgAndName[1]);
  if (fs.existsSync(path_and_name)) {

    console.log("跳过", path_and_name)

  } else {

    await download(imgAndName[0], path.join(__dirname, "images"), { filename: imgAndName[1] });
    console.log(imgAndName[0]);
  }

}

async function getUrlAndName(current_url) {

  // 用于存储返回值
  let imgAddrArray = [];
  // 请求资源
  const res = await axios({
    method: "get",
    url: current_url,
    header: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
    }
  })

  // console.log("res==>>",res);


  let res_json = res.data;
  let res_info = res_json.contents;
  res_info.map(async (res_info_value, res_info_index) => {
    let pic_description = res_info_value.title;

    let pic_url = res_info_value.url;

    // 源url: https://i-f.pximg.net/c/240x480/img-master/img/2020/02/12/06/57/05/79433546_p0_master1200.jpg

    // 目标url: https://i-f.pximg.net/img-original/img/2020/02/12/06/57/05/79433546_p0.jpg

    let origin_pic_url_list = [];

    let origin_pic_url_0 = "";
    let origin_pic_url_1 = "";
    origin_pic_url_0 = pic_url.replace("/c/240x480/img-master/img/", "/img-original/img/");
    origin_pic_url_0 = origin_pic_url_0.replace("_master1200", "");

    origin_pic_url_1 = pic_url.replace("/c/240x480/img-master/img/", "/img-original/img/");
    origin_pic_url_1 = origin_pic_url_1.replace("_master1200", "");
    origin_pic_url_1 = origin_pic_url_1.replace(".jpg", ".png");

    origin_pic_url_list = [origin_pic_url_0, origin_pic_url_1];

    // console.log("pic_url::", pic_url);

    // console.log("===>>", origin_pic_url_list)

    let next_request = true;
    let origin_pic_url_index = 0;

    while ((next_request) && (origin_pic_url_index < 2)) {

      let file_ext = "jpg"
      if (origin_pic_url_index === 0) { }
      if (origin_pic_url_index === 1) { file_ext = "png" }

      try {
        // console.log("====", [origin_pic_url_list[origin_pic_url_index], pic_description+"."+file_ext]);
        await download_img([origin_pic_url_list[origin_pic_url_index], pic_description + "." + file_ext]);
        next_request = false;
      } catch (e) {
        // console.log("==>>", e);
        origin_pic_url_index = origin_pic_url_index + 1;
      }

    }

  });
  return imgAddrArray;
}

// 创建文件夹, 控制整体流程
async function init() {
  // 创建文件夹
  try {
    await fs.mkdir(path.join(__dirname, 'images'));
  }
  catch (err) {
    // console.log("==>", err);
  }

  let p = 1;

  let current_url = 'https://www.pixiv.net/ranking.php?mode=monthly&content=illust&p=' + p + '&format=json';

  // 获取json总页数

  const res = await axios({
    method: "get",
    url: current_url,
    header: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
    }
  })


  let page = Math.ceil(res.data.rank_total / 50);

  console.log("page==>>", page);

  while (p <= page) {

    console.log("p==>>", p);
    current_url = 'https://www.pixiv.net/ranking.php?mode=monthly&content=illust&p=' + p + '&format=json';

    let imgAddrArray = await getUrlAndName(current_url);

    p = p + 1;

  }
}
init();
```

在公众号**0加1** 后台回复 **pixiv月度最佳插画**, 即可获取pixiv本月度 230 张优质超清插画

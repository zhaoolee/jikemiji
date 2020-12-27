---
title: 《资源》为台湾「表特日报」完成的小姐姐爬虫（附4000张成果图片）
---

zhaoolee发现一个好玩的邮件订阅，名为[「表特日报」](https://daily-beauty.xyz/)，「表特」是Beauty的谐音，也就是就是「颜值报」, 订阅「表特日报」后，每天会收到一封有高颜值妹纸的图片


![](https://www.v2fy.com/asset/website-000006-beauty/beauty_daily.png)


zhaoolee对邮件背后的图片数据源**PTT表特版**产生了兴趣，于是找到了这样一个页面
https://www.ptt.cc/man/Beauty/index.html

![](https://www.v2fy.com/asset/website-000006-beauty/002.png)

这是个台湾网站... 有点东西！

但这个网站每个帖子都需要单个打开才能查看， 于是zhaoolee找到一个与之关联的网站，可以使用瀑布流的方式直接查看帖子的内容


https://beautyptt.cc/

![](https://www.v2fy.com/asset/website-000006-beauty/004.gif)


于是zhaoolee通过开发者工具，查看了一下网站数据接口，并得知数据接口支持关键词筛选

![](https://www.v2fy.com/asset/website-000006-beauty/006.gif)


台湾人喜欢用「正妹」来形容美女，我们最终拼接的「正妹图片」接口为

```
https://beautyptt.cc/extend/?search=search&title=正妹&author=&infinite_json&page=1
```
page后面的数字可以从1开始，一直递增为2,3,4

于是我写了一段程序，源码地址如下
```
https://github.com/zhaoolee/ptt_beauty_spider/blob/master/index.js
```

爬虫运行了3个小时，爬了4000多张图片

![](https://www.v2fy.com/asset/website-000006-beauty/007.gif)

这个正妹专题的审美还挺多元！


4000张图片蓝奏云下载地址：https://www.lanzous.com/b00nfsnej

由于蓝奏云的单文件不得超过100M, 所以我对4000张图片进行了分卷压缩，下载所有文件后，移除.zip后缀，然后全选文件，使用7-zip将所有分卷解压到一个文件夹就可以了


## 本文永久更新地址(欢迎来读留言,写评论):

[https://www.v2fy.com/p/website-000006-beauty.md](https://www.v2fy.com/p/website-000006-beauty.md)

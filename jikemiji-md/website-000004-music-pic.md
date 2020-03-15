---
title: 《Chrome妙用》获取网易云音乐超清专辑封面
---

![](https://www.v2fy.com/asset/net-music-pic/000.png)

网易云音乐安装到本地后，听歌的体验非常不错，　尤其是转动的ＣＤ唱片机动画，简直是音乐软件教科书级的设计，唱片动画中间放置的一张专辑封面图，是整个唱片动画的灵魂，那么如何下载超清封面图呢？

## 获得分享链接

点击网易云音乐的**分享**按钮，点击**复制链接**，获得在网页播放的ＵＲＬ地址，如《镇魂街》插曲《等待》的ＵＲＬ为　https://music.163.com/#/song?id=417250587


![](https://www.v2fy.com/asset/net-music-pic/0002-open-dev.png)

##  打开URL链接

 在浏览器中打开URL链接，然后打开开发者工具

![](https://www.v2fy.com/asset/net-music-pic/001copy_link.png)

## 刷新页面

![](https://www.v2fy.com/asset/net-music-pic/0021reflash.png)

## 获取专辑封面链接

选择ＮetWork->Img->Preview, 找出专辑图片的链接，将图片链接中尾部`?`及后面的字符串删除


![](https://www.v2fy.com/asset/net-music-pic/003.png)


![](https://www.v2fy.com/asset/net-music-pic/004.png)

## 将图片保存到桌面

在浏览器中，打开上一步获得的url，并将获得的图片，保存到桌面，完成！

![](https://www.v2fy.com/asset/net-music-pic/005.png)

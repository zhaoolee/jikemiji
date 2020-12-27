---
title: 《markdown实用技巧》Markdown折叠内容妙法?
---


zhaoolee去年在Github创建了**谷粒-Chrome插件英雄榜**项目, 是一本Chrome插件(扩展工具)的中文说明书, 为的是让Chrome插件造福人类,截止2020年5月4号,已经更新了70篇图文并茂的文章, 收到了15K的Star  




Github项目主页: https://github.com/zhaoolee/ChromeAppHeroes

国内主页: http://v2fy.com/ChromeAppHeroes


项目主页挂了赞赏码, 每当有人捐赠,我就会把捐赠时间,昵称,金额 挂到主页比较靠前的位置

但随着捐赠数量的增多, 捐赠名单就会变长, 为了让主页保持良好的阅读体验,我尝试把名单折叠一下, 只保留最新的20位


GitHub默认支持Markdown,但Markdown原生不支持内容折叠的操作,经过我的一番努力,最终以简单代码方式实现了捐赠名单的折叠

## 实现的效果

![](https://www.v2fy.com/asset/kr008/kr008md001.gif)


## 实现的方式很简单

下面是**显示三个，折叠三个**的写法

```
| 赞赏金额 | 赞赏者 | 赞赏时间 |
| --- | --- | --- |
| 5.00 | 虚拟世界 | 2002-04-27 |
| 5.00 | 无名雍羽 | 2020-04-24 |
| 30.00 | 张明辉(极简插件站长) | 2020-04-21 |

<details>
<summary>点击展开历史捐赠</summary>
<pre>
<table>
<thead>
</thead>
<tbody>
<tr>
<td>5.00</td>
<td>半岛铁盒</td>
<td>2019-09-14</td>
</tr>
<tr>
<td>12.34</td>
<td>张明辉</td>
<td>2019-08-20</td>
</tr>
<tr>
<td>10.00</td>
<td>六小登登</td>
<td>2019-09-05</td>
</tr>
</tbody>
</table>
</pre>
</details>
```

## 节目游戏PPT可以省了

以上方法还可以用于**你问我猜**, **脑筋急转弯**之类的小节目，用Markdown**展示问题，隐藏内容**，连PPT都省了


![](https://www.v2fy.com/asset/kr008/kr008md002.gif)


只需将以下文本用Typora打开即可

Typora免费下载地址： https://typora.io/#download

```
#### 冬瓜、黄瓜、西瓜、南瓜都能吃，什么瓜不能吃？

<details>
<summary>点击显示答案</summary>
<pre>
傻瓜
</pre>
</details>


#### 小华在家里，和谁长得最像？

<details>
<summary>点击显示答案</summary>
<pre>
自己
</pre>
</details>


#### 什么车子寸步难行?

<details>
<summary>点击显示答案</summary>
<pre>
风车
</pre>
</details>
```



## 小结：

还有一个小技巧，如果你想让自己的名字,关键词，或一部分信息被Google收录，把这些信息加到Github的Star数量较多仓库, 是一个好办法, 因为Google对Github高Star仓库的权重排名是很高的,比如我的项目名为**谷粒-Chrome插件英雄榜**
我搜索**谷粒**关键词
![](https://www.v2fy.com/asset/kr008/kr008guli.png)
GitHub的权重比百度百科还要要高, 这也是我不想把捐赠者名字移出README.md的原因~


## 本文永久更新地址(欢迎来读留言,写评论):

[https://www.v2fy.com/p/kr-000008-markdown-content](https://www.v2fy.com/p/kr-000008-markdown-content)

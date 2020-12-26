---
title:  在Ubuntu 20.04中安装系统级最新版Go语言安装包,并新建项目
---

## Ubuntu20.04启用root用户

- 启用root用户

```sh
sudo passwd root
```

- 进入root账户

```sh
su
```

## 获取安装包

```sh
cd /usr/local
wget https://golang.org/dl/go1.15.6.linux-amd64.tar.gz
```

## 将安装包解压到`/usr/local`目录
```sh
tar -C /usr/local -zxvf go1.15.6.linux-amd64.tar.gz
# 移除安装包
rm go1.15.6.linux-amd64.tar.gz
```


## 将go的环境变量添加到系统级配置文件/etc/profile

由于`/etc/profile` 从`/etc/profile.d`文件夹读取配置文件, 为了不对`/etc/profile`造成破坏性更改,我们选择在`/etc/profile.d`新建文件`go.sh`,并在`go.sh`中填入环境变量

```sh
touch /etc/profile.d/go.sh
chmod 777 /etc/profile.d/go.sh
# 注意下面的$PATH前面有一个反斜杠,反斜杠一定要有,否则$PATH会被当做变量,写入的内容会超长
echo "export PATH=/usr/local/go/bin:\$PATH" > /etc/profile.d/go.sh
```

## 执行profile并生效

```sh
source /etc/profile
```


此刻完成了go语言编译器的系统级安装, 不仅root可用, 新建的普通用户也可用!



## 卸载go语言包,并重载配置文件

```sh
rm /etc/profile.d/go.sh
rm -rf /usr/local/go
source /etc/profile
```



## 开始开发


```sh
# 进入桌面
cd ~/Desktop
# 创建文件夹go-demo
mkdir go-demo
# 进入go-demo文件夹
cd go-demo
# 初始化项目go-demo
go mod init go-demo
# 在go-demo目录下新建main.go文件
touch main.go
```

- 往main.go中添加如下代码

```go
package main

import (
    "github.com/gin-gonic/gin"
    "fmt"
)

func main() {
    // 获取路由
    r := gin.Default()

    // 最简单的回应 http://127.0.0.1:8080/ping
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong（最简单的回应）",
        })
    })

    // GET版 鹦鹉学舌 http://127.0.0.1:8080/message?name=dd
    r.GET("/message", func(c *gin.Context){
        name := c.Query("name");
        data := map[string]interface{}{
            "name": name,
        }
        c.JSON(200, gin.H{
            "status": 1000,
            "message": "响应鹦鹉学舌",
            "data": data,
        })
    })

    // POST版鹦鹉学舌 http://127.0.0.1:8080/movie

    type Info struct {
        Name string `json:"name"`
        Score int `json:"score"`
    }

    r.POST("/movie", func(c *gin.Context){

        // 以Info为模板初始化data
        var data Info

        // 将请求参数绑定到data
        c.BindJSON(&data);

        fmt.Println("=data=>>",data);


        c.JSON(200, gin.H{
            "status": 1000,
            "message": "返回电影名称和评分",
            "data": data,
        })

    })


    r.Run() // 监听并在 0.0.0.0:8080 上启动服务
}
```

- 运行代码


```sh
go run main.go
```

- 用浏览器打开页面

```html
http://127.0.0.1:8080/ping
```

![image-20201214175544913](https://www.v2fy.com/asset/0i/jikemiji/jikemiji-md/2020-12-14-install-go.assets/image-20201214175544913.png)



- 代码实现过程详情: [https://www.v2fy.com/p/2020-12-13-go/](https://www.v2fy.com/p/2020-12-13-go/)



## 依赖的安装包下载到了哪里?

运行上图代码时,会从github自动下载依赖包,但这些依赖包并不在项目中,而是下载到了 `GOPATH` 路径下的 /pkg/mod文件夹下

```sh
# 查看 GOPATH 路径
go env | grep GOPATH
```




## 阅读原文（支持读写评论）

[https://www.v2fy.com/p/2020-12-14-install-go/](https://www.v2fy.com/p/2020-12-14-install-go/)
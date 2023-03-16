---
title: 《Nginx WordPress建站攻略》搭建一个高可玩的网站
---


## 初始化轻量应用服务器
- 初始化轻量应用服务器， 设置登录密码 比如iamzhaoolee
- 将域名 hk.v2fy.com 解析到 轻量应用服务器的ip
- 确认开启轻量应用服务器的80端口，63306端口，待会儿要用


## ssh登录到服务器

```
# 查看路径
pwd
```

## 下载
```
wget https://wordpress.org/wordpress-5.3.tar.gz
```

wordpress安装包有时候会下载失败，建议将安装包下载到本地，然后使用sftp手动上传到服务端




## 解压

```
tar -zxvf wordpress-5.3.tar.gz
```

## 创建配置文件
```
cd wordpress
cp wp-config-sample.php wp-config.php
```

## 创建数据库

### 安装docker

```
# 刷新yum源
yum clean all && yum makecache && yum update
# 安装阿里epel源
yum -y install epel-release
wget -O /etc/yum.repos.d/epel-7.repo http://mirrors.aliyun.com/repo/epel-7.repo
# 刷新yum源
yum clean all && yum makecache && yum update
# 安装pip
yum install python-pip
# 通过yum源安装docker
sudo yum -y install docker
# 启动docker
sudo systemctl start docker
# 开机自启
sudo systemctl enable docker
```







### 安装mysql 8.0
```
docker run -p 63306:3306 -e MYSQL_ROOT_PASSWORD=zhaooleemysql --name zhaooleemysqldb -d mysql:8.0
```
- `p 53306:3306` 将docker容器的3306端口映射到宿主机的63306端口
- `-e MYSQL_ROOT_PASSWORD=zhaooleemysql`  root用户登录密码为 zhaooleemysql

- `--name zhaooleemysqldb`  新建容器的名称为zhaooleemysqldb

- `mysql:8.0` 使用的mysql数据库版本为8.0


###  进入容器

```
docker exec -it zhaooleemysqldb bash
```



### 登录数据库

```
mysql -uroot -p
zhaooleemysql
```

### 新建用户(8.0更为严格,用root用户远程登录比较麻烦, 我们选择新建一个用户)

```
create user 'zhaoolee' identified with mysql_native_password by 'eelooahzpw';
```
- `zhaoolee` 新用户名为zhaoolee

- `mysql_native_password`   密码加密方式为`mysql_native_password`

- `eelooahzpw` 新用户的密码为eelooahzpw

- 连接端口依然是63306

### 为新用户zhaoolee增加权限
```
grant all privileges on *.* to 'zhaoolee';
```


### 刷新权限
```
flush privileges;
```




### 新建数据库
```
create database hk_v2fy charset=utf8;
```
- 新数据库的名称为 `hk_v2fy`

## 退出数据库

```
exit
```

## 退出docker容器

```
control +  p  + q
```

tips-000003-nginx-wordpress

## 尝试用Navicat连接


![](https://www.v2fy.com/asset/tips-000003-nginx-wordpress/navicat.png)



## 安装php7.3
```
sudo yum -y install epel-release
sudo rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm

yum --enablerepo=remi-php73 install -y php php-fpm

yum --enablerepo=remi-php73 install  -y php-xml php-soap php-xmlrpc php-mbstring php-json php-gd php-mcrypt php-mysqli php-pdo
```

## 查看php版本以及依赖包

```
php -v
php -m
```




### 安装插件解决需要ftp权限的问题


`chmod -R  777 /root/wordpress`





## 安装nginx


```
sudo rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

```
sudo yum install -y nginx
```

## 开启nginx


```
# 设置开机启动
sudo systemctl enable nginx
# 开启nginx
sudo systemctl start nginx
# 重启nginx
sudo systemctl restart nginx
# nginx重新加载配置文件
sudo systemctl reload nginx
```



## 配置php-fpm


```
vim /etc/php.ini
# 替换:
;cgi.fix_pathinfo=1
# 为:
cgi.fix_pathinfo=0
```


```
vim /etc/php-fpm.d/www.conf

# 替换:
listen = 127.0.0.1:9000
# 为:
listen = /var/run/php73-fpm/php73-fpm.sock

# 替换:
;listen.owner = nobody
;listen.group = nobody
# 为:
listen.owner = nginx
listen.group = nginx

# 替换:
user = apache
group = apache
# 为:
user = nginx
group = nginx
```

```
mkdir /var/run/php73-fpm

chown -R nginx:nginx /var/lib/php/session
```

## 解决php-fpm重启后目录被清除的问题

这里有个小问题，每次我们重启服务器后，所有临时目录和文件都将被清除，包括 /var/run/php73-fpm 目录。此目录是 PHP-FPM 进程运行时需要使用的目录，如果该目录不存在，PHP-FPM 进程将无法启动。因此，需要手动创建该目录以确保 PHP-FPM 进程正常启动。

1. 首先，创建一个名为 php-fpm73-mkdir.service 的新文件，存储在 /etc/systemd/system/ 目录中。

2. 在 /etc/systemd/system/php-fpm73-mkdir.service，添加以下内容，并保存。

```
[Unit]
Description=Create /var/run/php73-fpm directory
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/mkdir /var/run/php73-fpm
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target

```

3. 为php-fpm73-mkdir.service 设置开机启动

```
sudo systemctl start php-fpm73-mkdir.service
sudo systemctl enable php-fpm73-mkdir.service

```


##　为php-fpm添加开机启动

```
# 重启
systemctl restart php-fpm
# 新增启动项
systemctl enable php-fpm
```




## 配置nginx

- 域名为hk.v2fy.com

```
mkdir -p /usr/share/nginx/hk.v2fy.com


cp -r /root/wordpress/* /usr/share/nginx/hk.v2fy.com/

chmod 777 -R /usr/share/nginx/hk.v2fy.com/
```

#### 更改 `/usr/share/nginx/hk.v2fy.com/wp-config.php`

```
vim /usr/share/nginx/hk.v2fy.com/wp-config.php
```

![](https://www.v2fy.com/asset/tips-000003-nginx-wordpress/db.png)

#### 更改 `/etc/nginx/conf.d/hk.v2fy.com.conf`

```
vim /etc/nginx/conf.d/hk.v2fy.com.conf
```



```conf
server {
  listen 80;
  server_name hk.v2fy.com;
  root /usr/share/nginx/hk.v2fy.com;
  index index.php index.html index.htm;


  gzip on;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  #gzip_http_version 1.0;
  gzip_comp_level 8;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\.";

  location = /favicon.ico {
    log_not_found off;
    access_log off;
  }

  location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
  }

  location / {
    # This is cool because no php is touched for static content.
    # include the "?$args" part so non-default permalinks doesn't break when using query string
    try_files $uri $uri/ /index.php?$args;
  }


  location ~ \.php$ {
    try_files $uri =404;
    fastcgi_pass unix:/var/run/php73-fpm/php73-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
    expires max;
    log_not_found off;
  }


}
```


```
nginx -t
systemctl restart nginx
systemctl restart php-fpm
```





## 本文永久更新地址(欢迎来读留言,写评论):

[https://www.v2fy.com/p/tips-000003-nginx-wordpress](https://www.v2fy.com/p/tips-000003-nginx-wordpress)

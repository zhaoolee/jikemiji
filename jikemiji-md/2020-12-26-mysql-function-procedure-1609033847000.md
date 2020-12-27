---
title: Mysql函数(function)|存储过程(procedure)
---



![function_procedure](https://www.v2fy.com/asset/0i/jikemiji/jikemiji-md/2020-12-26-mysql-function-procedure-1609033847000.assets/3203841-c3d96c220efbb23f.png)
----
## 函数

mysql内置的函数很好用,同样mysql也支持用户自定义函数


### 1.为避免和函数中的语句结束符`;`冲突,将语句结束符号临时重定义为`$$`



````mysql
delimiter $$
````



### 2.书写函数体

- 语法
```mysql
create function 函数名(参数列表) returns 返回值类型
begin
    
declare 变量名 变量类型;
    
逻辑语句;
    
return 返回值;
    
end
    
$$

```


- 示例

```mysql
create function num_add() returns varchar(100)
begin
    
declare i int default 1;
declare x varchar(100) default '';
while i < 20 do
    
if i%2 = 0 then
    
set x = concat(x, " ", i);
    
end if;
    
set i = i + 1;
    
end while;
    
return x;
end
$$
```

### 3.将语句结束符还原为`;`

````mysql
delimiter;
````



### 4.调用函数

```mysql
select num_add();
```



### 运行结果:


![mysql_function](https://www.v2fy.com/asset/0i/jikemiji/jikemiji-md/2020-12-26-mysql-function-procedure-1609033847000.assets/3203841-50de96abc56c626e.png)


> 函数体中也可以编写sql语句,但不能使用`select...from...`,所以通过sql对数据表进行操作的任务,最好交给"存储过程"

----

# 存储过程
与函数相比,"存储过程"可以对"所有sql语句"进行完美封装.



### 1.为避免和"存储过程"中的语句结束符`;`冲突,将语句结束符号临时重定义为`$$`



````mysql
delimiter $$
````



### 2.创建"存储过程"

- 语法

  
    create procedure 存储过程名称(参数列表)
    begin
    
    sql语句;    
    

    end
    
    $$


- 示例

```sql
create procedure show_func_and_proc()
begin
    
select name, type, db from mysql.proc;
end
$$
```


### 3.将语句结束符还原为`;`

```mysql
delimiter ;
```



### 4.调用新建的存储过程
```mysql
call show_func_and_proc();
```
#### 运行结果:


![mysql_procedure](https://www.v2fy.com/asset/0i/jikemiji/jikemiji-md/2020-12-26-mysql-function-procedure-1609033847000.assets/3203841-6b49d61fedf5e69c.png)



## 小结



函数和存储过程中的主体都被`begin...end`嵌套,这是一种名为"事务"的结构,目的是保证`begin...end`以内的语句不可分割,要么完整执行,要么不执行.







## 本文永久更新地址(欢迎来读留言,写评论):

[https://www.v2fy.com/p/2020-12-26-mysql-function-procedure-1609033847000](https://www.v2fy.com/p/2020-12-26-mysql-function-procedure-1609033847000)

---
  title: mysql
  date: 2022-11-21
  sidebar: 'auto'
  tags:
  - 笔记
  - sql
  categories:
  - sql
---
## 终端操作数据库

### 显示数据库

```sql
show databases;
```

MySQL默认的数据库：

- infomation_schema：信息数据库，其中包括MySQL在维护的其他数据库、表、 列、访问权限等信息；
- performance_schema：性能数据库，记录着MySQL Server数据库引擎在运行 过程中的一些资源消耗相关的信息；
- mysql：用于存储数据库管理者的用户信息、权限信息以及一些日志信息等；
- sys：相当于是一个简易版的performance_schema，将性能数据库中的数据汇 总成更容易理解的形式；

### 创建数据库-表

```sql
-- 创建数据库
create database coderhub;
-- 使用数据库
use coderhub;
-- 在数据中，创建一张表：
create table user(
  name varchar(20),
  age int,
  height double
);
```

## SQL的数据类型

MySQL支持的数据类型有：数字类型，日期和时间类型，字符串（字符和字节）类型，空间类型和 JSON数 据类型。

- 数字类型
  - 整数数字类型：INTEGER，INT，SMALLINT，TINYINT，MEDIUMINT，BIGINT；
  - 浮点数字类型：FLOAT，DOUBLE（FLOAT是4个字节，DOUBLE是8个字节）；
  - 精确数字类型：DECIMAL，NUMERIC（DECIMAL是NUMERIC的实现形式）；
- 日期类型
  - YEAR以YYYY格式显示值
    - 范围 1901到2155，和 0000
  - DATE类型用于具有日期部分但没有时间部分的值：
    - DATE以格式YYYY-MM-DD显示值 ；
    - 支持的范围是 '1000-01-01' 到 '9999-12-31'；
  - DATETIME类型用于包含日期和时间部分的值：
    - DATETIME以格式'YYYY-MM-DD hh:mm:ss'显示值；
    - 支持的范围是1000-01-01 00:00:00到9999-12-31 23:59:59;
  - TIMESTAMP数据类型被用于同时包含日期和时间部分的值：
    - TIMESTAMP以格式'YYYY-MM-DD hh:mm:ss'显示值；
    - 但是它的范围是UTC的时间范围：'1970-01-01 00:00:01'到'2038-01-19 03:14:07';
  - 另外：DATETIME或TIMESTAMP 值可以包括在高达微秒（6位）精度的后小数秒一部分
    - 比如DATETIME表示的范围可以是'1000-01-01 00:00:00.000000'到'9999-12-31 23:59:59.999999';
- 字符串类型
  - CHAR类型在创建表时为固定长度，长度可以是0到255之间的任何值；
    - 在被查询时，会删除后面的空格；
  - VARCHAR类型的值是可变长度的字符串，长度可以指定为0到65535之间的值；
    - 在被查询时，不会删除后面的空格；
  - BINARY和VARBINARY 类型用于存储二进制字符串，存储的是字节字符串；
    - [参考](https://dev.mysql.com/doc/refman/8.0/en/binary-varbinary.html)
  - BLOB用于存储大的二进制类型；
  - TEXT用于存储大的字符串类型；



## SQL语句的分类

常见的SQL语句可以分成四类：

- DDL（Data Definition Language）：数据定义语言；
  - 可以通过DDL语句对数据库或者表进行：创建、删除、修改等操作；
- DML（Data Manipulation Language）：数据操作语言；
  - 可以通过DML语句对表进行：添加、删除、修改等操作；
- DQL（Data Query Language）：数据查询语言；
  - 可以通过DQL从数据库中查询记录；（重点）
- DCL（Data Control Language）：数据控制语言；
  - 对数据库、表格的权限进行相关访问控制操作；

## 表约束

- 主键：PRIMARY KEY
  - 一张表中，我们为了区分每一条记录的唯一性，必须有一个字段是永远不会重复，并且不会为空的，这个字段我们通常会 将它设置为主键：
    - 主键是表中唯一的索引；
    - 并且必须是NOT NULL的，如果没有设置 NOT NULL，那么MySQL也会隐式的设置为NOT NULL；
    - 主键也可以是多列索引，PRIMARY KEY(key_part, ...)，我们一般称之为联合主键；
    - 建议：开发中主键字段应该是和业务无关的，尽量不要使用业务字段来作为主键；
- 唯一：UNIQUE
  - 某些字段在开发中我们希望是唯一的，不会重复的，比如手机号码、身份证号码等，这个字段我们可以使用UNIQUE来约 束：
    - 使用UNIQUE约束的字段在表中必须是不同的；
    - 对于所有引擎，UNIQUE 索引允许NULL包含的列具有多个值NULL。
- 不能为空：NOT NULL
  - 某些字段我们要求用户必须插入值，不可以为空，这个时候我们可以使用 NOT NULL 来约束；
- 默认值：DEFAULT
  - 某些字段我们希望在没有设置值时给予一个默认值，这个时候我们可以使用 DEFAULT来完成；
- 自动递增：AUTO_INCREMENT
  - 某些字段我们希望不设置值时可以进行递增，比如用户的id，这个时候可以使用AUTO_INCREMENT来完成；



## DDL-对数据库的操作

```sql
# 查看所有的数据库
SHOW DATABASES;

# 选择某一个数据库
USE bili;

# 查看当前正在使用的数据库
SELECT DATABASE();

# 创建一个新的数据库
CREATE DATABASE douyu;
CREATE DATABASE IF NOT EXISTS douyu;
CREATE DATABASE IF NOT EXISTS huya DEFAULT CHARACTER SET utf8mb4
  		 COLLATE utf8mb4_0900_ai_ci;

# 删除数据库
DROP DATABASE IF EXISTS douyu;

# 修改数据库的编码
ALTER DATABASE huya CHARACTER SET = utf8 
				COLLATE = utf8_unicode_ci;
```

## DDL-对数据表的操作

```sql
# 查看所有的表
SHOW TABLES;

# 新建表
CREATE TABLE IF NOT EXISTS `students` (
	`name` VARCHAR(10) NOT NULL,
	`age` int,
	`score` int,
	`height` DECIMAL(10,2),
	`birthday` YEAR,
	`phoneNum` VARCHAR(20) UNIQUE
);

# 删除表
DROP TABLE IF EXISTS `moment`;

# 查看表的结构
DESC students;
# 查看创建表的SQL语句
SHOW CREATE TABLE `students`;
-- CREATE TABLE `students` (
--   `name` varchar(10) DEFAULT NULL,
--   `age` int DEFAULT NULL,
--   `score` int DEFAULT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

# 完整的创建表的语法
CREATE TABLE IF NOT EXISTS `users`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	age INT DEFAULT 0,
	phoneNum VARCHAR(20) UNIQUE DEFAULT '', -- UNIQUE 唯一
	createTime TIMESTAMP
);x

# 修改表
# 1.修改表的名字
ALTER TABLE `users` RENAME TO `user`;
# 2.添加一个新的列
ALTER TABLE `user` ADD `updateTime` TIMESTAMP;
# 3.修改字段的名称
ALTER TABLE `user` CHANGE `phoneNum` `telPhone` VARCHAR(20);
# 4.修改字段的类型
ALTER TABLE `user` MODIFY `name` VARCHAR(30);
# 5.删除某一个字段
ALTER TABLE `user` DROP `age`;

# 补充
# 根据一个表结构去创建另外一张表
CREATE TABLE `user2` LIKE `user`;
# 根据另外一个表中的所有内容，创建一个新的表
CREATE TABLE `user3` (SELECT * FROM `user`); 
```

## DML-对数据的增删改

```sql
# DML
# 插入数据
-- 插入全部的可以不用写前面的key
INSERT INTO `user` VALUES (110, 'why', '020-110110', '2020-10-20', '2020-11-11'); 
INSERT INTO `user` (name, telPhone, createTime, updateTime)
						VALUES ('kobe', '000-1111111', '2020-10-10', '2030-10-20');
						
INSERT INTO `user` (name, telPhone)
						VALUES ('lilei', '000-1111112');

# 需求：createTime和updateTime可以自动设置值
ALTER TABLE `user` MODIFY `createTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `user` MODIFY `updateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP					
																			 ON UPDATE CURRENT_TIMESTAMP;

INSERT INTO `user` (name, telPhone)
						VALUES ('hmm', '000-1111212');

# 删除数据
# 删除所有的数据
DELETE FROM `user`;
# 删除符合条件的数据
DELETE FROM `user` WHERE id = 110;

# 更新数据
# 更新所有的数据
UPDATE `user` SET name = 'lily', telPhone = '010-110110';
# 更新符合条件的数据
UPDATE `user` SET name = 'lily', telPhone = '010-110110' WHERE id = 115;
```

## DQL-数据的查询语句

```sql
# 创建products的表
CREATE TABLE IF NOT EXISTS `products` (
	id INT PRIMARY KEY AUTO_INCREMENT,
	brand VARCHAR(20),
	title VARCHAR(100) NOT NULL,
	price DOUBLE NOT NULL,
	score DECIMAL(2,1),
	voteCnt INT,
	url VARCHAR(100),
	pid INT
);

# 1.基本查询
# 查询表中所有的字段以及所有的数据
SELECT * FROM `products`;
# 查询指定的字段
SELECT title, price FROM `products`;
# 对字段结果起一个别名 (可以省略 as)
SELECT title as phoneTitle, price as currentPrice FROM `products`;


# 2.where条件
# 2.1. 条件判断语句
# 案例：查询价格小于1000的手机
SELECT title, price FROM `products` WHERE price < 1000;
# 案例二：价格等于999的手机
SELECT * FROM `products` WHERE price = 999;
# 案例三：价格不等于999的手机
SELECT * FROM `products` WHERE price != 999;
SELECT * FROM `products` WHERE price <> 999;
# 案例四：查询品牌是华为的手机
SELECT * FROM `products` WHERE brand = '华为';

# 2.2. 逻辑运算语句
# 案例一：查询1000到2000之间的手机
SELECT * FROM `products` WHERE price > 1000 AND price < 2000;
SELECT * FROM `products` WHERE price > 1000 && price < 2000;
# BETWEEN AND 包含等于
SELECT * FROM `products` WHERE price BETWEEN 1099 AND 2000;

# 案例二：价格在5000以上或者是品牌是华为的手机
SELECT * FROM `products` WHERE price > 5000 || brand = '华为';

# 将某些值设置为NULL
-- UPDATE `products` SET url = NULL WHERE id >= 85 and id <= 88;
# 查询某一个值为NULL
SELECT * FROM `products` WHERE url IS NULL;
-- SELECT * FROM `products` WHERE url = NULL;
-- SELECT * FROM `products` WHERE url IS NOT NULL;

# 2.3.模糊查询
SELECT * FROM `products` WHERE title LIKE '%M%';
SELECT * FROM `products` WHERE title LIKE '%P%';
SELECT * FROM `products` WHERE title LIKE '_P%';

# 3.对结果进行排序
SELECT * FROM `products` WHERE brand = '华为' || brand = '小米' || brand = '苹果';
SELECT * FROM `products` WHERE brand IN ('华为', '小米', '苹果') 
												 ORDER BY price ASC, score DESC;


# 4.分页查询
# LIMIT limit OFFSET offset;
# Limit offset, limit;
SELECT * FROM `products` LIMIT 20 OFFSET 0;
SELECT * FROM `products` LIMIT 20 OFFSET 20;
SELECT * FROM `products` LIMIT 40, 20;
```

## DQL-聚合函数GroupBy

```sql
# 1.聚合函数的使用
# 求所有手机的价格的总和
SELECT SUM(price) totalPrice FROM `products`;
# 求一下华为手机的价格的总和
SELECT SUM(price) FROM `products` WHERE brand = '华为';
# 求华为手机的平均价格
SELECT AVG(price) FROM `products` WHERE brand = '华为';
# 最高手机的价格和最低手机的价格
SELECT MAX(price) FROM `products`;
SELECT MIN(price) FROM `products`;

# 求华为手机的个数
SELECT COUNT(*) FROM `products` WHERE brand = '华为';
SELECT COUNT(*) FROM `products` WHERE brand = '苹果';
-- COUNT(url) 查询存在url的
SELECT COUNT(url) FROM `products` WHERE brand = '苹果';

SELECT COUNT(price) FROM `products`;
-- DISTINCT 查询不同的price的数量 (去重)
SELECT COUNT(DISTINCT price) FROM `products`;

# 2.GROUP BY的使用（分组）
-- 以 brand 分组 计算平均价格、数量、平均分数
SELECT brand, AVG(price), COUNT(*), AVG(score) FROM `products` GROUP BY brand;


# 3.HAVING的使用
-- 查找平均价格大于2000的 （这里不能使用WHERE，所以要使用HAVING）
SELECT brand, AVG(price) as avgPrice, COUNT(*), AVG(score) FROM `products` GROUP BY brand 
																												HAVING avgPrice > 2000;

# 4.需求：求评分score > 7.5的手机的，平均价格是多少？
SELECT AVG(price) FROM `products` WHERE score > 7.5
# 升级：平均分大于7.5的手机，按照品牌进行分类，求出平均价格。
SELECT brand, AVG(price) FROM `products` WHERE score > 7.5 GROUP BY brand;
```

## 多表的设计-外键

```sql
# 1.创建brand的表和插入数据
CREATE TABLE IF NOT EXISTS `brand`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	website VARCHAR(100),
	phoneRank INT
);

INSERT INTO `brand` (name, website, phoneRank) VALUES ('华为', 'www.huawei.com', 2);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('苹果', 'www.apple.com', 10);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('小米', 'www.mi.com', 5);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('oppo', 'www.oppo.com', 12);

INSERT INTO `brand` (name, website, phoneRank) VALUES ('京东', 'www.jd.com', 8);
INSERT INTO `brand` (name, website, phoneRank) VALUES ('Google', 'www.google.com', 9);


# 2.给brand_id设置引用brand中的id的外键约束
# 添加一个brand_id字段
ALTER TABLE `products` ADD `brand_id` INT;
-- ALTER TABLE `products` DROP `brand_id`;

# 修改brand_id为外键
ALTER TABLE `products` ADD FOREIGN KEY(brand_id) REFERENCES brand(id);

# 设置brand_id的值
UPDATE `products` SET `brand_id` = 1 WHERE `brand` = '华为';
UPDATE `products` SET `brand_id` = 2 WHERE `brand` = '苹果';
UPDATE `products` SET `brand_id` = 3 WHERE `brand` = '小米';
UPDATE `products` SET `brand_id` = 4 WHERE `brand` = 'oppo';

# 3.修改和删除外键引用的id -- 这个时候执行代码是报错的 需要以下操作
UPDATE `brand` SET `id` = 100 WHERE `id` = 1;


# 4.修改brand_id关联外键时的action
# 4.1.获取到目前的外键的名称
SHOW CREATE TABLE `products`;


-- CREATE TABLE `products` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `brand` varchar(20) DEFAULT NULL,
--   `title` varchar(100) NOT NULL,
--   `price` double NOT NULL,
--   `score` decimal(2,1) DEFAULT NULL,
--   `voteCnt` int DEFAULT NULL,
--   `url` varchar(100) DEFAULT NULL,
--   `pid` int DEFAULT NULL,
--   `brand_id` int DEFAULT NULL,
--   PRIMARY KEY (`id`),
--   KEY `brand_id` (`brand_id`),
--   CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

# 4.2.根据名称将外键删除掉
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;

# 4.2.重新添加外键约束
ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id)
																									ON UPDATE CASCADE
																									ON DELETE RESTRICT;
-- 可以给更新或者删除时设置几个值：																									
-- RESTRICT（默认属性）：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话会报错的，不允许更新或删除；
-- NO ACTION：和RESTRICT是一致的，是在SQL标准中定义的；
-- CASCADE：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，
		-- 有的话 -> 更新：那么会更新对应的记录；删除：那么关联的记录会被一起删除掉；
-- SET NULL：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话，将对应的值设置为 NULL；

-- 这样就可以
UPDATE `brand` SET `id` = 100 WHERE `id` = 1;
```

## 多表的设计-查询

![image-20221121111639943](/sql/image-20221121111639943.png)

```sql
# 1.获取到的是笛卡尔乘积 -- 第一张表的108条 * 第二张表的6条数据；
SELECT * FROM `products`, `brand`;
# 获取到的是笛卡尔乘积进行筛选 -- 性能不好
SELECT * FROM `products`, `brand` WHERE products.brand_id = brand.id;

# 2.左连接
# 2.1. 查询所有的手机（包括没有品牌信息的手机）以及对应的品牌 null
SELECT * FROM `products` LEFT OUTER JOIN `brand` ON products.brand_id = brand.id;

# 2.2. 查询没有对应品牌数据的手机
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL;
-- SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand_id IS NULL;

# 3.右连接
# 3.1. 查询所有的品牌（没有对应的手机数据，品牌也显示）以及对应的手机数据；
SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id;

# 3.2. 查询没有对应手机的品牌信息
SELECT * FROM `products` RIGHT JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL;

# 4.内连接
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id;
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id WHERE price = 8699;

# 5.全连接
# mysql是不支持FULL OUTER JOIN
SELECT * FROM `products` FULL OUTER JOIN `brand` ON products.brand_id = brand.id;

-- UNION 结合两个sql
(SELECT * FROM `products` LEFT OUTER JOIN `brand` ON products.brand_id = brand.id)
UNION
(SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id)

(SELECT * FROM `products` LEFT OUTER JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL)
UNION
(SELECT * FROM `products` RIGHT OUTER JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL)
```

## 多对多关系-设计

```sql
# 1.基本数据的模拟
CREATE TABLE IF NOT EXISTS students(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	age INT
);

CREATE TABLE IF NOT EXISTS courses(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	price DOUBLE
);

INSERT INTO `students` (name, age) VALUES('why', 18);
INSERT INTO `students` (name, age) VALUES('tom', 22);
INSERT INTO `students` (name, age) VALUES('lilei', 25);
INSERT INTO `students` (name, age) VALUES('lucy', 16);
INSERT INTO `students` (name, age) VALUES('lily', 20);

INSERT INTO `courses` (name, price) VALUES ('英语', 100);
INSERT INTO `courses` (name, price) VALUES ('语文', 666);
INSERT INTO `courses` (name, price) VALUES ('数学', 888);
INSERT INTO `courses` (name, price) VALUES ('历史', 80);
INSERT INTO `courses` (name, price) VALUES ('物理', 888);
INSERT INTO `courses` (name, price) VALUES ('地理', 333);


# 2.建立关系表
CREATE TABLE IF NOT EXISTS `students_select_courses`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	student_id INT NOT NULL,
	course_id INT NOT NULL,
	FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE,
	FOREIGN KEY (course_id) REFERENCES courses(id) ON UPDATE CASCADE
);

# 3.学生选课
# why选择了英文、数学、历史
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 1);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 3);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (1, 4);


INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 2);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (3, 4);


INSERT INTO `students_select_courses` (student_id, course_id) VALUES (5, 2);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (5, 3);
INSERT INTO `students_select_courses` (student_id, course_id) VALUES (5, 4);


# 4.查询的需求
# 4.1. 查询所有有选课的学生，选择了哪些课程
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
JOIN `courses` cs ON ssc.course_id = cs.id;


# 4.2. 查询所有的学生的选课情况
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id;

# 4.3. 哪些学生是没有选课
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
LEFT JOIN `courses` cs ON ssc.course_id = cs.id
WHERE cs.id IS NULL;

# 4.4. 查询哪些课程是没有被选择的
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
RIGHT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
RIGHT JOIN `courses` cs ON ssc.course_id = cs.id
WHERE stu.id IS NULL;;

# 4.5. 某一个学生选了哪些课程（why）
SELECT stu.id id, stu.name stuName, stu.age stuAge, cs.id csId, cs.name csName, cs.price csPrice
FROM `students` stu
LEFT JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
LEFT JOIN `courses` cs ON ssc.course_id = cs.id
WHERE stu.id = 2;
```

## 对象和数组类型

```sql
# 将联合查询到的数据转成对象（一对多）
SELECT 
	products.id id, products.title title, products.price price,
	JSON_OBJECT('id', brand.id, 'name', brand.name, 'website', brand.website) brand
FROM `products`
LEFT JOIN `brand` ON products.brand_id = brand.id;

# 将查询到的多条数据，组织成对象，放入到一个数组中(多对多)
SELECT 
	stu.id, stu.name, stu.age,
	JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name, 'price', cs.price))
FROM `students` stu
JOIN `students_select_courses` ssc ON stu.id = ssc.student_id
JOIN `courses` cs ON ssc.course_id = cs.id
GROUP BY stu.id;

SELECT * FROM products WHERE price > 6000;
```




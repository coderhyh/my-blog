// 导入我们的包
const path = require("path");
const archiver = require("archiver");
const fs = require("fs");
const node_ssh = require("node-ssh");
const ssh = new node_ssh();
const configs = require("./config");

const srcPath = path.resolve(__dirname, "../public");
// 为什么是"../public"?
// 因为我的项目设置的打包名称为public,而且从上面的目录树中可以了解到，public与deploy是一级。
// 所以我为了找到public文件夹，就得使用 "../public"


//压缩目录为 public.zip
console.log("开始压缩dist目录...");
startZip();

function startZip() {
  var archive = archiver("zip", {
    zlib: {
      level: 8, // 搜索路径深度
    },
  }).on("error", function (err) {
    throw err; //压缩过程中如果有错误则抛出
  });
  var output = fs
    .createWriteStream(__dirname + "/public.zip")
    .on("close", function (err) {
      /*压缩结束时会触发close事件，然后才能开始上传，
              否则会上传一个内容不全且无法使用的zip包*/
      if (err) {
        console.log("关闭archiver异常:", err);
        return;
      }
      console.log("已生成zip包");
      console.log("开始上传public.zip至远程机器...");
      uploadFile();
    });

  archive.pipe(output); //典型的node流用法
  archive.directory(srcPath, "/public"); //将srcPach路径对应的内容添加到zip包中/public路径
  archive.finalize();
};

// 上传文件到服务器
function uploadFile() {
  ssh
    .connect({
      host: configs.host,
      username: configs.username,
      password: configs.password,
      port: configs.port,
    })
    .then(function () {
      console.log(__dirname, configs.path);
      //上传网站的发布包至configs中配置的远程服务器的指定地址
      ssh
        .putFile(__dirname + "/public.zip", configs.path)
        .then(function (status) {
          console.log("上传文件成功");
          console.log("开始执行远端脚本");
          startRemoteShell(); //上传成功后触发远端脚本
        })
        .catch((err) => {
          console.log("文件传输异常:", err);
          process.exit(0);
        });
    })
    .catch((err) => {
      console.log("ssh连接失败:", err);
      process.exit(0);
    });
};

// 执行远程端部署脚本
// 具体远端部署脚本··· deploy.sh
function startRemoteShell() {
  // 在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
  ssh
    .execCommand("sh deploy.sh", {
      cwd: "/wwwroot/coderhyh.top",
    })
    .then(function (result) {
      console.log("远程STDOUT输出: " + result.stdout);
      console.log("远程STDERR输出: " + result.stderr);
      if (!result.stderr) {
        console.log("发布成功!");
        removeLocalFile();
        process.exit(0);
      }
    });
};

// 为了不占用本地空间，完成操作后删除本地的打包文件
function removeLocalFile() {
  fs.unlink(__dirname + "/public.zip", function (error) {
    if (error) {
      console.log(error);
      return false;
    }
    console.log("删除文件成功");
  });
};

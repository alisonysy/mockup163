## 模仿手机音乐APP页面
本项目为模仿网易云手机APP页面功能的个人项目，还处于开发中（正在完善歌单部分），目前已完成的功能：
### 首页展示最新歌曲
首页的“最新歌曲”部分根据在数据库中上传的最新时间显示
### 歌曲播放页面
点击“最新歌曲”里的歌曲，进入相应的歌曲播放页面，可进行：
1. 播放、暂停操作；
2. 查看并点击进度条跳转到音乐对应部分；
3. 查看滚动歌词

## 简易歌曲在线上传页面
模拟一个音乐APP在PC端的歌曲上传和管理页面。管理员能对音乐文件进行增删改查，点击选择文件或拖拽上传，上传成功后能编辑对应信息（歌曲、歌手、封面、歌词、是否高音质等），同时能查看保存了的音乐文件，并能再次编辑或删除。本项目是通过七牛云、LeanCloud数据库储存上传的音乐文件和相关信息。

**备注：** 本页面需要服务端运行，在本地搭建一个简易服务端：
1. npm i -g http-server
2. http-server -c-1
3. node server.js 8888
4. 再打开 https://alisonysy.github.io/mockup163/src/admin.html
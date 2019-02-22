## 简易歌曲在线上传页面
模拟一个音乐APP在PC端的歌曲上传和管理页面。管理员能对音乐文件进行增删改查，点击选择文件或拖拽上传，上传成功后能编辑对应信息，同时能查看保存了的音乐文件，并能再次编辑或删除。本项目是通过七牛云、LeanCloud数据库储存上传的音乐文件和相关信息。

**备注：** 本页面需要服务端运行，在本地搭建一个简易服务端：
1. npm i -g http-server
2. http-server -c-1
3. node server.js 8888
4. 再打开 https://alisonysy.github.io/mockup163/src/admin.html
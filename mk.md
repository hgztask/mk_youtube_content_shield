# 油管内容屏蔽器(youtube_content_shield)

对油管大部分页面内容进行屏蔽处理，主要作用域视频列表和评论区区域。
评论或直播弹幕处鼠标移入可显示屏蔽按钮，点击可根据需求添加类型屏蔽。

安装本脚本优先拓展为脚本猫和篡改猴，其他不建议。

其中浏览器建议为谷歌浏览器(chrome)和微软的edge浏览器，其余浏览器可能存在兼容问题。不作考虑。

如遇到插件的脚本不执行

请尝试关闭插件或浏览器的开发者人员模式再开启并重启浏览器尝试，再不行，请下载

    奔跑中的奶酪版本的便携版本edge或chrome地址https://www.runningcheese.com/edge

## 规则管理

### 支持添加的规则类型

1. 标题的模糊和正则匹配
2. 用户名的模糊、精确和正则匹配
3. 用户id的精确匹配(用户标识名，@开头)
4. 用户频道id的精确匹配
5. 视频id的精确匹配(直播时的url中的id也是这个)

- 正则匹配规则为正则表达式，可前往[正则表达式测试网站进行测试](https://www.jyshare.com/front-end/854/)

### 还有个比较特殊的关联类型规则

1. 用户id关联用户名
2. 用户id关联频道id
3. 用户名关联频道id

- 可颠倒关联，比如用户id关联用户名，也可以作为用户名关联用户id

<hr/>

## 页面的处理

1. 可屏蔽首页中的推广广告(包括顶部大横幅广告)
2. 可屏蔽shorts视频列表(整个移除)
3. 可屏蔽直播首页中的顶部大横幅广告

## 输出信息

1. 一般输出屏蔽信息

## 检测状态

该选项卡一般不用管，仅用于测试

## 面板设置

1. 可查找当前打开主面板的快捷键
2. 可设置打开主面板的快捷键

## 开源地址

github https://github.com/hgztask/mk_youtube_content_shield

## 说明

1. 如果有什么问题，欢迎提issue或前往作者交流群或b站个人主页上反馈
2. 该如还有未补充的，待后续完善描述

## 关于作者

[传送门\(企鹅反馈群聊876295632\)](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632)
作者所建的反馈提意见交流群(如果你有更好的建议或者想法以及需求都可以来反馈)，得到作者回复相对比其他平台要快.

[传送门](https://space.bilibili.com/473239155/dynamic)作者b站，最快更新状态和内容以及追进，也方便反馈相关问题

[传送门](https://scriptcat.org/zh-CN/users/96219)作者脚本猫地址

## 赞助

- 如果您觉得本脚本对您有帮助，欢迎赞助作者，以支持脚本的更新和开发。

<img src="https://www.mikuchase.ltd/img/paymentCodeZFB.webp" width="300">
<img src="https://www.mikuchase.ltd/img/paymentCodeWX.webp" width="300">
<img src="https://www.mikuchase.ltd/img/paymentCodeQQ.webp" width="300">

添加 Quixel 所有物品的脚本

由于 quixel 即将被移除，所有物品均可免费获取。此脚本可自动将物品添加到您的账户（截至发稿时，共有物品）18874

注：本脚本仅在最新版 Chrome 浏览器中测试。

如何使用
复制下面的脚本 (run.js)

登录 https://quixel.com
转到 https://quixel.com/megascans/collections

打开 devtools (F12) -> 转到 “控制台 ”选项卡
粘贴脚本并按 Enter
会弹出一个确认执行的对话框，点击 “确定”。
坐下来等待

常见问题
出现 “Forbidden（禁止）”错误。(即使刷新后，整个页面也只显示 “Forbidden（禁止）”）。
API 添加速度过快，有可能达到了 API 的速度限制。(我的测试大约是在 10 页之后，所以 ~10k 条目）。
等待 ~10-20 分钟后再继续。请参阅 https://quixel.com.Common Fixes -> Restart script（修复 -> 重启脚本），然后继续执行。
脚本似乎暂停/挂起
可能是记录太多了。试着监控脚本，如果显示 “END PAGE X”，记下页码（以防需要重启），然后点击 devtools 中的“🚫”图标清除控制台。
请参见修复。常见修复 -> 重启脚本

出现 **UNABLE TO ADD ITEM** 错误
如果是这样，那么您的账户中已经有了该资产。 ( )user already owns specified asset at a higher or equal resolution.)用户已经以更高或相同的分辨率拥有指定资产。
出现无法找到身份验证令牌的错误。请重新登录
清除浏览器 cookie 并重新登录 quixel。尝试手动添加 1 件物品。如果成功，请参见继续执行。常见问题修复 -> 重启脚本


常见修复
重启脚本
注意脚本正在运行的页面
复制 scriptrun.js
将第一行的内容更新为（假设第 10 页被挂起）startPage = 0startPage = 10
更改日志
初始脚本启动
更新以清除日志，减少挂起的几率

[当前] 跳过添加已获取的项目。减少日志。在脚本完成后添加更多信息，以显示已购买物品的数量。由于现在会跳过已购买的物品，因此从技术上讲，你不需要指定 anymore.startPage

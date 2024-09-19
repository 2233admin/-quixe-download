用于从 quixel 添加所有项目的脚本
由于 quixel 正在被移除，因此所有项目都可以免费获取。此脚本用于自动执行将项目添加到帐户的过程（截至撰写本文时，项目总数）18874

注意：此脚本仅在最新版本的 Chrome 中进行了测试。

如何使用
从下面复制脚本 （run.js)
登录 https://quixel.com
前往 https://quixel.com/megascans/collections
打开 devtools （F12） -> 转到“控制台”选项卡
粘贴脚本并按 。Enter
应弹出一个确认执行的对话框，单击“确定”
坐下来等待
常见问题
收到 “Forbidden” 错误。（即使刷新后，整个页面也只显示 “禁止”）
API 添加速度过快，您有可能达到 API 的速率限制。（我的测试大约在 10 页之后，所以 ~10k 项）。
等待 ~10-20 分钟后，然后继续。请参阅在加载 https://quixel.com 后继续执行。Common Fixes -> Restart script
脚本似乎已暂停/挂起
这可能是太多的伐木。尝试监控脚本，如果它显示 “END PAGE X”，记下页码（以防需要重新启动），然后单击 devtools 中的 “🚫” 图标清除控制台。
请参见修复。Common Fixes -> Restart script
收到错误**UNABLE TO ADD ITEM**
应该有 所示的错误消息。如果是 ，则它已在您的账户中。( )user already owns specified asset at a higher or equal resolution
收到错误cannot find authentication token. Please login again
清除浏览器 Cookie 并重新登录 quixel。尝试简单地手动添加 1 项。如果成功，请参阅 继续执行。Common Fixes -> Restart script
常见修复
重启脚本
记下它正在运行的页面
复制脚本run.js
将第一行的 更新为 （假设第 10 页已挂起）startPage = 0startPage = 10
更改日志
初始脚本启动
更新以清除日志以减少挂起的可能性
[当前]跳过添加已获取的项目。减少日志。在脚本完成后添加了更多信息以显示购买的物品数量。由于现在跳过了购买的项目，因此从技术上讲，您不再需要指定 。




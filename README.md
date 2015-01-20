# 海龜湯網頁版

起源
---
PTT Turtlesoup版

喝海龜湯是一種文化，更是一種聯想、邏輯與推理能力的訓練。

內容不僅限於恐怖或懸疑，亦有溫馨與歡樂的劇情。

趕快邀請親朋好友一起來喝海龜湯吧。


特色
---
* 在家能喝 出外也能喝 (支援PC與手機瀏覽)
* 湯主可藉由管理資訊面板 整理提示以及情報
* 湯主與玩家以聊天室的方式互動 加快遊戲進行速度

安裝
---

1) 安裝所需套件

    npm install

2) 修改app.js中的連接埠

3) 至Facebook開發者專區[註冊App](https://developers.facebook.com/apps/)

4) 將取得的app_id取代www/index.html中的default值

    FB.init({
		appId: "your-fb-app-id", // 填入app_id

5) 啟動

    node app.js

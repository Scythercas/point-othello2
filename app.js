const express = require("express");
const app  = express();
app.use(express.static("./public"));
const PORT = 3000;

// ルーティングの設定
app.get("/", (req, res)=>{
    res.sendFile("index.html");
    console.log("/ へアクセスがありました");
});

// HTTPサーバを起動する
app.listen(process.env.PORT || PORT, console.log(`listening at http://localhost:${PORT}`));
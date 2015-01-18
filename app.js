//湯資料
var soup = [
	{
		"id": "1",
		"title": "歡樂聊天區",
		"hostman": "Han-lin Pai",
		"previous": "沒事多喝湯，喝湯助健康。XDDD\n<font color='red'>註：輸入 :help 可顯示功能說明。</font>",
		"host_inf": "",
		"guest_inf": "",
		"answer": "",
		"progress": 0,
		"online": "0"
	}
]

//聊天紀錄
var chatroom = []

//在線玩家
var online_user = []

var express = require("express"),
	app = express(),
	http = require("http"),
	server = http.createServer(app),
	fs = require("fs"),
	__dirname = "www",
	io = require("socket.io").listen(server, {
		log: false
	})

server.listen((process.env.PORT || 5000))

app.configure(function () {
	app.use("/imgs", express.static(__dirname + "/imgs"))
	app.use("/js", express.static(__dirname + "/js"))
	app.use("/css", express.static(__dirname + "/css"))

	app.get(["/", "/create", "/soup/:id"], function (req, res) {
		fs.readFile(__dirname + "/index.html", function (err, data) {
			if (err) {
				res.writeHead(500)
				return res.end("Error loading $[1]", "index.html")
			}
			res.writeHead(200)
			res.end(data)
		})
	})
})

io.sockets.on("connection", function (socket) {
	//使用者離線
	socket.on('disconnect', function () {
		for(var i=0;i<online_user.length;i++) {
			var val = online_user[i]
			if(val.socket_id == socket.id)online_user.splice(i, 1)
		}
	})
	//使用者登入
	socket.on("user_login", function (data) {
		//記錄使用者socket_id及資料
		online_user.push({
			socket_id: socket.id,
			username: data.username,
			where: data.where,
			soup_id: data.soup_id
		})
		// console.log(online_user)
		console.log("** Online User **")
		for(var i=0;i<online_user.length;i++) {
			var user = online_user[i]
			console.log(user.username+"@"+user.where+"#"+user.soup_id)
		}

		//送出湯列表
		socket.emit("res_soup_list", { list: soup })
	})

	//當前網頁有哪些使用者
	socket.on("visitor", function (data) {
		var visitor = []
		for(var i=0;i<online_user.length;i++) {
			var val = online_user[i]
			//在大廳 顯示所有玩家
			if(data.where == "lobby") {
				visitor.push(val.username)
			}
			//在湯裡 顯示該湯玩家
			else if(val.where == data.where && val.soup_id == data.soup_id) {
				visitor.push(val.username)
			}
			if(i == online_user.length - 1) {
				if(data.where == "lobby") {
					//移除重複玩家
					var uniq = []
					for(var i=0;i<visitor.length;i++) {
						var el = visitor[i]
						if(uniq.length == 0) {
							uniq.push(el)
						}
						else {
							for(var j=0;j<uniq.length;j++) {
								if(el == uniq[j])break
								if(j == uniq.length - 1)uniq.push(el)
							}
						}
						if(i == visitor.length - 1)socket.emit("visitor", { visitor: uniq })
					}
				}
				else
					socket.emit("visitor", { visitor: visitor })
			}
		}
	})

	//將談話加入陣列
	socket.on("user_chat", function (data) {
		for(var i=0;i<chatroom.length;i++) {
			var val = chatroom[i]

			if(val.id == data.id) {
				chatroom[i].commu.push({ user: data.user, says: data.says, time: data.time })
				return null
			}

			if(i == chatroom.length - 1) {
				chatroom.push({ id: data.id, commu: [] })
			}
		}
		// console.log("["+data.id+"] "+data.user+" says '"+data.says+"'.")
	})

	//更新湯列表
	socket.on("req_soup_list", function (data) {
		socket.emit("res_soup_list", { list: soup })
	})

	//更新交談紀錄
	socket.on("req_chat_history", function (data) {
		//如果紀錄為空 則建立
		if(chatroom.length == 0) {
			chatroom.push({ id: data.id, commu: [] })
		}
		for(var i=0;i<chatroom.length;i++) {
			var val = chatroom[i]
			if(val.id == data.id) {
				socket.emit("res_chat_history", { id: val.id, commu: val.commu })
				break
			}
		}
	})

	//更新湯資料
	socket.on("req_soup_data", function (data) {
		for(var i=0;i<soup.length;i++) {
			var val = soup[i]
			if(val.id == data.id) {
				socket.emit("res_soup_data", { soup: val })
				break
			}
		}
	})

	//儲存湯資料
	socket.on("sav_soup_data", function (data) {
		
		if(data.soup.id == -1) {
			data.soup.id = new Date().getTime().toString()
			soup.push(data.soup)
			console.log("Success to create new soup '"+data.soup.id+"-"+data.soup.title+"'.")
		}
		else {
			for(var i=0;i<soup.length;i++) {
				var val = soup[i]
				if(val.id == data.soup.id && val.hostman == data.soup.hostman) {
					soup[i] = data.soup
					break
					console.log("Success to save soup '"+data.soup.id+"-"+data.soup.title+"'.")
				}
			}
		}
	})
})
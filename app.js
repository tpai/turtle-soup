//湯資料
var soup = [
	{
		"id": "1",
		"title": "歡樂聊天區",
		"hostman": "Han-lin Pai",
		"previous": "今天也要好好喝湯喔 (啾咪",
		"host_inf": "",
		"guest_inf": "",
		"answer": "",
		"online": "0"
	}
]

//聊天紀錄
var chatroom = []

var express = require("express"),
	app = express(),
	http = require("http"),
	server = http.createServer(app),
	fs = require("fs"),
	__dirname = "www",
	io = require("socket.io").listen(server, {
		log: false
	})

server.listen(500)

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
	socket.on("disconnect", function () {
		// console.log("Client disconnected!")
	})

	socket.on("user_login", function (data) {
		console.log("User "+data.username+" login!")

		socket.emit("res_soup_list", { list: soup })
		// console.log("Emit soup list to client!")
	})

	//將談話加入陣列
	socket.on("user_chat", function (data) {
		for(var i=0;i<chatroom.length;i++) {
			var val = chatroom[i]

			if(val.id == data.id) {
				chatroom[i].commu.push({ user: data.user, says: data.says })
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
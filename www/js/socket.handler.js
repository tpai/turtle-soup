var hostname = window.location.host
var path = location.pathname.split("/")
var where = (path[1]=="")?"lobby":path[1]
var soup_id = (path[2]==undefined)?-1:path[2]

var socket = io.connect(hostname, {
	"force new connection": true
});

socket.on("connect", function () {
	console.log("Connected to server!")
})

socket.on("disconnect", function () {
	console.log("Lost connection!")
})

//將湯資料寫入表格
var write_soup_data = function(row, stage) { //0:煮湯 1:主持 2:玩家
	if(stage == 0) {
		$("#title").html("<input type='text' value='' />")
		$("#online").html("<input type='radio' name='trigger' value='0' checked='true'> 燉煮 <input type='radio' name='trigger' value='1'> 保溫 <input type='radio' name='trigger' value='2'> 完食")
		$("#progress").html("<input type='text' value='0' style='width: 50px;' /> %")
		$("#who").html("<input type='hidden' id='hostman' value='"+row.hostman+"' />"+row.hostman)
		$("#previous").html("<textarea></textarea>")
		$("#host_inf").html("<textarea></textarea>")
		$("#guest_inf").html("<textarea></textarea>")
		$("#answer").html("<textarea></textarea>")
	}
	else if(stage == 1) {
		$("#title").html("<input type='text' value='"+row.title+"' />")
		$("#online").html("<input type='radio' name='trigger' value='0'> 燉煮 <input type='radio' name='trigger' value='1'> 保溫 <input type='radio' name='trigger' value='2'> 完食")
		$("#progress").html("<input type='text' value='"+row.progress+"' style='width: 50px;' /> %")
		$("#who").html("<input type='hidden' id='hostman' value='"+row.hostman+"' />"+row.hostman)
		$("input[name='trigger'][value='"+row.online+"']").prop("checked", "true")
		$("#previous").html("<textarea>"+row.previous+"</textarea>")
		$("#host_inf").html("<textarea>"+row.host_inf+"</textarea>")
		$("#guest_inf").html("<textarea>"+row.guest_inf+"</textarea>")
		$("#answer").html("<textarea>"+row.answer+"</textarea>")
	}
	else if(stage == 2) {
		$("#title").text(row.title)
		$("#online").text((row.online == "0")?"燉煮":(row.online == "1")?"保溫":(row.online == "2")?"完食":"Error")
		$("#progress").html("<div class='progress'><div class='bar bar-warning' style='width: "+row.progress+"%;'></div></div>")
		$("#who").text(row.hostman)
		$("#previous").html(nl2br(row.previous))
		$("#host_inf").html(nl2br(row.host_inf))
		$("#guest_inf").html(nl2br(row.guest_inf))
		$("#answer").html(nl2br(row.answer))
		$("#edit").parent().remove()
	}
};

//更新湯列表
socket.on("res_soup_list", function (data) {

	sortJsonArrayByProp(data.list, "online")

	//湯表標頭
	var html = "<tr><td class='label_style'>湯題</td><td class='label_style'>主持人</td><td class='label_style'>進度</td></tr>"

	$.each(data.list, function(index, row) {
		//煲湯頁
		if(where.search("create") != -1) {
			FB.api("/me", function (res) {
				write_soup_data({ hostman: res.name }, 0)
			})

			$("#main").show()

			console.log("Append create form to table.")
			return null
		}
		//喝湯頁
		else if(where.search("soup") != -1) {

			if(soup_id == row.id) {

				FB.api("/me", function (res) {
					//主持人
					if(res.name == row.hostman) {
						write_soup_data(row, 1)
					}
					//玩家
					else {
						write_soup_data(row, 2)	
						//定時請求湯資料
						setInterval(function() {
							socket.emit("req_soup_data", { id: row.id })
						}, 1000)
					}
					//定時請求聊天紀錄與在線使用者
					setInterval(function() {
						socket.emit("req_chat_history", { id: row.id })
						socket.emit("visitor", { where: where, soup_id: soup_id })
					}, 1000)
				})
				
				//變更網頁標題
				$("title").text(row.title)
				$("#main").show()

				console.log("Append soup detail to table.")
				return null
			}
		}
		//湯表頁
		else {
			var online
			if(row.online == "0")online = "green"
			else if(row.online == "1")online = "red"
			else if(row.online == "2")online = "gray"

			html += "<tr><td class='soup'><a href='/soup/"+row.id+"' style='color: "+online+"'>"+row.title+"</a></td><td class='hostman'>"+row.hostman+"</td><td><div class='progress'><div class='bar bar-warning' style='width: "+row.progress+"%;'></div></div></td></tr>"

			if(index == data.list.length - 1) {
				//寫入湯表
				$("#soup_list").html(html)
				$("#list").show()
				//定時請求新湯表與在線使用者
				setTimeout(function() {
					socket.emit("req_soup_list", {})
					socket.emit("visitor", { where: where, soup_id: soup_id })
				}, 3000)
			}
		}
	})
})

var intv_id //for highlight
//更新交談紀錄
socket.on("res_chat_history", function (data) {
	var html = ""
	$.each(data.commu, function (key, val) {
		html = "<tr><td><span name='"+val.user+"' class='quick_name'>"+val.user+"</span>："+val.says+"</td><td style='text-align: right; vertical-align: top;'><a name='"+(key+1)+"' class='line_number'>:"+(key+1)+"</a><span class='timebox'>《"+val.time+"》</span></td></tr>" + html
		if(key == data.commu.length - 1) {
			//更新至表格
			$("#commu").html(html)
			//快捷輸入行號
			$(".line_number")
				.css("cursor", "pointer")
				.click(function() {
					$("#says").prop("value", $("#says").prop("value")+" "+$(this).text()+" ").focus()
				})

			//綁定高亮事件
			$(".anchor").click(function() {
				if(intv_id != undefined)clearInterval(intv_id)

				var obj = $(this)
				intv_id = setInterval(function() {
					highlight_tag_line($(obj).text().replace(":", ""))
				}, 1000)
			})

			//主持人高亮
			$("span[name='"+$("#who").text()+"']").css("font-weight", "bold").css("color", "blue")
		}
	})
})
//更新湯資料
socket.on("res_soup_data", function (data) {
	FB.api("/me", function (res) {
		if(res.name == data.soup.hostman) {
			write_soup_data(data.soup, 1)
		}
		else {
			write_soup_data(data.soup, 2)
		}
	})
})
//更新在線使用者
socket.on("visitor", function (data) {
	var visitor = data.visitor
	var html = "<span class='label_style'>線上湯友：</span>"
	$.each(visitor, function(key, val) {
		html += "<span class='tag_name quick_name'>"+val+"</span> "
	})
	$("#"+where+"_visitor").html(html)

	//快捷輸入姓名
	$(".quick_name")
		.css("cursor", "pointer")
		.click(function() {
			var qname = $(this).text().split("：")[0]
			$("#says").prop("value", $("#says").prop("value")+"["+qname+"] ").focus()
		})
})
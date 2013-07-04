//儲存湯資訊
$("#save").click(function() {
	$(this).prop("disabled", "disabled")

	var id = (soup_id === undefined)?-1:soup_id
	var title = $("#title input").prop("value")
	var online = $("input[name='trigger']:checked").val()
	var progress = $("#progress input").prop("value")
	var prev = $("#previous textarea").val()
	var h_inf = $("#host_inf textarea").val()
	var g_inf = $("#guest_inf textarea").val()
	var ans = $("#answer textarea").val()

	var data = {
		id: id,
		title: title,
		online: online,
		progress: progress,
		previous: prev,
		host_inf: h_inf,
		guest_inf: g_inf,
		answer: ans
	}
	// console.log(data)
	console.log("Save soup data.")

	FB.api("/me", function (res) {
		data["hostman"] = res.name
		socket.emit("sav_soup_data", { soup: data })

		if(id == -1) {
			location.href = "/"
		}
		else {
			$("#save").prop("disabled", "")
		}
	})
})

//開關資訊面板
$("#show_inf_table").click(function() {
	$(".inf_table").toggle()
})

//添加對話內容至表格
var add_to_commu_table = function() {
	var says = $("#says").prop("value")
	if(says != "") {

		//新增留言歷史
		var arr = JSON.parse(localStorage["says_history"])
		arr.unshift(says)
		localStorage["says_history"] = JSON.stringify(arr)

		//過濾不法字元 同時進行parse
		says = content_parser(strip_tags(says, ""))

		var hostman = $("#hostman").prop("value")
		var user = $("#username").text()

		socket.emit("user_chat", {
			id: soup_id,
			user: user,
			says: says
		})

		//添加對話內容至表格
		$("#commu").prepend("<tr><td>"+user+"："+says+"</td></tr>")

		$("#says").prop("value", "")

		// console.log("["+soup_id+"] "+user+" says '"+says+"'.")
	}
};

//送出對話
var history_index = -1
$("#send").click(add_to_commu_table)
$("#says").keyup(function(e) {
	if(e.which == 13) {
		history_index = -1
		add_to_commu_table()
		$("#highlight").hide()
	}
	else if(e.which == 38 || e.which == 40) {

		var arr = JSON.parse(localStorage["says_history"])

		switch(e.which) {
			case 38:
				//尚在對話歷史範圍內
				if(history_index < arr.length - 1)history_index++
				break
			case 40:
				//尚在對話歷史範圍內
				if(history_index > 0)history_index--
				break
		}

		//將歷史紀錄帶到輸入框
		$("#says").prop("value", arr[history_index])
	}
	
})
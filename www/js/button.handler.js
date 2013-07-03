//儲存湯資訊
$("#save").click(function() {
	$(this).prop("disabled", "disabled")

	var soup_id = (id === undefined)?-1:id
	var title = $("#title input").prop("value")
	var prev = $("#previous textarea").val()
	var h_inf = $("#host_inf textarea").val()
	var g_inf = $("#guest_inf textarea").val()
	var ans = $("#answer textarea").val()
	var online = $("input[name='trigger']:checked").val()

	var data = {
		id: soup_id,
		title: title,
		previous: prev,
		host_inf: h_inf,
		guest_inf: g_inf,
		answer: ans,
		online: online
	}
	// console.log(data)
	console.log("Save soup data.")

	FB.api("/me", function (res) {
		data["hostman"] = res.name
		socket.emit("sav_soup_data", { soup: data })

		if(soup_id == -1) {
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
		var hostman = $("#hostman").prop("value")
		var user = $("#username").text()

		socket.emit("user_chat", {
			id: id,
			user: user,
			says: says
		})

		//添加對話內容至表格
		$("#commu").prepend("<tr><td><span name='"+user+"'>"+user+"</span>："+says+"</td></tr>")

		$("#says").prop("value", "")
		console.log("["+id+"] "+user+" says '"+says+"'.")
	}
	else {
		alert("請放心地跟湯主聊天 他不會把你吃掉啦 XD")
	}
};

//送出對話
$("#send").click(add_to_commu_table)
$("#says").keyup(function(e) { 	if(e.which == 13)add_to_commu_table() })
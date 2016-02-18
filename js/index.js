window.onload = function (){
	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');

	//画横线
	ctx.beginPath();
	var movey=20.5;
	for (var i = 0; i < 15; i++) {
		ctx.moveTo(20.5,movey);
		ctx.lineTo(580,movey);
		movey+=40;
		ctx.stroke();
	};
	var movex=20.5;
	for (var i = 0; i < 15; i++) {
		ctx.moveTo(movex,20.5);
		ctx.lineTo(movex,580);
		movex+=40;
		ctx.stroke();
	};
	//左上角黑点
	ctx.moveTo(140,140);
	ctx.beginPath();
	ctx.arc(140,140,3,0,Math.PI*2);
	ctx.fill();
	//右上角黑点
	ctx.moveTo(460,140);
	ctx.beginPath();
	ctx.arc(460,140,3,0,Math.PI*2);
	ctx.fill();
	//左下角黑点
	ctx.moveTo(140,460);
	ctx.beginPath();
	ctx.arc(140,460,3,0,Math.PI*2);
	ctx.fill();
	//右下角黑点
	ctx.moveTo(460,460);
	ctx.beginPath();
	ctx.arc(460,460,3,0,Math.PI*2);
	ctx.fill();
	//正中间黑点
	ctx.moveTo(300,300);
	ctx.beginPath();
	ctx.arc(300,300,3,0,Math.PI*2);
	ctx.fill();
	
}
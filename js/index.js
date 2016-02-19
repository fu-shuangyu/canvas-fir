window.onload = function (){
	var canvas = document.querySelector('#canvas');
	var canvas1 = document.querySelector('#canvas1');
	var sucai = document.querySelector('#sucai');
	// var hiuqi = document.querySelector('#hiuqi');
	var ctx = canvas.getContext('2d');
	var ctx1 = canvas.getContext('2d');
	var huaqipan = function(){
		//画横线
		ctx.clearRect(0,0,600,600);
		var movey=20.5;
		for (var i = 0; i < 15; i++) {
			ctx.beginPath();
			var lingrad = ctx.createLinearGradient(20.5,20.5,580,20.5);
		    lingrad.addColorStop(0.5,'red');
		    lingrad.addColorStop(1,'blue');
			ctx.strokeStyle = lingrad;
			ctx.moveTo(20.5,movey);
			ctx.lineTo(580,movey);
			movey+=40;
			ctx.stroke();
		};
		var movex=20.5;
		for (var i = 0; i < 15; i++) {
			var lingrad1 = ctx.createLinearGradient(20.5,20.5,580,580);
		    lingrad1.addColorStop(0.5,'orange');
		    lingrad1.addColorStop(1,'purple');
			ctx.strokeStyle = lingrad1;			
			ctx.beginPath();
			ctx.moveTo(movex,20);
			ctx.lineTo(movex,580);
			movex+=40;
			ctx.stroke();
		};
		

		//四个角上的点
		var z=[140.5,460.5];
		for (var i = 0; i < z.length; i++) {
			for (var j = 0; j < z.length; j++) {
				ctx.beginPath();
				ctx.arc(z[i],z[j],3,0,Math.PI*2);
				ctx.fill();
			};
		};
		//正中间黑点
		ctx.moveTo(300.5,300.5);
		ctx.beginPath();
		ctx.arc(300.5,300.5,3,0,Math.PI*2);
		ctx.fill();
	}
	huaqipan();
	


	
	/*
		x:number  落子的x坐标
		y:number  落子的y坐标
		color：记录黑子白子
	*/

	//用图片裁出棋子
	var luozi = function(x,y,color){
		var qizix = x*40+2.5;
		var qiziy = y*40+2.5;
		if(color){
			ctx.drawImage(sucai,0,0,78,79,qizix,qiziy,36,36);
		}else{
			ctx.drawImage(sucai,79,0,78,78,qizix,qiziy,36,36);
		}
	}
	//用画布画下棋子
	var luozi2 = function(x,y,color){
		var qizix = x*40+20.5;
		var qiziy = y*40+20.5;
		var black = ctx1.createRadialGradient(qizix,qiziy,3,qizix,qiziy,18);
		black.addColorStop(0.1,'#333');
		black.addColorStop(1,'black');
		var white = ctx1.createRadialGradient(qizix,qiziy,3,qizix,qiziy,18);
		white.addColorStop(0.05,'#fff');
		white.addColorStop(1,'#ccc');

		ctx1.fillStyle=color?black:white;
		ctx1.beginPath();
		ctx1.arc(qizix,qiziy,20,0,Math.PI*2);
		ctx1.fill();
	}

	//	flag：记录谁该落子
	var flag = true;
	flag = localStorage.flag?false:true;
	var qizi = {};
	canvas1.onclick = function(e){
		var ev = window.event||e;
		var x = Math.round((ev.offsetX-20.5)/40);
		var y = Math.round((ev.offsetY-20.5)/40);
		if(qizi[x+'_'+y]){return;}
		luozi(x,y,flag);		
		qizi[x+'_'+y] = flag?'black':'white';
		if(flag){
			if(panduan(x,y,'black')){
				alert('黑棋赢');
				if(confirm('是否再来一局')){
					localStorage.clear();
					qizi = {};
					huaqipan();
					kaiguan=true;
					return;
				}else{
					canvas1.onclick = null;
				}
			}
		}else{
			if(panduan(x,y,'white')){
				alert('白棋赢');
				if(confirm('是否再来一局')){
					localStorage.clear();
					qizi = {};
					huaqipan();
					kaiguan = true;
					return;
				}else{
					canvas1.onclick = null;
				}
			}
		}
		flag = !flag;
		localStorage.data = JSON.stringify(qizi);
		if(!flag){
			localStorage.flag=1;
		}else{
			localStorage.removeItem('flag');
		}
		
	}
	//如果本地存储中有数据，读取这些数据到页面中
	if(localStorage.data){
		qizi = JSON.parse(localStorage.data);
		for(var i in qizi){
			var x = i.split('_')[0];
			var y = i.split('_')[1];
			luozi(x,y,qizi[i]=='black'?true:false);
		}
	}
	
	//判断谁嬴谁输
	var filter = function(color){
		var r = {};
		for(var i in qizi){
			if(qizi[i]==color){
				r[i]=qizi[i];
			}
		}
		return r;
	}
	var xy2id = function(x,y){
		return x+'_'+y;
	}
	var panduan = function(x,y,color){
		//判断color是黑子还是白子
		var shuju = filter(color);
		var tx,ty,hang=1,shu = 1,zuoxie = 1,youxie=1;
		tx=x;ty=y;while(shuju[xy2id(tx-1,ty)]){tx--;hang++}
		tx=x;ty=y;while(shuju[xy2id(tx+1,ty)]){tx++;hang++}
		if(hang>=5){
			return true;
		}
		tx=x;ty=y;while(shuju[xy2id(tx,ty-1)]){ty--;shu++}
		tx=x;ty=y;while(shuju[xy2id(tx,ty+1)]){ty++;shu++}
		if(shu>=5){
			return true;
		}
		tx=x;ty=y;while(shuju[xy2id(tx-1,ty-1)]){tx--;ty--;zuoxie++}
		tx=x;ty=y;while(shuju[xy2id(tx+1,ty+1)]){tx++;ty++;zuoxie++}
		if(zuoxie>=5){
			return true;
		}
		tx=x;ty=y;while(shuju[xy2id(tx+1,ty-1)]){tx++;ty--;youxie++}
		tx=x;ty=y;while(shuju[xy2id(tx-1,ty+1)]){tx--;ty++;youxie++}
		if(youxie>=5){
			return true;
		}
	}
	canvas.ondblclick = function(){
		ev.stopPropagation();
	}
	canvas1.ondblclick = function(){
		ev.stopPropagation();
	}
	document.ondblclick = function(){
		localStorage.clear();
		location.reload();
	}

}



/*	var lingrad = ctx.createLinearGradient(20,300,580,300);
    lingrad.addColorStop(0,'red');
    lingrad.addColorStop(0.2,'orange');
    lingrad.addColorStop(0.4,'yellow');
    lingrad.addColorStop(0.6,'green');
    lingrad.addColorStop(0.8,'cyan');
    lingrad.addColorStop(0.9,'blue');
    lingrad.addColorStop(1,'purple');
    ctx.strokeStyle = lingrad;
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';

	//线性渐变也可以应用在图形上。
	ctx.fillStyle=lingrad;
	ctx.fillRect(0,0,600,100);

	ctx.beginPath();
	ctx.moveTo(20.5,300.5);
	ctx.lineTo(580.5,300.5);
	ctx.stroke();*/
	/*//左上角黑点
	ctx.fillStyle='#000';
	ctx.moveTo(140.5,140.5);
	ctx.beginPath();
	ctx.arc(140.5,140.5,3,0,Math.PI*2);
	ctx.fill();
	//右上角黑点
	ctx.moveTo(460.5,140.5);
	ctx.beginPath();
	ctx.arc(460.5,140.5,3,0,Math.PI*2);
	ctx.fill();
	//左下角黑点
	ctx.moveTo(140.5,460.5);
	ctx.beginPath();
	ctx.arc(140.5,460.5,3,0,Math.PI*2);
	ctx.fill();
	//右下角黑点
	ctx.moveTo(460.5,460.5);
	ctx.beginPath();
	ctx.arc(460.5,460.5,3,0,Math.PI*2);
	ctx.fill();*/

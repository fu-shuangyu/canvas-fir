window.onload = function (){
	var canvas = document.querySelector('#canvas');
	var canvas1 = document.querySelector('#canvas1');
	// var canvas2 = document.querySelector('#canvas2');
	var sucai = document.querySelector('#sucai');
	// var hiuqi = document.querySelector('#hiuqi');
	var ctx = canvas.getContext('2d');
	var ctx1 = canvas1.getContext('2d');
	// var ctx2 = canvas2.getContext('2d');
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
					flag=true;
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
					flag = true;
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
	sucai.ondblclick = function(){
		ev.stopPropagation();
	}
	var cw = document.documentElement.clientWidth;
	var ch = document.documentElement.clientHeight;
	var bgi = document.querySelector('.dbgimg');
	bgi.style.cssText = 'height:'+ch+'px;width:'+cw+'px';
	window.onresize= function(){
		var cw = document.documentElement.clientWidth;
		var ch = document.documentElement.clientHeight;
		var bgi = document.querySelector('.dbgimg');
		bgi.style.cssText = 'height:'+ch+'px;width:'+cw+'px';
	}


	var star = document.querySelector('.star');
	var restar = document.querySelector('.restar');
	var bg = document.querySelector('.bg');
	star.onclick = function(){
		canvas.style.display = 'block';
		restar.style.display = 'block';
		star.style.display = 'block';
		canvas1.style.display = 'block';
		bg.style.display = 'block';
		star.style.display = 'none';
	}
	var btn1 = document.getElementsByClassName('restar')[0];
	btn1.onclick = function(){
		localStorage.clear();
		location.reload();
	}

	/*//保存页面作为PNG图片
	var link = document.createElement('a');
	link.innerHTML = 'download image';
	link.style.cssText = 'position:absolute;color:#fff;background:#ff6700;'
	link.addEventListener('click', function(ev) {
	    link.href = canvas.toDataURL();
	    link.download = "mypainting.png";
	}, false);

	document.body.appendChild(link);*/



  /* //钟表
	var drawClock = function(){
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		ctx2.clearRect(0,0,200,200);
		//保存一个干净的画布状态
		ctx2.save();
		//移动画布原点到中心
		ctx2.translate(100,100);
		//表盘最外的圆盘
		ctx2.save();
		ctx2.shadowoffsetX = 0;
		ctx2.shadowoffsetY = 0;
		ctx2.shadowBlur = 10;
		ctx2.shadowColor = 'rgba(0,0,0,1)';
		ctx2.beginPath();
		ctx2.strokeStyle = '#2af';
		ctx2.lineWidth = 6;
		ctx2.arc(0,0,90,0,Math.PI*2);
		ctx2.stroke();
		ctx2.restore();


		//用循环表盘针
		ctx2.save();
		ctx2.beginPath();
		ctx2.strokeStyle = '#333';
		ctx2.lineWidth = 5;
		//花了表盘的内表盘
		ctx2.arc(0,0,60,0,Math.PI*2);
		ctx2.stroke();
		ctx2.lineWidth = 4;
		ctx2.lineCap = 'round';
		for (var i = 1; i < 61; i++) {
			ctx2.rotate(Math.PI/30);
			ctx2.beginPath();
			if(i%5 == 0){
				ctx2.lineWidth = 4;
				ctx2.moveTo(48,0);
			}else{
				ctx2.lineWidth = 2;
				ctx2.moveTo(55,0);
			}
			ctx2.lineTo(60,0);
			ctx2.stroke();
		};

		ctx2.restore();

		//时钟时针
		ctx2.save();
		ctx2.rotate((360*(h*60*60+m*60+s)/43200)/180*Math.PI);
		ctx2.beginPath();
		ctx2.lineWidth = 12;
		ctx2.moveTo(0,20);ctx.lineCap = 'round';
		ctx2.lineTo(0,-100);
		ctx2.stroke();
		ctx2.restore();

		//时钟分针
		ctx2.save();
		
		ctx2.rotate((360*(m*60+s)/3600)/180*Math.PI);

		ctx2.beginPath();
		ctx2.strokeStyle = '#000';
		ctx2.lineWidth = 8;
		ctx2.lineCap = 'round';
		ctx2.moveTo(0,20);
		ctx2.lineTo(0,-160);
		ctx2.stroke();
		ctx2.restore();


		
		//表盘秒针
		ctx2.save();
		// ctx.rotate(x);
		ctx2.rotate(Math.PI/30*s);

		ctx2.beginPath();
		ctx2.strokeStyle = '#f00';
		ctx2.lineWidth = 8;
		ctx2.lineCap = 'round';
		ctx2.moveTo(0,20);
		ctx2.lineTo(0,-150);
		ctx2.stroke();
		ctx2.moveTo(0,-150);
		ctx2.fillStyle = '#f00';
		ctx2.arc(0,-100,12,0,Math.PI*2);
		ctx2.fill();
		ctx2.save();
		ctx2.beginPath();
		ctx2.fillStyle = '#fff';
		ctx2.arc(0,-100,9,0,Math.PI*2);
		ctx2.fill();
		ctx2.restore();
		//时钟原点嵌套的两个圆
		ctx2.save();
		ctx2.beginPath();
		ctx2.fillStyle = 'red';
		ctx2.arc(0,0,10,0,Math.PI*2);
		ctx2.fill();
		ctx2.restore();
		ctx2.save();
		ctx2.restore();
		ctx2.beginPath();
		ctx2.fillStyle = '#535353';
		ctx2.arc(0,0,5,0,Math.PI*2);
		ctx2.fill();
	    ctx2.restore();
		

	//复原干净的画布
		ctx2.restore();
		requestAnimationFrame(drawClock);
	}
   //复原一开始保存的干净的画布状态
   ctx2.restore();
   // drawClock();
   requestAnimationFrame(drawClock);*/






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

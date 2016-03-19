window.onload = function (){
	var canvas = document.querySelector('#canvas');
	var canvas1 = document.querySelector('#canvas1');
	// var canvas2 = document.querySelector('#canvas2');
	var sucai = document.querySelector('#sucai');
	// var hiuqi = document.querySelector('#hiuqi');
	var ctx = canvas.getContext('2d');
	var ctx1 = canvas1.getContext('2d');
	var star = document.querySelector('.star');
		var restar = document.querySelector('.restar');
		var bg = document.querySelector('.bg');
	var btn1 = document.getElementsByClassName('restar')[0];

	var _xx = 22;
	var _yy = 6.5;
	var _zz = 314;
	var W = document.documentElement.clientWidth;
	var z = [ 3*_xx + _yy, 11*_xx + _yy];
	var _r = 3;
	var _aa = 320;
	var _qizibanjing  = 20;

	if(W >= 768){
	    canvas.width = 600;
	    canvas.height = 600;
	    _xx = 40;
	    _yy = 20.5;
	    _zz = 580;
	    z = [140.5,460.5];
	    _r = 3;
	    _aa = 600;
	    _qizibanjing  = 36;
	    canvas.addEventListener('click',handle);
		btn1.onclick = function(){
			localStorage.clear();
			location.reload();
		}
	}



	// var ctx2 = canvas2.getContext('2d');
	var huaqipan = function(){
		//画横线
		ctx.clearRect(0,0,600,600);
		var movey=_yy;
		for (var i = 0; i < 15; i++) {
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.moveTo(_yy,movey);
			ctx.lineTo(_zz,movey);
			movey+=_xx;
			ctx.stroke();
		};
		var movex=_yy;
		for (var i = 0; i < 15; i++) {
			ctx.strokeStyle = 'black';			
			ctx.beginPath();
			ctx.moveTo(movex,_yy);
			ctx.lineTo(movex,_zz);
			movex+=_xx;
			ctx.stroke();
		};
		

		//四个角上的点
		for (var i = 0; i < z.length; i++) {
			for (var j = 0; j < z.length; j++) {
				ctx.beginPath();
				ctx.arc(z[i],z[j],_r,0,Math.PI*2);
				ctx.fill();
			};
		};
		//正中间黑点
		ctx.moveTo(_aa/2+0.5,_aa/2+0.5);
		ctx.beginPath();
		ctx.arc(_aa/2+0.5,_aa/2+0.5,_r,0,Math.PI*2);
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
		var qizix = x*_xx+0.5;
		var qiziy = y*_xx+0.5;
		if(color=='black'){
			ctx.drawImage(sucai,0,0,78,79,qizix,qiziy,_qizibanjing,_qizibanjing);
		}else{
			ctx.drawImage(sucai,79,0,78,78,qizix,qiziy,_qizibanjing,_qizibanjing);
		}
	}
	//用画布画下棋子
	/*var luozi2 = function(x,y,color){
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
	}*/

	var kongbai = {};
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			kongbai[i+'_'+j] = true;
		}
	}
	//	flag：记录谁该落子
	var flag = true;
	flag = localStorage.flag?false:true;
	var qizi = {};
	var ai = function(){
		do{
			var x = Math.floor( Math.random()*15 );
			var y = Math.floor( Math.random()*15 );
		}while( qizi[ x+'_'+y ] );
		return {x:x,y:y};
	}
	var fangshouAI = function(){
		var max = -10000000;
		var xx = {};
		for( var i in kongbai){
			var pos = i;
			var x = panduan( Number(pos.split('_')[0]),Number(pos.split('_')[1]),'black' );
			if( x>max ){
				max = x;
				xx.x = pos.split('_')[0];
				xx.y = pos.split('_')[1];
			}
		}
		var max2 = -10000000;
		var yy = {};
		for( var i in kongbai){
			var pos = i;
			var x = panduan( Number(pos.split('_')[0]),Number(pos.split('_')[1]),'white' );
			if( x>max2 ){
				max2 = x;
				yy.x = pos.split('_')[0];
				yy.y = pos.split('_')[1];
			}
		}
		if( max2 > max ){
			return yy;
		}
		return xx;
	}
	function handle(e){
		var ev = window.event||e;
		//判断落子的x和y的值
		var x = Math.round((ev.offsetX-_yy)/_xx);
		var y = Math.round((ev.offsetY-_yy)/_xx);
		if(e.type == 'tap'){
			var x =  Math.round( (ev.position.x - canvas.offsetLeft - _yy)/_xx );
			var y =  Math.round( (ev.position.y - canvas.offsetTop - _yy)/_xx );
		}
		if(qizi[x+'_'+y]){return;}
		luozi(x,y,'black');		
		qizi[x+'_'+y] = 'black';
		delete kongbai[x+'_'+y];

		
		var pos = fangshouAI();
		luozi(pos.x,pos.y,'white');
		qizi[pos.x+'_'+pos.y] = 'white';
		delete kongbai[pos.x+'_'+pos.y];
		if( panduan(x,y,'black') >= 5 ){
			alert('黑棋赢');
			if(confirm('是否再来一局')){
			    localStorage.clear();
			    qizi = {};
			    huaqipan();
			    flag=true;
			    kongbai = {};
			    return;
			}else{
			    canvas1.onclick = null;
			}
		}


		if( panduan(Number(pos.x),Number(pos.y),'white') >= 5 ){
			alert('白棋赢');
			if(confirm('是否再来一局')){
			    localStorage.clear();
			    qizi = {};
			    huaqipan();
			    flag=true;
			    kongbai = {};
			    return;
			}else{
			    canvas1.onclick = null;
			}

		}
	}
	touch.on(canvas1,'tap',handle);

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
		tx=x;ty=y;while(shuju[xy2id(tx,ty-1)]){ty--;shu++}
		tx=x;ty=y;while(shuju[xy2id(tx,ty+1)]){ty++;shu++}
		tx=x;ty=y;while(shuju[xy2id(tx-1,ty-1)]){tx--;ty--;zuoxie++}
		tx=x;ty=y;while(shuju[xy2id(tx+1,ty+1)]){tx++;ty++;zuoxie++}
		tx=x;ty=y;while(shuju[xy2id(tx+1,ty-1)]){tx++;ty--;youxie++}
		tx=x;ty=y;while(shuju[xy2id(tx-1,ty+1)]){tx--;ty++;youxie++}
		return Math.max(hang,shu,zuoxie,youxie);
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


	
	function bl(){
		canvas.style.display = 'block';
		restar.style.display = 'block';
		canvas1.style.display = 'block';
		bg.style.display = 'block';
		star.style.display = 'none';		
	}
	touch.on(star,'tap',bl);
	
	touch.on(btn1,'tap',function(){
		localStorage.clear();
		location.reload();
	})

	/*//保存页面作为PNG图片
	var link = document.createElement('a');
	link.innerHTML = 'download image';
	link.style.cssText = 'position:absolute;color:#fff;background:#ff6700;'
	link.addEventListener('click', function(ev) {
	    link.href = canvas.toDataURL();
	    link.download = "mypainting.png";
	}, false);

	document.body.appendChild(link);*/

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

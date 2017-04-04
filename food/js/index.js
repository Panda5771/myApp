(function() {
	var oUls = document.getElementsByTagName('ul');
		var ulAry = utils.listToArray(oUls);
		var winHeight=utils.win('clientHeight');//可视屏幕的高度
		var oImgs=document.getElementsByTagName('img');
		var back=document.getElementById('back');
	//发送请求
	var data;
	var xhr = new XMLHttpRequest;
	xhr.open('get', 'data.txt', false);
	xhr.onreadystatechange = function() {
		if(this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
			data = utils.toJson(xhr.responseText);
			data && data.length?bindData():null;
		}
	};
	xhr.send(null);
	//绑定数据到页面中
	//每循环一次就创建一个li
	function bindData(){
		for(var i = 0; i < data.length; i++) {
		var cur = data[i];
		var oLi = document.createElement('li'),
			oa = document.createElement('a');
		oa.href = 'javascript:;';
		oa.innerHTML = '赞';
		oLi.appendChild(oa);
		var oImg = document.createElement('img');
		//给图片设置随机高度 200-350
		oImg.style.height=Math.round(Math.random()*150+200)+'px';
		oImg.setAttribute('data-real',cur['src']);
		oLi.appendChild(oImg);
		var oP = document.createElement('p');
		oP.className='title';
		oP.innerHTML = cur['title'];
		oLi.appendChild(oP);
		//每个li放进ul之前都要进行判断,哪个ul最短,就把这个li放到哪个ul中

		ulAry.sort(function(a, b) {// 从小到大排序
			return a.offsetHeight - b.offsetHeight;
		});
		ulAry[0].appendChild(oLi);//把li放到最短的那个ul中
	}
	}
	//延迟加载,要先获取所有的img,每一张图片都要判断是否要延迟加载
	delayImg();
	window.onscroll=function(){
		delayImg();
		backTop();
	}
	function delayImg(){
		for (var i=0;i<oImgs.length;i++) {
			if(oImgs[i].flag) continue;//flag为true说明已经加载过了,跳出本次循环
			checkImg(oImgs[i]);
		}
	}
	
	//检测图片是否可以加载
	function checkImg(img){
		var sTop=utils.win('scrollTop'),//卷出的高度
		 imgTop=utils.offset(img).top,//图片距离body的上偏移量
		imgHeight=img.offsetHeight;//图片本身的高度
		if(winHeight+sTop>=imgHeight+imgTop){
			var srcVal=img.getAttribute('data-real');
			//检测资源的有效性,创建一个临时的img盒子
			var imgTemp=document.createElement('img');
			imgTemp.src=srcVal;
			imgTemp.onload=function(){
				img.src=srcVal;//srcVal就是real-data那个属性的值,也就是图片的路径
				imgTemp=null;
				fadeImg(img);//图片渐变效果
				img.flag=true;//说明图片已经加载过了
				
			}
		}
	}
	//图片渐变效果
	function fadeImg(img){
		var timer=setInterval(function(){
			var opa=utils.getCss(img,'opacity');
			if(opa>=1){
				clearInterval(timer);
				return;
			}
			opa+=0,1;
			utils.setCss(img,'opacity',opa);
		},100);
	}
	
	//回到顶部按钮,显示或隐藏
	function backTop(){
		var sTop=utils.win('scrollTop');
		if(sTop>=winHeight*0.5){
			utils.setCss(back,'display','block');
		}else{
			utils.setCss(back,'display','none');
		}
	}
	//点击back按钮时,回到顶部
	var timer;
	back.onclick=function(){
		timer=setInterval(function(){
			var sTop=utils.win("scrollTop");
			if(sTop<=0){
				utils.win('scrollTop',0);
				clearInterval(timer);
			    return;
			}
			sTop-=200;
			utils.win('scrollTop',sTop);
		},10);
	}
	//防止用户 回到顶部过程中 滑动滚轮
	window.onmousewheel=function(){
		clearInterval(timer);
	}
})();
var utils = (function() {
	/*
	 *listToArray:类数组转化为数组(document.getElementsByTagName获取的结果是类数组对象,字符串也是类数组)
	 * @parameter
	 * 		likeAry[要转化的类数组]
	 * @return
	 * 		[Array] [转化后的新数组]
	 * */
	function listToArray(likeAry) {
		var ary = [];
		try {
			return Array.prototype.slice.call(likeAry);
		} catch(e) {
			//TODO handle the exception
			for(var i = 0; i < likeAry.length; i++) {
				ary.push(likeAry[i]);
			}
			return ary;
		}
	}
	/**
	 * toJson:将json字符串转化为json对象
	 * (为什么要将字符串转为对象呢?)因为转化为json对象才能使用属性和方法
	 * 例如:var jsonObj={"name":"zhufeng","age":7}; jsonObj.name是可以得到值"zhufeng"的,如果是json字符串就不能这样写
	 *@param:
	 * 	jsonStr:json字符串
	 * @return:
	 * 	[object][json对象]
	 */
	function toJson(jsonStr) {
		return "JSON" in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')');
	}
	/*
	 * win:获取或设置document文档的一些盒模型样式属性值
	 * @param attr 设置属性 (只有一个参数的话是获取)
	 * @param val  设置的属性值
	 * @return {val}
	 * **/
	function win(attr, val) {
		if(typeof val === 'undefined') {
			return document.documentElement[attr] || document.body[attr];
		}
		document.documentElement[attr] = val;
		document.body[attr] = val;
	}
	/**
	 * *
	 * offset:获取当前元素距离body的左偏移和上偏移的距离
	 * @param ele 元素
	 * @return {top:t,left:l}
	 * */
	function offset(ele) {
		var l = ele.offsetLeft, //当前元素距离其父级元素的左偏移
			t = ele.offsetTop, //当前元素距离其父级元素的上偏移
			p = ele.offsetParent; //
		while(p) {
			//		IE不需要加边框宽度,标准浏览器才需要加
			if(navigator.userAgent.indexOf('MSIE 8.0') === -1) {
				l += p.clientLeft; //父级元素的左边框宽度
				t += p.clientTop; //父级元素的上边框宽度
			}
			l += p.offsetLeft; //父级元素到其父级元素的左偏移
			t += p.offsetTop; //父级元素到其父级元素的上偏移
			p = p.offsetParent;
		}
		return { top: t, left: l }
	}
	/*
	 * 
	 *getCss:获取当前元素所有经过浏览器计算的样式(兼容全部的浏览器)
	 * @param
	 * 		curEle:当前要操作的元素
	 *      attr:当前要获取的样式属性名
	 * @return 
	 * 		获取的样式属性值
	 * */
	function getCss(curEle, attr) {
		var result = null,
			reg = null;
		if('getComputedStyle' in window) {
			result = window.getComputedStyle(curEle, null)[attr];
		} else {
			if(attr === 'opacity') { //在ie下透明度:filter:alpha(opacity=30);
				result = curEle.currentStyle['filter'];
				reg = /^alpha\(opacity=(.+)\)$/;
				result = reg.test(result) ? reg.exec(result)[1] / 100 : 1;
			} else {
				result = curEle.currentStyle[attr]; //在ie下用currentStyle
			}
		}
		//处理那些带单位的css属性,比如width:100px,把px去掉
		reg = /^-?(\d|([1-9]\d+))(\.\d+)?(px|pt|rem|rm)$/;
		reg.test(result) ? result = parseFloat(result) : null;
		return result;
	}
	/**
 * *
 * 
	/**
	 * *
	 * setCss:
	 * */

	function setCss(curEle, attr, value) {
		if(arguments.length < 3) {
			return;
		}

		if(attr === 'float') {
			curEle['style']['cssFloat'] = value;
			curEle['style']['styleFloat'] = value;
			return;
		}

		if(attr === 'opacity') {
			curEle['style']['opacity'] = value;
			curEle['style']['filter'] = 'alpha(opacity=' + value * 100 + ')';
			return;
		}

		var reg = /^(width|height|((margin|padding)?(left|right|bottom|top))|fontSize)$/i;
		if(reg.test(attr)) {
			if(!isNaN(value)) {
				value = value + 'px';
			}
		}
		curEle['style'][attr] = value;
	}
	return {
		listToArray: listToArray, //将类数组转换为数组
		toJson: toJson, //将json字符串转换为json对象
		win: win, //获取或设置盒子模型的属性
		offset: offset, //获得元素距离body的上偏移量/左偏移量
		getCss: getCss,
		setCss: setCss
	}
})();
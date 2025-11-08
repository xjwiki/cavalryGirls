/** xjTip(提示标签插件) / V0.1.3 / MIT Licensed / © 2018-2025 XJ.Chen / https://github.com/xjArea/xjTip */
;(function($){



//全局变量
var 
w = window,
d = document,

win = $(w),
doc = $(d),

und = void(0),
fun = function(){},

spa = ' ',
emp = '',

rea = 'readonly',
dis = 'disabled',
cla = 'xjTip-',

iss = function(a){ return typeof(a) == 'string' ? true : false },
s2b = function(a){ return a === 'false' ? false : true },

civ = function(a){ clearInterval(a) },
psi = function(a){ return parseInt(a) },
min = function(a,b){ return Math.min(a,b) },
max = function(a,b){ return Math.max(a,b) };



//特殊变量
var 
o_margin = {xs:4, sm:4, md:6, lg:8, xl:10},

c_shadow = cla + 'drop-shadow',

s_click = 'click',
s_hover = 'hover',
s_mouseenter = 'mouseenter',
s_mouseleave = 'mouseleave',
s_focus = 'focus',
s_blur = 'blur',

s_style = 'style',
s_fixed = 'fixed',

s_0px = '0px',
s_280px = '280px',

s_auto = 'auto',
s_autoX = 'autoX',
s_autoY = 'autoY',

s_to = 'top',
s_tl = 'top-left',
s_tr = 'top-right',
s_ri = 'right',
s_rt = 'right-top',
s_rb = 'right-bottom',
s_bo = 'bottom',
s_bl = 'bottom-left',
s_br = 'bottom-right',
s_le = 'left',
s_lt = 'left-top',
s_lb = 'left-bottom',

c_to = cla + s_to,
c_tl = cla + s_tl,
c_tr = cla + s_tr,
c_ri = cla + s_ri,
c_rt = cla + s_rt,
c_rb = cla + s_rb,
c_bo = cla + s_bo,
c_bl = cla + s_bl,
c_br = cla + s_br,
c_le = cla + s_le,
c_lt = cla + s_lt,
c_lb = cla + s_lb,
c_po = c_to + spa + c_ri + spa + c_bo + spa + c_le;



//插件开始
$.fn.xjTip = function(s){



//默认参数
var o = {
	text : emp,					//标签的text内容
	html : emp,					//标签的html内容
	node : emp,					//内容节点选择器
	
	bodyAppend : true,			//写入到body中
	positionSet : s_auto,		//标签定位的值
	
	className : emp,			//提示标签额外类名
	styleText : emp,			//提示标签额外样式
	
	width : s_auto,				//设置宽度
	minWidth : s_0px,			//最小宽度
	maxWidth : s_280px,			//最大宽度
	
	height : s_auto,			//设置高度
	minHeight : s_0px,			//最小高度
	maxHeight : s_280px,		//最大高度
	
	align : s_autoY,			//标签的对齐方式
	offset : '0,0',				//标签的偏移位置
	
	color : 'black',			//提示标签的颜色
	size : 'md',				//提示标签的尺寸
	
	arrow : true,				//是否有箭头
	radius : true,				//是否有圆角
	shadow : true,				//是否有阴影
	
	ctrlEvent : s_click,		//如何打开菜单
	clickClose : true,			//点击标签关闭
	followMouse : false,		//是否跟随鼠标
	
	autoOpen : false,			//是否自动打开
	autoClose : true, 			//是否自动关闭
	
	autoForbid : false,			//是否自动禁止
	autoIgnore : true,			//是否自动忽视
	autoRemove : true,			//是否自动移除
	
	delayShow : 0,				//提示标签显示的延迟
	delayHide : 0,				//提示标签隐藏的延迟
	
	duration : 200,				//提示标签的动画时长
	easing : 'swing',			//提示标签的动画缓动
	
	before : fun,				//提示标签显示前的回调
	after : fun,				//提示标签显示后的回调
};
if(w.xj && xj.config && xj.config.xjTip){ $.extend(o, xj.config.xjTip) };
if(s){$.extend(o,s)};



//简化参数
var 
text = o.text,
html = o.html,
node = o.node,

bodyAppend = o.bodyAppend,
positionSet = o.positionSet,

className = o.className,
styleText = o.styleText,

width = o.width,
minWidth = o.minWidth,
maxWidth = o.maxWidth,

height = o.height,
minHeight = o.minHeight,
maxHeight = o.maxHeight,

align = o.align,
offset = o.offset,

color = o.color,
size = o.size,

arrow = o.arrow,
radius = o.radius,
shadow = o.shadow,

ctrlEvent = o.ctrlEvent,
clickClose = o.clickClose,
followMouse = o.followMouse,

autoOpen = o.autoOpen,
autoClose = o.autoClose,

autoForbid = o.autoForbid,
autoIgnore = o.autoIgnore,
autoRemove = o.autoRemove,

delayShow = o.delayShow,
delayHide = o.delayHide,

duration = o.duration,
easing = o.easing,

before = o.before,
after = o.after;



//遍历设置
var 
body = $('body'),
returnResult = [];
this.each(function(){



//基础变量
var 
_id = 'xjTip' + String(Math.random()).slice(2,12),
__id = '.'+_id,
___id = '#'+_id,
that = $(this).addClass(_id),
tipTag = $(),
wrapTag = $(),
mainTag = $(),
innerTag = $(),
arrowTag = $();



//私有参数
var 
_text,
_html,
_node,
_bodyAppend = that.attr(cla+'bodyAppend') || bodyAppend,
_positionSet = that.attr(cla+'positionSet') || positionSet,
_className = that.attr(cla+'className') || className,
_styleText = that.attr(cla+'styleText') || styleText,
_width = that.attr(cla+'width') || width,
_minWidth = that.attr(cla+'minWidth') || minWidth,
_maxWidth = that.attr(cla+'maxWidth') || maxWidth,
_height = that.attr(cla+'height') || height,
_minHeight = that.attr(cla+'minHeight') || minHeight,
_maxHeight = that.attr(cla+'maxHeight') || maxHeight,
_align = that.attr(cla+'align') || align,
_offset = that.attr(cla+'offset') || offset,
_color = that.attr(cla+'color') || color,
_size = that.attr(cla+'size') || size,
_arrow = that.attr(cla+'arrow') || arrow,
_radius = that.attr(cla+'radius') || radius,
_shadow = that.attr(cla+'shadow') || shadow,
_ctrlEvent = that.attr(cla+'ctrlEvent') || ctrlEvent,
_clickClose = that.attr(cla+'clickClose') || clickClose,
_followMouse = that.attr(cla+'followMouse') || followMouse,
_autoOpen = that.attr(cla+'autoOpen') || autoOpen,
_autoClose = that.attr(cla+'autoClose') || autoClose,
_autoForbid = that.attr(cla+'autoForbid') || autoForbid,
_autoIgnore = that.attr(cla+'autoIgnore') || autoIgnore,
_autoRemove = that.attr(cla+'autoRemove') || autoRemove,
_delayShow = that.attr(cla+'delayShow') || delayShow,
_delayHide = that.attr(cla+'delayHide') || delayHide,
_duration = that.attr(cla+'duration') || duration,
_easing = that.attr(cla+'easing') || easing;



//格式参数
_offset = _offset ? _offset.split(',') : offset.split(',');
_bodyAppend = iss(_bodyAppend) ? s2b(_bodyAppend) : bodyAppend;
_arrow = iss(_arrow) ? s2b(_arrow) : arrow;
_radius = iss(_radius) ? s2b(_radius) : radius;
_shadow = iss(_shadow) ? s2b(_shadow) : shadow;
_clickClose = iss(_clickClose) ? s2b(_clickClose) : clickClose;
_followMouse = iss(_followMouse) ? s2b(_followMouse) : followMouse;
_autoOpen = iss(_autoOpen) ? s2b(_autoOpen) : autoOpen;
_autoClose = iss(_autoClose) ? s2b(_autoClose) : autoClose;
_autoForbid = iss(_autoForbid) ? s2b(_autoForbid) : autoForbid;
_autoIgnore = iss(_autoIgnore) ? s2b(_autoIgnore) : autoIgnore;
_autoRemove = iss(_autoRemove) ? s2b(_autoRemove) : autoRemove;
_delayShow = iss(_delayShow) ? psi(_delayShow) : delayShow;
_delayHide = iss(_delayHide) ? psi(_delayHide) : delayHide;
_duration = iss(_duration) ? psi(_duration) : duration;



//纠正触发交互事件
var 
nodeType,
nodeName;
if('ontouchstart' in document){
	_followMouse = false;
	nodeType = that.attr('type');
	nodeName = that[0].nodeName.toLowerCase();
	if(_ctrlEvent == s_hover){ _ctrlEvent = s_click }else 
	if(_ctrlEvent == s_focus){
		if(nodeName == 'input' && !/button|submit|reset|image/i.test(nodeType)){ }else 
		if(nodeName != 'textarea'){ _ctrlEvent = s_click };
	};
}else if(_followMouse){
	_ctrlEvent = s_hover;
};

//标签展示轴向方位
var 
showX = (_align == s_autoX || _align.indexOf(s_ri) == 0 || _align.indexOf(s_le) == 0),
showY = (_align == s_autoY || _align.indexOf(s_to) == 0 || _align.indexOf(s_bo) == 0);

//外边据的相关尺寸
var
marginX = (_arrow && showX) ? o_margin[_size] : 0,
marginY = (_arrow && showY) ? o_margin[_size] : 0;

//小箭头的相关尺寸
var 
arrowW = marginX ? marginX+2 : 0,
arrowH = marginY ? marginY+2 : 0;

//标签偏移的尺寸值
var 
offsetX = psi(_offset[0]),
offsetY = psi(_offset[1]);

//定位弹出层的变量
var 
thatOW, thatOH, thatOL, thatOT, 
winW, winH, winSL, winST, 
tipOW, tipOH, tipL, tipT, 
arrowML, arrowMT, 
arrowMinML, arrowMinMT, 
arrowMaxML, arrowMaxMT, 
clientX, clientY;

//展示相关参数
var 
tipOpening = false,
tipPosition = emp,
targetNode = und,
autoDelete = und;



//在X轴方向上自动对齐
var 
tipAutoX = function(){
	if(!_followMouse){
		tipL = thatOL + thatOW + offsetX;																			//X轴居右
		tipT = thatOT + (thatOH - tipOH)/2 + offsetY;																//Y轴居中
		if(tipL + tipOW + marginX > winSL + winW && thatOL - tipOW - marginX - offsetX >= winSL){					//右侧超出但左侧放得下则定位在左侧
			tipL = thatOL - tipOW - marginX - offsetX;
			tipTag.addClass(c_le);
		}else{
			tipTag.addClass(c_ri);
		};
		if(tipOH > thatOH){																							//标签高过按钮了且到达浏览器边缘则定位偏移
			if(tipT < winST){																						//标签定位超出顶部
				if(_arrow){
					arrowMT = -(winST - tipT + arrowW);																//获取箭头的marginTop值
					arrowMinMT = max(-(tipOH/2) + arrowW/2 - 2, -(tipOH/2) + thatOH/2 - arrowW);					//获取箭头最小的marginTop值
					if(arrowMT < arrowMinMT){ arrowMT = arrowMinMT };												//不能让小箭头超出顶部
					arrowTag.css({marginTop : arrowMT});															//设置箭头最终的marginTop定位
				};
				tipT = winST;																						//标签顶部为滚动条滚动的距离
				if(tipT > thatOT){ tipT = thatOT };																	//标签超过按钮则标签上边线对齐按钮上边线
			}else if(tipT + tipOH > winST + winH){																	//标签定位超出底部
				if(_arrow){
					arrowMT = (tipT + tipOH) - (winST + winH) - arrowW;												//获取箭头的marginTop值
					arrowMaxMT = min(tipOH/2 - (arrowW*2 + arrowW/2) + 2, tipOH/2 - thatOH/2 - arrowW);				//获取箭头最大的marginTop值
					if(arrowMT > arrowMaxMT){ arrowMT = arrowMaxMT };												//不能让小箭头超出底部
					arrowTag.css({marginTop : arrowMT});															//设置箭头最终的marginTop定位
				};
				tipT = winST + winH - tipOH;																		//标签顶部为滚动条滚动的距离
				if(tipOH + tipT < thatOT + thatOH){ tipT = thatOH + thatOT - tipOH };								//标签超过按钮则标签下边线对齐按钮下边线
			}else if(_arrow){																						//恢复偏移
				arrowTag.css({marginTop : emp});
			};
		};
	}else{
		tipL = clientX + winSL + offsetX + 10;																		//X轴居右
		tipT = clientY + winST + offsetY - tipOH/2;																	//Y轴居中
		if(tipL + tipOW + marginX > winSL + winW && clientX + winSL - tipOW - marginX - (offsetX+10) >= winSL){		//右侧超出但左侧放得下则定位在左侧
			tipL = clientX + winSL - tipOW - marginX - (offsetX+10);
			tipTag.addClass(c_le);
		}else{
			tipTag.addClass(c_ri);
		};
		if(tipT < winST){																							//标签定位超出顶部
			if(_arrow){
				arrowMT = -(winST - tipT + arrowW);																	//获取箭头的marginTop值
				arrowMinMT = -(tipOH/2) + arrowW/2 - 2;																//获取箭头最小的marginTop值
				if(arrowMT < arrowMinMT){ arrowMT = arrowMinMT };													//不能让小箭头超出顶部
				arrowTag.css({marginTop : arrowMT});																//设置箭头最终的marginTop定位
			};
			tipT = winST;																							//标签顶部为滚动条滚动的距离
		}else if(tipT + tipOH > winST + winH){																		//标签定位超出底部
			if(_arrow){
				arrowMT = (tipT + tipOH) - (winST + winH) - arrowW;													//获取箭头的marginTop值
				arrowMaxMT = tipOH/2 - (arrowW*2 + arrowW/2) + 2;													//获取箭头最大的marginTop值
				if(arrowMT > arrowMaxMT){ arrowMT = arrowMaxMT };													//不能让小箭头超出底部
				arrowTag.css({marginTop : arrowMT});																//设置箭头最终的marginTop定位
			};
			tipT = winST + winH - tipOH;																			//标签顶部为滚动条滚动的距离
		}else if(_arrow){																							//恢复偏移
			arrowTag.css({marginTop : emp});
		};
	};
};



//在Y轴方向上自动对齐
var 
tipAutoY = function(){
	if(!_followMouse){
		tipL = thatOL + (thatOW - tipOW)/2 + offsetX;																//X轴居中
		tipT = thatOT - tipOH - marginY - offsetY;																	//Y轴居上
		if(thatOT - tipT > thatOT - winST){																			//顶部超出但底部放得下则定位在底部
			tipT = thatOT + thatOH + offsetY;
			tipTag.addClass(c_bo);
		}else{
			tipTag.addClass(c_to);
		};
		if(tipOW > thatOW){																							//标签宽过按钮了且到达浏览器边缘则定位偏移
			if(tipL < winSL){																						//标签定位超出左侧
				if(_arrow){
					arrowML = tipL - winSL - arrowH;																//获取箭头的marginLeft值
					arrowMinML = max(-(tipOW/2) + arrowH/2 - 2, -(tipOW/2) + thatOW/2 - arrowH);					//获取箭头最小的marginLeft值
					if(arrowML < arrowMinML){ arrowML = arrowMinML };												//不能让小箭头超出左侧
					arrowTag.css({marginLeft : arrowML});															//设置箭头最终的marginLeft定位
				};
				tipL = winSL;																						//标签左侧为滚动条滚动的距离
				if(tipL > thatOL){ tipL = thatOL };																	//标签超过按钮则标签左边线对齐按钮左边线
			}else if(tipL + tipOW > winSL + winW){																	//标签定位超出右侧
				if(_arrow){
					arrowML = (tipL + tipOW) - (winSL + winW) - arrowH;												//获取箭头的marginLeft值
					arrowMaxML = min(tipOW/2 - (arrowH*2 + arrowH/2) + 2, tipOW/2 - thatOW/2 - arrowH);				//获取箭头最大的marginLeft值
					if(arrowML > arrowMaxML){ arrowML = arrowMaxML };												//不能让小箭头超出右侧
					arrowTag.css({marginLeft : arrowML});															//设置箭头最终的marginLeft定位
				};
				tipL = winSL + winW - tipOW;																		//标签最右侧只能到右侧的边缘
				if(tipOW + tipL < thatOL + thatOW){ tipL = thatOL + thatOW - tipOW };								//标签超过按钮则标签右边线对齐按钮右边线
			}else if(_arrow){																						//恢复偏移
				arrowTag.css({marginLeft : emp});
			};
		};
	}else{
		tipL = clientX + winSL + offsetX - (tipOW/2);																//X轴居中
		tipT = clientY + winST - tipOH - marginY - offsetY - 10;													//Y轴居上
		if(tipT < winST){																							//顶部超出但底部放得下则定位在底部
			tipT = clientY + winST + offsetY + 10;
			tipTag.addClass(c_bo);
		}else{
			tipTag.addClass(c_to);
		};
		if(tipL < winSL){																							//标签定位超出左侧
			if(_arrow){
				arrowML = -(winSL - tipL + arrowH);																	//获取箭头的marginLeft值
				arrowMinML = -(tipOW/2) + arrowH/2 - 2;																//获取箭头最小的marginLeft值
				if(arrowML < arrowMinML){ arrowML = arrowMinML };													//不能让小箭头超出左侧
				arrowTag.css({marginLeft : arrowML});																//设置箭头最终的marginLeft定位
			};
			tipL = winSL;																							//标签左侧为滚动条滚动的距离
		}else if(tipL + tipOW > winSL + winW){																		//标签定位超出右侧
			if(_arrow){
				arrowML = (tipL + tipOW) - (winSL + winW) - arrowH;													//获取箭头的marginLeft值
				arrowMaxML = tipOW/2 - (arrowH*2 + arrowH/2) + 2;													//获取箭头最大的marginLeft值
				if(arrowML > arrowMaxML){ arrowML = arrowMaxML };													//不能让小箭头超出右侧
				arrowTag.css({marginLeft : arrowML});																//设置箭头最终的marginLeft定位
			}
			tipL = winSL + winW - tipOW;																			//标签最右侧只能到右侧的边缘
		}else if(_arrow){																							//恢复偏移
			arrowTag.css({marginLeft : emp});
		};
	};
};



//固定方向设置的布局
var tipFixed = function(){
	if(!_followMouse){
		if(_align.indexOf(s_to) == 0){ tipT = thatOT - tipOH - offsetY }else										//Y轴居上
		if(_align.indexOf(s_ri) == 0){ tipL = thatOL + thatOW + offsetX }else										//X轴居右
		if(_align.indexOf(s_bo) == 0){ tipT = thatOT + thatOH + offsetY }else										//Y轴居下
		if(_align.indexOf(s_le) == 0){ tipL = thatOL - tipOW - offsetX };											//X轴居左
		if(_align == s_tl || _align == s_bl){ tipL = thatOL + offsetX }else 										//X轴居左
		if(_align == s_to || _align == s_bo){ tipL = thatOL + (thatOW - tipOW)/2 + offsetX }else 					//X轴居中
		if(_align == s_tr || _align == s_br){ tipL = thatOL + thatOW - tipOW + offsetX }else 						//X轴居右
		if(_align == s_lt || _align == s_rt){ tipT = thatOT + offsetY }else 										//Y轴居上
		if(_align == s_le || _align == s_ri){ tipT = thatOT + (thatOH - tipOH)/2 + offsetY }else 					//Y轴居中
		if(_align == s_lb || _align == s_rb){ tipT = thatOT + thatOH - tipOH + offsetY };	 						//Y轴居下
	}else{
		if(_align.indexOf(s_to) == 0){ tipT = clientY + winST - tipOH - offsetY - 10; }else							//Y轴居上
		if(_align.indexOf(s_ri) == 0){ tipL = clientX + winSL + offsetX + 10; }else									//X轴居右
		if(_align.indexOf(s_bo) == 0){ tipT = clientY + winST + offsetY + 10; }else									//Y轴居下
		if(_align.indexOf(s_le) == 0){ tipL = clientX + winSL - tipOW - offsetX - 10 };								//X轴居左
		if(_align == s_tl || _align == s_bl){ tipL = clientX + winSL + offsetX }else 								//X轴居左
		if(_align == s_to || _align == s_bo){ tipL = clientX + winSL - (tipOW/2) + offsetX }else 					//X轴居中
		if(_align == s_tr || _align == s_br){ tipL = clientX + winSL - tipOW + offsetX }else 						//X轴居右
		if(_align == s_lt || _align == s_rt){ tipT = clientY + winST + offsetY }else 								//Y轴居上
		if(_align == s_le || _align == s_ri){ tipT = clientY + winST - (tipOH/2) + offsetY }else 					//Y轴居中
		if(_align == s_lb || _align == s_rb){ tipT = clientY + winST - tipOH + offsetY };							//Y轴居下
	};
};



//弹出层重置定位方法
var 
tipResize = function(){
	
	//添加占位标签
	var cloneTag = tipTag.clone().empty().removeAttr('id').css({visibility:'hidden'});
	body.append(cloneTag);
	
	//标签的初始化
	tipTag.css({top:s_0px, left:s_0px, width:s_auto, height:s_auto});
	if(_align == s_autoX || _align == s_autoY){ tipTag.removeClass(c_po) };
	
	//获取目标参数
	thatOW = that.outerWidth();
	thatOH = that.outerHeight();
	thatOL = that.offset().left;
	thatOT = that.offset().top;
	
	//获取窗口参数
	winW = win.width();
	winH = win.height();
	winSL = win.scrollLeft();
	winST = win.scrollTop();
	
	//获取标签尺寸
	tipOW = tipTag.outerWidth();
	tipOH = tipTag.outerHeight();
	
	//设置标签尺寸
	if(_align == s_autoX || _align == s_autoY){ tipTag.css({width:tipOW+marginX, height:tipOH+marginY}) }
	else{ tipTag.css({width:tipOW, height:tipOH}) };
	
	//计算标签位置
	if(_align == s_autoX){ tipAutoX() }else 
	if(_align == s_autoY){ tipAutoY() }
	else{ tipFixed() };
	
	//标签最终定位
	if(tipPosition != s_fixed){ tipTag.css({left:tipL, top:tipT}) }
	else{ tipTag.css({left:tipL-winSL, top:tipT-winST}) };
	
	//移除占位标签
	cloneTag.remove();
	
};



//返回值对象
var xjTip = {
	
	//获取按钮
	that : that,
	getThis : function(){ return that },
	
	//获取元素
	getTip : function(){ return tipTag },
	getWrap : function(){ return wrapTag },
	getMain : function(){ return mainTag },
	getInner : function(){ return innerTag },
	getArrow : function(){ return arrowTag },
	
	//重设销毁
	resize : function(){ tipResize() },
	destroy : function(flag){
		if(flag){ that.remove() }
		else{ that.off(__id) };
		tipTag.off(__id);
		xjTip.hide();
	},
	
	//隐藏弹出层
	hide : function(){
		
		//停动画清回调并改变状态
		tipTag.stop(true);
		setTimeout(function(){ tipOpening = false });
		
		//执行淡出关闭的动画
		tipTag
		.delay(_delayHide + 50)
		.animate({opacity:0}, _duration, _easing, function(){
			tipTag.remove();
			win.off(__id);
			doc.off(__id);
		});
		
	},
	
	//显示弹出层
	show : function(){
		
		//停止动画改变状态
		tipTag.stop(true);
		setTimeout(function(){
			tipOpening = true;
		});
		
		//还在场那重新打开
		if($(___id).length){
			tipResize();
			tipTag.animate({opacity:1}, _duration, _easing );
			return false;
		};
		
		//是否禁止响应菜单
		if(_autoForbid && (that.hasClass(rea) || that.prop(rea) || that.attr(rea) || that.hasClass(dis) || that.prop(dis) || that.attr(dis))){
			xjTip.hide();
			return false;
		};
		
		//获取要写入的内容
		_text = that.attr(cla+'text') || text;
		_html = that.attr(cla+'html') || html;
		_node = that.attr(cla+'node') || node;
		if(!_text && !_html && _node){
			if( /\$\(this\)/i.test(_node) ){
				targetNode = that.find(_node.replace(/\$\(this\)/i, emp));
			}else{
				targetNode = $(_node);
			};
		};
		
		//是否菜单为空忽视
		if(_autoIgnore){
			if(!_text && !_html && !_node){
				xjTip.hide();
				return false;
			}else if(_node && !targetNode.length){
				xjTip.hide();
				return false;
			};
		};
		
		//创建并获取标签节点
		tipTag = $('<div class="xjTip" id="'+_id+'"></div>');
		wrapTag = $('<div class="xjTip-wrap"></div>');
		mainTag = $('<div class="xjTip-main"></div>');
		innerTag = $('<div class="xjTip-inner"></div>');
		arrowTag = $('<div class="xjTip-arrow"></div>');
		
		//构建提示标签的结构
		mainTag.append(innerTag);
		wrapTag.append(mainTag);
		wrapTag.append(arrowTag);
		tipTag.append(wrapTag);
		
		//设置标签的主体内容
		if(_text){ innerTag.text(_text) }else 
		if(_html){ innerTag.html(_html) }else 
		if(targetNode){ innerTag.html(targetNode.html()) };
		
		//设置标签的样式类名
		if(_className){ tipTag.addClass(_className) };
		if(_styleText){ tipTag.attr(s_style, _styleText) };
		if(_color != 'black'){ tipTag.addClass(cla + _color) };
		if(_size != 'md'){ tipTag.addClass(cla + _size) };
		if(_align.indexOf(s_auto) == -1){ tipTag.addClass(cla + _align) };
		if(!_arrow){ tipTag.addClass(cla+'no-arrow') };
		if(!_radius){ tipTag.addClass(cla+'no-radius') };
		if(_shadow){ tipTag.addClass(c_shadow) };
		
		//设置标签的宽高属性
		if(_width != s_auto){ mainTag.css({width : psi(_width) - marginX}) };
		if(_height != s_auto){ mainTag.css({height : psi(_height) - marginY}) };
		if(_minWidth != s_0px){ mainTag.css({minWidth : psi(_minWidth) - marginX}) };
		if(_minHeight != s_0px){ mainTag.css({minHeight : psi(_minHeight) - marginY}) };
		mainTag.css({maxWidth : psi(_maxWidth) - marginX});
		mainTag.css({maxHeight : psi(_maxHeight) - marginY});
		
		//写入页面并回调显示
		before(xjTip);
		if(_bodyAppend){ body.append(tipTag) }
		else{ that.before(tipTag.css({position : s_fixed})) };
		if(_positionSet != s_auto){ tipTag.css({position : _positionSet}) };
		tipPosition = tipTag.css('position');
		after(xjTip);
		
		//绑定重置事件并显示
		tipResize();
		win.on('resize'+__id, function(){ tipResize() });
		win.on('scroll'+__id, function(){ tipResize() });
		tipTag.delay(_delayShow).animate({opacity:1}, _duration, _easing );
		
		//监听自动销毁
		if(_autoRemove){
			civ(autoDelete);
			autoDelete = setInterval(function(){
				if(!d.getElementById(_id)){ civ(autoDelete) };
				if(!d.getElementsByClassName(_id).length){
					civ(autoDelete);
					xjTip.destroy();
				};
			}, 500);
		};
		
		//当触发事件为click时
		if(_ctrlEvent == s_click){
			if(_autoClose){
				doc.on(s_click+__id, function(){
					if(tipOpening){ xjTip.hide() };
				});
			};
			if(_clickClose == false){ 
				tipTag.on(s_click+__id, function(){
					tipOpening = false;
					setTimeout(function(){ tipOpening = true });
				});
			};
		};
		
		//当触发事件为hover时
		if(_ctrlEvent == s_hover){
			tipTag.on(s_mouseenter+__id, function(){ xjTip.show() });
			if(_autoClose){ tipTag.on(s_mouseleave+__id, function(){ xjTip.hide() }) };
			if(_clickClose){ tipTag.on(s_click+__id, function(){ xjTip.hide() }) };
		};
		
		//标签跟随鼠标同步移动
		if(_followMouse){
			doc.on('mousemove'+__id, function(e){
				clientX = e.clientX;
				clientY = e.clientY;
				tipResize();
			});
		};
		
	},
	
};



//绑定 that 的 click 打开事件
if(_ctrlEvent == s_click){
	that.on(s_click+__id, function(){ if(!tipOpening){ xjTip.show() } });
};

//绑定 that 的 hover 开关事件
if(_ctrlEvent == s_hover){
	that.on(s_mouseenter+__id, function(e){
		if(_followMouse){
			clientX = e.clientX;
			clientY = e.clientY;
		};
		xjTip.show();
	});
	if(_autoClose){ that.on(s_mouseleave+__id, function(){ xjTip.hide() }) };
};

//绑定that的focus开关事件
if(_ctrlEvent == s_focus){
	that.on(s_focus+__id, function(){ xjTip.show() });
	if(_autoClose){ that.on(s_blur+__id, function(){ xjTip.hide() }) };
};



//自动打开
if(_autoOpen){ xjTip.show() };

//添加结果
returnResult.push(xjTip);



});//this.each



//返回
return (this.length == 1) ? returnResult[0] : returnResult;



};//$.fn.xjTip



})(jQuery);
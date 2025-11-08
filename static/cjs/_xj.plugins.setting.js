// ---------------------------------------------------------------------------------------------
// XJ 插件配置，需要在插件加载前设置，所以写在 IIFE 中而不是 Ready，并且该文件被放在最前面被加载
(function(){

// 创建全局容器对象
if(!window.xj){ xj = {} };

// xj.viewport
if(!xj.viewportConfig){ xj.viewportConfig = {} };
if(!xj.viewportOption){ xj.viewportOption = {} };
xj.viewportConfig['0.3.2'] = {};
xj.viewportOption['0.3.2'] = {};

// xj.storage
if(!xj.storageConfig){ xj.storageConfig = {} };
if(!xj.storageOption){ xj.storageOption = {} };
xj.storageConfig['0.2.2'] = {};
xj.storageOption['0.2.2'] = {};

// xj.ripple
if(!xj.rippleConfig){ xj.rippleConfig = {} };
if(!xj.rippleOption){ xj.rippleOption = {} };
xj.rippleConfig['0.5.1'] = { classTarget: null, existClass: '', defaultSelector: 
'.xj-ripple, .xj-ripple-out, button, .button', };
xj.rippleOption['0.5.1'] = {};

// xj.basic
if(!xj.basicConfig){ xj.basicConfig = {} };
if(!xj.basicOption){ xj.basicOption = {} };
xj.basicConfig['0.5.0'] = {};
xj.basicOption['0.5.0'] = {};

// xjArrive
if(!xj.Arrive){ xj.Arrive = {} };
if(!xj.Arrive.config){ xj.Arrive.config = {} };
if(!xj.Arrive.option){ xj.Arrive.option = {} };
xj.Arrive.config['0.3.2'] = {};
xj.Arrive.option['0.3.2'] = {};

// xjDemo
if(!xj.Demo){ xj.Demo = {} };
if(!xj.Demo.config){ xj.Demo.config = {} };
if(!xj.Demo.option){ xj.Demo.option = {} };
xj.Demo.config['0.1.0'] = {};
xj.Demo.option['0.1.0'] = {};

// xjScroll
if(!xj.Scroll){ xj.Scroll = {} };
if(!xj.Scroll.config){ xj.Scroll.config = {} };
if(!xj.Scroll.option){ xj.Scroll.option = {} };
xj.Scroll.config['0.4.0'] = {};
xj.Scroll.option['0.4.0'] = {};

// xjDir
if(!xj.Dir){ xj.Dir = {} };
if(!xj.Dir.config){ xj.Dir.config = {} };
if(!xj.Dir.option){ xj.Dir.option = {} };
xj.Dir.config['0.2.1'] = {};
xj.Dir.option['0.2.1'] = {};

// xjTip : 这是旧式写法, 插件有待更新
window.xj||(xj={}),xj.config||(xj.config={}),xj.config.xjTip={
	maxWidth: '480px', maxHeight: '640px', 
	ctrlEvent: 'click', duration: '0',  
	size: 'lg', clickClose: false, 
	// followMouse : false, //
};

})();



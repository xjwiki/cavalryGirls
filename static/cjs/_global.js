// ---------------------------------------------------------------------------------------------
// Ready 以后的操作
$(function(){



// 获取顶层对象以及 jQuery 实例对象
// 获取 xj.storage 以及插件实例对象
let pub_win = window, pub_doc = document;
let pub_html = document.documentElement, pub_body = document.body;
let jqi_win = $(pub_win), jqi_doc = $(pub_doc), jqi_html = $(pub_html), jqi_body = $(pub_body);

let xjls = xj.storage.localStorage;
let xjss = xj.storage.sessionStorage;

let jqi_xjDir01 = $('#xjDir01');
let xjDir01Return = xj.Dir.return[jqi_xjDir01.attr('xjDirId')];

let jqi_xjScroll01 = $('#xjScroll01');
let xjScroll01Return = xj.Scroll.return[jqi_xjScroll01.attr('xjScrollId')];



// 窗口小于 1284 取消 body 渐变背景
// 避免阴影出现在右侧三模块的间隙里
let hiddenShadow = function(){ jqi_body.css('backgroundImage', (pub_html.clientWidth <= 1284 ? 'none' : '')) };
jqi_win.on('resize', function(){ hiddenShadow() });
hiddenShadow();



// 将 main 和 tool 锚点改为滚动定位
// 用属性选择器来解决非法符号的问题
$('#pub_main, #pub_tool').on('click', 'a', function(e){
	
	let id = e.currentTarget.getAttribute('href');
	if(/^#/.test(id) === false){ return }
	else{ id = id.slice(1) };
	
	let jqi_idNode = $('[id="'+ id +'"]');
	if(jqi_idNode.length !== 0){
		e.preventDefault();
		jqi_idNode.xjArrive([0,-16], 250);
		location.hash = id;
	};
	
});



// 点击右下角按钮回顶部, 不用arrive
// 因为顶部的 head 可能定位是 fixed
$('#pub_toolBackToTop').on('click', function(e){
$(document.scrollingElement).stop().animate({scrollTop:0}, 250) });

// 点击右下角按钮来切换导航的小菜单
// 用 sessionStorage 实现跨页面记录
let jqi_pub_toolAnchorTip = $('#pub_toolAnchorTip');

if(xjss.get('toolAnchorTip') 
=== null){ xjss.set('toolAnchorTip', true) };
if(xjss.get('toolAnchorTip') !== true){ jqi_pub_toolAnchorTip.hide() };

$('#pub_toolNavigated').on('click', function(){
	if(xjss.get('toolAnchorTip') === true){
		xjss.set('toolAnchorTip', false);
		jqi_pub_toolAnchorTip.hide();
	}else{
		xjss.set('toolAnchorTip', true);
		jqi_pub_toolAnchorTip.show();
	};
});



// 监听 body 中的 pub_lang 节点变化
// 文本被翻译, 改变 html[lang] 属性
new MutationObserver(function(records, observer){
	
	// 简中: 这是用于语言检测的测试句子 - 語言/檢測
	// 繁中: 這是用於語言檢測的測試句子 - 语言/检测
	// 日文: これは言語検出のためのテスト文です - 平假片假字母
	// 英文: This is a test sentence for language detection - test/language
	
	// Chrome 翻译的时候会同步修改 html 的 lang 属性
	// 但 Edge 和其他翻译插件可能不会, 所以只要不是预设语言, 就手动改变属性
	
	let ele_html = document.documentElement;
	let ele_lang = document.getElementById('pub_lang');
	
	let lang = '';
	let text = ele_lang.textContent;
	
	if(/[\u3040-\u309f\u30a0-\u30ff]/.test(text)){ lang = 'ja' }else 
	if(/语言/.test(text) && /检测/.test(text) ){ lang = 'zh-hans' }else 
	if(/語言/.test(text) && /檢測/.test(text) ){ lang = 'zh-hant' }else 
	if(/test/i.test(text) && /language/i.test(text)){ lang = 'en' };
	
	// 是预设的语言就直接设置, 否则
	// 设为 ud, 既 undefined 的意思
	if(['zh-hans','zh-hant','en', 'ja', ].includes(lang) 
	=== true){ ele_html.setAttribute('lang', lang) }
	else{ ele_html.setAttribute('lang', 'ud') };
	
}).observe(document.getElementById('pub_lang'), {
	childList: true,							// 监听子节点的增删改
	attributes: true,							// 监听节点属性的变动
	characterData: true,						// 监听节点内容或节点文本的变动
	subtree: true,								// 表示是否将该观察器应用于该节点的所有后代节点
	// attributeOldValue: true,					// 观察 attributes 变动时，是否需要记录变动前的值
	// characterDataOldValue: true				// 观察 characterData 变动时，是否需要记录变动前的值
	// attributeFilter: ['class', 'title'],		// 需要观察的特定属性，得传入数组，比如 ['class', 'title']
});



});



// ---------------------------------------------------------------------------------------------
// 全局方法所在对象
window.xj2 = {};

// 表格排序功能函数
window.xj2._buildPowerTable = function(tableID){
	
	// 获取相关节点
	let ele_table = document.getElementById(tableID);
	let ele_thead = ele_table.querySelector('thead');
	let ele_tbody = ele_table.querySelector('tbody');
	let ele_thead_th = Array.prototype.slice.apply(ele_thead.querySelectorAll('th'));
	let ele_tbody_tr = Array.prototype.slice.apply(ele_tbody.querySelectorAll('tr'));
	
	let ele_thead_th_icon = ele_thead_th.map(
	function(ele_th){ return ele_th.querySelector('i.icon.fas') });
	let ele_originalSort_th = ele_thead_th[ ele_table.getAttribute('originalSort') ];
	
	// 定义排序方法
	function sortMethod(type, a, b){
		switch(type){
			
			// 字符串直接本地化比对后排序即可
			// case 'number' : { return a - b }; break;
			case 'string' : { return a.localeCompare(b) }; break;
			
			// isNaN 时将其视为大于所有的数值
			case 'number' : { 
				if(isNaN(parseFloat(a))){ return 1 }
				else if(isNaN(parseFloat(b))){ return -1 }
				else{ return (parseFloat(a) - parseFloat(b)) };
			}; break;
			
			// 日期排序, 因为 IE 始终无法处理 '2012-12-12' 这种格式的时间, 所以这里得将 '-' 替换成 '/'
			case 'dateTime' : { return new Date(a.split('-').join('/')).getTime() - 
			new Date(b.split('-').join('/')).getTime(); }; break;
			
			// 针对 '500 ~ 2000' 范围数的排序
			case 'numberRange' : { if(a.split(/ *~ */)[0] === b.split(/ *~ */)[0]){ return a.split(/ *~ */)[1] - b.split(/ *~ */)[1] }
				else{ return a.split(/ *~ */)[0] - b.split(/ *~ */)[0] };
			}; break;
			
		};
	};
	
	// 定义排序操作
	function sortHandle(type, flag, cellIndex){
		ele_tbody_tr.sort(function(a, b){return sortMethod(type, a.cells[cellIndex].textContent !== '' ? a.cells[cellIndex].textContent : a.cells[cellIndex].innerHTML, 
		b.cells[cellIndex].textContent !== '' ? b.cells[cellIndex].textContent : b.cells[cellIndex].innerHTML)*flag }); // 排序
		ele_tbody_tr.forEach(function(ele_tr){ ele_tbody.appendChild(ele_tr) }); // 添加
	};
	
	// 实行排序操作
	ele_thead_th.forEach(function(ele_th){
		ele_th.addEventListener('click', function(){
			
			// 获取排序类型
			let sortType = ele_th.getAttribute('sortType');
			if(Boolean(sortType) === false){ sortType = 'string' };
			
			// 获取设置了图标的 th > i 节点
			let ele_upIcon = ele_thead.querySelector('.fa-sort-up');
			let ele_downIcon = ele_thead.querySelector('.fa-sort-down');
			if(ele_upIcon){ ele_upIcon.classList.remove('fa-sort-up') };
			if(ele_downIcon){ ele_downIcon.classList.remove('fa-sort-down') };
			ele_thead_th_icon.forEach(function(i){ i.classList.add('fa-sort') });
			
			// 如果是第三次点击了, 则恢复原始排序并终止
			if(ele_th.sortFlag === -1){
				sortHandle(ele_originalSort_th.hasAttribute('sortType') ? ele_originalSort_th.getAttribute('sortType') : 'string', 1, ele_originalSort_th.cellIndex);
				ele_thead_th.forEach(function(ele_th){ delete ele_th.sortFlag });
				return;
			};
			
			// 确定升序降序, 删掉其他 th 排序属性, 排序
			if(ele_th.sortFlag === undefined){ ele_th.sortFlag = 1 }else if(ele_th.sortFlag === 1){ ele_th.sortFlag = -1 };
			ele_thead_th.forEach(function(node){ if(node !== ele_th){ delete node.sortFlag } });
			sortHandle(sortType, ele_th.sortFlag, ele_th.cellIndex);
			
			// 设置升序或降序的排序小三角图标
			ele_th.querySelector('.icon').classList.remove('fa-sort');
			ele_th.querySelector('.icon').classList.add(ele_th.sortFlag === 1 ? 'fa-sort-up' : 'fa-sort-down');
			
		}, false);
	});
	
	// 返回当前表格
	return ele_table;
	
};

// 表格原始文本处理
window.xj2._hideText = function(text, encode){
	
	if(typeof(text) !== 'string'){ return text };
	if(encode !== true){ return (text.replace(/ # /, '<h>') + '</h>') };
	
	return text.replace(/ # ([\s\S]+)/, function($0, $1)
	{ return ('<h>'+ $1.replace(/</g,'&lt;').replace(/>/g,'&gt;') +'</h>') });
	
};

// 动态高亮表格背景
window.xj2._groupedSet = function(jqi_powerTable){
	
	// 获取行并移除高亮
	let jqi_tr = jqi_powerTable
	.find('tbody tr').removeClass('tr-grouped');
	
	// 高亮首个非隐藏行
	for(let i01=0, l01=jqi_tr.length; i01<l01; i01++){
		if(jqi_tr.get(i01).classList.contains('hideTr') === true){ continue };
		jqi_tr.eq(i01).addClass('tr-grouped');
		break;
	};
	
	// 遍历表格的所有行
	for(let i01=0, l01=jqi_tr.length; i01<l01; i01++){
		
		// 当前行被隐藏, 那无需计算直接跳过
		let thisRow = jqi_tr.get(i01), prevRow = 'ignore';
		if(thisRow.classList.contains('hideTr') === true){ continue };
		
		// 从当前行开始, 再次遍历前面所有行
		for(let i02=i01-1; i02>-1; i02--){
			
			// 如果上一行是隐藏的就直接跳过
			let prevRow = jqi_tr.get(i02), oneGroup = false;
			if(prevRow.classList.contains('hideTr') === true){ continue }else 
			if(thisRow.getAttribute('group') === prevRow.getAttribute('group')){ oneGroup = true };
			
			// 如果上一行和当前行同类则同步
			if(oneGroup === true ){ if(prevRow.classList.contains('tr-grouped') === true ){
				thisRow.classList.add('tr-grouped') }; break;
			};
			
			// 如果非同类则高亮取反跳出循环
			if(oneGroup === false){ if(prevRow.classList.contains('tr-grouped') === false){
				thisRow.classList.add('tr-grouped') }; break;
			};
			
		};
		
	};
	
};

// 合并表格同类的行
window.xj2._rowSpanSet = function(jqi_powerTable, nthValue, flag){
	
	// 项目表格行和节点
	let jqi_tr = jqi_powerTable.find('tbody tr');
	if(typeof(nthValue) === 'boolean'){ [nthValue,flag,] = [flag,nthValue,] };
	let jqi_td0 = jqi_tr.find('td:nth-of-type('+nthValue+')').removeClass('hideTd').removeAttr('rowSpan');
	
	// 遍历表格的所有行
	for(let i01=0, l01=jqi_tr.length; i01<l01; i01++){
		
		// 当前行被隐藏, 那无需计算直接跳过
		if(jqi_tr.get(i01).classList.contains('hideTr') === true){ continue };
		
		// 创建 rowSpan, 获取当前行的分组值
		let rowSpanValue = 1, groupValue = jqi_tr.get(i01).getAttribute('group');
		
		// 从当前行开始, 再次遍历后面所有行
		for(let i02=i01+1, l02=jqi_tr.length; i02<l02; i02++){
			
			// 下一行是被隐藏的那就直接跳过
			if(jqi_tr.get(i02).classList.contains('hideTr') === true){ continue };
			
			// 下行不隐藏但不同组则循环终止
			if(jqi_tr.get(i02).getAttribute('group') !== groupValue){ break };
			
			// 下行同组不隐藏但值不同也中止
			if(flag === true){ if(jqi_tr.
			get(i02).children[nthValue-1].textContent 
			!== jqi_tr.get(i01).children[nthValue-1].textContent){ break } };
			
			// 下行不隐藏且同组则 rowSpan+1
			jqi_td0.get(i02).classList.add('hideTd'); rowSpanValue += 1;
			
		};
		
		// 设置 rowSpan, 循环跳过后面同组项
		if(rowSpanValue === 1){ continue };
		jqi_td0.get(i01).setAttribute
		('rowSpan', rowSpanValue);
		i01 = i01 + rowSpanValue - 1;
		
	};
	
};



// ---------------------------------------------------------------------------------------------
// 导航和标题的文本
(function(){



// 创建常用变量合集
let istIndex = /\/page\//i.test(location.pathname) === false;

// 子页左侧导航数据
xj2._dirLinksContent = $(/*html*/`
	
	<li><a href="${istIndex?'.':'..'}/index.html"><i class="xjDir-icon">
		<img class="xj-black-hide" style="height:54px;" src="${istIndex ? '.' : '..'}/static/icon/logo-white.png" />
		<img class="xj-white-hide" style="height:54px;" src="${istIndex ? '.' : '..'}/static/icon/logo-black.png" />
	</i></a></li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-compass"></i>		<i class="xjDir-text">新手指南</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a href="./${istIndex?'page/':''}guide_introduce.html">									<i class="xjDir-icon fas fa-1">.</i>					<i class="xjDir-text"><span>选择模式</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}guide_operation.html">									<i class="xjDir-icon fas fa-2">.</i>					<i class="xjDir-text"><span>内勤运营</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}guide_construct.html">									<i class="xjDir-icon fas fa-3">.</i>					<i class="xjDir-text"><span>装备配置</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-circle-info"></i>	<i class="xjDir-text">游戏数据</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a href="./${istIndex?'page/':''}data_weapon_list.html">								<i class="xjDir-icon fas fa-gun"></i>					<i class="xjDir-text"><span>武器列表</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_weapon_model.html">								<i class="xjDir-icon fas fa-gears"></i>					<i class="xjDir-text"><span>武器配件</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_weapon_fusion.html">								<i class="xjDir-icon fas fa-circle-nodes"></i>			<i class="xjDir-text"><span>武器融合</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./${istIndex?'page/':''}data_mecha_list.html">									<i class="xjDir-icon fas fa-robot"></i>					<i class="xjDir-text"><span>机体详情</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_mecha_main.html">									<i class="xjDir-icon fas fa-user-gear"></i>				<i class="xjDir-text"><span>主体强化</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_mecha_foot.html">									<i class="xjDir-icon fas fa-gauge-high"></i>			<i class="xjDir-text"><span>足部强化</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_mecha_hang.html">									<i class="xjDir-icon fas fa-shield-halved"></i>			<i class="xjDir-text"><span>机身挂件</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_mecha_mend.html">									<i class="xjDir-icon fas fa-screwdriver-wrench"></i>	<i class="xjDir-text"><span>机体改造</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_mecha_frag.html">									<i class="xjDir-icon fas fa-bomb"></i>					<i class="xjDir-text"><span>投掷物品</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./${istIndex?'page/':''}data_pilot_intro.html">								<i class="xjDir-icon fas fa-people-group"></i>			<i class="xjDir-text"><span>主角小队</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_pilot_think.html">								<i class="xjDir-icon fas fa-book-open-reader"></i>		<i class="xjDir-text"><span>思潮影响</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_pilot_loyal.html">								<i class="xjDir-icon fas fa-heart"></i>					<i class="xjDir-text"><span>忠诚好感</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_pilot_jewel.html">								<i class="xjDir-icon fas fa-gem"></i>					<i class="xjDir-text"><span>饰品装备</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_pilot_skill.html">								<i class="xjDir-icon fas fa-star"></i>					<i class="xjDir-text"><span>战场技能</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_pilot_level.html">								<i class="xjDir-icon fas fa-medal"></i>					<i class="xjDir-text"><span>军衔等级</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./${istIndex?'page/':''}data_enemy_info.html">									<i class="xjDir-icon fas fa-skull"></i>					<i class="xjDir-text"><span>敌军情报</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_enemy_group.html">								<i class="xjDir-icon fas fa-users-line"></i>			<i class="xjDir-text"><span>编队建制</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_enemy_plot.html">									<i class="xjDir-icon fas fa-list-ol"></i>				<i class="xjDir-text"><span>剧情模式</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_enemy_mode.html">									<i class="xjDir-icon fas fa-list-check"></i>			<i class="xjDir-text"><span>特殊遭遇</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_enemy_outer.html">								<i class="xjDir-icon fas fa-clipboard-check"></i>		<i class="xjDir-text"><span>外勤任务</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_enemy_rest.html">									<i class="xjDir-icon fas fa-calendar-days"></i>			<i class="xjDir-text"><span>假日安排</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./${istIndex?'page/':''}data_manage_defenses.html">							<i class="xjDir-icon fas fa-chess-rook"></i>			<i class="xjDir-text"><span>城防设施</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_manage_strategy.html">							<i class="xjDir-icon fas fa-plane-up"></i>				<i class="xjDir-text"><span>战略支援</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_manage_renovate.html">							<i class="xjDir-icon fas fa-chair"></i>					<i class="xjDir-text"><span>家具清单</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_manage_material.html">							<i class="xjDir-icon fas fa-recycle"></i>				<i class="xjDir-text"><span>回收废料</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_manage_expenses.html">							<i class="xjDir-icon fas fa-money-bill"></i>			<i class="xjDir-text"><span>费用计算</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_manage_building.html">							<i class="xjDir-icon fas fa-warehouse"></i>				<i class="xjDir-text"><span>基地部门</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./${istIndex?'page/':''}data_others_priority.html">							<i class="xjDir-icon fas fa-scale-balanced"></i>		<i class="xjDir-text"><span>商品权重</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_others_achieved.html">							<i class="xjDir-icon fas fa-trophy"></i>				<i class="xjDir-text"><span>成就系统</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_others_advanced.html">							<i class="xjDir-icon fas fa-sliders"></i>				<i class="xjDir-text"><span>奖惩机制</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_others_dialogue.html">							<i class="xjDir-icon fas fa-comment-dots"></i>			<i class="xjDir-text"><span>台词对白</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_others_parlance.html">							<i class="xjDir-icon fas fa-tags"></i>					<i class="xjDir-text"><span>术语提示</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}data_others_question.html">							<i class="xjDir-icon fas fa-circle-question"></i>		<i class="xjDir-text"><span>问题合集</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-square-pen"></i>		<i class="xjDir-text">事件剧情</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a href="./${istIndex?'page/':''}event_plot.html">										<i class="xjDir-icon fas fa-file"></i>					<i class="xjDir-text"><span>剧情环境</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}event_other.html">										<i class="xjDir-icon fas fa-file-lines"></i>			<i class="xjDir-text"><span>特殊场景</span></i></a></li>
			<li><a href="./${istIndex?'page/':''}event_detail.html">									<i class="xjDir-icon fas fa-book"></i>					<i class="xjDir-text"><span>事件详情</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-square-plus"></i>	<i class="xjDir-text">衍生内容</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a href="./${istIndex?'page/':''}ertra_wiki_update.html">								<i class="xjDir-icon fas fa-rotate"></i>				<i class="xjDir-text"><span>网站更新</span></i></a></li>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/images/">				<i class="xjDir-icon fas fa-paintbrush"></i>			<i class="xjDir-text"><span>艺术作品</span></i></a></li>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/workshop/">				<i class="xjDir-icon fas fa-puzzle-piece"></i>			<i class="xjDir-text"><span>创意工坊</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-signs-post"></i>		<i class="xjDir-text">相关地址</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/eventcomments/">		<i class="xjDir-icon fas fa-clock-rotate-left"></i>		<i class="xjDir-text"><span>游戏更新</span></i></a></li>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/discussions/">			<i class="xjDir-icon fab fa-steam"></i>					<i class="xjDir-text"><span>蒸汽社区</span></i></a></li>
			<li><a target="_blank" href="https://space.bilibili.com/679684537">							<i class="xjDir-icon fab fa-bilibili"></i>				<i class="xjDir-text"><span>哔哩哔哩</span></i></a></li>
			<li><a target="_blank" href="https://tieba.baidu.com/f?kw=铁骑少女">						<i class="xjDir-icon fas fa-paw"></i>					<i class="xjDir-text"><span>百度贴吧</span></i></a></li>
			<li><a target="_blank" href="https://github.com/xjwiki/cavalryGirls/issues">				<i class="xjDir-icon fas fa-bug"></i>					<i class="xjDir-text"><span>百科反馈</span></i></a></li>
			<li><a target="_blank" href="https://github.com/xjwiki/cavalryGirls/releases">				<i class="xjDir-icon fas fa-download"></i>				<i class="xjDir-text"><span>百科下载</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-handshake-simple">	</i><i class="xjDir-text">友情链接</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a target="_blank" href="https://xjwiki.github.io/wastelandExpress/">					<i class="xjDir-icon fas fa-hand-point-right"></i>		<i class="xjDir-text"><span>废土快递</span></i></a></li>
			<li><a target="_blank" href="https://xjwiki.github.io/deepDarkForest/">						<i class="xjDir-icon fas fa-hand-point-right"></i>		<i class="xjDir-text"><span>深暗森林</span></i></a></li>
			<li><a target="_blank" href="https://xjwiki.github.io/cavalryGirls/">						<i class="xjDir-icon fas fa-hand-point-right"></i>		<i class="xjDir-text"><span>铁骑少女</span></i></a></li>
		</ul>
	</li>
	
`);



})();



// ---------------------------------------------------------------------------------------------
// Ready 后的节点操作
$(function(){



// 获取顶层四个对象, 以及它们的 jQuery 实例对象;
// 获取 xj.storage 对象和 dir & scroll 实例对象;
let pub_win = window, pub_doc = document;
let pub_html = document.documentElement, pub_body = document.body;
let jqi_win = $(pub_win), jqi_doc = $(pub_doc), jqi_html = $(pub_html), jqi_body = $(pub_body);

let xjls = xj.storage.localStorage;
let xjss = xj.storage.sessionStorage;

let jqi_xjDir01 = $('#xjDir01');
let xjDir01Return = xj.Dir.return[jqi_xjDir01.attr('xjDirId')];

let jqi_xjScroll01 = $('#xjScroll01');
let xjScroll01Return = xj.Scroll.return[jqi_xjScroll01.attr('xjScrollId')];



// 窗口宽度尺寸小于 1284 就取消 body 的渐变背景;
// 避免阴影出现在 head 和 main 和 foot 的间隙里;
let hiddenShadow = function(){ jqi_body.css('backgroundImage', (pub_html.clientWidth <= 1284 ? 'none' : '')) };
jqi_win.on('resize', function(){ hiddenShadow() });
hiddenShadow();



// 阻止 main 和 tool 锚点默认事件, 改为滚动定位;
// 在 id 中可能存在非法符号, 用属性选择器来选择;
$('#pub_main, #pub_tool').on('click', 'a', function(e){
	
	let id = e.currentTarget.getAttribute('href');
	if(/^#/.test(id) === false){ return }
	else{ id = id.slice(1) };
	
	let jqi_idNode = $('[id="'+ id +'"]');
	if(jqi_idNode.length !== 0){
		e.preventDefault();
		jqi_idNode.xjArrive([0, 0,], 250);
		location.hash = id;
	};
	
});



// 点击右下角按钮返回顶部, 这不能用 xjArrive 了;
// 因为顶部的 head 可能是 position:fixed 定位的;
$('#pub_toolBackToTop').on('click', function(e){
$(document.scrollingElement).stop().animate({scrollTop:0}, 250) });

// 点击右下角的按钮, 来切换当前页面的导航小菜单;
// 这里用 sessionStorage 来实现跨页面的历史记录;
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



});



// ---------------------------------------------------------------------------------------------
// 表格排序功能的函数
let buildPowerTable = function(tableID){
	
	// 获取相关的节点元素
	let ele_table = document.getElementById(tableID);
	let ele_thead = ele_table.querySelector('thead');
	let ele_tbody = ele_table.querySelector('tbody');
	let ele_thead_th = Array.prototype.slice.apply(ele_thead.querySelectorAll('th'));
	let ele_tbody_tr = Array.prototype.slice.apply(ele_tbody.querySelectorAll('tr'));
	
	let ele_thead_th_icon = ele_thead_th.map(
	function(ele_th){ return ele_th.querySelector('i.icon.fa') });
	let ele_originalSort_th = ele_thead_th[ ele_table.getAttribute('originalSort') ];
	
	// 定义排序方法
	function sortMethod(type, a, b){
		switch(type){
			
			// 字符串直接本地化比对后排序即可
			// case 'number' : { return a - b }; break;
			case 'string' : { return a.localeCompare(b) }; break;
			
			// 当遭遇 a 或 b 不为 Number 的时候, 则直接将其视为大于所有的数值
			case 'number' : { if(isNaN(Number(a))){ return 1 }else 
				if(isNaN(Number(b))){ return -1 }
				else{ return a - b };
			}; break;
			
			// 日期排序, 因为 IE 始终无法处理 '2012-12-12' 这种格式的时间, 所以这里得将 '-' 替换成 '/'
			case 'dateTime' : { return new Date(a.split('-').join('/')).getTime() - 
			new Date(b.split('-').join('/')).getTime(); }; break;
			
			// 针对 '500 ~ 2000' 这种范围数的排序
			case 'numberRange' : {
				if(a.split(' ~ ')[0] === b.split(' ~ ')[0]){ return a.split(' ~ ')[1] - b.split(' ~ ')[1] }
				else{ return a.split(' ~ ')[0] - b.split(' ~ ')[0] };
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



// ---------------------------------------------------------------------------------------------
// 子页面左侧导航数据
// let isIndex = (document.title === '废土快递攻略百科' || document.title === 'Dustland Delivery Encyclopedia');
// ${isZH ? '../static/icon/logo01.png' : '../../static/icon/logo02.png'}
let isZH = (document.documentElement.lang === 'zh-cmn-hans');
let dirRepeatAnchor = $(/*html*/`

	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-compass"></i><i class="xjDir-text">新手指南</i><i class="xjDir-sign"></i></a>
		<ul>
			<li class="xjDir-disabled"><a href="./guide_start.html"><i class="xjDir-icon fas fa-list-ol"></i>		<i class="xjDir-text"><span>尚未完成</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-circle-info"></i><i class="xjDir-text">游戏数据</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a href="./data_weapon_list.html">			<i class="xjDir-icon fas fa-gun"></i>					<i class="xjDir-text"><span>武器列表</span></i></a></li>
			<li><a href="./data_weapon_model.html">			<i class="xjDir-icon fas fa-gears"></i>					<i class="xjDir-text"><span>武器配件</span></i></a></li>
			<li><a href="./data_weapon_fusion.html">		<i class="xjDir-icon fas fa-circle-nodes"></i>			<i class="xjDir-text"><span>武器融合</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./data_mecha_list.html">			<i class="xjDir-icon fas fa-robot"></i>					<i class="xjDir-text"><span>机体详情</span></i></a></li>
			<li><a href="./data_mecha_main.html">			<i class="xjDir-icon fas fa-user-gear"></i>				<i class="xjDir-text"><span>主体强化</span></i></a></li>
			<li><a href="./data_mecha_foot.html">			<i class="xjDir-icon fas fa-gauge-high"></i>			<i class="xjDir-text"><span>足部强化</span></i></a></li>
			<li><a href="./data_mecha_hang.html">			<i class="xjDir-icon fas fa-shield-halved"></i>			<i class="xjDir-text"><span>机身挂件</span></i></a></li>
			<li><a href="./data_mecha_mend.html">			<i class="xjDir-icon fas fa-screwdriver-wrench"></i>	<i class="xjDir-text"><span>机体改造</span></i></a></li>
			<li><a href="./data_mecha_frag.html">			<i class="xjDir-icon fas fa-bomb"></i>					<i class="xjDir-text"><span>投掷物品</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./data_pilot_intro.html">			<i class="xjDir-icon fas fa-people-group"></i>			<i class="xjDir-text"><span>主角小队</span></i></a></li>
			<li><a href="./data_pilot_think.html">			<i class="xjDir-icon fas fa-book-open-reader"></i>		<i class="xjDir-text"><span>思潮影响</span></i></a></li>
			<li><a href="./data_pilot_loyal.html">			<i class="xjDir-icon fas fa-heart"></i>					<i class="xjDir-text"><span>忠诚好感</span></i></a></li>
			<li><a href="./data_pilot_skill.html">			<i class="xjDir-icon fas fa-star"></i>					<i class="xjDir-text"><span>战场技能</span></i></a></li>
			<li><a href="./data_pilot_jewel.html">			<i class="xjDir-icon fas fa-gem"></i>					<i class="xjDir-text"><span>饰品装备</span></i></a></li>
			<li><a href="./data_pilot_level.html">			<i class="xjDir-icon fas fa-medal"></i>					<i class="xjDir-text"><span>军衔等级</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li><a href="./data_enemy_info.html">			<i class="xjDir-icon fas fa-skull"></i>					<i class="xjDir-text"><span>敌军情报</span></i></a></li>
			<li><a href="./data_enemy_group.html">			<i class="xjDir-icon fas fa-users-line"></i>			<i class="xjDir-text"><span>编队建制</span></i></a></li>
			<li><a href="./data_enemy_plot.html">			<i class="xjDir-icon fas fa-list-ol"></i>				<i class="xjDir-text"><span>剧情遭遇</span></i></a></li>
			<li><a href="./data_enemy_mode.html">			<i class="xjDir-icon fas fa-list-check"></i>			<i class="xjDir-text"><span>特殊模式</span></i></a></li>
			<li><a href="./data_enemy_outer.html">			<i class="xjDir-icon far fa-paste"></i>					<i class="xjDir-text"><span>外勤任务</span></i></a></li>
			<li><a href="./data_enemy_rest.html">			<i class="xjDir-icon fas fa-calendar-days"></i>			<i class="xjDir-text"><span>假日安排</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li                       ><a href="./data_manage_defenses.html">		<i class="xjDir-icon fas fa-chess-rook"></i>			<i class="xjDir-text"><span>城防设施</span></i></a></li>
			<li                       ><a href="./data_manage_strategy.html">		<i class="xjDir-icon fas fa-plane-up"></i>				<i class="xjDir-text"><span>战略支援</span></i></a></li>
			<li                       ><a href="./data_manage_renovate.html">		<i class="xjDir-icon fas fa-chair"></i>					<i class="xjDir-text"><span>家具清单</span></i></a></li>
			<li                       ><a href="./data_manage_material.html">		<i class="xjDir-icon fas fa-recycle"></i>				<i class="xjDir-text"><span>回收废料</span></i></a></li>
			<li class="xjDir-disabled"><a href="./data_manage_building.html">		<i class="xjDir-icon fas fa-warehouse"></i>				<i class="xjDir-text"><span>基地建设</span></i></a></li><!--◇ 也包括进城券的使用 StreetCardUse/Street_BU ◇-->
			<li class="xjDir-disabled"><a href="./data_manage_expenses.html">		<i class="xjDir-icon fas fa-money-bill"></i>			<i class="xjDir-text"><span>费用计算</span></i></a></li>
			<li class="xjDir-divide"></li>
			
			<li class="xjDir-disabled"><a href="./data_other_list.html">			<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>成就系统</span></i></a></li>
			<li class="xjDir-disabled"><a href="./data_other_list.html">			<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>术语名词</span></i></a></li><!-- 包括 Buffs 信息和游戏提示 -->
			<li class="xjDir-disabled"><a href="./data_manage_shopping.html">		<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>商店机制</span></i></a></li><!--◇商店和黑市售卖物品的概率◇-->
			<li class="xjDir-disabled"><a href="./data_other_list.html">			<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>按键设置</span></i></a></li>
			<li class="xjDir-disabled"><a href="./data_other_list.html">			<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>台词对白</span></i></a></li><!--◇ 也许改成模式事件 ◇-->
			<li class="xjDir-disabled"><a href="./data_other_list.html">			<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>全局参数</span></i></a></li>
			<li class="xjDir-disabled"><a href="./data_other_list.html">			<i class="xjDir-icon fas fa-gear"></i>					<i class="xjDir-text"><span>问题合集</span></i></a></li>
			
			<!--◇ 各种模式的增益减益 ◇-->
			
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-square-pen"></i><i class="xjDir-text">事件剧情</i><i class="xjDir-sign"></i></a>
		<ul>
			<li class="xjDir-disabled"><a href="./story_tool_event.html">			<i class="xjDir-icon fas fa-toolbox"></i>				<i class="xjDir-text"><span>工具事件(未完成)</span></i></a></li>
			<li class="xjDir-disabled"><a href="./story_trip_event.html">			<i class="xjDir-icon fas fa-book"></i>					<i class="xjDir-text"><span>剧情事件(未完成)</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-square-plus"></i><i class="xjDir-text">衍生内容</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a href="./ertra_wiki_update.html">		<i class="xjDir-icon fas fa-rotate"></i>						<i class="xjDir-text"><span>网站更新</span></i></a></li>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/workshop/">								<i class="xjDir-icon fas fa-puzzle-piece"></i>			<i class="xjDir-text"><span>创意工坊	</span></i></a></li>
			<!--◇
			<li class="xjDir-disabled"><a href="./extra_modify_save.html">			<i class="xjDir-icon fas fa-code"></i>					<i class="xjDir-text"><span>修改存档(未完成)</span></i></a></li>
			<li class="xjDir-disabled"><a href="./ertra_good_mod.html">			<i class="xjDir-icon fas fa-puzzle-piece"></i>			<i class="xjDir-text"><span>模组推荐(未完成)</span></i></a></li>
			◇-->
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon fas fa-link"></i><i class="xjDir-text">相关地址</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/eventcomments/">						<i class="xjDir-icon fas fa-clock-rotate-left"></i>		<i class="xjDir-text"><span>游戏更新记录</span></i></a></li>
			<li><a target="_blank" href="https://steamcommunity.com/app/2055050/discussions/">							<i class="xjDir-icon fas fa-message"></i>				<i class="xjDir-text"><span>游戏讨论社区</span></i></a></li>
			<li><a target="_blank" href="https://github.com/xjwiki/cavalryGirls/issues">								<i class="xjDir-icon fas fa-bug"></i>					<i class="xjDir-text"><span>百科问题反馈</span></i></a></li>
			<li><a target="_blank" href="https://github.com/xjwiki/cavalryGirls/releases">								<i class="xjDir-icon fas fa-download"></i>				<i class="xjDir-text"><span>下载离线百科</span></i></a></li>
		</ul>
	</li>
	
	<li class="xjDir-divide"></li>
	<li class="xjDir-spread">
		<a class="xj-ripple" href="javascript:void(0)"><i class="xjDir-icon far fa-handshake" style="transform:rotate(-30deg);"></i><i class="xjDir-text">友情链接</i><i class="xjDir-sign"></i></a>
		<ul>
			<li><a target="_blank" href="https://xjwiki.github.io/wastelandExpress/">									<i class="xjDir-icon fas fa-heart-circle-plus"></i>		<i class="xjDir-text"><span>废土快递</span></i></a></li>
		</ul>
	</li>
	
`);



import Vue from 'vue';
import App from './App';



Vue.config.productionTip = false;

App.mpType = 'app';

// 公共api接口
Vue.prototype.http = 'https://wall.conststar.cn/wall_test_1.2/'
// 图片api接口
Vue.prototype.httpImg = 'https://wall.conststar.cn/wall_test/api/file/image/'

// 自定义顶部导航-渐变色
Vue.prototype.background = {
	backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
}

// 状态码
Vue.prototype.getMsg = function(data) {
	let dataInfo = {}
	if (data.code === 200) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'success'
		return dataInfo;
	}
	//非异常错误（正常的错误） 201-299
	else if (201 <= data.code && data.code <= 299) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'warning'
		return dataInfo;
	}
	//服务器错误 1000
	else if (data.code === 1000) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//参数错误：10001-19999
	else if (10001 <= data.code && data.code <= 19999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//用户错误：20001-29999
	else if (20001 <= data.code && data.code <= 29999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}

	//业务错误：30001-39999
	else if (30001 <= data.code && data.code <= 39999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//系统错误：40001-49999
	else if (40001 <= data.code && data.code <= 49999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//数据错误：50001-599999
	else if (50001 <= data.code && data.code <= 599999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//接口错误：60001-69999
	else if (60001 <= data.code && data.code <= 69999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//权限错误：70001-79999
	else if (70001 <= data.code && data.code <= 79999) {
		dataInfo.dataMsg = data.message
		dataInfo.dataType = 'error'
		return dataInfo;
	}
	//状态码不在设定之内
	else {
		dataInfo.dataMsg = "非法的状态码"
		dataInfo.dataType = 'error'
		return dataInfo;
	}
}

Vue.prototype.date = function(time) {
	return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
}


// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';
Vue.prototype.$store = store

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

// i18n部分的配置
// 引入语言包，注意路径
import Chinese from '@/common/locales/zh.js';
import English from '@/common/locales/en.js';

// VueI18n
import VueI18n from '@/common/vue-i18n.min.js';

// VueI18n
Vue.use(VueI18n);

const i18n = new VueI18n({
	// 默认语言
	locale: 'zh',
	// 引入语言文件
	messages: {
		'zh': Chinese,
		'en': English,
	}
});

// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
Vue.prototype._i18n = i18n;

const app = new Vue({
	i18n,
	store,
	...App
});

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

app.$mount();

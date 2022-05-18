<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="isCanUse">
			<view class='header' v-if="getInfo === false">
				<image src='../../static/star.png'></image>
				未登录
			</view>
			<view class='header' v-else>
				<image class="image" :src="info.avatarUrl"></image>
				<view>{{info.nickName}}</view>
			</view>
			<view class='content'>
				<view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称，头像、地区等)</text>
			</view>

			<button v-if="regPage === false" class='bottom' type='primary' open-type="getUserInfo"
				withCredentials="true" lang="zh_CN" @click="getUserProfile">
				授权登录
			</button>
			<button v-else class='bottom' type='primary' @tap="goReg">
				前往注册
			</button>
		</view>
		<!-- #endif -->


	</view>
</template>

<script>
	export default {
		data() {
			return {
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
				wxCode: '',
				getInfo: false,
				regPage: false,
				info: {}
			};
		},
		methods: {
			goReg() {
				uni.navigateTo({
					url: './regOptions'
				})
			},
			//第一授权获取用户信息===》按钮触发
			// wxGetUserInfo() {
			// 	this.getInfo = true
			// 	let _this = this;
			// 	uni.getUserInfo({
			// 		provider: 'weixin',
			// 		success: function(infoRes) {
			// 			console.log(infoRes)
			// 			_this.nickName = infoRes.userInfo.nickName; //昵称
			// 			_this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
			// 			try {
			// 				uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
			// 				_this.updateUserInfo();
			// 			} catch (e) {}
			// 			uni.switchTab({
			// 				url: '../index/index'
			// 			})
			// 		},
			// 		fail(res) {
			// 			console.log(res)
			// 			uni.showToast({
			// 				title: "微信登录授权失败",
			// 				icon: "none"
			// 			});
			// 		}
			// 	});
			// },

			//登录
			login() {
				uni.showLoading({
					title: '登录中...'
				});

				let that = this;
				// 1、获取服务商
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						console.log("服务商")
						console.log(res.provider);
						// 2、如果服务商是微信的话就进行登录
						//（支持微信、qq和微博等）
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log(loginRes)
									// 3、wx获取登录用户code
									that.wxCode = loginRes.code


									// 判断是否通过微信注册过
									that.$u.get('/api/user/isAddedByWeChat', {
										code: that.wxCode,
									}).then(res => {
										console.log(res)
										if (res.data === false) {
											// 弹出一个页面 让用户进行选择是绑定现有用户还是通过微信注册成为新用户
											console.log("用户选择")
											that.regPage = true
											uni.navigateTo({
												url: `./regOptions`
											})
										} else {
											if (!that.isCanUse) {
												//非第一次授权获取用户信息
												uni.getUserInfo({
													provider: 'weixin',
													success: function(infoRes) {
														console.log(infoRes)
														//获取用户信息后向调用信息更新方法
														let nickName = infoRes
															.userInfo
															.nickName; //昵称
														let avatarUrl = infoRes
															.userInfo
															.avatarUrl; //头像
														that
															.updateUserInfo(); //调用更新信息方法
													}
												});
											}
											uni.login({
												provider: 'weixin',
												success: function(loginRes) {
													console.log(loginRes)
													// 3、wx获取登录用户code
													that.wxCode = loginRes.code
													//4.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
													that.$u.post(
														'/api/user/loginByWeChat', {
															code: that
																.wxCode,
														}).then(res => {
														console.log(
															res)
														uni.setStorageSync(
															'token',
															res
															.data)
														//openId、或SessionKdy存储//隐藏loading
														uni
															.hideLoading();
													})
												}
											});
										}
									})
								}
							});

						} else {
							uni.showToast({
								title: '请先安装微信或升级版本',
								icon: "none"
							});
						}
					}
				});
			},
			// 获取用户信息
			getUserProfile() {
				let that = this
				uni.getUserProfile({
					desc: "用于完善用户信息",
					success: (res1) => {
						that.info = res1.userInfo;
						console.log(res1)
						uni.showToast({
							icon: "none",
							title: '获取成功'
						})
						this.getInfo = true
						uni.switchTab({
							url: '../index/index'
						})
					},
					fail: (err) => {
						console.log(err)
						uni.showToast({
							icon: "none",
							title: '用户拒绝获取'
						})
					}
				})
			}
		},
		onLoad() { //默认加载
			this.login();
		}
	}
</script>

<style>
	.header {
		margin: 120rpx auto 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 85vw;
		padding-bottom: 50rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 40rpx;
		font-weight: bold;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}
</style>

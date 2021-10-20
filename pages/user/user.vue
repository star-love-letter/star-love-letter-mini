<template>
	<view>
		<u-navbar :is-back="false" title="个人信息" :background="background" title-color="#FFFFFF"></u-navbar>
		<view class="all">
			<view class="u-flex">
				<view>
					<u-avatar :src="avatarSrc" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">{{userInfo.name}}</view>
					<view class="u-font-14 u-tips-color">{{userInfo.email}}</view>
				</view>
			</view>
			<view class='createTime'>注册日期：{{date(userInfo.createTime)}}</view>
		</view>
		<view class='lastTime'>
			<view class="LTtext">上次登录日期：</view>
			<view class="LTdate">{{date(userInfo.lastTime)}}</view>
		</view>
		<view class="nomore">
			暂无更多信息
		</view>
		<!-- <view class="logout" v-if="isjudgeLogin">
			<u-button @click="logout()" type="success" :ripple="true" style="width: 80%;">退出登录</u-button>
		</view> -->
		<u-mask :show="!isjudgeLogin">
			<view class="warp">
				<view class="goLogin">
					<p>{{userMsg || '暂未登录'}}</p>
					<u-button @click="goLogin()" type="success" :ripple="true" style="margin: 0 auto;">去登录
					</u-button>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarSrc: '../../../static/star.png',
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				// 用户信息
				userInfo: '',
				// 用户状态码
				userCode: '',
				// 用户登录信息
				userMsg: '',
				isjudgeLogin: true
			}
		},
		methods: {
			date(time) {
				return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
			},
			// 去登录
			goLogin() {
				uni.reLaunch({
					url: '../wxLogin/wxLogin'
				})
			}
		},
		onLoad() {
			// 判断是否登录
			if (uni.getStorageSync('token') === '') this.isjudgeLogin = false
			else {
				// 获取用户信息
				this.$u.get('/api/user/user').then(res => {
					console.log(res)
					this.userInfo = res.data
					if(res.code !== 200){
						this.userMsg = res.message
						this.isjudgeLogin = false
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.all {
		padding: 30rpx;
		border-bottom: 1rpx solid #999;
	}

	page {
		background-color: #fff;
	}

	// 创建日期
	.createTime {
		font-size: 25rpx;
		// float: right;
		color: #999;
		margin-left: 20rpx;
	}

	// 最后一次登录的日期
	.lastTime {
		margin: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.LTtext {
			font-size: 37rpx;
		}

		.LTdate {
			font-size: 30rpx;
		}
	}

	// 没有更多信息
	.nomore {
		text-align: center;
		color: #999;
		font-size: 30rpx;
	}

	// 退出登录
	.logout {
		margin: 5vh 10vw 0;
		text-align: center;
	}

	// 去登录
	.goLogin {
		height: 100vh;
		margin: 40vh 10vw;

		p {
			color: #fff;
			text-align: center;
			font-size: 50rpx;
			margin-bottom: 60rpx;
		}
	}
</style>

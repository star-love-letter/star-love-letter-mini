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
			<view class='createTime' v-if="userInfo">注册日期：{{date(userInfo.createTime)}}</view>
		</view>
		<view class="userOptions">
			<view class="optionsConfession" @click="goMyTable()">
				<u-icon name="heart" style="color: rgb(240,145,145);margin-right: 20rpx;"></u-icon>
				<span>我的表白</span>
				<u-icon name="arrow-right"
					style="position: absolute;right: 0;top:50%; transform: translate(-50%, -50%);"></u-icon>
			</view>
			<view class="optionsCollect">
				<u-icon name="star" style="color: rgb(240,145,145);margin-right: 20rpx;"></u-icon>
				<span>我的收藏</span>
				<u-icon name="arrow-right"
					style="position: absolute;right: 0;top:50%; transform: translate(-50%, -50%);"></u-icon>
			</view>
			<view class="optionsCall" @click="goContactUs()">
				<u-icon name="chat" style="color: rgb(240,145,145);margin-right: 20rpx;"></u-icon>
				<span>联系我们</span>
				<u-icon name="arrow-right"
					style="position: absolute;right: 0;top:50%; transform: translate(-50%, -50%);"></u-icon>
			</view>
		</view>
		<view class='lastTime'>
			<view class="LTtext" v-if="userInfo">上次登录日期：{{date(userInfo.lastTime)}}</view>
		</view>
		<view class="nomore">
			暂无更多信息
		</view>
		<u-mask :show="!isjudgeLogin">
			<view class="warp">
				<view class="goLogin">
					<p>{{userMsg || '暂未登录'}}</p>
					<u-button @click="goLogin()" type="success" :ripple="true" style="margin: 0 auto;">去登录
					</u-button>
				</view>
			</view>
		</u-mask>
		<!-- 暂无内容弹窗 -->
		<u-popup :show="showUndefined" @close="close" @open="open()">
			<view>
				<text>暂无内容</text>
			</view>
		</u-popup>
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
				isjudgeLogin: true,
			}
		},
		methods: {
			goMyTable() {
				uni.navigateTo({
					url: `../myPost/myPost?userName=${this.userInfo.name}`,
					fail(err) {
						console.log(err)
					}
				});
			},
			goContactUs() {
				uni.navigateTo({
					url: '../contactUs/contactUs',
					fail(err) {
						console.log(err)
					}
				});
			},
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
					this.userInfo = res.data
					if (res.code !== 200) {
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
		background-color: #fff;
		margin-bottom: 10rpx;
	}

	page {
		background-color: #ededed;
	}

	// 创建日期
	.createTime {
		font-size: 25rpx;
		color: #999;
		margin-left: 20rpx;
	}

	// 最后一次登录的日期
	.lastTime {
		margin: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.LTtext {
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

	.userOptions {
		background-color: #fff;

		view {
			font-size: 30rpx;
			line-height: 8vh;
			margin: 0 30rpx;
			position: relative;
			border-bottom: 1rpx solid #999;
		}

		view:last-child {
			border: 0;
		}
	}
</style>

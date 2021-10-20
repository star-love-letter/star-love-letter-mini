<template>
	<view>
		<u-navbar :is-back="true" title="用户个人信息" :background="background" title-color="#FFFFFF"
			back-icon-color="#fff">
		</u-navbar>
		<view class="all">
			<view class="u-flex">
				<view>
					<u-avatar :src="avatarSrc" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">{{userPublicInfo.name}}</view>
					<view class="u-font-14 u-tips-color">{{userPublicInfo.email}}</view>
				</view>
			</view>
			<view class='createTime'>注册日期：{{date(userPublicInfo.createTime)}}</view>
		</view>
		<view class='lastTime'>
			<view class="LTtext">上次登录日期：</view>
			<view class="LTdate">{{date(userPublicInfo.lastTime)}}</view>
		</view>
		<view class="nomore">
			暂无更多信息
		</view>
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
				userPublicInfo: ''
			}
		},
		methods: {
			date(time) {
				return new Date(parseInt(time)).toLocaleString().replace(/:\d{1,2}$/, ' ');
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.userPublicInfo = option
			console.log(this.userPublicInfo)
		},
		onPullDownRefresh() {
			console.log('refresh');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>

<style lang="scss">
	.all {
		padding: 30rpx;
		border-bottom: 1rpx solid #999;
	}

	.info {
		padding-top: 50rpx;
	}

	page {
		background-color: #fff;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.createTime {
		font-size: 25rpx;
		// float: right;
		color: #999;
		margin-left: 20rpx;
	}

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

	.nomore {
		text-align: center;
		color: #999;
		font-size: 30rpx;
	}
</style>

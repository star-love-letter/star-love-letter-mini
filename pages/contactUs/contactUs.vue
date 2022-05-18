<template>
	<view>
		<u-navbar :is-back="true" title="联系我们" :background="background" title-color="#FFFFFF"></u-navbar>
		<view style="width: 100%;height: 100%; display: flex; justify-content: center;">
			<image style="height: 70vh; width: 600rpx;" mode="aspectFit" :src="wechatSrc"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wechatSrc: '../../static/wechat.jpg',
				// 自定义顶部导航-渐变色
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>

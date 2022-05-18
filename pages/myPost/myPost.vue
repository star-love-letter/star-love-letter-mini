<template>
	<view>
		<u-navbar :is-back="true" title="我的帖子" :background="background" title-color="#FFFFFF" back-icon-color="#fff"
			:border-bottom='false'>
		</u-navbar>
		<view :data='serachData' v-for="item in myPostList" :keys='item.id' class="postStyle">
			<post :item="item"></post>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top='20' margin-bottom="20" />
	</view>
</template>
<script>
	import post from '../post/post.vue'
	export default {
		components: {
			post
		},
		data() {
			return {
				myPostList: [],
				myPostCount: 0,
				userName: '',
				myPostSize: 10,
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '正在加载中',
					nomore: '没有更多帖子'
				},
				status: 'loading',
			}
		},
		onReachBottom() {
			if (this.myPostCount <= this.myPostSize) {
				this.status = 'nomore'
				return;
			} else this.status = 'loading';
			this.myPostSize += 10;
			this.getMyPost()
		},
		methods: {
			getMyPost() {
				// 获取数据
				uni.$u.http.get("/api/table/searchList", {
					keyword: this.userName,
					pageIndex: 1,
					pageSize: this.myPostSize
				}).then(({
					data
				}) => {
					this.myPostList = data
				}).catch(err => {
					console.log(err)
				})
				// 获取帖子总数
				this.$u.get('/api/table/searchCount', {
					keyword: this.userName,
				}).then(res => {
					this.myPostCount = res.data;
				}).catch(err => {
					console.log(err)
				})
			}
		},
		onLoad(option) {
			console.log(option.userName)
			this.userName = option.userName
			this.getMyPost()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.postStyle {
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 10rpx;
	}
</style>

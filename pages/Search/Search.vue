<template>
	<view>
		<u-navbar :is-back="true" title="搜索" :background="background" title-color="#FFFFFF"
			back-icon-color="#fff" :border-bottom='false'>
		</u-navbar>
		<view class="search">
			<u-search placeholder="输入关键字" v-model="keyword" :animation="true" bg-color="#ededed" :focus='true'
				@custom="search" @search="search"></u-search>
		</view>
		<view class="hint" v-show="hintShow === true">
			<p>请在搜索框输入关键字进行搜索</p>
		</view>
		<view class="hint" v-show="noData === true">
			<p>暂无搜索结果</p>
		</view>
		<view class="content">
			<ul :data='serachData' class='serachData'>
				<li v-for="item in serachData" :keys='item.id'>
					<post :item="item"></post>
					<view class="operate layout_flex">
						<view class="actionPost">
							<view @tap="Like(item.id,item.support)" :class="{ likeActive:item.support }">
								<u-icon name="thumb-up-fill"></u-icon>
								{{item.supportCount || 0}}
							</view>
							<view class="comment" @tap="Details(item.id)">
								<u-icon name="chat"></u-icon>
								{{item.commentCount || 0}}
							</view>
						</view>
						<view @tap="Details(item.id)"><span>查看详情</span></view>
					</view>
				</li>
			</ul>
		</view>
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
				// 搜索值
				keyword: '',
				// 自定义顶部导航-渐变色
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				// 搜索数据的列表
				serachData: [],
				// 是否显示提示文字
				hintShow: true,
				// 是否显示没有数据
				noData: false
			}
		},
		methods: {
			search() {
				// 获取帖子列表
				this.$u.get('/api/table/searchList', {
					pageIndex: 1,
					pageSize: 10,
					keyword: this.keyword,
				}).then(res => {
					this.noData = false
					this.serachData = res.data;
					this.hintShow = false
					let newArr = [...this.serachData]
					if(newArr.length === 0){
						this.noData = true
					}
				})
			},
			// 点赞
			Like(id, support) {
				if (support) {
					// 取消点赞
					this.$u.delete('/api/table/support?tableId=' + id).then(res => {
						if (res.code !== 200) {
							this.error(res)
						} else {
							this.search()
						}
					})
				} else {
					// 发送点赞请求
					this.$u.put('/api/table/support?tableId=' + id).then(res => {
						if (res.code !== 200) {
							this.error(res)
						} else {
							console.log(res)
							this.search()
						}
					})
				}
			},
			// 转到评论页
			Details(id) {
				uni.navigateTo({
					url: `../Details/Details?id=${id}`
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.search {
		padding: 0 3vw;
		height: 7vh;
		line-height: 7vh;
		width: 100%;
		background-image: linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95));
		box-shadow: 0 4rpx 5rpx #b0a2a2;
		margin-bottom: 10rpx;
		position: fixed;
		z-index: 999;
	}

	.hint {
		margin-top: 10vh;
		color: #999;
		text-align: center;
	}

	.serachData {
		margin-top: 7vh;

		&>li {
			background-color: #fff;
			margin-bottom: 10rpx;
			padding: 30rpx;
		}
	}
	// 操作帖子和查看详情
	.operate {
		color: #999;
		font-size: 25rpx;
	}
	// flex布局
	.layout_flex {
		display: flex;
		justify-content: space-between;
	}
	// 点赞后的样式
	.likeActive {
		color: #ff7e7e;
	}
	
	.comment {
		margin-left: 10rpx
	}
	
	// 操作帖子
	.actionPost {
		display: flex;
		justify-content: left;
		font-size: 30rpx;
	
		.like {
			padding-right: 20rpx;
		}
	}
</style>

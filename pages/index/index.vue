<template>
	<view>
		<u-navbar :is-back="false" title=" " :background="background" title-color="#FFFFFF">
			<view class="slot-wrap">
				<u-search placeholder="请输入内容" :show-action="false" @tap='gotoSearch'></u-search>
			</view>
		</u-navbar>
		<view>
			<ul :data='postData' class='post'>
				<li class="postList" v-for="(item,index) in postData" :keys='item.id'>
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
		<!-- 顶部提示 -->
		<u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
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
				postData: '',
				searchValue: '',
				itemList: {},
				// 帖子页数
				postPage: 1,
				// 每页帖子个数
				postSize: 10,
				// 帖子总数
				postCount: '',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '正在加载中',
					nomore: '没有更多帖子'
				},
				status: 'loading',
				// 自定义顶部导航-渐变色
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				dataInfo: {},
				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44
			}
		},
		onReachBottom() {
			if (this.postSize >= this.postCount) {
				this.status = 'nomore'
				return;
			} else this.status = 'loading';
			this.postSize += 10;
			this.getPost()
		},
		onPullDownRefresh() {
			console.log('refresh');
			uni.reLaunch({
				url: '../index/index'
			});
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			// 点赞
			Like(id, support) {
				if (support) {
					// 取消点赞
					this.$u.delete('/api/table/support?tableId=' + id).then(res => {
						this.showTips(this.getMsg(res))
						if (res.code === 200) {
							this.getPost()
						}
					})
				} else {
					// 发送点赞请求
					this.$u.put('/api/table/support?tableId=' + id).then(res => {
						this.showTips(this.getMsg(res))
						if (res.code === 200) {
							this.getPost()
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
			gotoSearch() {
				uni.navigateTo({
					url: '../Search/Search'
				})
			},
			getPost() {
				// 获取帖子列表
				this.$u.get('/api/table/pageList', {
					pageIndex: this.postPage,
					pageSize: this.postSize
				}).then(res => {
					if (res.code !== 200) {
						this.error(res)
					} else {
						this.postData = res.data;
					}
				})
				// 获取帖子总数
				this.$u.get('/api/table/count').then(res => {
					if (res.code !== 200) {
						this.error(res)
					} else {
						this.postCount = res.data;
					}
				})
			},
			// 打开顶部提示
			showTips(res) {
				this.$refs.uTips.show({
					title: res.dataMsg,
					type: res.dataType,
					duration: '1500'
				});
			},
		},
		mounted() {
			this.getPost()
		}
	}
</script>
<style lang="less">
	page {
		background-color: #ededed;
	}

	// 自定义导航栏插槽的样式
	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;
	}


	// 整个帖子的样式
	.post {
		li {
			height: auto;
			margin-bottom: 10rpx;
			padding: 30rpx;
			background-color: #FFFFFF;
		}

		li:last-child {
			margin: 0;
		}
	}

	// 帖子内容
	.item_content {
		margin: 40rpx 0 40rpx 0;
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

	// 操作帖子
	.actionPost {
		display: flex;
		justify-content: left;
		font-size: 30rpx;

		.like {
			padding-right: 20rpx;
		}
	}

	// 点赞后的样式
	.likeActive {
		color: #ff7e7e;
	}

	.comment {
		margin-left: 10rpx
	}
</style>

<template>
	<view>
		<u-navbar :is-back="true" :customBack="getIndex" title="表白详情" :background="background" title-color="#FFFFFF" back-icon-color="#fff">
		</u-navbar>
		<view class="postList">
			<post :item="detailsData"></post>
			<view class="operate layout_flex">
				<view class="actionPost">
					<view @tap="Like(detailsData.id,detailsData.support)" :class="{ likeActive:detailsData.support }">
						<u-icon name="thumb-up-fill"></u-icon>
						{{detailsData.supportCount || 0}}
					</view>
				</view>
				{{date(detailsData.createTime)}}
			</view>
		</view>
		<view class="CommentTitle">
			<view style="display: flex;align-items: center;">
				<span style='width: 10rpx;height: 50rpx;background-color: #FF3853;display: block'></span>
				<view class="CommentTT">评论</view>
			</view>
			<u-button size="mini" style="margin-right: 20rpx;" @click='commentShow = true'>发布评论</u-button>
		</view>
		<ul :data='commentList'>
			<li v-for="item in commentList" :keys='item.id'>
				<comment :item="item"></comment>
			</li>
		</ul>

		<view class="commentNomore" v-if="commentList.length === 0">
			暂时没有评论
		</view>
		<!-- 发布评论弹出层 -->
		<u-popup v-model="commentShow" mode="bottom" border-radius="14" height="auto" :safe-area-inset-bottom="true">
			<view class="writeComment">
				<u-input v-model="writeComment" type="textarea" border="true" height="260" auto-height="true"
					placeholder='写评论' :clearable="false" />
				<view class="smallImg" @click="previewImage()">
					<view v-for="(item,index) in tempFilePaths" :key="index" style="position: relative;">
						<u-image :src="item" width="220rpx" height="200rpx" mode=""></u-image>
						<view @tap.stop>
							<view class="delImg" v-if="tempFilePaths" @click="delImg(index)">
								<u-icon name="close" size="20rpx"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="layout_flex publishComment">
					<u-icon name="photo" size="40" @click="clickUpload()"></u-icon>
					<span v-if='writeComment===""' style='color: #FFB16E;'>发送</span>
					<span v-else style='color: #FF6700;' @click='publishComment()'>发送</span>
				</view>
			</view>
		</u-popup>
		<!-- 顶部提示 -->
		<u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" margin-top='20' margin-bottom="30" />
	</view>
</template>

<script>
	import post from '../post/post.vue'
	import comment from './comment.vue'
	export default {
		components: {
			post,
			comment
		},
		data() {
			return {
				// 详情页数据
				detailsData: '',
				// 评论数据
				commentList: '',
				// 帖子id
				postID: '',
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				// 评论列表的个数
				commentSize: 10,
				// 是否弹出发布评论
				commentShow: false,
				// 评论内容
				writeComment: '',
				// 上传图片的地址
				actionImg: this.http + '/api/file/image',
				// 添加图片的链接
				tempFilePaths: '',
				// 上传图片的列表
				imageList: [],
				// 每个评论的图片列表
				commentImgList: '',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '正在加载中',
					nomore: '没有更多评论'
				},
				status: 'nomore',
				dataInfo: {},
				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44
			}
		},
		onReachBottom() {
			// console.log(this.commentSize)
			// console.log(this.detailsData.commentCount)
			if (this.commentSize >= this.detailsData.commentCount) {
				this.status = 'nomore'
				return ;
			}else this.status = 'loading';
			this.commentSize += 10;
			this.getCommentList()
		},
		methods: {
			// 点赞
			Like(id, support) {
				if (support) {
					// 取消点赞
					this.$u.delete('/api/table/support?tableId=' + id).then(res => {
						this.dataInfo = this.getMsg(res)
						console.log(this.getMsg(res))
						this.showTips()
						if (res.code === 200) {
							this.getPost()
						}
					})
				} else {
					// 发送点赞请求
					this.$u.put('/api/table/support?tableId=' + id).then(res => {
						this.dataInfo = this.getMsg(res)
						console.log(this.getMsg(res))
						this.showTips()
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
			getPost() {
				// 获取单个帖子列表
				this.$u.get('/api/table/table', {
					id: this.postID
				}).then(res => {
					if (res.code !== 200) {
						this.error(res)
					} else {
						this.detailsData = res.data
					}
				})
			},
			// 点击上传图片
			clickUpload() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						if (tempFilePaths.length <= 5) {
							this.tempFilePaths = tempFilePaths;
						} else console.log("请上传小于等于五个图片")



						for (let i = 0; i < this.tempFilePaths.length; i++) {
							const uploadTask = uni.uploadFile({
								url: this.actionImg, //仅为示例，非真实的接口地址
								filePath: this.tempFilePaths[i],
								name: 'file',
								header: {
									token: uni.getStorageSync('token')
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes);
									let successData = JSON.parse(uploadFileRes.data);
									this.dataInfo = this.getMsg(successData)
									this.showTips()
									this.imageList.push(successData.data);
									console.log(this.imageList)
								}
							});
						}
					}
				});
			},
			// 点击删除图片
			delImg(index) {
				this.tempFilePaths = this.tempFilePaths.slice(index + 1);
				console.log(this.tempFilePaths);
			},
			// 预览图片
			previewImage() {
				uni.previewImage({
					urls: this.tempFilePaths,
				});
			},
			// 发送评论
			publishComment() {
				const imgList = JSON.stringify(this.imageList)
				console.log(imgList)
				console.log(typeof imgList)
				this.$u.post('/api/comment/add', {
					tableId: this.postID,
					content: this.writeComment,
					images: imgList,
				}).then(res => {
					console.log(res)
					this.writeComment = '';
					this.tempFilePaths = '';
					this.imageList = [];
					this.commentShow = false;
					this.getCommentList()
					this.dataInfo = this.getMsg(res)
					console.log(this.getMsg(res))
					this.showTips()
				})
			},
			// 获取评论列表
			getCommentList() {
				this.$u.get('/api/comment/pageList', {
					tableId: this.postID,
					pageIndex: 1,
					pageSize: this.commentSize
				}).then(res => {
					if (res.code !== 200) {
						this.error(res)
					} else {
						console.log(res)
						this.commentList = res.data
					}
				})
			},
			// 跳转到上一页并刷新页面
			getIndex() {
				uni.switchTab({
					url: '../index/index',
					success() {
						// getCurrentPages() 方法获取当前页面栈的实例,以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面
						// getCurrentPages().pop();//当前页面
						var page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
						page.onLoad();
					}
				})
			},
			// 打开顶部提示
			showTips() {
				console.log(this.dataInfo.dataMsg)
				this.$refs.uTips.show({
					title: this.dataInfo.dataMsg,
					type: this.dataInfo.dataType,
					duration: '1500'
				});
			},
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.postID = option.id

			// 获取单个帖子列表
			this.getPost()

			// 获取评论列表
			this.getCommentList()
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	// 整个帖子的样式
	.postList {
		background-color: #FFFFFF;
		height: auto;
		margin-bottom: 10rpx;
		padding: 30rpx;
	}

	// flex布局
	.layout_flex {
		display: flex;
		justify-content: space-between;
	}

	// 帖子的评论点赞和查看详情
	.operate {
		color: #999;
		font-size: 25rpx;
	}

	// 操作帖子
	.actionPost {
		display: flex;
		justify-content: left;
		font-size: 30rpx;

	}

	// 点赞后的样式
	.likeActive {
		color: #ff7e7e;
	}

	// 暂时没有评论
	.commentNomore {
		width: 100%;
		height: 5vh;
		background-color: #fff;
		text-align: center;
	}

	// 发布评论样式
	.writeComment {
		padding: 20rpx;
	}

	// 写评论底部的发送的样式
	.publishComment {
		margin: 0 15rpx;

		span {
			font-size: 35rpx;
		}
	}

	.smallImg {
		display: flex;
		padding: 20rpx 0;
	}

	.delImg {
		width: 50rpx;
		height: 48rpx;
		border-radius: 50%;
		text-align: center;
		background-color: rgba($color: #BEBEBE, $alpha: 0.5);
		position: absolute;
		right: 0;
		top: 0;
	}
	// 评论标题样式
	.CommentTitle {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		padding: 20rpx 0 20rpx 0;
	
		.CommentTT {
			font-weight: bold;
			color: #000;
			margin-left: 15rpx;
		}
	}
</style>

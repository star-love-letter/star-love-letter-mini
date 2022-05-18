<template>
	<view>
		<u-navbar :is-back="true" :customBack="getIndex" title="表白详情" :background="background" title-color="#FFFFFF"
			back-icon-color="#fff">
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
				<view class="smallImg">
					<view v-for="(item,index) in tempFilePaths" :key="index" style="position: relative;width: 33.3%;">
						<u-image :src="item" width="220rpx" height="200rpx" mode="aspectFit"
							@click="previewImage(index)"></u-image>
						<view @tap.stop>
							<view class="delImg" @click="delImg(index)">
								<u-icon name="close" size="20rpx"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="publishComment">
					<u-icon style="float: left;" v-if="updataPhoneNum < 3" name="photo" size="40"
						@click="clickUpload()"></u-icon>
					<span v-if='writeComment !== "" && UPFlag === true' style='color: #FF6700; float: right;' @click='publishComment()'>发送</span>
					<span v-else style='color: #FFB16E; float: right;'>发送</span>
				</view>
			</view>
		</u-popup>
		<!-- 顶部提示 -->
		<u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
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
				tempFilePaths: [],
				// 上传图片的列表
				imageList: [],
				// 每个评论的图片列表
				commentImgList: '',
				iconType: 'flower',
				dataInfo: {},
				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44,
				updataPhoneNum: 0,
				// 上传图片列表
				updataPhotoList: '',
				// 判断图片是否上传完成
				UPFlag: true,
				// 判断是否点赞
				isSupport: false,
				// 是否添加评论
				isAddComment: false
			}
		},
		onReachBottom() {
			// console.log(this.commentSize)
			// console.log(this.detailsData.commentCount)
			if (this.commentSize >= this.detailsData.commentCount) {
				this.status = 'nomore'
				return;
			} else this.status = 'loading';
			this.commentSize += 10;
			this.getCommentList()
		},
		methods: {
			// 点赞
			Like(id, support) {
				this.isSupport = true
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
			// 获取上传图片的链接
			clickUpload() {
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						this.updataPhotoList = chooseImageRes.tempFilePaths[0];
						this.tempFilePaths.push(chooseImageRes.tempFilePaths[0]);
						this.updataPhoneNum = this.tempFilePaths.length;
						this.updatePhoto()
					}
				});
			},
			// 上传图片到服务器
			updatePhoto() {
				const uploadTask = uni.uploadFile({
					url: this.actionImg,
					filePath: this.updataPhotoList,
					name: 'file',
					header: {
						token: uni.getStorageSync('token')
					},
					success: (uploadFileRes) => {
						this.UPFlag = false;
						let successData = JSON.parse(uploadFileRes.data);
						this.imageList.push(successData.data);
						this.UPFlag = true;
					}
				})
			},
			// 点击删除图片
			delImg(index) {
				this.tempFilePaths.splice(index, 1);
				this.imageList.splice(index, 1);
				this.updataPhoneNum -= 1;
			},
			// 预览图片
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.tempFilePaths
				});
			},
			// 发送评论
			publishComment() {
				this.isAddComment = true
				const imgList = JSON.stringify(this.imageList)
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
				if(this.isAddComment || this.isSupport){
					uni.reLaunch({
						url: '../index/index'
					});					
				}else{
					uni.switchTab({
						url: '../index/index',
					})					
				}
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

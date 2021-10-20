<template>
	<view>
		<!-- 评论 -->
		<view class="Comment">
			<view class="CommentContent">
				<!-- 用户头像 -->
				<view class="left">
					<image src="@/static/star.png" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="top">
						<view class="name" @tap="UserInfo(item.userPublic)">{{ item.userPublic.name }}</view>
					</view>
					<view class="content">{{ item.content }}</view>

					<view :key="index" v-for="(img,index) in imgSrc" class="imgList">
						<view @tap.stop>
							<u-image width="100%" height="180rpx" :src="img" @click="imgPreview(index)"
								:mode="imgMode">
								<u-loading slot="loading"></u-loading>
								<view slot="error" style="font-size: 24rpx;">暂无图片</view>
							</u-image>
						</view>
					</view>
					<view class="bottom">
						{{ date(item.createTime) }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['item'],
		data() {
			return {
				// 图片链接数组
				imgSrc: [],
				flag: false,
				// 图片的裁剪
				imgMode: 'aspectFill',
			}
		},
		methods: {
			// 解析图片列表
			getImgList() {
				if (this.item.images !== null) {
					// 解析之前 判断一下 解析的是不是json字符串
					if (!this.item.images) {
						return
					}
					// 解析json
					let img_src = JSON.parse(this.item.images);
			
					for (let i = 0; i < img_src.length; i++) {
						if (!this.flag) {
							this.imgSrc.push(this.http+'/api/file/image/'+ img_src[i]);
						}
					}
				}
				this.flag = true;
			},
			// 预览图片
			imgPreview(index) {
				// 预览图片
				uni.previewImage({
					urls: this.imgSrc,
					current: index
				});
			},
			// 跳转到用户信息页
			UserInfo(userPublic) {
				uni.navigateTo({
					url: `../UserInfo/UserInfo?lastTime=${userPublic.lastTime}&createTime=${userPublic.createTime}&name=${userPublic.name}&id=${userPublic.id}&email=${userPublic.email}`
				});
			},
		},
		created() {
			this.getImgList()
		},
	}
</script>

<style lang="scss">
	.Comment {
		background-color: #FFFFFF;
		padding: 20rpx 0 20rpx 0;
		border-bottom: 1px solid #f0f0f0;
		// 评论整体样式
		.CommentContent {
			display: flex;
			padding: 30rpx;

			.left {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}

			.right {
				flex: 1;
				padding-left: 20rpx;
				font-size: 30rpx;

				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;

					.name {
						display: inline-block;
						color: #0000ff;
						font-weight: normal;
					}

					.highlight {
						color: #5677fc;

						.num {
							color: #5677fc;
						}
					}
				}

				.content {
					margin-bottom: 10rpx;
				}

				.bottom {
					margin-top: 20rpx;
					display: flex;
					font-size: 24rpx;
					color: #9a9a9a;

					.reply {
						color: #5677fc;
						margin-left: 10rpx;
					}
				}
			}
		}
	}
	// 图片列表
	.imgList {
		width: calc(100% / 3 - 30rpx);
		display: inline-block;
		margin-right: 10rpx;
	}
</style>

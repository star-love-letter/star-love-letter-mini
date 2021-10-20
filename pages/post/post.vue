<template>
	<view>
		<view class="Confession">
			{{item.sender||'表白者'}}
			<u-icon name="heart-fill" color="red"></u-icon>
			{{item.recipient||'被表白者'}}
		</view>
		<view @tap="Details(item.id)">
			<view class="item_content">
				<view style="margin-bottom: 20rpx;">
					{{item.content||'表白内容'}}
				</view>
				<view :key="index" v-for="(img,index) in imgSrc" class="imgList">
					<view @tap.stop>
						<u-image width="100%" height="200rpx" :src="img" @click="imgPreview(index)" :mode="imgMode">
							<u-loading slot="loading"></u-loading>
							<view slot="error" style="font-size: 24rpx;">暂无图片</view>
						</u-image>
					</view>
				</view>
			</view>
		</view>
		<view class="userPublic">
			<view style="display: inline-block;">表白用户：</view>
			{{Anonymous(item.anonymous)}}
			<view class="userPublicName" @tap="UserInfo(item.userPublic)">{{item.userPublic.name}}</view>
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
				// 搜索框的值
				searchValue: '',
				// 自定义顶部导航-渐变色
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				// 是否点赞（点过赞为true,默认为false）
				isLike: '',
				// 图片的裁剪
				imgMode: 'aspectFill',
				flag: false
			}
		},
		created() {
			this.getImgList()
		},
		watch: {
			item: function(val, oldVal) {
				this.getImgList()
			}
		},
		methods: {
			// 跳转到用户信息页
			UserInfo(userPublic) {
				uni.navigateTo({
					url: `../UserInfo/UserInfo?lastTime=${userPublic.lastTime}&createTime=${userPublic.createTime}&name=${userPublic.name}&id=${userPublic.id}&email=${userPublic.email}`
				});
			},
			// 判断是否匿名
			Anonymous(index) {
				if (index) {
					return '[匿名]';
				}
				return ''
			},
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
			// 转到评论页
			Details(id) {
				uni.navigateTo({
					url: `../Details/Details?id=${id}`
				});
			}
		}
	}
</script>
<style lang="scss">
	// 自定义导航栏插槽的样式
	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		/* 如果您想让slot内容与导航栏左右有空隙 */
		padding: 0 30rpx;
	}

	// 表白人与被表白人的样式
	.Confession {
		font-size: 30rpx;
		font-weight: bold;
	}

	// flex布局
	.layout_flex {
		display: flex;
		justify-content: space-between;
	}


	// 帖子内容
	.item_content {
		margin: 25rpx 0 20rpx 0;

		// 图片的样式
		.u-image {
			margin: 20rpx 10rpx 10rpx 0;
		}
	}

	// 表白者的用户信息
	.userPublic {
		color: #616161;
		font-size: 26rpx;
		font-weight: bold;
		margin-bottom: 20rpx;

		.userPublicName {
			display: inline-block;
			color: #0000ff;
			font-weight: normal;
		}
	}

	// 图片列表
	.imgList {
		width: calc(100% / 3 - 30rpx);
		display: inline-block;
		margin-right: 10rpx;
	}

	// 点赞的样式
	.comment {
		margin-left: 15rpx
	}
</style>

<template>
	<view>
		<u-navbar :is-back="false" title="表白" :background="background" title-color="#FFFFFF">
		</u-navbar>
		<u-form :model="form" ref="uForm" label-width="200rpx">
			<u-form-item label="表白人:" prop="Name">
				<u-input v-model="form.Name" placeholder="请输入表白者" />
			</u-form-item>
			<u-form-item label="性别:" prop="Sex">
				<u-input v-model="form.Sex" type="select" @click="sexShow = true" placeholder="表白者性别" />
				<u-select v-model="sexShow" :list="sex" @confirm="selectSex"></u-select>
			</u-form-item>
			<u-form-item label="被表白人:" prop="beName">
				<u-input v-model="form.beName" placeholder="请输入被表白者" />
			</u-form-item>
			<u-form-item label="性别:" prop="beSex">
				<u-input v-model="form.beSex" type="select" @click="be_sexShow = true" placeholder="表白者性别" />
				<u-select v-model="be_sexShow" :list="be_sex" @confirm="be_selectSex"></u-select>
			</u-form-item>
			<u-form-item label="表白内容:" prop="content">
				<u-input v-model="form.content" type="textarea" height="100" auto-height="true" placeholder=" " />
			</u-form-item>
			<div class="UP_photo">
				<view v-for="(item,index) in tempFilePaths" :key="index" class="Photo">
					<u-image :src="item" width="200rpx" height="200rpx" mode="aspectFit" @click="previewImage(index)">
					</u-image>
					<view @tap.stop>
						<view class="delImg" @click="delImg(index)">
							<u-icon name="close" size="20rpx"></u-icon>
						</view>
					</view>
				</view>
				<div class="upDataPhoto" v-if="updataPhoneNum < 6" @click='updataPhotoFn'>
					<div class="updataflex">
						<span>+</span>
						<p style="font-size: 25rpx;">上传图片</p>
					</div>
				</div>
			</div>
			<u-form-item label="是否匿名:" prop="checkedAnonymous">
				<u-switch slot="right" v-model="checkedAnonymous" active-color="green" inactive-color="#eee"></u-switch>
			</u-form-item>
			<u-form-item label="是否邮箱通知:" prop="checkedNotifyEmail">
				<u-switch slot="right" v-model="checkedNotifyEmail" active-color="green" inactive-color="#eee">
				</u-switch>
			</u-form-item>
			<view class="button">
				<!-- 发布按钮 -->
				<u-button type="success" @click='Publish()' shape="circle" :loading="!showUpdateImg" :disabled='!showUpdateImg'>
					{{publishText}}
				</u-button>
			</view>
		</u-form>
		<!-- 发布成功弹窗 -->
		<u-top-tips ref="Publish" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
		<!-- 上传图片成功弹窗 -->
		<u-top-tips ref="submitImg" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				// 表白者性别Select下拉
				sexShow: false,
				// 是否匿名
				checkedAnonymous: false,
				// 是否邮箱通知
				checkedNotifyEmail: true,
				// 被表白者性别下拉
				be_sexShow: false,
				// 上传图片的地址
				actionImg: this.http + '/api/file/image',
				// 添加图片的链接
				tempFilePaths: [],
				// 上传图片的列表
				imageList: [],
				// 上传图片列表
				updataPhotoList: '',
				// 判断图片是否上传完成
				showUpdateImg: true,
				updataPhoneNum: 0,
				sex: [{
						value: '1',
						label: '男'
					},
					{
						value: '2',
						label: '女'
					},
					{
						value: '0',
						label: '保密'
					}
				],
				be_sex: [{
						value: '1',
						label: '男'
					},
					{
						value: '2',
						label: '女'
					},
					{
						value: '0',
						label: '未知'
					}
				],
				form: {
					Name: '',
					Sex: '',
					Sex_Num: '',
					beName: '',
					beSex: '',
					beSex_Num: '',
					content: ''
				},
				rules: {
					Name: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					Sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					beName: [{
						required: true,
						message: '请输入姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					beSex: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '请输入表白内容',
						trigger: 'blur'
					}],
				},
				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44
			}
		},
		computed: {
			publishText() {
				return this.showUpdateImg ? '发布' : '图片上传中'
			}
		},
		methods: {
			// 上传图片的函数
			updataPhotoFn() {
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
				this.showUpdateImg = false;
				const uploadTask = uni.uploadFile({
					url: this.actionImg,
					filePath: this.updataPhotoList,
					name: 'file',
					header: {
						token: uni.getStorageSync('token')
					},
					success: (uploadFileRes) => {
						console.log(uploadFileRes);
						let successData = JSON.parse(uploadFileRes.data);
						this.imageList.push(successData.data);
						this.showUpdateImg = true;
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
			// 表白者性别
			selectSex(value) {
				this.form.Sex = value[0].label;
				this.form.Sex_Num = value[0].value;
			},
			// 被表白者性别
			be_selectSex(value) {
				this.form.beSex = value[0].label;
				this.form.beSex_Num = value[0].value;
			},
			// 发布表白
			Publish() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let imageList = JSON.stringify(this.imageList)
						console.log(imageList)
						this.$u.http.post('/api/table/add', {
							"sender": this.form.Name,
							"senderSex": this.form.Sex_Num,
							"recipient": this.form.beName,
							"recipientSex": this.form.beSex_Num,
							"content": this.form.content,
							"anonymous": this.checkedAnonymous,
							"notifyEmail": this.checkedNotifyEmail,
							"images": imageList
						}).then(res => {
							this.showTipsPublish(this.getMsg(res))
							if (res.code === 200) {
								setTimeout(() => {							
									uni.reLaunch({
										url: '../index/index'
									});
								}, 1000)
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			// 发布成功顶部提示
			showTipsPublish(res) {
				console.log(res.dataMsg)
				this.$refs.Publish.show({
					title: res.dataMsg,
					type: res.dataType,
					duration: '2000'
				});
			},
			// 上传图片成功顶部提示
			showTipsImg() {
				this.$refs.submitImg.show({
					title: '上传成功',
					type: 'success',
					duration: '1500'
				});
			},
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
	}
</script>

<style lang="scss">
	.u-form {
		margin: 50rpx;
	}

	.button {
		text-align: center;
		margin: 40rpx;
	}

	.Prompt {
		width: 60vw;
		height: 20vh;
		margin: 40vh auto;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		h1 {
			font-size: 35rpx;
			font-weight: bold;
		}

		span {
			display: block;
			margin: 20rpx 0;
			text-indent: 2em;
		}
	}

	.upDataPhoto {
		display: inline-block;
		width: 200rpx;
		height: 200rpx;
		background-color: rgb(244, 245, 247);
		margin: 9rpx;

		.updataflex {
			width: 100%;
			height: 100%;
			font-size: 50rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
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

	.Photo {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		display: inline-block;
		margin: 9rpx;
	}

	.UP_photo {
		display: flex;
		flex-wrap: wrap;
	}
</style>

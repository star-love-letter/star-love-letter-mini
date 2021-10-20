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
			<u-form-item :label-position="label_position" label="上传图片">
				<u-upload ref="uUpload" :action="actionImg" :auto-upload="true" :header="uploadHeader" max-count="9"
					:deletable="deletable">
				</u-upload>
				<u-button @click="submit" throttle-time='1000'>上传</u-button>
			</u-form-item>
			<u-form-item label="是否匿名:" prop="checkedAnonymous">
				<u-switch slot="right" v-model="checkedAnonymous" active-color="green" inactive-color="#eee"></u-switch>
			</u-form-item>
			<u-form-item label="是否邮箱通知:" prop="checkedNotifyEmail">
				<u-switch slot="right" v-model="checkedNotifyEmail" active-color="green" inactive-color="#eee">
				</u-switch>
			</u-form-item>
			<view class="button">
				<u-button type="success" shape="circle" plain :ripple="true" @click="Publish">发布
				</u-button>
			</view>
		</u-form>
		<u-mask :show="closePrompt" @click="closePrompt = false">
			<view class="warp">
				<view class="Prompt">
					<view>
						<h1>注意:</h1>
						<span>图片上传完成后不能进行更改</span>
					</view>
					<view style="text-align: center;">
						<u-button @click="closePrompt = false" size="medium">确认</u-button>
					</view>
				</view>
			</view>
		</u-mask>

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
				showPublishSuccess: false,
				// 上传的头信息
				uploadHeader: {
					token: uni.getStorageSync('token'),
					'content-type': 'application/x-www-form-urlencoded'
				},
				// 上传图片的file路径
				imgList: [],
				// 是否显示图片右上角的删除按钮
				deletable: true,
				// 关闭遮罩层
				closePrompt: true,
				label_position: "left",
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
		methods: {
			// 上传图片
			submit() {
				let files = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				// 如果您不需要进行太多的处理，直接如下即可
				for (let i = 0; i < files.length; i++) {
					this.imgList.push(files[i].response.data);
				}
				this.deletable = false;
				console.log(files)
				this.showTipsImg()
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
						let imageList = JSON.stringify(this.imgList)
						console.log(imageList)
						this.$u.post('/api/table/add', {
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
								this.$refs.uUpload.clear();
								this.form = {
									Name: '',
									Sex: '',
									Sex_Num: '',
									beName: '',
									beSex: '',
									beSex_Num: '',
									content: ''
								}
								setTimeout(() => {
									uni.switchTab({
										url: '../index/index',
										success() {
											// 跳转指定页面后刷新
											// getCurrentPages()是当前页面栈
											// getCurrentPages().pop();//当前页面
											var page = getCurrentPages().pop();
											if (page == undefined || page == null) return;
											page.onLoad();
										}
									})
								}, 2000)
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

<style lang="less">
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
</style>

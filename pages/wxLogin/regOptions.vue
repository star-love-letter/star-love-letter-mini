<template>
	<view>
		<u-navbar :is-back="true" title="注册" :background="background" title-color="#FFFFFF" back-icon-color="#fff">
		</u-navbar>
		<view class="pageStyle">
			<p>选择注册方式</p>
			<u-button type="success" @click="wxReg_show = true">注册新用户</u-button>
			<u-button type="success" @click="bindAccount_show = true">绑定现有用户</u-button>
		</view>

		<!-- 通过微信注册弹出层 -->
		<u-popup v-model="wxReg_show" mode="center" border-radius="14" width='80%' height="42%">
			<view class="wxReg_popup">
				<p>注册</p>
				<u-form :model="regData" ref="reg_wxRef" :rules="RegFromRules" label-width="150rpx">
					<u-form-item label="注册名称:" prop="wx_name">
						<u-input v-model="regData.wx_name" placeholder="请填写名称" />
					</u-form-item>
					<u-form-item label="密码:" prop="wx_pwd">
						<u-input v-model="regData.wx_pwd" placeholder="请填写密码" type="password" />
					</u-form-item>
					<u-form-item label="重复密码:" prop="wx_pwdAgain">
						<u-input v-model="regData.wx_pwdAgain" placeholder="请重复填写密码" type="password" />
					</u-form-item>
					<u-form-item>
						<u-button @click="reg_wx()">注册</u-button>
					</u-form-item>
				</u-form>
			</view>
		</u-popup>
		<!-- 绑定现有用户弹出层 -->
		<u-popup v-model="bindAccount_show" mode="center" border-radius="14" width='80%' height="42%">
			<view class="bindAccount_popup">
				<p>登录</p>
				<view class="login">
					<u-form :model="accountData" ref="account_wxRef" :rules="accountFromRules" label-width="150rpx">
						<u-form-item label="id或邮箱:" prop="id">
							<u-input v-model="accountData.id" placeholder="请填写id或者邮箱" />
						</u-form-item>
						<u-form-item label="密码:" prop="password">
							<u-input v-model="accountData.password" placeholder="请填写密码" type="password" />
						</u-form-item>
						<u-form-item>
							<u-button @click="login()">登录</u-button>
						</u-form-item>
					</u-form>
				</view>
				<p>登录您现有账号，此操作会将您的账号与此微信号绑定</p>
			</view>
		</u-popup>
		<!-- 消息弹窗 -->
		<u-top-tips ref="msg_wxReg" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundImage: 'linear-gradient(90deg, rgb(255, 0, 69), rgb(255, 106, 95))'
				},
				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44,
				// 注册的数据
				regData: {
					wx_name: '',
					wx_pwd: '',
					wx_pwdAgain: '',
				},
				// 注册表单验证
				RegFromRules: {
					wx_name: [{
						required: true,
						message: '请输入名称',
						trigger: 'change',
					}, {
						max: 8,
						message: '名称不能超过8个字',
						trigger: 'blur'
					}],
					wx_pwd: [{
						required: true,
						message: '请输入密码',
						trigger: 'change'
					}, {
						min: 7,
						message: '密码必须大于6个字',
						trigger: 'blur'
					}, {
						max: 17,
						message: '密码必须小于18个字',
						trigger: 'blur'
					}],
					wx_pwdAgain: [{
							required: true,
							message: '请重复输入密码',
							trigger: 'change'
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								if (value !== this.regData.wx_pwd) {
									return false
								}
								return true
							},
							message: '两次输入密码不一致',
							trigger: 'blur'
						},
					],
				},
				wxCode: '',
				// 通过微信注册弹出层
				wxReg_show: false,
				// 弹窗的时间
				tipsDuration: 2000,
				// 绑定现有用户弹出层
				bindAccount_show: false,
				// 登录的数据
				accountData: {
					id: '',
					password: '',
				},
				// 登录表单验证
				accountFromRules: {
					id: [{
						required: true,
						message: '请输入用户id或邮箱',
						trigger: 'change',
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'change'
					}],
				}
			}
		},
		onReady() {
			this.$refs.reg_wxRef.setRules(this.RegFromRules);
			this.$refs.account_wxRef.setRules(this.accountFromRules);
		},
		methods: {
			// 微信注册消息弹窗
			show_wxRegMsg(res) {
				console.log(res.dataMsg)
				this.$refs.msg_wxReg.show({
					title: res.dataMsg,
					type: res.dataType,
					duration: this.tipsDuration
				});
			},
			// 登录账号获取token
			login() {
				this.$refs.account_wxRef.validate((valid) => {
					if (valid) {
						// 账号登录
						this.$u.post('/api/user/login', {
							id: this.accountData.id,
							password: this.accountData.password
						}).then(res => {
							console.log(res)
							uni.setStorageSync('token', res.data);
							let that = this
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {
									console.log(loginRes)
									// 3、wx获取登录用户code
									let wxCode = loginRes.code
									that.$u.post('/api/user/bindWeChatByCode', {
										code: wxCode,
									}).then(res => {
										that.show_wxRegMsg(that.getMsg(res))
										that.bindAccount_show = false
										if (res.code !== 200) {
											setTimeout(() => {
												that.accountData.password = ''
												that.bindAccount_show = true
											}, 1500)
										}else{
											that.accountData.id = ''
											that.accountData.password = ''
											setTimeout(() => {
												uni.redirectTo({
												    url: './wxLogin',
													success() {
														// 跳转指定页面后刷新
														// getCurrentPages()是当前页面栈
														// getCurrentPages().pop();//当前页面
														var page = getCurrentPages().pop();
														if (page == undefined || page == null) return;
														page.onLoad();
													}
												});
											}, that.tipsDuration)
										}
									})
								}
							});
						})
					}
				})
			},
			// 通过微信注册
			reg_wx() {
				this.$refs.reg_wxRef.validate((valid) => {
					if (valid) {
						let that = this;
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								console.log(loginRes)
								// 3、wx获取登录用户code
								let wxCode = loginRes.code
								that.$u.post('/api/user/addByWeChat', {
									code: wxCode,
									password: that.regData.wx_pwd,
									name: that.regData.wx_name
								}).then(res => {
									that.show_wxRegMsg(that.getMsg(res))
									console.log(res)
									that.wxReg_show = false
									if (res.code !== 200) {
										setTimeout(() => {
											that.regData.wx_pwd = ''
											that.regData.wx_pwdAgain = ''
											that.wxReg_show = true
										}, 1500)
									}else{
										that.regData.wx_name = ''
										that.regData.wx_pwd = ''
										that.regData.wx_pwdAgain = ''
										setTimeout(() => {
											// 注册成功后关闭页面跳转登录界面
											uni.redirectTo({
											    url: './wxLogin',
												success() {
													// 跳转指定页面后刷新
													// getCurrentPages()是当前页面栈
													// getCurrentPages().pop();//当前页面
													var page = getCurrentPages().pop();
													if (page == undefined || page == null) return;
													page.onLoad();
												}
											});
										}, that.tipsDuration)
									}
								})
							}
						});
					}
				})
			},
		},
	}
</script>

<style lang="less">
	.wxReg_popup,
	.bindAccount_popup {
		padding: 8%;
	}
	.pageStyle{
		padding: 0 20rpx;
		margin-top:20vh;
		p{
			text-align: center;
			font-size: 40rpx;
		}
		.u-button{
			margin-top: 20rpx;
		}
	}
</style>

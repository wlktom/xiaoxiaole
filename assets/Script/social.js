/**
 * @author uu
 * @file  排行榜组件
 * @description 用户点击查看排行榜才检查授权,如果此时用户没有授权则进入授权界面
 */
cc.Class({
	extends: cc.Component,
	properties: {
		display: cc.Sprite,
		groupDisplay: cc.Sprite,
		_isShow: false,
		// score: 0
	},
	isSharing: false,
	init(c) {
		let self = this
		this._controller = c
		wx.showShareMenu({
			withShareTicket: true
		})
		wx.onShareAppMessage(function () {
			return {
				title: "开局只是个农民，现在已经做到宰相",
				// imageUrlId: 'oxEwGvClT0uldQ470pM84w',
				imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
			}
		})
		// this.display.node.width = window.width
		//this.display.node.height = window.height
		//this.display.node.getComponent(cc.WXSubContextView).enabled = false;
		//   this.tex = new cc.Texture2D();
		//TODO: 微信小游戏导致音乐自动关闭 处理失败
		// 监听
		wx.onAudioInterruptionEnd(() => {
			c.musicMgr.pauseBg()
			c.musicMgr.resumeBg()
		})
		wx.onShow((options) => {
			// console.log(options)
			if (options.scene == 1044) {
				wx.postMessage({
					message: 'group',
					shareTicket: options.shareTicket
				})
				c.openGroupRank()
				this.display.node.active = false
				c.totalRank.active = false
			}
			cc.director.resume()
			// if (!self.hasShared && self.isSharing && self._controller.game._status == 1) {
			// 	// TODO 分享成功
			// 	self.onItemShareSuccess()
			// }
		})
		wx.onHide(() => {
			cc.director.pause()
		})
		// 获取最高官阶
		this.getHighestLevel()
	},
	onItemShareSuccess() {
		this.hasShared = true
		this._controller.game.fakeShareSuccess()
	},
	getHighestLevel() {
		let highLevel = wx.getStorageSync('highLevel')
		return highLevel
	},
	getHighestScore() {
		let score = wx.getStorageSync('highScore')
		return score
	},
	// --------------- share ----------------
	onShareButton() {
		var self = this;
		wx.shareAppMessage({
			title: "我终于当上了" + this._controller.scoreMgr.levelData[this._controller.scoreMgr.level - 1].name + ",不服来战",
			// imageUrlId: 'oxEwGvClT0uldQ470pM84w',
			imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
		})
	},
	onUsualShareButton() {
		wx.shareAppMessage({
			title: "开局只是个农民，现在已经做到宰相",
			// imageUrlId: 'oxEwGvClT0uldQ470pM84w',
			imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
		})
	},
	onItemShareButton() {
		if (!this.hasShared) {
			this.isSharing = true
		} else {
			// 提示玩家 当前局已分享
			return
		}
		wx.shareAppMessage({
			title: "开局只是个农民，现在已经做到宰相",
			// imageUrlId: 'oxEwGvClT0uldQ470pM84w',
			imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
		})
	},
	onShakePhone() {
		wx.vibrateShort()
	},
	// ---------------分数上传---------------
	onGameOver(level, score) {
		//上传分数
		//打开开放域
		this.score = score
		let highLevel = level
		let highScore = score
		let self = this
		highLevel = wx.getStorageSync('highLevel')
		highLevel = parseInt(highLevel)
		if (highLevel) {
			highLevel = highLevel < level ? level : highLevel
		} else {
			highLevel = level
		}
		highScore = wx.getStorageSync('highScore')
		if (highScore) {
			highScore = parseInt(highScore)
			highScore = highScore < score ? score : highScore
		} else {
			highScore = score
		}
		var highLevelName = this._controller.gameData.json.levelData[highLevel - 1].name
		wx.setStorageSync('highLevel', highLevel + '')
		wx.setStorageSync('highScore', highScore + '')
		self._controller.scoreMgr.failHighScore.string = "您的最高分:" + (highScore + '')
		var kvDataList = new Array()
		kvDataList.push({
			key: "highLevel",
			value: highLevelName,
		}, {
			key: "highScore",
			value: highScore + '',
		})
		wx.setUserCloudStorage({
			"KVDataList": kvDataList,
			success: () => {
				//  self.showRank()
			},
			fail: (res) => {
				//   console.log(res)
			}
		})
	},
	showRank() {
		wx.postMessage({
			message: 'Show'
		})
		this.display.node.active = true
		this._isShow = true
	},
	// switchRankType() {
	//   wx.postMessage({
	//     message: 'switchRank'
	//   })
	//   this._isShow = true
	// },
	closeRank() {
		this.display.node.active = false
		wx.postMessage({
			message: 'Hide'
		})
		this._isShow = false
	},
	showGroupRank() {
		wx.postMessage({
			message: 'Show'
		})
		this.groupDisplay.node.active = true
		this._isShow = true
	},
	// switchRankType() {
	//   wx.postMessage({
	//     message: 'switchRank'
	//   })
	//   this._isShow = true
	// },
	closeGroupRank() {
		this.groupDisplay.node.active = false
		wx.postMessage({
			message: 'Hide'
		})
		this._isShow = false
	},
	createImage(sprite, url) {
		let image = wx.createImage();
		image.onload = function () {
			let texture = new cc.Texture2D();
			texture.initWithElement(image);
			texture.handleLoadedTexture();
			sprite.spriteFrame = new cc.SpriteFrame(texture);
		};
		image.src = url;
	},
	update() {
		if (this._isShow) {
			if (this.display.node.active) {
				this.display.node.getComponent(cc.WXSubContextView).update()
			}
			if (this.groupDisplay.node.active) {
				this.groupDisplay.node.getComponent(cc.WXSubContextView).update()
			}
		}
	},
	// 控制打开广告
	onReviveButton(type) {
		// 广告位
		let self = this
		this.adType = type //0表示加倍 1表示复活 2表示炸弹
		if (this.audioAd) {
			this.audioAd.show().catch(() => {
				// 失败重试
				this.audioAd.load()
					.then(() => this.audioAd.show())
					.catch(err => {
						console.log('激励视频 广告显示失败', err.errMsg)
						if (self.adType == 1) {
							self._controller.game.onSkipRevive()
						} else if (self.adType == 2) {
							self._controller.scoreMgr.onLevelUpButton()
						} else {
							self.onItemShareSuccess()
						}
					})
			})
			return
		}
		this.audioAd = wx.createRewardedVideoAd({
			adUnitId: 'adunit-482148cfeb243378'
		})
		this.audioAd.show().catch(() => {
			// 失败重试
			this.audioAd.load()
				.then(() => this.audioAd.show())
				.catch(err => {
					self.fakeShare()
				})
		})
		this.audioAd.onError(err => {
			self.fakeShare()
		})
		this.audioAd.onClose((res) => {
			if (self.adType == 1) {
				if (res && res.isEnded || res === undefined) {
					self._controller.game.showReviveSuccess()
				} else {
					self._controller.game.askRevive()
				}
			} else if (self.adType == 0) {
				if (res && res.isEnded || res === undefined) {
					self._controller.scoreMgr.onLevelUpButton(2)
				}
			} else {
				if (res && res.isEnded || res === undefined) {
					self.onItemShareSuccess()
				}
			}
		})
	},
	fakeShare() {
		let self = this
		wx.shareAppMessage({
			title: "我已经玩到" + this._controller.scoreMgr.score + "分了，邀请你来挑战",
			// imageUrlId: 'oxEwGvClT0uldQ470pM84w',
			imageUrl: 'https://mmocgame.qpic.cn/wechatgame/LtJZOjH6Z9ibiaMlpqzldsOf46Q7TZiaysI1fwc4Oj1L3CkbCaJMAMoicibbHu2HUQkOib/0'
		})
		if (this.adType) {
			self._controller.game.showReviveSuccess()
		} else {
			self._controller.scoreMgr.onLevelUpButton(2)
		}
	},
	openBannerAdv() {
		// 创建 Banner 广告实例，提前初始化
		// let screenWidth = wx.getSystemInfoSync().screenWidth
		// let bannerHeight = screenWidth / 350 * 120
		// let screenHeight = wx.getSystemInfoSync().screenHeight - 108
		// let adUnitIds = [
		//   'adunit-510a4ec39065ef96',
		//   'adunit-29b0fa7a2db8e8cb',
		//   'adunit-4020bb9ea439e6a5'
		// ]
		// if (this.bannerAd) {
		//   this.bannerAd.destroy()
		// }
		// this.bannerAd = wx.createBannerAd({
		//   adUnitId: adUnitIds[Math.floor(Math.random() * 3)],
		//   style: {
		//     left: 0,
		//     top: screenHeight,
		//     width: 620,
		//   }
		// })
		// // 在适合的场景显示 Banner 广告
		// this.bannerAd.onLoad(() => {
		//   // console.log('banner 广告加载成功')
		// })
		// this.bannerAd.onError((e) => {
		//   console.log('banner 广告加载失败', e)
		// })
		// this.bannerAd.show()
		//   .then()
	},
	navToMiniprogram(event, custom) {
		console.log(custom)
		wx.navigateToMiniProgram({
			appId: custom
		})
	},
	closeBannerAdv() {
		if (this.bannerAd) {
			this.bannerAd.hide()
		}
	}
});
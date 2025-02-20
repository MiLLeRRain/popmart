App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'popmart-util-8gcbt6lw780e6496',
        traceUser: true,
      })
    }

    // 添加全局错误监听
    wx.onError(function(error) {
      console.error('全局异常:', error)
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null
  }
})
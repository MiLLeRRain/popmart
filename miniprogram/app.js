App({
  globalData: {
    userInfo: null,
    isCloudInited: false,
    cloudInitError: null,
    isLoading: false,
    loadError: null,
    retryCount: 0,
    maxRetries: 3,
    requestTimeout: 15000, // 15 seconds timeout
  },

  onLaunch() {
    this.initCloud()
    this.setupErrorHandling()
    this.setupPerformanceMonitoring()
    this.initLogs()
  },

  initCloud() {
    if (!wx.cloud) {
      this.handleCloudError(new Error('请使用 2.2.3 或以上的基础库以使用云能力'))
      return
    }

    try {
      wx.cloud.init({
        env: 'popmart-util-8gcbt6lw780e6496',
        traceUser: true,
      })
      console.info('[Cloud] Initialization successful')
      this.globalData.isCloudInited = true
    } catch (error) {
      this.handleCloudError(error)
    }
  },

  handleCloudError(error) {
    console.error('[Cloud] Initialization failed:', error)
    this.globalData.cloudInitError = error.message
    this.globalData.isCloudInited = false

    // Show error to user
    wx.showToast({
      title: '云环境初始化失败，请重试',
      icon: 'none',
      duration: 2000
    })
  },

  setupErrorHandling() {
    // Global error handler
    wx.onError((error) => {
      console.error('[Global Error]:', error)
      this.globalData.loadError = error

      // Implement retry mechanism
      if (this.globalData.retryCount < this.globalData.maxRetries) {
        this.globalData.retryCount++
        console.info(`[Retry] Attempt ${this.globalData.retryCount} of ${this.globalData.maxRetries}`)
        this.initCloud()
      }
    })

    // Network status monitoring
    wx.onNetworkStatusChange((res) => {
      console.info('[Network] Status changed:', res.networkType)
      if (!res.isConnected) {
        wx.showToast({
          title: '网络连接已断开',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  setupPerformanceMonitoring() {
    if (wx.reportPerformance) {
      // Monitor page load performance
      wx.reportPerformance(1001, Date.now() - this.launchStartTime)
    }
  },

  initLogs() {
    const logs = wx.getStorageSync('logs') || []
    logs.unshift({
      timestamp: Date.now(),
      type: 'launch',
      cloudInit: this.globalData.isCloudInited,
      error: this.globalData.cloudInitError
    })
    wx.setStorageSync('logs', logs)
  }

})
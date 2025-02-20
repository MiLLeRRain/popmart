Page({
  data: {
    series: [],
    testResults: null
  },

  onLoad() {
    console.log('Index Page - onLoad');
    this.loadSeriesData();
  },

  // Load series data
  async loadSeriesData() {
    try {
      const seriesRes = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: 'popmart-util-8gcbt6lw780e6496'
        },
        data: {
          type: 'fetchSeriesList'
        }
      });

      if (seriesRes.result.success && seriesRes.result.data) {
        this.setData({
          series: seriesRes.result.data
        });
      }
    } catch (error) {
      console.error('Failed to load series data:', error);
    }
  },

  // 测试云数据库功能
  async testCloudDB() {
    try {
      wx.showLoading({
        title: '测试中...',
      });

      // 1. 测试获取系列列表
      const seriesRes = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: 'popmart-util-8gcbt6lw780e6496'
        },
        data: {
          type: 'fetchSeriesList'
        }
      });

      console.log('Series data:', seriesRes.result);
      
      if (!seriesRes.result.success || !seriesRes.result.data.length) {
        throw new Error('获取系列数据失败或数据为空');
      }

      // 2. 测试获取第一个系列的商品
      const firstSeriesId = seriesRes.result.data[0]._id;
      const itemsRes = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: 'popmart-util-8gcbt6lw780e6496'
        },
        data: {
          type: 'fetchSeriesItems',
          seriesId: firstSeriesId
        }
      });

      console.log('Items data:', itemsRes.result);

      if (!itemsRes.result.success) {
        throw new Error('获取商品数据失败');
      }

      // 3. 验证图片链接
      const testImageUrl = itemsRes.result.data[0]?.image;
      if (testImageUrl) {
        await new Promise((resolve, reject) => {
          wx.getImageInfo({
            src: testImageUrl,
            success: resolve,
            fail: reject
          });
        });
      }

      // 4. 显示测试结果
      const testResults = {
        seriesCount: seriesRes.result.data.length,
        itemsCount: itemsRes.result.data.length,
        imageAccessible: true
      };

      this.setData({ testResults });
      
      wx.showToast({
        title: '测试完成',
        icon: 'success'
      });

    } catch (error) {
      console.error('测试失败:', error);
      wx.showToast({
        title: '测试失败',
        icon: 'error'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 导航到计算器页面
  async navigateToCalculator(e) {
    const series = e.currentTarget.dataset.series;
    try {
      // Fetch items for the selected series
      const itemsRes = await wx.cloud.callFunction({
        name: 'quickstartFunctions',
        config: {
          env: 'popmart-util-8gcbt6lw780e6496'
        },
        data: {
          type: 'fetchSeriesItems',
          seriesId: series._id
        }
      });

      if (!itemsRes.result.success) {
        throw new Error('Failed to fetch series items');
      }

      // Navigate to calculator page with both series and items data
      wx.navigateTo({
        url: '/pages/calculator/index',
        events: {
          // Listen for any events sent back from calculator page
          acceptDataFromCalculator: function(data) {
            console.log('Data from calculator:', data);
          }
        },
        success: function(res) {
          // Send data to calculator page through the event channel
          res.eventChannel.emit('acceptDataFromOpener', {
            series: series,
            items: itemsRes.result.data
          });
        }
      });

    } catch (error) {
      console.error('Navigation failed:', error);
      wx.showToast({
        title: 'Failed to load series items',
        icon: 'error'
      });
    }
  }
})
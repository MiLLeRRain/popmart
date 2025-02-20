# WeChat Mini Program Lifecycle Documentation

This document provides a comprehensive guide to understanding and implementing lifecycle events in WeChat Mini Programs, with practical examples from the POPMART Blind Box Calculator application.

## Application Lifecycle

Application lifecycle events affect the entire Mini Program and are defined in `app.js`.

### onLaunch(options)

Triggered when the Mini Program is first launched.

```javascript
App({
  onLaunch: function(options) {
    // Initialize cloud environment
    wx.cloud.init({
      env: 'your-env-id',
      traceUser: true
    })
    
    // Initialize global data
    this.globalData = {
      seriesList: [],
      currentSeries: null
    }
  }
})
```

### onShow(options)

Triggered when the Mini Program enters the foreground.

```javascript
App({
  onShow: function(options) {
    // Refresh series data when app becomes active
    this.refreshSeriesData()
  },
  
  refreshSeriesData() {
    // Fetch latest series data from cloud database
    wx.cloud.callFunction({
      name: 'fetchSeriesList'
    })
  }
})
```

### onHide()

Triggered when the Mini Program enters the background.

```javascript
App({
  onHide: function() {
    // Save any unsaved state
    this.saveAppState()
  }
})
```

### onError(error)

Triggered when a JavaScript error occurs.

```javascript
App({
  onError: function(error) {
    // Log error to monitoring system
    console.error('Application error:', error)
    wx.cloud.callFunction({
      name: 'logError',
      data: { error: error }
    })
  }
})
```

## Page Lifecycle

Page lifecycle events are specific to individual pages within the Mini Program.

### onLoad(options)

Triggered when a page is first loaded.

```javascript
Page({
  onLoad: function(options) {
    // Initialize page data
    this.setData({
      seriesId: options.id,
      boxes: []
    })
    
    // Load series details
    this.loadSeriesDetails(options.id)
  }
})
```

### onShow()

Triggered when a page enters the foreground.

```javascript
Page({
  onShow: function() {
    // Refresh probability calculations
    this.calculateProbabilities()
  }
})
```

### onReady()

Triggered when a page's initial rendering is complete.

```javascript
Page({
  onReady: function() {
    // Initialize UI components
    this.initializeChart()
  },
  
  initializeChart() {
    // Set up probability distribution chart
    const chart = wx.createCanvasContext('probabilityChart')
    // Chart initialization code
  }
})
```

### onHide()

Triggered when a page enters the background.

```javascript
Page({
  onHide: function() {
    // Save page state
    this.savePageState()
  }
})
```

### onUnload()

Triggered when a page is closed.

```javascript
Page({
  onUnload: function() {
    // Clean up resources
    this.cleanupResources()
  }
})
```

## Component Lifecycle

Component lifecycle events are specific to custom components.

### created()

Triggered when a component instance is created.

```javascript
Component({
  created: function() {
    // Initialize component data
    this.initData = {
      probability: 0,
      boxCount: 0
    }
  }
})
```

### attached()

Triggered when a component is attached to the page.

```javascript
Component({
  attached: function() {
    // Set up component
    this.setupComponent()
  },
  
  setupComponent() {
    // Initialize component state
    this.setData({
      isReady: true
    })
  }
})
```

### ready()

Triggered when component initialization is complete.

```javascript
Component({
  ready: function() {
    // Component is ready to interact
    this.triggerEvent('componentReady')
  }
})
```

### detached()

Triggered when a component is removed from the page.

```javascript
Component({
  detached: function() {
    // Clean up component resources
    this.cleanup()
  }
})
```

## Best Practices

1. **Data Loading**
   - Load essential data in `onLoad`
   - Load supplementary data in `onShow`
   - Use `onReady` for UI initialization

2. **Resource Management**
   - Clean up resources in `onUnload` and `detached`
   - Save state in `onHide` when necessary
   - Initialize resources in `created` for components

3. **Error Handling**
   - Implement proper error handling in `onError`
   - Log errors appropriately
   - Provide user feedback when necessary

## Common Issues and Solutions

1. **Data Not Persisting**
   - Use `onHide` to save important data
   - Implement proper state management

2. **UI Not Updating**
   - Ensure `setData` is called after data changes
   - Use `onReady` for UI initialization

3. **Memory Leaks**
   - Clean up event listeners in `onUnload`
   - Release resources in `detached`

## Performance Considerations

1. **Optimize onLoad**
   - Minimize synchronous operations
   - Load data incrementally

2. **Efficient Data Updates**
   - Use selective `setData`
   - Batch updates when possible

3. **Resource Management**
   - Release unused resources
   - Implement proper cleanup

## Related Documentation

- [WeChat Mini Program Framework](https://developers.weixin.qq.com/miniprogram/en/dev/framework/MINA.html)
- [Component Framework](https://developers.weixin.qq.com/miniprogram/en/dev/framework/custom-component/)
- [Performance Optimization](https://developers.weixin.qq.com/miniprogram/en/dev/framework/performance/tips.html)
const db = require('../../utils/db')

Page({
  data: {
    series: null,
    items: [],
    numberOptions: [],
    excludeNumberOptions: [],
    confirmedNumbers: [],
    excludeNumbers: [],
    results: [],
    gridColumns: 4,
    gridRows: 3,
    maxTipsCount: 3,
    // Add new data properties for image loading states
    seriesImageLoaded: false,
    seriesImageError: false,
    itemImagesLoaded: [],
    itemImagesError: []
  },

  async onLoad() {
    console.log('Calculator Page - onLoad');
    try {
      const eventChannel = this.getOpenerEventChannel();
      
      await new Promise((resolve, reject) => {
        eventChannel.on('acceptDataFromOpener', (data) => {
          const { series, items } = data;
          
          if (!series || !items) {
            reject(new Error('Invalid data received'));
            return;
          }

          const totalBoxes = series.totalBoxes;
          const { columns, rows } = this.calculateGridLayout(totalBoxes);

          const numberOptions = items.map(item => item.name);
          const excludeNumberOptions = items.map(item => item.name);
          const confirmedNumbers = Array(totalBoxes).fill('');
          const excludeNumbers = Array(totalBoxes).fill([]).map(() => []);

          // Initialize image loading states
          const itemImagesLoaded = Array(items.length).fill(false);
          const itemImagesError = Array(items.length).fill(false);

          this.setData({
            series,
            items,
            numberOptions,
            excludeNumberOptions,
            confirmedNumbers,
            excludeNumbers,
            gridColumns: columns,
            gridRows: rows,
            maxTipsCount: series.maxTipsCount || 3,
            itemImagesLoaded,
            itemImagesError
          });
          
          resolve();
        });
      });
    } catch (error) {
      console.error('Failed to parse page data:', error)
      wx.showToast({
        title: 'Failed to load data',
        icon: 'error'
      })
    }
  },

  // Image loading handlers
  onImageLoad() {
    this.setData({ seriesImageLoaded: true });
  },

  onImageError() {
    this.setData({ seriesImageError: true });
    console.error('Failed to load series image');
  },

  onItemImageLoad(e) {
    const { index } = e.currentTarget.dataset;
    const itemImagesLoaded = [...this.data.itemImagesLoaded];
    itemImagesLoaded[index] = true;
    this.setData({ itemImagesLoaded });
  },

  onItemImageError(e) {
    const { index } = e.currentTarget.dataset;
    const itemImagesError = [...this.data.itemImagesError];
    itemImagesError[index] = true;
    this.setData({ itemImagesError });
    console.error(`Failed to load item image at index ${index}`);
  },

  calculateGridLayout(totalBoxes) {
    if (totalBoxes === 12) return { columns: 4, rows: 3 }
    if (totalBoxes === 8) return { columns: 4, rows: 2 }
    if (totalBoxes === 6) return { columns: 3, rows: 2 }

    // For other numbers, calculate optimal layout
    const sqrt = Math.sqrt(totalBoxes)
    let columns = Math.ceil(sqrt)
    let rows = Math.ceil(totalBoxes / columns)

    // Adjust if too narrow
    if (columns < 2) {
      columns = 2
      rows = Math.ceil(totalBoxes / columns)
    }

    return { columns, rows }
  },

  onConfirmedNumberChange(e) {
    const { index } = e.currentTarget.dataset
    const value = parseInt(e.detail.value) + 1  // Convert picker index to actual number
    const confirmedNumbers = [...this.data.confirmedNumbers]
    
    // Clear any existing excluded numbers for this cell
    const excludeNumbers = [...this.data.excludeNumbers]
    excludeNumbers[index] = []
    
    confirmedNumbers[index] = value
    this.setData({ 
      confirmedNumbers,
      excludeNumbers
    })
  },

  onExcludeNumbersChange(e) {
    const { index } = e.currentTarget.dataset
    const selectedValue = parseInt(e.detail.value) + 1  // Convert picker index to actual number
    const excludeNumbers = [...this.data.excludeNumbers]
    
    // Clear any confirmed number for this cell
    const confirmedNumbers = [...this.data.confirmedNumbers]
    confirmedNumbers[index] = ''
    
    const currentExcluded = excludeNumbers[index]
    const valueIndex = currentExcluded.indexOf(selectedValue)
    
    if (valueIndex === -1) {
      if (currentExcluded.length >= this.data.maxTipsCount) {
        wx.showToast({
          title: `最多排除${this.data.maxTipsCount}个数字`,
          icon: 'none'
        })
        return
      }
      currentExcluded.push(selectedValue)
    } else {
      currentExcluded.splice(valueIndex, 1)
    }
    
    excludeNumbers[index] = currentExcluded
    this.setData({ 
      excludeNumbers,
      confirmedNumbers
    })
  },

  showResetConfirm() {
    wx.showModal({
      title: '确认重置',
      content: '是否确认重置所有选择？',
      success: (res) => {
        if (res.confirm) {
          this.resetAll()
        }
      }
    })
  },

  resetAll() {
    const totalBoxes = this.data.series.totalBoxes
    this.setData({
      confirmedNumbers: Array(totalBoxes).fill(''),
      excludeNumbers: Array(totalBoxes).fill([]).map(() => []),
      results: []
    })
    wx.showToast({
      title: '已重置',
      icon: 'success'
    })
  },

  calculateProbability() {
    const numSamples = 100000
    const totalBoxes = this.data.series.totalBoxes
    const allNumbers = [...Array(totalBoxes).keys()].map(i => i + 1)
    
    // Initialize frequency matrix
    const frequencyMatrix = {}
    for (let box = 0; box < totalBoxes; box++) {
      frequencyMatrix[box] = {}
      for (let num of allNumbers) {
        frequencyMatrix[box][num] = 0
      }
    }

    // Run Monte Carlo simulation
    for (let i = 0; i < numSamples; i++) {
      const fixedNumbers = this.data.confirmedNumbers.map(n => n ? parseInt(n) : undefined)
      const excludedNumbers = this.data.excludeNumbers
      let numbersLeft = allNumbers.filter(n => !fixedNumbers.includes(n))
      let assignment = [...fixedNumbers]

      // Assign numbers to boxes
      for (let box = 0; box < totalBoxes; box++) {
        if (assignment[box] !== undefined) continue
        
        let validNumbers = numbersLeft.filter(n => !excludedNumbers[box].includes(n))
        if (validNumbers.length === 0) continue

        let chosenNumber = validNumbers[Math.floor(Math.random() * validNumbers.length)]
        assignment[box] = chosenNumber
        numbersLeft = numbersLeft.filter(n => n !== chosenNumber)
      }

      // Update frequency matrix
      for (let box = 0; box < totalBoxes; box++) {
        if (assignment[box] !== undefined) {
          frequencyMatrix[box][assignment[box]] += 1
        }
      }
    }

    // Calculate probabilities and sort results
    const results = Object.keys(frequencyMatrix).map(box => {
      const boxFrequencies = frequencyMatrix[box]
      const probabilities = Object.entries(boxFrequencies)
        .map(([number, frequency]) => ({
          number: parseInt(number),
          value: Number(((frequency / numSamples) * 100).toFixed(2))
        }))
        .filter(prob => prob.value > 0)
        .sort((a, b) => {
          if (parseFloat(b.value) !== parseFloat(a.value)) {
            return parseFloat(b.value) - parseFloat(a.value)
          }
          return b.number - a.number
        })
        .slice(0, 5)

      return {
        box: parseInt(box) + 1,
        probabilities
      }
    })

    this.setData({ results })
  }
})
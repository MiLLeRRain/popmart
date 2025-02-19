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
    gridRows: 3
  },

  async onLoad(options) {
    const { seriesId } = options
    if (!seriesId) {
      wx.showToast({
        title: 'Invalid series ID',
        icon: 'error'
      })
      return
    }

    try {
      // Load series and items data
      const series = await db.getSeriesById(seriesId)
      const items = await db.getItemsBySeries(seriesId)

      // Calculate grid layout
      const totalBoxes = series.totalBoxes
      const { columns, rows } = this.calculateGridLayout(totalBoxes)

      // Initialize data arrays
      const numberOptions = Array.from({length: totalBoxes}, (_, i) => i + 1)
      const excludeNumberOptions = Array.from({length: totalBoxes}, (_, i) => i + 1)
      const confirmedNumbers = Array(totalBoxes).fill('')
      const excludeNumbers = Array(totalBoxes).fill([]).map(() => [])

      this.setData({
        series,
        items,
        numberOptions,
        excludeNumberOptions,
        confirmedNumbers,
        excludeNumbers,
        gridColumns: columns,
        gridRows: rows
      })
    } catch (error) {
      console.error('Failed to load series data:', error)
      wx.showToast({
        title: 'Failed to load data',
        icon: 'error'
      })
    }
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
    const value = this.data.numberOptions[e.detail.value]
    const confirmedNumbers = [...this.data.confirmedNumbers]
    confirmedNumbers[index] = value

    this.setData({ confirmedNumbers })
  },

  onExcludeNumbersChange(e) {
    const { index } = e.currentTarget.dataset
    const selectedValue = this.data.excludeNumberOptions[e.detail.value]
    const excludeNumbers = [...this.data.excludeNumbers]
    
    const currentExcluded = excludeNumbers[index]
    const valueIndex = currentExcluded.indexOf(selectedValue)
    
    if (valueIndex === -1) {
      if (currentExcluded.length >= 3) {
        wx.showToast({
          title: '最多排除3个数字',
          icon: 'none'
        })
        return
      }
      currentExcluded.push(selectedValue)
    } else {
      currentExcluded.splice(valueIndex, 1)
    }
    
    excludeNumbers[index] = currentExcluded
    this.setData({ excludeNumbers })
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
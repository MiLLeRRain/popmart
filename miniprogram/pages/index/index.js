Page({
  data: {
    numberOptions: Array.from({length: 12}, (_, i) => i + 1),
    excludeNumberOptions: Array.from({length: 12}, (_, i) => i + 1),
    confirmedNumbers: Array(12).fill(''),
    excludeNumbers: Array(12).fill([]),
    results: []
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
    
    // Check if the number is already selected
    const currentExcluded = excludeNumbers[index]
    const valueIndex = currentExcluded.indexOf(selectedValue)
    
    if (valueIndex === -1) {
      // Add new number if not already selected and within limit
      if (currentExcluded.length >= 3) {
        wx.showToast({
          title: '最多排除3个数字',
          icon: 'none'
        })
        return
      }
      currentExcluded.push(selectedValue)
    } else {
      // Remove number if already selected
      currentExcluded.splice(valueIndex, 1)
    }
    
    excludeNumbers[index] = currentExcluded
    this.setData({ excludeNumbers })
  },

  onTestData() {
    const boxHints = {
      1: [2, 5, 8],
      2: [1, 3, 7],
      3: [],
      4: [1, 8, 10],
      5: "fixed:6",
      6: [5, 9, 11],
      7: "fixed:4",
      8: [3, 6, 12],
      9: [1, 4, 7],
      10: "fixed:9",
      11: [3, 8, 9],
      12: [4, 6, 10]
    };

    const confirmedNumbers = Array(12).fill('');
    const excludeNumbers = Array(12).fill([]).map(() => []);

    // Process each box's hints
    Object.entries(boxHints).forEach(([box, hint]) => {
      const index = parseInt(box) - 1;
      if (typeof hint === 'string' && hint.startsWith('fixed:')) {
        confirmedNumbers[index] = parseInt(hint.split(':')[1]);
      } else if (Array.isArray(hint)) {
        excludeNumbers[index] = [...hint];
      }
    });

    this.setData({
      confirmedNumbers,
      excludeNumbers
    });
  },

  calculateProbability() {
    console.log("clicked");
    const numSamples = 100000;
    const totalBoxes = 12;
    const allNumbers = [...Array(totalBoxes).keys()].map(i => i + 1);
    
    // Initialize frequency matrix
    const frequencyMatrix = {};
    for (let box = 0; box < totalBoxes; box++) {
      frequencyMatrix[box] = {};
      for (let num of allNumbers) {
        frequencyMatrix[box][num] = 0;
      }
    }

    // Run Monte Carlo simulation
    for (let i = 0; i < numSamples; i++) {
      const fixedNumbers = this.data.confirmedNumbers.map(n => n ? parseInt(n) : undefined);
      const excludedNumbers = this.data.excludeNumbers;
      let numbersLeft = allNumbers.filter(n => !fixedNumbers.includes(n));
      let assignment = [...fixedNumbers];

      // Assign numbers to boxes
      for (let box = 0; box < totalBoxes; box++) {
        if (assignment[box] !== undefined) continue;
        
        // Filter valid numbers for this box
        let validNumbers = numbersLeft.filter(n => !excludedNumbers[box].includes(n));
        if (validNumbers.length === 0) continue;

        // Randomly choose a number
        let chosenNumber = validNumbers[Math.floor(Math.random() * validNumbers.length)];
        assignment[box] = chosenNumber;
        numbersLeft = numbersLeft.filter(n => n !== chosenNumber);
      }

      // Update frequency matrix
      for (let box = 0; box < totalBoxes; box++) {
        if (assignment[box] !== undefined) {
          frequencyMatrix[box][assignment[box]] += 1;
        }
      }
    }

    // Calculate probabilities and sort results
    const results = Object.keys(frequencyMatrix).map(box => {
      const boxFrequencies = frequencyMatrix[box];
      const probabilities = Object.entries(boxFrequencies)
        .map(([number, frequency]) => ({
          number: parseInt(number),
          value: ((frequency / numSamples) * 100).toFixed(2)
        }))
        .filter(prob => prob.value > 0)
        .sort((a, b) => {
          if (parseFloat(b.value) !== parseFloat(a.value)) {
            return parseFloat(b.value) - parseFloat(a.value);
          }
          return b.number - a.number;
        })
        .slice(0, 5);

      return {
        box: parseInt(box) + 1,
        probabilities
      };
    });

    // Generate JSON output
    const jsonOutput = JSON.stringify(results, null, 2);
    console.log('Probability Results JSON:', jsonOutput);

    // Create and display console table
    console.log('Probability Results Table:');
    results.forEach(result => {
      console.log(`\nBox ${result.box}:`);
      console.table(result.probabilities.map(p => ({
        'Number': p.number,
        'Probability (%)': p.value
      })));
    });

    this.setData({ results });
  }
})
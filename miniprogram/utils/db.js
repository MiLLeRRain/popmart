const db = wx.cloud.database()

class DB {
  constructor() {
    this.seriesCollection = db.collection('series')
    this.itemsCollection = db.collection('items')
  }

  // Series operations
  async getActiveSeries() {
    try {
      const { data } = await this.seriesCollection
        .where({
          isActive: true
        })
        .orderBy('createTime', 'desc')
        .get()
      return data
    } catch (error) {
      console.error('Failed to get active series:', error)
      throw error
    }
  }

  async getSeriesById(seriesId) {
    try {
      const { data } = await this.seriesCollection.doc(seriesId).get()
      return data
    } catch (error) {
      console.error('Failed to get series by id:', error)
      throw error
    }
  }

  // Items operations
  async getItemsBySeries(seriesId) {
    try {
      const { data } = await this.itemsCollection
        .where({
          seriesId: seriesId
        })
        .orderBy('index', 'asc')
        .get()
      return data
    } catch (error) {
      console.error('Failed to get items by series:', error)
      throw error
    }
  }
}

module.exports = new DB()
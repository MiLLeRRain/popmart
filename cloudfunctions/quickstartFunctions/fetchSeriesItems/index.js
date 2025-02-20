const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取指定系列的盲盒商品列表
exports.main = async (event, context) => {
  try {
    const { seriesId } = event;
    if (!seriesId) {
      return {
        success: false,
        errMsg: 'seriesId is required'
      };
    }

    // 返回指定系列的商品列表查询结果
    const result = await db.collection('items')
      .where({
        seriesId: seriesId
      })
      .get();

    return {
      success: true,
      data: result.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
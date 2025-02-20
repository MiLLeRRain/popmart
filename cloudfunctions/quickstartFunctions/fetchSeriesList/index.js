const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取盲盒系列列表
exports.main = async (event, context) => {
  try {
    // 返回系列列表查询结果
    const result = await db.collection('series').get();
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
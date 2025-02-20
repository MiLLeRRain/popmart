# POPMART 盲盒概率计算器小程序 / Blind Box Probability Calculator Mini Program

| 中文 | English |
|------|----------|
| **项目简介** | **Project Introduction** |
| 这是一个基于微信小程序平台开发的 POPMART 盲盒概率计算器，帮助用户计算和分析盲盒抽取的概率分布。通过云开发技术和蒙特卡洛算法，为用户提供精确的概率预测服务。 | This is a POPMART blind box probability calculator developed on the WeChat Mini Program platform, helping users calculate and analyze the probability distribution of blind box draws. Through cloud development technology and Monte Carlo algorithm, it provides users with accurate probability prediction services. |
| **功能特点** | **Features** |
| - 🎯 盲盒系列展示：展示不同的 POPMART 盲盒系列<br>- 📊 概率计算：基于蒙特卡洛算法的精确概率计算<br>- 🔍 已知信息排除：支持输入已知盒子信息，提高预测准确度<br>- 🎲 多维度分析：支持多种盒数配置（6、8、12等）<br>- 🌩️ 云端数据存储：利用云开发技术实现数据的实时更新<br>- 📱 流畅用户体验：优化的UI设计和交互体验 | - 🎯 Blind Box Series Display: Showcase different POPMART blind box series<br>- 📊 Probability Calculation: Precise probability calculation based on Monte Carlo algorithm<br>- 🔍 Known Information Exclusion: Support input of known box information to improve prediction accuracy<br>- 🎲 Multi-dimensional Analysis: Support various box configurations (6, 8, 12, etc.)<br>- 🌩️ Cloud Data Storage: Real-time data updates using cloud development technology<br>- 📱 Smooth User Experience: Optimized UI design and interaction experience |
| **技术栈** | **Tech Stack** |
| - 微信小程序原生开发框架<br>- 微信云开发<br>- JavaScript ES6+<br>- 蒙特卡洛概率算法<br>- 微信小程序云数据库 | - WeChat Mini Program Native Development Framework<br>- WeChat Cloud Development<br>- JavaScript ES6+<br>- Monte Carlo Probability Algorithm<br>- WeChat Mini Program Cloud Database |
| **目录结构** | **Directory Structure** |
```
├── cloudfunctions/        # 云函数目录 / Cloud Functions Directory
│   └── quickstartFunctions/  # 快速启动函数 / Quick Start Functions
├── miniprogram/          # 小程序主目录 / Mini Program Main Directory
│   ├── pages/           # 页面文件 / Page Files
│   │   ├── index/      # 首页（系列展示）/ Homepage (Series Display)
│   │   └── calculator/ # 概率计算器页面 / Probability Calculator Page
│   ├── utils/          # 工具函数 / Utility Functions
│   └── app.json        # 小程序配置文件 / Mini Program Configuration File
└── project.config.json  # 项目配置文件 / Project Configuration File
```
| **主要功能模块** | **Main Function Modules** |
| **1. 系列展示模块**<br>- 展示所有可用的盲盒系列<br>- 支持系列图片预览<br>- 流畅的列表加载和图片懒加载 | **1. Series Display Module**<br>- Display all available blind box series<br>- Support series image preview<br>- Smooth list loading and image lazy loading |
| **2. 概率计算模块**<br>- 支持输入已知盒子信息<br>- 支持排除法则设置<br>- 实时概率计算<br>- 结果可视化展示 | **2. Probability Calculation Module**<br>- Support input of known box information<br>- Support exclusion rule settings<br>- Real-time probability calculation<br>- Visual result display |
| **使用指南** | **User Guide** |
| 1. 打开小程序，浏览可用的盲盒系列<br>2. 选择需要计算概率的系列<br>3. 在计算器页面输入已知信息：<br>   - 确认已开出的盒子<br>   - 设置排除的可能性<br>4. 点击计算按钮获取概率分布结果 | 1. Open the mini program and browse available blind box series<br>2. Select the series for probability calculation<br>3. Input known information on the calculator page:<br>   - Confirm opened boxes<br>   - Set exclusion possibilities<br>4. Click calculate button to get probability distribution results |
| **环境配置** | **Environment Configuration** |
| **开发环境要求**<br>- 微信开发者工具最新版<br>- Node.js 12.0.0 或以上版本<br>- 注册微信小程序账号并开通云开发功能 | **Development Environment Requirements**<br>- Latest version of WeChat Developer Tools<br>- Node.js 12.0.0 or above<br>- Register WeChat Mini Program account and enable cloud development |
| **配置步骤**<br>1. 克隆项目代码<br>2. 在微信开发者工具中导入项目<br>3. 开通云开发环境<br>4. 初始化云数据库集合 | **Configuration Steps**<br>1. Clone project code<br>2. Import project in WeChat Developer Tools<br>3. Enable cloud development environment<br>4. Initialize cloud database collections |
| **部署步骤** | **Deployment Steps** |
| 1. 在微信开发者工具中打开项目<br>2. 上传并部署云函数<br>3. 部署云数据库集合<br>4. 预览和发布小程序 | 1. Open project in WeChat Developer Tools<br>2. Upload and deploy cloud functions<br>3. Deploy cloud database collections<br>4. Preview and publish mini program |
| **数据结构** | **Data Structure** |
| **系列(Series)集合**<br>```javascript
{
  _id: string,
  name: string,      // 系列名称
  imageUrl: string,  // 系列图片
  totalBoxes: number // 盒子总数
}
``` | **Series Collection**<br>```javascript
{
  _id: string,
  name: string,      // Series name
  imageUrl: string,  // Series image
  totalBoxes: number // Total boxes
}
``` |
| **商品(Items)集合**<br>```javascript
{
  _id: string,
  seriesId: string,  // 关联的系列ID
  name: string,      // 商品名称
  index: number      // 排序索引
}
``` | **Items Collection**<br>```javascript
{
  _id: string,
  seriesId: string,  // Associated series ID
  name: string,      // Item name
  index: number      // Sort index
}
``` |
| **注意事项** | **Notes** |
| - 概率计算结果仅供参考，不代表实际开盒概率<br>- 建议输入准确的已知信息以提高预测准确度<br>- 图片资源建议使用CDN加速<br>- 定期备份云数据库数据 | - Probability calculation results are for reference only and do not represent actual box opening probability<br>- It is recommended to input accurate known information to improve prediction accuracy<br>- Recommended to use CDN acceleration for image resources<br>- Regularly backup cloud database data |
| **开发计划** | **Development Plan** |
| - [ ] 添加用户收藏功能<br>- [ ] 优化概率计算算法<br>- [ ] 添加历史记录功能<br>- [ ] 支持更多盒数配置<br>- [ ] 添加社区分享功能 | - [ ] Add user favorites function<br>- [ ] Optimize probability calculation algorithm<br>- [ ] Add history record function<br>- [ ] Support more box number configurations<br>- [ ] Add community sharing function |
| **贡献指南** | **Contribution Guide** |
| 1. Fork 本仓库<br>2. 创建新的功能分支<br>3. 提交代码更改<br>4. 创建 Pull Request | 1. Fork this repository<br>2. Create new feature branch<br>3. Submit code changes<br>4. Create Pull Request |
| **许可说明** | **License** |
| 本项目遵循 MIT 许可证。详见 LICENSE 文件。 | This project follows the MIT license. See LICENSE file for details. |
| **联系方式** | **Contact** |
| 如有问题或建议，欢迎提交 Issue 或 Pull Request。 | For questions or suggestions, please submit an Issue or Pull Request. |

---

感谢使用 POPMART 盲盒概率计算器小程序！

Thank you for using the POPMART Blind Box Probability Calculator Mini Program!
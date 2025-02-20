# POPMART 盲盒概率计算器小程序
# POPMART Blind Box Probability Calculator Mini Program

## 项目简介
## Project Introduction

这是一个基于微信小程序平台开发的 POPMART 盲盒概率计算器，帮助用户计算和分析盲盒抽取的概率分布。通过云开发技术和蒙特卡洛算法，为用户提供精确的概率预测服务。

This is a POPMART blind box probability calculator developed on the WeChat Mini Program platform, helping users calculate and analyze the probability distribution of blind box draws. Through cloud development technology and Monte Carlo algorithm, it provides users with accurate probability prediction services.

## 功能特点
## Features

- 🎯 盲盒系列展示：展示不同的 POPMART 盲盒系列
- 📊 概率计算：基于蒙特卡洛算法的精确概率计算
- 🔍 已知信息排除：支持输入已知盒子信息，提高预测准确度
- 🎲 多维度分析：支持多种盒数配置（6、8、12等）
- 🌩️ 云端数据存储：利用云开发技术实现数据的实时更新
- 📱 流畅用户体验：优化的UI设计和交互体验

- 🎯 Blind Box Series Display: Showcase different POPMART blind box series
- 📊 Probability Calculation: Precise probability calculation based on Monte Carlo algorithm
- 🔍 Known Information Exclusion: Support input of known box information to improve prediction accuracy
- 🎲 Multi-dimensional Analysis: Support various box configurations (6, 8, 12, etc.)
- 🌩️ Cloud Data Storage: Real-time data updates using cloud development technology
- 📱 Smooth User Experience: Optimized UI design and interaction experience

## 技术栈
## Tech Stack

- 微信小程序原生开发框架
- 微信云开发
- JavaScript ES6+
- 蒙特卡洛概率算法
- 微信小程序云数据库

- WeChat Mini Program Native Development Framework
- WeChat Cloud Development
- JavaScript ES6+
- Monte Carlo Probability Algorithm
- WeChat Mini Program Cloud Database

## 目录结构
## Directory Structure

```
├── cloudfunctions/        # 云函数目录 | Cloud Functions Directory
│   └── quickstartFunctions/  # 快速启动函数 | Quick Start Functions
├── miniprogram/          # 小程序主目录 | Mini Program Main Directory
│   ├── pages/           # 页面文件 | Page Files
│   │   ├── index/      # 首页（系列展示）| Homepage (Series Display)
│   │   └── calculator/ # 概率计算器页面 | Probability Calculator Page
│   ├── utils/          # 工具函数 | Utility Functions
│   └── app.json        # 小程序配置文件 | Mini Program Configuration File
└── project.config.json  # 项目配置文件 | Project Configuration File
```

## 主要功能模块
## Main Function Modules

### 1. 系列展示模块
### 1. Series Display Module

- 展示所有可用的盲盒系列
- 支持系列图片预览
- 流畅的列表加载和图片懒加载

- Display all available blind box series
- Support series image preview
- Smooth list loading and image lazy loading

### 2. 概率计算模块
### 2. Probability Calculation Module

- 支持输入已知盒子信息
- 支持排除法则设置
- 实时概率计算
- 结果可视化展示

- Support input of known box information
- Support exclusion rule settings
- Real-time probability calculation
- Visual result display

## 使用指南
## User Guide

1. 打开小程序，浏览可用的盲盒系列
2. 选择需要计算概率的系列
3. 在计算器页面输入已知信息：
   - 确认已开出的盒子
   - 设置排除的可能性
4. 点击计算按钮获取概率分布结果

1. Open the mini program and browse available blind box series
2. Select the series for probability calculation
3. Input known information on the calculator page:
   - Confirm opened boxes
   - Set exclusion possibilities
4. Click calculate button to get probability distribution results

## 环境配置
## Environment Configuration

### 开发环境要求
### Development Environment Requirements

- 微信开发者工具最新版
- Node.js 12.0.0 或以上版本
- 注册微信小程序账号并开通云开发功能

- Latest version of WeChat Developer Tools
- Node.js 12.0.0 or above
- Register WeChat Mini Program account and enable cloud development

### 配置步骤
### Configuration Steps

1. 克隆项目代码
2. 在微信开发者工具中导入项目
3. 开通云开发环境
4. 初始化云数据库集合

1. Clone project code
2. Import project in WeChat Developer Tools
3. Enable cloud development environment
4. Initialize cloud database collections

## 部署步骤
## Deployment Steps

1. 在微信开发者工具中打开项目
2. 上传并部署云函数
   ```bash
   # 进入云函数目录 | Enter cloud functions directory
   cd cloudfunctions/quickstartFunctions
   # 安装依赖 | Install dependencies
   npm install
   # 上传云函数 | Upload cloud functions
   ```
3. 部署云数据库集合
4. 预览和发布小程序

1. Open project in WeChat Developer Tools
2. Upload and deploy cloud functions
3. Deploy cloud database collections
4. Preview and publish mini program

## 数据结构
## Data Structure

### 系列(Series)集合
### Series Collection
```javascript
{
  _id: string,
  name: string,      // 系列名称 | Series name
  imageUrl: string,  // 系列图片 | Series image
  totalBoxes: number // 盒子总数 | Total boxes
}
```

### 商品(Items)集合
### Items Collection
```javascript
{
  _id: string,
  seriesId: string,  // 关联的系列ID | Associated series ID
  name: string,      // 商品名称 | Item name
  index: number      // 排序索引 | Sort index
}
```

## 注意事项
## Notes

- 概率计算结果仅供参考，不代表实际开盒概率
- 建议输入准确的已知信息以提高预测准确度
- 图片资源建议使用CDN加速
- 定期备份云数据库数据

- Probability calculation results are for reference only and do not represent actual box opening probability
- It is recommended to input accurate known information to improve prediction accuracy
- Recommended to use CDN acceleration for image resources
- Regularly backup cloud database data

## 开发计划
## Development Plan

- [ ] 添加用户收藏功能 | Add user favorites function
- [ ] 优化概率计算算法 | Optimize probability calculation algorithm
- [ ] 添加历史记录功能 | Add history record function
- [ ] 支持更多盒数配置 | Support more box number configurations
- [ ] 添加社区分享功能 | Add community sharing function

## 贡献指南
## Contribution Guide

1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码更改
4. 创建 Pull Request

1. Fork this repository
2. Create new feature branch
3. Submit code changes
4. Create Pull Request

## 许可说明
## License

本项目遵循 MIT 许可证。详见 LICENSE 文件。

This project follows the MIT license. See LICENSE file for details.

## 联系方式
## Contact

如有问题或建议，欢迎提交 Issue 或 Pull Request。

For questions or suggestions, please submit an Issue or Pull Request.

---

感谢使用 POPMART 盲盒概率计算器小程序！

Thank you for using the POPMART Blind Box Probability Calculator Mini Program!
# Project GreenEdge（绿刃计划）

> Code for a Cooler Planet — 用代码，为地球降温。

[![GitHub Pages](https://img.shields.io/badge/Live-yuye0325.github.io%2Fproject--greenedge-brightgreen)](https://yuye0325.github.io/project-greenedge/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributors](https://img.shields.io/badge/Contributors-Welcome-orange)](#-如何参与)

## 项目使命

汇聚全球开发者的智慧，用代码推动工业与生活的切实减碳。这是一个**完全开源、财务透明、零成本运行**的公益协作社区。

## 为什么加入？

| 传统环保项目 | Project GreenEdge |
|-------------|-------------------|
| 需要捐款 | **零资金门槛** |
| 不透明 | **财务48小时公示，宪章锁定不可改** |
| 参与方式单一 | **写代码、做设计、跑模型、写文档都行** |
| 成果不可见 | **每次贡献实时展示在主页** |

## 核心原则

- **完全开源**：所有代码、模型、文档 MIT 协议开源
- **零成本运行**：基于 GitHub Pages 免费托管
- **财务透明**：收支 48 小时内公示，写入宪章且条款不可修改
- **贡献公开**：每位贡献者自动展示在贡献者墙

## 当前挑战

### 挑战 #1：建筑用电预测基线模型

- 目标：MAPE < 5%
- 推荐数据集：ASHRAE Great Energy Predictor
- 详情：[challenges/01-building-energy-prediction.md](challenges/01-building-energy-prediction.md)

计划中：工业能效优化、交通碳排放预测、个人碳足迹计算器、企业能效仪表盘。

## 项目结构

```
/
├── index.html              # 项目主页
├── README.md               # 说明文档
├── CONTRIBUTORS.md         # 贡献者墙
├── constitution.md         # 透明宪章（含不可修订条款）
├── finance/
│   └── ledger.md           # 财务公示账本
├── challenges/
│   ├── 01-building-energy-prediction.md
│   └── 01-submissions/
├── assets/
│   ├── css/style.css
│   └── js/script.js
└── .github/workflows/      # 自动部署
```

## 如何参与

不需要是大神，有热情就够了。5 分钟即可完成首次贡献：

1. **Fork** 本仓库
2. 选择你想做的方式：
   - 数据科学 → 跑模型、优化算法、特征工程
   - 前端 → 优化网站、数据可视化
   - 后端 → CI/CD、数据管道
   - 文档 → 翻译、撰写教程
   - 传播 → 转发给社区和组织
3. **提交 PR**，你的名字将出现在贡献者墙上

## 许可证

MIT License — 自由使用、修改、分发。

## 联系

- 站点：https://yuye0325.github.io/project-greenedge/
- 仓库：https://github.com/Yuye0325/project-greenedge
- 反馈：通过 GitHub Issues 提交

---

**特别声明**：本项目为公益开源项目，永久开放、贡献公开、财务透明。项目不属于任何个人，属于所有贡献者和全人类。

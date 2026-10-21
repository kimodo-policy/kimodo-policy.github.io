# Kimodo-Policy 封面

本地预览：

```bash
cd /Users/jiaxizhang/Documents/kimodo/website/real/web/web
python3 -m http.server 8765 --bind 127.0.0.1
```

打开 http://127.0.0.1:8765/ 。

- `index.html`：论文标题、作者、单位、校徽和资源入口。
- `styles.css`：参考 https://mopa-policy.github.io/ 的封面布局、字体、蒙层及按钮样式。标题配色 #76B900 / #6E89BC。
- `script.js`：静音循环、播放开关、后台暂停及减少动态效果偏好。
- `封面视频/transportation.mp4`：保留的原始视频。
- `assets/transportation.mp4`：1080p H.264 网页版本，保留原速、移除音轨、启用 faststart。
- 校徽直接引用用户提供的 `封面视频/hksutgz.png`。
- arXiv 按钮沿用旧网站的 GitHub Release PDF，待正式 arXiv 地址提供后替换。
- 字体 Inter Bold 和资源按钮图标取自 MoPA 网站的对应公开资源。

此版本仅实现封面，未发布到线上。

## 每次更新后

这是纯 HTML/CSS/JavaScript 网站，无需编译或 npm build。
若预览服务器尚未启动，执行：

```bash
cd /Users/jiaxizhang/Documents/kimodo/website/real/web/web
python3 -m http.server 8765 --bind 127.0.0.1
```

服务器已运行时无需重启，保存修改后在浏览器按 Cmd+Shift+R 强制刷新。
封面锚点为 `#top`；`#overview` 位于封面之后，等待添加第一节内容。
封面导航仅悬停高亮；正文按视口 36% 处的阅读位置动态高亮当前章节。键盘焦点保留可见轮廓。

## 封面播放与正文初稿

- 播放顺序：transportation → football → banana → boxing → pnp → sitting → transportation。
- 使用两个 video 元素预载下一段，整组循环；保留播放/暂停、后台暂停和减少动态效果偏好。
- 两个 Hugging Face 按钮分别指向模型和数据集仓库。
- 正文包含 Overview、Method、Performance、Model、Datasets、Videos 六节。当前为英文文字初稿，暂未插入正文图表和视频。
- 正文文字基于 SHA256 为 0426912fd8330cfc750bc3b1c3d9b1a35323b76b0cefe6d5cd37d89d38878d21 的 21 页论文，主要依据第 4–6 节及 Limitations。对应本地 research_context/2026-10-13/main_arxiv.pdf。
- 正文参照 https://openhlm-corl.github.io/ ：1040px 容器、28px 横向内边距、88px/96px 章节留白、18px/1.72 正文、Inter 400/500/600 字体。分割线为 #6E89BC。
- 顶栏离开封面时淡出，进入正文后呈半透明白底并带 8px 背景模糊；按 OpenHLM 的阅读位置逻辑动态高亮当前章节（绿色）。
- 新视频为原片的 H.264 1080p 网页副本，无音轨，保留原速；原片未改动。

修改文字、样式和脚本后无需编译，服务器运行时只需 Cmd+Shift+R 刷新。

封面与 Overview 之间无分割线；正文章节之间保留蓝色分割线。

## Overview 图片

- `figure/overview0.png`：每次进入视口时，8.8 秒从左向右柔和显现。
- `figure/overviewbackground.png`：底层静态背景，与动作图使用完全相同的显示宽高和边界。
- `figure/overview.png`：紧接在下方，参考 MoPA 方法图的 20px 圆角、细边框、24px 内边距与轻阴影。
- 原图未编辑；顶部虚线通过 CSS 裁切隐藏，减少动态效果偏好下直接显示完整图。

Performance 使用 performance-data.js 中的论文 Tables 1–3 / Figure 11 数据；performance.js 实现标签切换、动态图表和数值动画。Simple 汇总由试验计数计算，缺失结果保持为空。

## Videos

- 三个标签：real（6 段）、humanoidarena（7 段）、simple（24 段，8 个任务各 3 段）。桌面每行 3 个，平板 2 个，手机 1 个。
- `videos-data.js` 管理视频顺序、标题、路径和预览图；`videos.js` 管理标签、键盘切换及视口内静音循环播放。尊重减少动态效果设置，保留原生播放控件。
- real 与封面原片逐一比对相同，复用已有 `assets/*.mp4` H.264 播放副本。HumanoidArena 原片为 MPEG-4 Part 2，浏览器兼容副本位于 `assets/task-videos/`，原片保持不变。Simple 直接使用 `videos/simple/` 中的 H.264 原片。
- 卡片采用 OpenHLM HLM Tasks 的三列布局、细边框、轻阴影、左上标签、下方标题和序号。为保留完整相机画面，4:3 原片在统一 16:9 视频框内等比显示。

## Model & Datasets / Real-world setup

- Model&Datasets 精简为 Hugging Face 风格的仓库卡片、Model/Datasets 滑块切换，以及 419 小时预训练语料的概述与 `figure/datasets.png`。
- `resources.js` 管理两个仓库的展示和直达链接。卡片为静态资源简介，不展示未验证的实时文件清单、下载量或仓库统计。
- real 视频网格下展示 `figure/deploymentconfigandmotionprofiles.png` 和论文中的 PICO / D435i / Dex3-1 数采配置。切换到 HumanoidArena 或 Simple 时隐藏该块。

## 最新展示调整

- Simple 雷达图展示全部 10 个策略。保留源数据中的 null，在渲染时将未报告任务补为 0（表中标为 0*），八任务均值也按补零后计算，并注明这是展示约定而非实测失败。
- 预训练图改用 pretrainleft / pretrainmiddle / pretrainright.png 三层无边框组合，各区域悬停或键盘聚焦时放大 1.2 倍。
- Overview 和 Method 正文项目名使用标题同款 Kimodo #76B900、-Policy #6E89BC。

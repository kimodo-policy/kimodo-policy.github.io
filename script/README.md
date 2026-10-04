# Kimodo-Policy 项目主页修改指南

## 本地运行

在 `web` 目录启动静态服务器：

```sh
cd /data/local-data/data/code/yunhengwang/paper/web
python3 -m http.server 8001
```

打开 `http://localhost:8001/` 即可进入主页。根目录的 `index.html` 会自动跳转到 `script/`。网页内容、样式和脚本都在 `script/`，图片与视频素材放在同级 `figure/` 目录，论文 PDF 放在 `paper/`。

## 页面内容与素材位置

以下按 HTML 栏目、CSS 选择器和图片文件名定位，不依赖行号。可在 `script/` 目录执行 `rg -n 'overview1.png|methodt2m.png' index.html` 搜索具体位置。

| 页面内容 | 文件与定位方式 | 当前素材 / 文案位置 |
|---|---:|---|
| 封面背景图 | `index.html` 的 `.cover-image` | `../figure/cover.png` |
| 浏览器标签页头像 | 两个入口 HTML 的 `<link rel="icon">` | `../figure/avator.png`；该图片也用于 GitHub `kimodo-policy` 组织头像 |
| 封面标题、副标题、作者与单位 | `.cover-content` 内标题、`.author-list`、`.affiliation-list`、`.author-notes` | 作者姓名后的上标为单位编号；`★` 为共同一作，`†` 为通讯作者；单位编号与作者对应论文 TeX |
| arXiv、Code、Hugging Face 链接 | `.hero-actions` | arXiv 当前链接到本地论文 PDF；代码和模型发布后给对应按钮补上正式网址。按钮图标在 `../figure/brand/` |
| 顶部栏目导航 | `.section-nav` | 修改栏目文字和对应的 `href="#栏目id"` |
| Overview 标题与正文 | `#overview` | 直接修改该栏目中的标题和段落 |
| Overview 总览图 | `#overview` 的 `figure` | `../figure/overview1.png` |
| Comparison 标题与正文 | `#comparison` | 直接修改该栏目中的标题和段落 |
| Comparison 对比图 | `#comparison` 的 `figure` | `../figure/overview.png` |
| Method 标题、结构介绍与架构图 | `#method` 的前半部分 | 正文直接编辑；架构图为 `../figure/method.png` |
| T2M 先验迁移标题、解读和配图 | `#method .method-transfer` | 正文直接编辑；图片为 `../figure/methodt2m.png` |
| Experiment 基准介绍 | `#experiment` 开头正文 | 直接修改 HTML 文本和实验指标 |
| Pre-training 标题、说明和数据图 | `#experiment .pretrain-section` | 正文直接修改；图片为 `../figure/pretraindata.png` |
| HumanoidArena 与 SIMPLE 基准图 | `#experiment` 中 `humanoidarena.png` | `../figure/humanoidarena.png` |
| Conclusion 标题与正文 | `#conclusion` | 直接修改该栏目中的标题和段落 |
| 页面底部文字 | `.site-footer` | 直接修改 HTML 文本 |

当前 `web` 版本的 Experiment 保留预训练介绍及 HumanoidArena/SIMPLE 基准结果图，已移除 HumanoidArena 任务卡片、真机任务卡片和部署配置图。其余保留图片附近有中文 HTML 注释，说明素材用途和替换方式。

## 如何换图、调尺寸和位置

**换图片内容：** 最简单的方法是把新图覆盖 `figure/` 下同名文件，HTML 无需改动。若使用新文件名，就修改上表对应 `<img src="../figure/文件名.png">` 中的路径。任务卡片同理，逐个修改对应卡片的 `src`。

**换成视频：** 找到对应 `.task-video` 中的 `<img>`，改成：

```html
<video controls muted playsinline preload="metadata">
  <source src="../figure/example.mp4" type="video/mp4">
</video>
```

保留外层 `<div class="task-video">`，视频就会沿用卡片尺寸和裁切方式。需要卡片进入屏幕时自动播放，可在 `<video>` 上增加 `data-autoplay`。

**调整图片显示大小：**

- 普通板块配图的宽度、自动高度由 `static/css/index.css` 的 `.paper-figure img` 控制；最大高度在 `static/css/kimodo.css` 的 `.paper-figure img` 控制。正文容器宽度由 `.container.is-max-desktop` 控制。
- 浏览器标签页头像由两个入口 HTML 的 `<link rel="icon">` 控制，替换 `figure/avator.png` 即可更新；GitHub 组织头像需要在组织设置中单独更新。
- 封面图的取景位置由 `static/css/kimodo.css` 的 `.cover-image` `object-position` 控制；例如改成 `center 45%` 可调整画面取景。
- 任务视频卡片统一为 `16:9`，由 `.task-video { aspect-ratio: 16 / 9; }` 控制。图片使用 `object-fit: cover` 填满卡片；若希望完整显示而允许留边，可改成 `contain`。

**调整板块间距和分隔线：** 板块上下留白在 `static/css/index.css` 的 `.section` 设置；章节分隔线在 `static/css/kimodo.css` 的 `.section + .section::before` 设置，宽度当前略宽于正文，色号为 `#e7e7e7`（RGB 231, 231, 231）。修改 `width` 和 `border-top` 可调整线长、粗细。

**调整文字：** 所有标题、正文、作者、任务名和图注都在 `script/index.html` 对应栏目附近直接编辑。正文中项目名请沿用 `<strong class="accent-text">Kimodo-Policy</strong>`，这样会保持加粗和 `#294791`（RGB 41, 71, 145）蓝色；样式强制使用 800 字重。封面标题中 `Policy` 由 `.cover-policy` 控色。全站字号、字体、文字颜色在 `static/css/index.css` 和 `static/css/kimodo.css` 中调整。

**调整封面资源按钮：** 三个圆角按钮沿用 MoPA 项目主页的 arXiv 红色、Code 深色和 Hugging Face 黄色样式。按钮间距、圆角、尺寸及各自配色都在 `static/css/kimodo.css` 的 `.project-button`、`.button-arxiv`、`.button-code`、`.button-huggingface` 中修改；图标文件在 `figure/brand/`。

封面资源按钮左边缘与作者姓名、单位说明对齐，由 `.hero-actions { justify-content: flex-start; }` 控制。

## 发布到 GitHub Pages

主页由 `kimodo-policy/kimodo-policy.github.io` 公开发布，网址为 `https://kimodo-policy.github.io/`。仓库根目录包含网站文件和 `.github/workflows/deploy.yml`，每次推送到 `main` 后由 GitHub Actions 自动部署。

## 标准更新流程

日常编辑只需要修改本地 `/data/local-data/data/code/yunhengwang/paper/web`。这个目录是网站源文件目录，不建议直接在其中执行 `git push`；推荐使用一个单独的主页仓库 clone 作为发布工作区。

第一次准备发布工作区：

```sh
gh auth switch --user zzzzzzzzjx
cd /data/local-data/data/code/yunhengwang/paper
gh repo clone kimodo-policy/kimodo-policy.github.io
cd kimodo-policy.github.io
git config user.name "JesseZhang"
git config user.email "zzzzzzzzjx@users.noreply.github.com"
```

每次修改 `web/` 后，同步并提交：

```sh
rsync -a --delete \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='paper/main_arxiv copy.pdf' \
  --exclude='web.tar.gz' \
  /data/local-data/data/code/yunhengwang/paper/web/ \
  /data/local-data/data/code/yunhengwang/paper/kimodo-policy.github.io/

cd /data/local-data/data/code/yunhengwang/paper/kimodo-policy.github.io
git status
git add .
git diff --cached --stat
git commit -m "Update Kimodo-Policy website"
git push origin main
```

不要删除 `.github/`，其中包含 GitHub Pages 自动部署工作流；不要把论文 PDF 重新复制进主页仓库，Paper 按钮已经链接到 Release 资产。推送成功后，Actions 通常需要几十秒到几分钟完成部署，主页地址为 `https://kimodo-policy.github.io/`。

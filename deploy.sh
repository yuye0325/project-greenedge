#!/bin/bash
# ============================================================
# Project GreenEdge (绿刃计划) - 一键部署脚本
# 功能：自动初始化 Git、推送到 GitHub、开启 Pages
# 用法：bash deploy.sh
# ============================================================

set -e

echo "========================================"
echo "  Project GreenEdge 一键部署"
echo "========================================"
echo ""

# ========== 1. 检查 Git ==========
if ! command -v git &> /dev/null; then
    echo "[错误] 未检测到 Git，请先安装 Git"
    echo "  下载地址: https://git-scm.com/downloads"
    exit 1
fi

# ========== 2. 收集信息 ==========
echo "请输入你的 GitHub 用户名（如 greenedge-org）："
read -r GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "[错误] 用户名不能为空"
    exit 1
fi

echo ""
echo "仓库名称（默认: project-greenedge）："
read -r REPO_NAME
REPO_NAME=${REPO_NAME:-project-greenedge}

echo ""
echo "========================================"
echo "  确认信息"
echo "========================================"
echo "  GitHub 用户名: $GITHUB_USER"
echo "  仓库名称:      $REPO_NAME"
echo "  仓库地址:      https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "请确保你已在 GitHub 上创建了该仓库（公开、不要勾选初始化）"
echo "如果还没创建，请打开: https://github.com/new"
echo ""
echo "按 Enter 继续，或 Ctrl+C 取消..."
read -r

# ========== 3. 替换配置 ==========
echo ""
echo "[1/5] 替换配置文件中的用户名..."

# 替换 script.js 中的配置
if [ -f "assets/js/script.js" ]; then
    # macOS 和 Linux 的 sed 语法不同
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/owner: 'Yuye0325'/owner: '$GITHUB_USER'/g" assets/js/script.js
    else
        sed -i "s/owner: 'Yuye0325'/owner: '$GITHUB_USER'/g" assets/js/script.js
    fi
fi

# 替换 HTML 中的链接
if [ -f "index.html" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/Yuye0325\/project-greenedge/$GITHUB_USER\/$REPO_NAME/g" index.html
    else
        sed -i "s/Yuye0325\/project-greenedge/$GITHUB_USER\/$REPO_NAME/g" index.html
    fi
fi

# 替换 README 中的链接
if [ -f "README.md" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/Yuye0325\/project-greenedge/$GITHUB_USER\/$REPO_NAME/g" README.md
    else
        sed -i "s/Yuye0325\/project-greenedge/$GITHUB_USER\/$REPO_NAME/g" README.md
    fi
fi

echo "  ✓ 配置已更新"

# ========== 4. 初始化 Git 并推送 ==========
echo ""
echo "[2/5] 初始化 Git 仓库..."

git init
git add .
git commit -m "init: Project GreenEdge 绿刃计划初始提交

- 项目主页 (index.html)
- 贡献者墙 (CONTRIBUTORS.md)
- 财务公开账本 (finance/ledger.md)
- 项目透明宪章 (constitution.md)
- 首个挑战任务 (challenges/01-building-energy-prediction.md)
- GitHub Pages 自动部署 (GitHub Actions)"

echo "  ✓ Git 仓库已初始化"

echo ""
echo "[3/5] 推送到 GitHub..."

git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

git branch -M main
git push -u origin main

echo "  ✓ 代码已推送到 GitHub"

# ========== 5. 开启 GitHub Pages ==========
echo ""
echo "[4/5] 开启 GitHub Pages..."

# 使用 GitHub API 开启 Pages（需要 token）
# 如果没有 token，提示手动操作
echo ""
echo "  ⚠️  需要手动开启 GitHub Pages："
echo "  1. 打开 https://github.com/$GITHUB_USER/$REPO_NAME/settings/pages"
echo "  2. Source 选择 'GitHub Actions'"
echo "  3. 页面会自动部署，等待 1-2 分钟"
echo ""
echo "  你的网站地址: https://$GITHUB_USER.github.io/$REPO_NAME/"

# ========== 6. 完成 ==========
echo ""
echo "[5/5] 部署完成！"
echo ""
echo "========================================"
echo "  Project GreenEdge 已上线！"
echo "========================================"
echo ""
echo "  🌐 网站: https://$GITHUB_USER.github.io/$REPO_NAME/"
echo "  📦 仓库: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "  下一步："
echo "  1. 等待 1-2 分钟让 GitHub Pages 完成部署"
echo "  2. 访问网站确认一切正常"
echo "  3. 在 CONTRIBUTORS.md 中留下你的减碳承诺"
echo "  4. 分享给朋友，邀请他们一起参与！"
echo ""
echo "========================================"
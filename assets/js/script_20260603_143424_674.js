/* ============================================================
   Project GreenEdge (绿刃计划) - 页面交互逻辑
   功能：
   1. GitHub API 动态加载贡献者
   2. 导航栏滚动阴影
   3. 移动端菜单切换
   ============================================================ */

(function () {
  'use strict';

  // ========== 配置 ==========
  // ⚠️ 部署前请将以下变量替换为你自己的 GitHub 仓库信息
  var CONFIG = {
    owner: 'your-username',        // 你的 GitHub 用户名
    repo: 'project-greenedge',     // 仓库名
    perPage: 10,                   // 每页获取的 commit 数量
    maxContributors: 8             // 最多显示几位贡献者
  };

  // ========== DOM 元素 ==========
  var loadingSpinner = document.getElementById('loadingSpinner');
  var contributorsList = document.getElementById('contributorsList');
  var contributorsError = document.getElementById('contributorsError');
  var statContributors = document.getElementById('statContributors');
  var statCommits = document.getElementById('statCommits');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelector('.nav-links');
  var nav = document.getElementById('nav');

  // ========== 导航栏：滚动阴影 ==========
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ========== 导航栏：移动端菜单 ==========
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  // ========== GitHub API：获取贡献者 ==========
  function fetchContributors() {
    // GitHub REST API - 获取仓库提交记录（无需认证即可访问公开仓库）
    // 文档：https://docs.github.com/en/rest/commits/commits#list-commits
    var apiUrl = 'https://api.github.com/repos/' +
      encodeURIComponent(CONFIG.owner) + '/' +
      encodeURIComponent(CONFIG.repo) +
      '/commits?per_page=' + CONFIG.perPage;

    fetch(apiUrl, {
      headers: {
        // GitHub API 建议设置 Accept 头以获取稳定版本
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(function (response) {
        if (!response.ok) {
          // 403 通常是 API 限流（未认证每小时 60 次）
          if (response.status === 403) {
            throw new Error('GitHub API 限流，请稍后刷新（未认证账户每小时 60 次请求）');
          }
          throw new Error('API 请求失败，状态码: ' + response.status);
        }
        return response.json();
      })
      .then(function (commits) {
        if (!Array.isArray(commits) || commits.length === 0) {
          throw new Error('暂无提交记录');
        }

        // 提取所有贡献者信息（去重）
        var contributorsMap = {};

        commits.forEach(function (commit) {
          // GitHub commit 的结构：commit.author.name / commit.author.email
          var author = (commit.commit && commit.commit.author) || commit.author;
          if (!author || !author.name) return;

          var name = author.name;
          // 去重：同一作者只保留最新一条提交
          if (!contributorsMap[name]) {
            contributorsMap[name] = {
              name: name,
              avatar: commit.author ? commit.author.avatar_url : '',
              message: (commit.commit && commit.commit.message) || '',
              date: (commit.commit && commit.commit.author && commit.commit.author.date) || ''
            };
          }
        });

        var contributors = Object.values(contributorsMap)
          .slice(0, CONFIG.maxContributors);

        // 更新统计数据
        if (statContributors) {
          statContributors.textContent = Object.keys(contributorsMap).length;
        }
        if (statCommits) {
          statCommits.textContent = commits.length;
        }

        // 渲染贡献者列表
        renderContributors(contributors);
      })
      .catch(function (error) {
        console.warn('贡献者数据加载失败:', error.message);
        // 显示备用错误提示
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (contributorsError) contributorsError.style.display = 'block';

        // 统计数据置为不可用
        if (statContributors) statContributors.textContent = '--';
        if (statCommits) statCommits.textContent = '--';
      });
  }

  // ========== 渲染贡献者列表 ==========
  function renderContributors(contributors) {
    // 隐藏加载动画
    if (loadingSpinner) loadingSpinner.style.display = 'none';

    if (contributors.length === 0) {
      if (contributorsError) contributorsError.style.display = 'block';
      return;
    }

    // 显示列表
    if (contributorsList) contributorsList.style.display = 'flex';

    var html = '';
    contributors.forEach(function (c) {
      var shortMsg = c.message.replace(/\n/g, ' ').substring(0, 60);
      if (shortMsg.length === 60) shortMsg += '...';

      // 格式化日期
      var dateStr = '';
      if (c.date) {
        var d = new Date(c.date);
        dateStr = (d.getMonth() + 1) + '-' + d.getDate();
      }

      // 头像：优先使用 GitHub 头像，否则用首字母
      var avatarHtml = c.avatar
        ? '<img src="' + escapeAttr(c.avatar) + '" alt="" class="contributor-avatar-img" width="42" height="42">'
        : '<div class="contributor-avatar">' + escapeHtml(c.name.charAt(0).toUpperCase()) + '</div>';

      html +=
        '<li class="contributor-item">' +
          avatarHtml +
          '<div class="contributor-info">' +
            '<div class="contributor-name">' + escapeHtml(c.name) + '</div>' +
            '<div class="contributor-commit">' + escapeHtml(shortMsg) + '</div>' +
          '</div>' +
          '<span class="contributor-date">' + escapeHtml(dateStr) + '</span>' +
        '</li>';
    });

    contributorsList.innerHTML = html;
  }

  // ========== HTML 转义（防 XSS） ==========
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ========== 属性值转义 ==========
  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ========== 页面加载时触发 ==========
  fetchContributors();

})();
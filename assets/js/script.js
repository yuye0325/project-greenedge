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
    owner: 'Yuye0325',        // 你的 GitHub 用户名
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
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(function (response) {
        if (!response.ok) {
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

        var contributorsMap = {};

        commits.forEach(function (commit) {
          var author = (commit.commit && commit.commit.author) || commit.author;
          if (!author || !author.name) return;

          var name = author.name;
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

        if (statContributors) {
          statContributors.textContent = Object.keys(contributorsMap).length;
        }
        if (statCommits) {
          statCommits.textContent = commits.length;
        }

        renderContributors(contributors);
      })
      .catch(function (error) {
        console.warn('贡献者数据加载失败:', error.message);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (contributorsError) contributorsError.style.display = 'block';
        if (statContributors) statContributors.textContent = '--';
        if (statCommits) statCommits.textContent = '--';
      });
  }

  function renderContributors(contributors) {
    if (loadingSpinner) loadingSpinner.style.display = 'none';

    if (contributors.length === 0) {
      if (contributorsError) contributorsError.style.display = 'block';
      return;
    }

    if (contributorsList) contributorsList.style.display = 'flex';

    var html = '';
    contributors.forEach(function (c) {
      var shortMsg = c.message.replace(/\n/g, ' ').substring(0, 60);
      if (shortMsg.length === 60) shortMsg += '...';

      var dateStr = '';
      if (c.date) {
        var d = new Date(c.date);
        dateStr = (d.getMonth() + 1) + '-' + d.getDate();
      }

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

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  fetchContributors();

})();

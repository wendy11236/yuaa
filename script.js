// ===================== 通用工具函数（封装复用逻辑） =====================
/**
 * 安全获取DOM元素（避免null报错）
 * @param {string} selector 选择器
 * @returns {HTMLElement|null} DOM元素或null
 */
const $ = (selector) => document.querySelector(selector) || null;

/**
 * 安全获取多个DOM元素
 * @param {string} selector 选择器
 * @returns {NodeList} 元素列表（空列表而非null）
 */
const $$ = (selector) => document.querySelectorAll(selector) || [];

/**
 * 格式化时间（兼容低版本浏览器padStart）
 * @param {number} timestamp 时间戳
 * @returns {string} 格式化后的时间 YYYY-MM-DD HH:MM
 */
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const pad = (num) => (num < 10 ? '0' + num : num); // 兼容padStart
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * 防抖函数（优化高频事件）
 * @param {Function} fn 执行函数
 * @param {number} delay 延迟时间
 * @returns {Function} 防抖后的函数
 */
const debounce = (fn, delay = 300) => {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

// ===================== 动漫详情数据（修正图片路径：建议改为相对路径） =====================
const animeDetails = {
    1: {
        title: "进击的巨人",
        image: "images/微信图片_20251120195346_91_151.jpg", // 改为相对路径（需确保images文件夹和html同级）
        type: "热血 / 科幻",
        score: "9.8",
        episodes: "75集（全四季）",
        release: "2013-2023",
        director: "荒木哲郎、林祐一郎",
        studio: "WIT STUDIO（1-3季）、MAPPA（最终季）",
        intro: "在一个被巨人包围的世界里，人类被迫居住在三重巨大的城墙内。少年艾伦·耶格尔亲眼目睹母亲被巨人吞噬，从此立下誓言要将所有巨人驱逐出去。随着调查兵团的冒险，人类逐渐发现巨人的真相以及世界的秘密，一场关乎人类存亡的战争就此展开。"
    },
    2: {
        title: "鬼灭之刃",
        image:"images/微信图片_20251120195349_92_151.jpg" , 
        type: "战斗 / 奇幻",
        score: "9.7",
        episodes: "44集（含剧场版）",
        release: "2019-至今",
        director: "外崎春雄",
        studio: "ufotable",
        intro: "平凡的卖炭少年灶门炭治郎，在一天回家后发现家人被鬼残忍杀害，唯一幸存的妹妹祢豆子也变成了鬼。为了让妹妹恢复人身，也为了替家人报仇，炭治郎加入了专门猎杀鬼的组织「鬼杀队」，开启了与鬼战斗的艰难旅程。作品以精美的画面、动人的剧情和深刻的人物塑造深受喜爱。"
    },
    3: {
        title: "原神·动画版",
        image:"images/微信图片_20251214185945_196_151.jpg" , 
        type: "冒险 / 奇幻",
        score: "9.6",
        episodes: "连载中",
        release: "2024-至今",
        director: "ufotable 团队",
        studio: "ufotable",
        intro: "改编自米哈游旗下热门游戏《原神》，讲述了来自另一个世界的旅行者兄妹，在降临提瓦特大陆后遭遇陌生神明，妹妹被掳走，哥哥（或妹妹）为了寻找亲人，踏上了跨越七国的冒险之旅。途中结识了各种性格鲜明的伙伴，解开了提瓦特大陆的诸多秘密。"
    },
    4: {
        title: "排球少年！！",
        image: "images/微信图片_20251211155254_193_151.jpg", 
        type: "运动 / 热血",
        score: "9.9",
        episodes: "四季全（85集）",
        release: "2014-2020",
        director: "满仲劝",
        studio: "Production I.G",
        intro: "讲述了小个子少年日向翔阳受电视上播放的排球比赛启发，立志成为排球运动员，进入乌野高中后与影山飞雄等队友一起，向着全国大赛目标努力拼搏的热血故事。"
    }
};

// ===================== 核心逻辑（DOM加载完成后执行：所有DOM操作都放这里） =====================
document.addEventListener('DOMContentLoaded', () => {
    // ========== 0. 全局错误捕获（优先执行） ==========
    window.addEventListener('error', (e) => {
        console.error('全局错误:', e.message, '行号:', e.lineno, '列号:', e.colno);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise错误:', e.reason);
        e.preventDefault();
    });

    // ========== 1. 加载动画（容错处理） ==========
    const loader = $('#loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }

    // ========== 2. 暗色模式切换（全量容错） ==========
    const modeToggle = $('#modeToggle');
    const body = document.body;
    if (modeToggle) {
        const modeIcon = modeToggle.querySelector('i');
        const modeText = modeToggle.querySelector('span');
        
        // 从本地存储读取模式
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode && body) {
            body.classList.add('dark-mode');
            modeIcon?.classList?.remove('fa-moon-o');
            modeIcon?.classList?.add('fa-sun-o');
            modeText && (modeText.textContent = '亮色模式');
        }

        // 切换模式
        modeToggle.addEventListener('click', () => {
            if (!body) return;
            const newDarkMode = body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', newDarkMode);
            
            if (modeIcon) {
                modeIcon.classList.toggle('fa-moon-o', !newDarkMode);
                modeIcon.classList.toggle('fa-sun-o', newDarkMode);
            }
            if (modeText) {
                modeText.textContent = newDarkMode ? '亮色模式' : '暗色模式';
            }
        });
    }

    // ========== 3. 旧版弹窗逻辑（整合到核心弹窗，保留兼容） ==========
    const oldModal = $('#anime-detail-modal');
    const closeBtn = $('.close-btn');
    if (oldModal && closeBtn) {
        // 关闭旧弹窗
        closeBtn.addEventListener('click', () => {
            oldModal.style.display = 'none';
        });
        // 点击外部关闭旧弹窗
        window.addEventListener('click', (e) => {
            if (e.target === oldModal) {
                oldModal.style.display = 'none';
            }
        });
    }

    // ========== 4. 动漫详情模态框 + 评论功能（增强容错+体验） ==========
    const animeModal = $('#animeModal');
    const closeModal = $('#closeModal');
    const animeDetailContent = $('#animeDetailContent');
    const commentInput = $('#commentInput');
    const commentSubmitBtn = $('#commentSubmitBtn');
    const commentList = $('#commentList');
    const animeCards = $$('.anime-card');
    let currentAnimeId = '';

    // 从本地存储获取评论
    const getComments = () => {
        try {
            return JSON.parse(localStorage.getItem('animeComments')) || {};
        } catch (e) {
            console.warn('读取评论数据失败', e);
            return {};
        }
    };

    // 渲染评论列表
    const renderComments = (animeId) => {
        if (!commentList) return;
        const comments = getComments();
        const animeComments = comments[animeId] || [];
        
        commentList.innerHTML = '';
        // 无评论提示
        if (animeComments.length === 0) {
            commentList.innerHTML = '<div class="comment-empty">暂无评论，快来抢沙发吧～</div>';
            return;
        }

        // 渲染评论
        animeComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            commentItem.innerHTML = `
                <div class="comment-meta">
                    <span class="comment-author">匿名用户</span>
                    <span class="comment-time">${formatTime(comment.time)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            `;
            commentList.appendChild(commentItem);
        });
    };

    // 提交评论（防抖+验证）
    const submitComment = debounce(() => {
        if (!commentInput || !currentAnimeId) return;
        
        const content = commentInput.value.trim();
        if (content.length < 5) {
            alert('评论内容不少于5个字哦～');
            return;
        }

        try {
            const comments = getComments();
            if (!comments[currentAnimeId]) comments[currentAnimeId] = [];
            
            // 添加新评论（最新的在最上方）
            comments[currentAnimeId].unshift({
                content: content,
                time: Date.now()
            });
            
            // 保存到本地存储
            localStorage.setItem('animeComments', JSON.stringify(comments));
            commentInput.value = '';
            renderComments(currentAnimeId);
            // 友好提示（替代alert）
            const tip = document.createElement('div');
            tip.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            tip.textContent = '评论提交成功！';
            document.body.appendChild(tip);
            setTimeout(() => tip.style.opacity = 1);
            setTimeout(() => {
                tip.style.opacity = 0;
                setTimeout(() => document.body.removeChild(tip), 300);
            }, 2000);
        } catch (e) {
            console.warn('提交评论失败', e);
            alert('评论提交失败，请重试～');
        }
    }, 500); // 防抖延迟500ms

    // 打开模态框（整合旧版弹窗逻辑）
    animeCards.forEach(card => {
        card.addEventListener('click', () => {
            const animeId = card.dataset.animeId;
            if (!animeId || !animeDetails[animeId]) return;
            
            currentAnimeId = animeId;
            const detail = animeDetails[animeId];
            
            // 填充旧版弹窗数据（兼容）
            if (oldModal) {
                const oldDetailImg = $('#detail-img');
                const oldDetailTitle = $('#detail-title');
                const oldDetailType = $('#detail-type');
                const oldDetailScore = $('#detail-score');
                const oldDetailEpisodes = $('#detail-episodes');
                const oldDetailRelease = $('#detail-release');
                const oldDetailDirector = $('#detail-director');
                const oldDetailStudio = $('#detail-studio');
                const oldDetailIntro = $('#detail-intro');

                oldDetailImg && (oldDetailImg.src = detail.image);
                oldDetailImg && (oldDetailImg.alt = `${detail.title}详情图`);
                oldDetailTitle && (oldDetailTitle.textContent = detail.title);
                oldDetailType && (oldDetailType.textContent = detail.type);
                oldDetailScore && (oldDetailScore.textContent = detail.score);
                oldDetailEpisodes && (oldDetailEpisodes.textContent = detail.episodes);
                oldDetailRelease && (oldDetailRelease.textContent = detail.release);
                oldDetailDirector && (oldDetailDirector.textContent = detail.director);
                oldDetailStudio && (oldDetailStudio.textContent = detail.studio);
                oldDetailIntro && (oldDetailIntro.textContent = detail.intro);
                oldModal.style.display = 'block';
            }

            // 填充新版弹窗数据
            if (animeDetailContent) {
                animeDetailContent.innerHTML = `
                    <img src="${detail.image}" alt="${detail.title}" class="anime-detail-img">
                    <div class="anime-detail-info">
                        <h2>${detail.title}</h2>
                        <p><strong>类型：</strong>${detail.type || '未知'}</p>
                        <p><strong>评分：</strong>${detail.score || '暂无'}</p>
                        <p><strong>集数：</strong>${detail.episodes || '未知'}</p>
                        <p><strong>播出时间：</strong>${detail.release || '未知'}</p>
                        <p><strong>导演：</strong>${detail.director || '未知'}</p>
                        <p><strong>动画制作：</strong>${detail.studio || '未知'}</p>
                        <h3>剧情简介</h3>
                        <p>${detail.intro || '暂无简介'}</p>
                    </div>
                `;
            }

            // 渲染评论
            renderComments(animeId);
            
            // 显示新版模态框（容错）
            if (animeModal) {
                animeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // 禁止背景滚动时的抖动
                document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
            }
        });
    });

    // 关闭模态框（恢复滚动+清空输入）
    const closeModalHandler = () => {
        // 关闭新版弹窗
        if (animeModal) {
            animeModal.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.paddingRight = ''; // 恢复右侧padding
        }
        // 关闭旧版弹窗
        if (oldModal) {
            oldModal.style.display = 'none';
        }
        // 清空输入
        if (commentInput) commentInput.value = '';
        currentAnimeId = '';
    };

    // 绑定新版弹窗关闭事件
    if (closeModal) closeModal.addEventListener('click', closeModalHandler);
    if (animeModal) {
        animeModal.addEventListener('click', (e) => {
            if (e.target === animeModal) closeModalHandler();
        });
    }

    // 绑定评论提交事件
    if (commentSubmitBtn) commentSubmitBtn.addEventListener('click', submitComment);
    if (commentInput) {
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment();
            }
        });
    }

    // ========== 5. 角色投票功能（防重复+容错） ==========
    const voteBtns = $$('.vote-btn');
    let votedCharacters = {};
    // 读取投票数据（容错）
    try {
        votedCharacters = JSON.parse(localStorage.getItem('votedCharacters')) || {};
    } catch (e) {
        console.warn('读取投票数据失败', e);
        votedCharacters = {};
    }

    // 初始化投票数
    voteBtns.forEach(btn => {
        const characterCard = btn.closest('.character-card');
        const characterId = characterCard?.dataset.characterId;
        const voteCount = btn.querySelector('.vote-count');
        if (characterId && voteCount) {
            voteCount.textContent = votedCharacters[characterId] || 0;
        }
    });

    // 投票逻辑（防重复点击）
    voteBtns.forEach(btn => {
        let isVoting = false; // 防止重复点击
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isVoting) return;
            
            const characterCard = btn.closest('.character-card');
            const characterId = characterCard?.dataset.characterId;
            const voteCount = btn.querySelector('.vote-count');
            const voteIcon = btn.querySelector('i');
            if (!characterId || !voteCount || !voteIcon) return;

            isVoting = true;
            // 更新投票数
            votedCharacters[characterId] = (votedCharacters[characterId] || 0) + 1;
            voteCount.textContent = votedCharacters[characterId];
            
            // 保存到本地存储
            try {
                localStorage.setItem('votedCharacters', JSON.stringify(votedCharacters));
            } catch (e) {
                console.warn('保存投票数据失败', e);
            }

            // 更新按钮状态
            const voteText = btn.childNodes[1]?.textContent?.trim() || '';
            if (voteText.includes('为他') || voteText.includes('为她')) {
                voteIcon.classList.remove('fa-heart');
                voteIcon.classList.add('fa-heart-o');
                btn.innerHTML = `<i class="fa fa-heart-o"></i> 已投票 <span class="vote-count">${votedCharacters[characterId]}</span>`;
            }

            // 投票动画
            btn.classList.add('voted');
            setTimeout(() => {
                btn.classList.remove('voted');
                isVoting = false;
            }, 500);
        });
    });

    // ========== 6. 图片懒加载（增强兼容+体验） ==========
    const lazyLoadImages = $$('.lazy-load');
    if ('IntersectionObserver' in window && lazyLoadImages.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src'); // 移除冗余属性
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px 0px' });

        lazyLoadImages.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理：直接加载所有图片
        lazyLoadImages.forEach(img => {
            if (img.dataset.src) img.src = img.dataset.src;
        });
    }

    // ========== 7. 滚动动画（性能优化） ==========
    const fadeElements = $$('.fade-in');
    if ('IntersectionObserver' in window && fadeElements.length) {
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

        fadeElements.forEach(el => elementObserver.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('active'));
    }

    // ========== 8. 导航栏 + 回到顶部（全量容错+性能优化） ==========
    const navLinks = $$('.nav-menu a');
    const sections = $$('section');
    const navbar = $('.navbar');
    const backToTopBtn = $('#backToTop');
    const menuBtn = $('.menu-btn');
    const navMenu = $('.nav-menu');
    const menuIcon = menuBtn?.querySelector('i');

    // 滚动监听（防抖优化）
    const handleScroll = debounce(() => {
        const scrollY = window.scrollY;

        // 8.1 导航栏active状态切换
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}` || (currentSection === '' && link.getAttribute('href') === '#home')) {
                link.classList.add('active');
            }
        });

        // 8.2 导航栏滚动样式
        if (navbar) {
            navbar.classList.toggle('scroll', scrollY > 100);
        }

        // 8.3 回到顶部按钮显示
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('active', scrollY > 300);
        }
    }, 100); // 滚动防抖100ms

    window.addEventListener('scroll', handleScroll);

    // 8.4 锚点平滑滚动（容错）
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = $(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单（容错）
                if (navMenu?.classList?.contains('active')) {
                    navMenu.classList.remove('active');
                    menuIcon?.classList?.remove('fa-times');
                    menuIcon?.classList?.add('fa-bars');
                }
            }
        });
    });

    // 8.5 移动端菜单切换（容错）
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars');
                menuIcon.classList.toggle('fa-times');
            }
        });
    }

    // 8.6 回到顶部功能（容错）
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // ====== 1. 找 DOM 元素 ======
const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const list = document.querySelector('#list');
const countSpan = document.querySelector('#count');
const clearBtn = document.querySelector('#clearBtn');

// ====== 2. 数据：任务数组（真正的数据在这里） ======
let tasks = [];

// ====== 3. localStorage：存 / 取 ======
const STORAGE_KEY = 'todo_lite_tasks';

function saveTasks() {
  // 把数组 → 字符串，塞进浏览器“小抽屉”，数据是存放在浏览器中的。JSON.stringify(tasks)把用户在键盘上输入的数组转化为json存放。(STORAGE_KEY, JSON.stringify(tasks)是一个键值对（变量名，值）
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  // 从浏览器的抽屉里把存放的数据拿出来（可能是 null）
  const data = localStorage.getItem(STORAGE_KEY);
  // 如果有数据，就 parse 回数组；没有就用空数组，if语句
  tasks = data ? JSON.parse(data) : [];
}

// ====== 4. 渲染：把 tasks 画到页面上 ======
function render() {
  // 先清空列表
  list.innerHTML = '';

  // 再按 tasks 重新画
  tasks.forEach((text) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.className = 'task';
    span.textContent = text;

    const tag = document.createElement('span');
    tag.className = 'small';

    li.appendChild(span);
    li.appendChild(tag);
    list.appendChild(li);
  });

  // 更新计数
  countSpan.textContent = tasks.length;
}

// ====== 5. 添加任务（一个“动作包”） ======
function addTask() {
  const text = input.value.trim();

  if (!text) {
    alert('先写点东西再添加 😉');
    input.focus();
    return;
  }

  // 1) 改数据
  tasks.push(text);

  // 2) 调用函数，存起来
  saveTasks();

  // 3) 调用函数，重新渲染
  render();

  // 4) 收尾 增强用户体验
  input.value = '';
  input.focus();
}

// ====== 6. 清空任务 ======
function clearAll() {
  if (!confirm('确定要清空所有动漫吗？')) return;

  tasks = [];
  saveTasks();
  render();
  input.focus();
}

// ====== 7. 绑定事件 ======
addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', clearAll);

// ====== 8. 初始化：先读本地数据，再画出来 ======
loadTasks();
render();
input.focus();
    }
});
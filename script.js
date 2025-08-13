// app.js
document.addEventListener('DOMContentLoaded', () => {
    // --- 配置信息 ---
    const personalData = {
        name: "SSBX",
        title: "生生不息",
        avatar: "https://img.qlqqs.com/b/2025/08/13/689c8cfedbc32.png",
        bio: "生生不息",

        // --- “我的网站”数据结构更新 ---
        // span: 1  => 占据1列
        // span: 2  => 占据2列
        // type: 'image' => 设为图片背景卡片
        websites: [
            {
                title: "个人博客",
                description: "记录我的技术、生活与思考。",
                url: "https://blog.136188.xyz/",
                icon: "bi-journal-richtext",
                span: 2 // 这个卡片将占据2列
            },
            {
                title: "论文拼图",
                description: "一个提供科研论文图片拼图服务的网站。",
                url: "https://paper.136188.xyz/",
                icon: "bi-images",
                span: 1 // 这个卡片将占据1列
            },
            {
                title: "XXX",
                description: "XXXX。",
                url: "#", // 替换为您的链接
                span: 3,
                type: 'image', // 特殊类型：图片卡片
                imageUrl: 'https://api.dujin.org/bing/1920.php' // 替换为您的图片URL
            },

        ],

        // --- “联系方式”数据结构更新 ---
        social: [
            {
                title: "GitHub",
                description: "查看我的开源项目。",
                url: "https://github.com/",
                icon: "bi-github",
                span: 1
            },
            {
                title: "邮箱",
                description: "随时欢迎与我联系。",
                url: "mailto:lts2233@hotmail.com",
                icon: "bi-envelope-fill",
                span: 1
            },
            {
                title: "Telegram",
                description: "加入我的频道或私聊。",
                url: "",
                icon: "bi-telegram",
                span: 1
            }
        ]
    };

    // --- DOM 元素 (来自您的 index.html) ---
    const elements = {
        html: document.documentElement,
        name: document.getElementById('name'),
        title: document.getElementById('title'),
        avatar: document.getElementById('avatar'),
        bio: document.getElementById('bio'),
        websitesContainer: document.getElementById('websites-container'),
        socialLinksContainer: document.getElementById('social-links'),
        hitokotoText: document.getElementById('hitokoto-text'),
        refreshHitokotoBtn: document.getElementById('refresh-hitokoto'),
        themeSwitcherBtn: document.getElementById('theme-switcher')
    };

    // --- 渲染函数更新 ---
    const renderLinks = (container, linksData) => {
        if (!container) return;
        if (!linksData || linksData.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-secondary);">暂无链接</p>';
            return;
        }

        container.innerHTML = linksData.map(link => {
            // 根据数据动态添加CSS class
			let classList = ['card'];
			// 当 span 值大于1时，自动添加对应的class (例如 md-col-span-2, md-col-span-3)
			if (link.span > 1) {
				classList.push(`md-col-span-${link.span}`);
			}
            if (link.type === 'image') {
                classList.push('image-card');
            }

            const style = link.imageUrl ? `style="background-image: url('${link.imageUrl}')"` : '';
            const target = link.url && link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';

            // 根据类型生成不同的卡片内容
            let content = '';
            if (link.type === 'image') {
                // 图片卡片，可以保留标题和描述作为遮罩层文字
                content = `
                    <div class="overlay"></div>
                    <div class="card-content">
                        <h2>${link.title || ''}</h2>
                        <p>${link.description || ''}</p>
                    </div>
                `;
            } else {
                // 普通文本卡片
                content = `
                    <div class="card-content">
                        <h2><i class="bi ${link.icon || ''}"></i> ${link.title || ''}</h2>
                        <p>${link.description || ''}</p>
                    </div>
                `;
            }

            return `
                <a href="${link.url || '#'}" class="${classList.join(' ')}" ${target} ${style}>
                    ${content}
                </a>
            `;
        }).join('');
    };

    // --- 主题管理和基础渲染 (来自您的 app.js) ---
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        elements.html.setAttribute('data-theme', currentTheme);
    };

    const setupThemeSwitcher = () => {
        if (!elements.themeSwitcherBtn) return;
        elements.themeSwitcherBtn.addEventListener('click', () => {
            const currentTheme = elements.html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            elements.html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    };

    const renderProfile = () => {
        if (elements.name) elements.name.textContent = personalData.name;
        if (elements.title) elements.title.textContent = personalData.title;
        if (elements.avatar) elements.avatar.src = personalData.avatar;
        if (elements.bio) elements.bio.textContent = personalData.bio;
    };

    const loadHitokoto = async () => {
        if (!elements.hitokotoText) return;
        elements.hitokotoText.textContent = '正在获取...';
        try {
            const response = await fetch('https://v1.hitokoto.cn/?encode=json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            elements.hitokotoText.textContent = `“${data.hitokoto}” — ${data.from || '未知来源'}`;
        } catch (error) {
            console.error('Failed to load Hitokoto:', error);
            elements.hitokotoText.textContent = '“生活本身就是一种无法抗拒的向前。”';
        }
    };

    // --- 初始化 ---
    initTheme();
    setupThemeSwitcher();
    renderProfile();
    renderLinks(elements.websitesContainer, personalData.websites);
    renderLinks(elements.socialLinksContainer, personalData.social);
    loadHitokoto();

    if (elements.refreshHitokotoBtn) {
        elements.refreshHitokotoBtn.addEventListener('click', loadHitokoto);
    }
});
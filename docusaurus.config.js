module.exports = {
  title: 'My Site',
  tagline: 'The tagline of my site',
  url: 'https://btey.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'btey', // Usually your GitHub org/user name.
  projectName: 'btey.github.io', // Usually your repo name.
  themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'community',
        editUrl: 'https://github.com/btey/MyDocs/edit/master/community/',
        routeBasePath: 'community',
        sidebarPath: require.resolve('./sidebarsCommunity.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'second-blog',
        path: 'second-blog/blog',
        routeBasePath: 'second-blog',
        editUrl:
          'https://github.com/btey/MyDocs/edit/master/second-blog/blog',
        postsPerPage: 3,
        feedOptions: {
          type: 'all',
          copyright: `Copyright © ${new Date().getFullYear()} B. Tey`,
        },
      },
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsDir: [
          "docs", 
          "community"
        ],
        docsRouteBasePath: [
          "/docs",
          "/community"
        ],
        blogDir: [
          "blog",
          "second-blog/blog"
        ],
        blogRouteBasePath: [
          "/blog",
          "/second-blog"
        ],
      },
    ],
  ],
  themeConfig: {
    hideableSidebar: true,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      hideOnScroll: false,
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
        srcDark: 'img/docusaurus_keytar.svg',
      },
      items: [
        {
          to: 'docs/',
          //activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
          docId: 'introduction',
        },
        {
          to: '/community/support',
          label: 'Community',
          position: 'left',
          activeBaseRegex: `/community/`,
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {to: 'second-blog', label: 'Blog 2', position: 'left'},
        {
          href: 'https://github.com/btey',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/btey',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} B. Tey. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/btey/MyDocs/edit/master/',
        },
        blog: {
          path: 'blog',
          postsPerPage: 3,
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/btey/MyDocs/edit/master/blog/',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} B. Tey`,
          },
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All our posts',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

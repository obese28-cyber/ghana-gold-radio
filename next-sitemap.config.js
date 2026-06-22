/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ghanagoldradio.com',
  generateRobotsTxt: false, // we ship a static robots.txt in /public
  exclude: ['/admin', '/admin/*', '/api/*'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
};

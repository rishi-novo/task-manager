const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api', // This should match the API path you want to proxy
        createProxyMiddleware({
            target: 'https://cc1fbde45ead-in-south-01.backstract.io',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/pensive-mccarthy-6b7c9f8cde4411efbd780242ac12000431/api', // Adjust the path as needed
            },
        })
    );
}; 
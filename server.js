const express = require('express');
const {blogAnalysis,searchByTitle, getBlogDataMiddleware} = require('./controller');

const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/blog-stats', getBlogDataMiddleware , blogAnalysis);
app.get('/api/blog-search',getBlogDataMiddleware, searchByTitle);
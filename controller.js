const _ = require('lodash');
const https = require('https');

function getBlogDataMiddleware(req, res, next){
    const options = {
      hostname: 'intent-kit-16.hasura.app',
      path: '/api/rest/blogs',
      method: 'GET',
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    };
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          const blogData = JSON.parse(data);
          req.blogData = blogData;
          next(); 
        } catch (error) {
          console.error('Error parsing blog data:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    });
    request.on('error', (error) => {
      console.error('Error fetching blog data:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  
    request.end();
}

function blogAnalysis(req, res){
    const blogData = req.blogData.blogs;
    const totalBlogs = blogData.length;
    const longestBlog = _.maxBy(blogData, 'title.length');
    const blogsWithPrivacy = _.filter(blogData, (blog) =>
    blog.title.toLowerCase().includes('privacy')
    ).length;
    const uniqueTitles = _.uniqBy(blogData, 'title').map((blog) => blog.title);
    const result ={
        totalBlogs,
        longestBlogTitle: longestBlog.title,
        blogsWithPrivacy,
        uniqueTitles,  
    }
    res.json(result);
}

function searchByTitle(req,res){
        const query = req.query.query;
        if (!query) {
          return res.status(400).json({ error: 'Query parameter is missing' });
        }
        const searchResults = _.filter(req.blogData.blogs, (blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase())
        );
        res.json(searchResults);
}

module.exports = {blogAnalysis, searchByTitle, getBlogDataMiddleware};
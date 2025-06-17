// Js_001: Creating our own HTTP web server using HTTP built-in module in NodeJS and handling different routes in a simple way.

/* 
For Understanding URLs, copy and visit the link given below:

https://shifs999.github.io/JS_Daily/JS_Fundamentals.html#urls   
This is the extended link, see how because of #urls section at the end, you will lead directly to the 'Understanding URLs' section on my JS_Fundamentals page. Understand the components of URL explained there through some examples.
*/

const http = require('http');
const fs = require('fs');
const url = require('url')

const server = http.createServer((req, res) => {    // handler function for handling request and response objects
  const log = `${Date.now()}: ${req.url} New Req Received\n`;  // log is a string that we will write to our log file, req.url represents full relative URL path + query string, for eg. /about?name=John&u_id=1
  const myurl = url.parse(req.url, true);    // true means we want to parse the query parameter strings as well
  fs.appendFile('log.txt', log, (err, data) => {   // log.txt is the file where our logs will be maintained
    switch(myurl.pathname){      // myurl.pathname represents just the path of the URL, for eg. /about
      case '/': 
        res.end('Home Page');
        break;
      case '/about': 
        const username = myurl.query.name;
        const user_id = myurl.query.u_id
        // for eg. if localhost:8000/about?name=John&u_id=1 is the url, then myurl.query.name will be 'John'.
        res.end(`Hi ${username}, your user id is ${user_id}`);   // This will give 'Hi John, your user id is 1' on the browser
        break;
      case '/search':
        const search = myurl.query.search_query; // eg. if localhost:8000/search?search_query=JS+Daily+logs is the url, then myurl.query.search_query will be 'JS Daily logs'.
        res.end(`Here are your results for ${search} ...`); // This will give 'Here are your results for JS Daily logs' on the browser
      default:
        res.end('Error 404: Page not found');
    }
  });
});

server.listen(8000, () => {
  console.log('Server is running...');
})


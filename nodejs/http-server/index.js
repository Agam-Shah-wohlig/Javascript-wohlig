const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res)=>{
    const log = `${Date.now()}: ${req.url} ${req.method} New Request Received\n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl)
    fs.appendFile("./logs.txt", log, (err, data) => {
        switch(myUrl.pathname){
            case("/"): 
                if (req.method === 'GET'){
                res.end("You are at HomePage");
            }
            break;
            
            case("/about"): 
                const username = myUrl.query.q; // /about?q=Agam
                console.log(` The User is :${username}`)
                res.end(" You are in about section");
            break;
            
            case("/search"): 
                const search = myUrl.query.search_query // /search?search_query=agam+sanjay+shah
                res.end(`you search this query ${search}`);
            break;

            case("/signup"):
                if (req.method === 'GET'){
                    res.end('This is the signup form')
                } else if(req.method === 'POST'){
                    // DB Query
                    res.end("Success")
                }
                break;

            default: res.end("This page Does not Exist");
        }
    });
});

server.listen(8000, () => console.log("server started!"));


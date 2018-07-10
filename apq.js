let http=require("http");
let path=require("path");
let fs=require("fs");
let mime = require('mime'); 
let querystring=require('querystring');
// console.log(__dirname);//e:\ahmsp\hm\b11Node.js\d2\03
let rootPath=path.join(__dirname,"www");
// console.log(rootPath);//e:\ahmsp\hm\b11Node.js\d2\03\www

http.createServer(function (request,response) {  
    console.log("请求进来了");
    // console.log(request.url);// 默认/  /index.html

    // //如果路径是http://127.0.0.1:4560/，这把/改为/index.html
    // let houUrl=request.url;
    // if(houUrl=="/"){houUrl="/index.html"}
    // let filePath=path.join(rootPath,houUrl);//拼接到存储这些文件的目录后

    let filePath=path.join(rootPath,querystring.unescape(request.url));//拼接到存储这些文件的目录后的文件的绝对路径
    console.log(filePath);

    let isExist=fs.existsSync(filePath);//判断路径是否存在
    if(isExist){//路径存在
        fs.readdir(filePath,(err,files)=>{
            if(err){//不是目录，即是文件
                fs.readFile(filePath,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        response.writeHead(200,{"content-type":mime.getType(filePath)})
                        response.end(data);
                    }
                })
            }else{//是目录
                console.log(files);
                if(files.indexOf("index.html")!=-1){//判断目录中是否有index.html
                    fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            response.end(data);
                        }
                    })
                }else{//不存在index.html
                    let back="";
                    for(let i=0;i<files.length;i++){
                        back+=`<h2><a href="${request.url=='/'?"":request.url}/${files[i]}">${files[i]}</a></h2>`
                    }
                    response.writeHead(200,{"content-type":"text/html;charset=utf-8"})
                    response.end(back);
                }
            }
        });
    }else{//路径不存在
        //不存在更改状态码为404
        // 返回404页面
        response.writeHead(404,{"content-type":"text/html;charset=utf-8"});
        response.end("<h1>404</h1>")
    }

}).listen(4560,"127.0.0.1",()=>{
    console.log("成功")
})
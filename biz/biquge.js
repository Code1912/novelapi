/**
 * Created by Code1912 on 2016/12/9.
 */
//www.biquge.tw

let http = require('http');
let $=require("cheerio");
let he=require("he")
let iconv = require('iconv-lite');
let BufferHelper = require('bufferhelper');
const  type=2;
class BiQuGe {
    static search(req, res) {
        let keyword = req.param("keyword", "");
        let pageIndex = req.param("pageIndex", "");
        this.searchBiz(keyword,pageIndex,res).then(data=>{
            res.send(data);
        })
    }
    static  searchBiz(keyword,pageIndex,res) {
        return new Promise(function (resolve, reject) {
            let pageIndexStr = pageIndex > 1 ? `&p=${pageIndex - 1}` : "";
            let url = `http://zhannei.baidu.com/api/customsearch/searchwap?q=${encodeURIComponent(keyword)}${pageIndexStr}&s=16829369641378287696&srt=def&nsid=0`;

            http.get(url, (res1) => {
                let html = '';
                res1.on('data', function (data) {
                    html += data;
                });
                res1.on('end', function () {
                    let data = JSON.parse(html);
                    let retData = {
                        success: data.results ? true : false,
                        pageIndex: data.curpage,
                        totalCount: data.totalNum,
                        resultList: data.results || []
                    };
                    if (retData.resultList.length > 0) {
                        retData.resultList.forEach(n => {
                            n.current_url = n.url ? n.url + "all.html" : "";
                            n.current_url = n.current_url.replace(/http:\/\/www./ig, "http://m.");
                            n.type = type;
                        })
                    }

                    resolve(retData);

                });
                res1.on("error", () => {
                    reject(false);
                });
                BiQuGe.errorListen(res1, res)
            });
        });
    }
    static  chapterList(req, res) {
        let url = req.param("url")
        http.get(url, (res1) => {
            let bufferHelper = new BufferHelper();
            res1.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res1.on('end', function () {
                let array = [];
                let html = iconv.decode(bufferHelper.toBuffer(), 'UTF8')||"";
                let chapterList = $(html).find("#chapterlist>p>a") || [];
                let index=0;
                chapterList.each((i, p) => {
                    let obj = $(p);
                    if(obj.attr("href").indexOf("#")>-1){
                        return;
                    }
                    index++;
                    array.push({
                        title: obj.text(),
                        url: `http://m.biquge.tw${obj.attr("href")}`,
                        chapter_index:index,
                        type:type
                    })
                });

                res.send({
                    success: array.length>0?true:false,
                    resultList: array
                })
            });
            this.errorListen(res1,res)
        });
    }

    static  chapterInfo(req, res) {
        let url = req.param("url") ;
        http.get(url, (res1) => {
            let bufferHelper = new BufferHelper();
            res1.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res1.on('end', function () {
                let html = iconv.decode(bufferHelper.toBuffer(), 'UTF8')||"";
                html=html.replace(/(<br>)|(<br\/>)|(<br \/>)|((<br >))/ig,"\n").replace("wz1()","");
                // html=html.replace(/&nbsp;/ig,"\t")
                let htmlJQ = $(html);

                var result={
                    title: htmlJQ.find("title").text().split("_")[0],
                    content: he.decode(htmlJQ.find("#chaptercontent").text()),
                    type:type
                };
                res.send({
                    success: result.content?true:false,
                    result: result
                })
            });
            this.errorListen(res1, res)
        });
    }
    static  errorListen(httpRes,res){
        httpRes.on("error", () => {
            res.send(
                {
                    success: false,
                    message:"get novel error"
                }
            )
        })
    }
}
module.exports= {
    biQuGe: BiQuGe
}

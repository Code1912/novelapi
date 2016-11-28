/**
 * Created by Code1912 on 2016/11/28.
 */
let http = require('http');
let $=require("cheerio");
let he=require("he")
let iconv = require('iconv-lite');
let BufferHelper = require('bufferhelper');
class LuoQiu {
    static search(req, res) {
        console.log(req.params);
        let keyWord = req.param("keyword", "");
        let pageIndex = req.param("pageIndex", "");
        let pageIndexStr = pageIndex > 1 ? `&p=${pageIndex - 1}` : "";
        http.get(`http://zhannei.baidu.com/api/customsearch/searchwap?q=${encodeURIComponent(keyWord)}${pageIndexStr}&s=17782022296417237613&srt=def&nsid=0`, (res1) => {
            let html = '';
            res1.on('data', function (data) {
                html += data;
            });
            res1.on('end', function () {
                let data = JSON.parse(html);
                res.send({
                    success: data.results ? true : false,
                    pageIndex: data.curpage,
                    totalCount: data.totalNum,
                    resultList: data.results
                });

            });
            this.errorListen(res1,res)
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
                let html = iconv.decode(bufferHelper.toBuffer(), 'GBK')
                let chapterList = $(html).find("#defaulthtml4>table .dccss a") || [];
                chapterList.each((i, p) => {
                    let obj = $(p);
                    array.push({
                        title: obj.text(),
                        url: `http://www.luoqiu.com${obj.attr("href")}`
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
                let array = [];
                let html = iconv.decode(bufferHelper.toBuffer(), 'GBK');
                let htmlJQ = $(html);

                var result={
                    title: htmlJQ.find(".bname_content").text(),
                    content: he.decode(htmlJQ.find("#content").html())||htmlJQ.find("#content").text()
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
            res1.send(
                {
                    success: false,
                    message:"get novel error"
                }
            )
        })
    }
}
module.exports= {
    luoQiu: LuoQiu
}
/**
 * Created by Code1912 on 2016/11/28.
 * //www.luoqiu.com
 */
let http = require('http');
let $=require("cheerio");
let he=require("he")
let iconv = require('iconv-lite');
let BufferHelper = require('bufferhelper');
const  type=1;
class LuoQiu {
    static search(req, res) {
        let keyword = req.param("keyword", "");
        let pageIndex = req.param("pageIndex", "");
        this.searchBiz(keyword,pageIndex,res).then(data=>{
            res.send(data);
        })
    }
    static searchBiz(keyword,pageIndex,res) {
        return new Promise(function (resolve, reject) {
            let pageIndexStr = pageIndex > 1 ? `&p=${pageIndex - 1}` : "";
            let url = `http://zhannei.baidu.com/api/customsearch/searchwap?q=${encodeURIComponent(keyword)}&p=${pageIndexStr}&s=17782022296417237613&srt=def&nsid=0`;

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
                            n.current_url = (n.listPage_url || []).length > 0 ? n.listPage_url[0] : "";
                            n.type = type;
                        })
                    }

                    resolve(retData);

                });
                res1.on("error", () => {
                    reject(false);
                });
                LuoQiu.errorListen(res1, res)
            });
        });
    }
    static  chapterList(req, res) {
        let url = req.param("url");
        http.get(url, (res1) => {
            let bufferHelper = new BufferHelper();
            res1.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res1.on('end', function () {
                let array = [];
                let html = iconv.decode(bufferHelper.toBuffer(), 'GBK')
                let chapterList = $(html).find("#defaulthtml4>table .dccss a") || [];
                let index=0;
                chapterList.each((i, p) => {
                    let obj = $(p);
                    index++;
                    array.push({
                        title: obj.text(),
                        url: `http://www.luoqiu.com${obj.attr("href")}`,
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
                let array = [];
                let html = iconv.decode(bufferHelper.toBuffer(), 'GBK')||"";
                html=html.replace(/(<br>)|(<br\/>)|(<br \/>)|((<br >))/ig,"\n");
               // html=html.replace(/&nbsp;/ig,"\t")
                let htmlJQ = $(html);

                var result={
                    title: htmlJQ.find(".bname_content").text(),
                    content: he.decode(htmlJQ.find("#content").text()),
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
        httpRes.on("error", (e) => {
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
    luoQiu: LuoQiu
}
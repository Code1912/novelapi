/**
 * Created by Code1912 on 2017/4/8.
 */
"use strict";
let http = require('http');
let $=require("cheerio");
let he=require("he");
let iconv = require('iconv-lite');
let BufferHelper = require('bufferhelper');
let config=require("../config/config.js").config;
String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
let  _getConfig=(type)=> {
    let tempConfig=Object.assign({},  config.sites[type]||config.sites[0] ) ;
    if(tempConfig.special_chars){
        tempConfig.special_chars=`(${config.common_special_chars})|(${tempConfig.special_chars})`
    }else {
        tempConfig.special_chars=config.common_special_chars;
    }
    return tempConfig;
};

let  _getQueryUrl=(keyword,searchId,pageIndex) =>{
    let url = `http://zhannei.baidu.com/api/customsearch/searchwap?q=${encodeURIComponent(keyword)}&p=${pageIndex}&s=${searchId}&srt=def&nsid=0`;
    return url;
};

let _createUrl=(host,reqUrl,relativeUrl)=>{
   if(relativeUrl.indexOf("/")==0){
       return host+relativeUrl;
   }
   let index=reqUrl.lastIndexOf("/");
   if(index>-1){
       reqUrl=reqUrl.substring(0,index+1);
   }
   return reqUrl+relativeUrl;
};

let _getHtml=(url,charset)=>{
    return new Promise((resolve,rejcet)=>{
        http.get(url, (res1) => {
            let bufferHelper = new BufferHelper();
            res1.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });
            res1.on('end', function () {
                let html = iconv.decode(bufferHelper.toBuffer(), charset||"UTF8");
                resolve(html);
            });
            res1.on("error", () => {
                rejcet("");
            });
        });
    })
};

let _innerSearch=(keyword,pageIndex,type)=>{
    let tempConfig=_getConfig(type);
    let url=_getQueryUrl(keyword,tempConfig.search_id,pageIndex-1);
    return _getHtml(url).then(html=> {
        let data = JSON.parse(html);
      //  console.log(data);
        let retData = {
            type: type,
            typeName: tempConfig.name,
            success: data.results ? true : false,
            pageIndex: data.curpage,
            totalCount: data.totalNum,
            resultList: data.results || []
        };
        if (retData.resultList.length > 0) {
            retData.resultList.forEach(n => {

                if((n.listPage_url || []).length > 0 ){
                    n.current_url =   n.listPage_url[0];
                    if(n.current_url=="0"){
                        n.current_url = n.url;
                    }
                }
                else{
                    n.current_url = n.url;
                }
                if(tempConfig.get_list_page_url){
                    n.current_url=tempConfig.get_list_page_url(n.current_url );
                }
                n.type = type;
                n.typeName=tempConfig.name
            })
        }
        return Promise.resolve(retData);
    })
};

let  search=(req,res)=> {
    let keyword=req.query.keyword;
    let pageIndex=req.query.pageIndex||1;
    let type=req.query.type||2;
    _innerSearch(keyword,pageIndex,type).then(data=>{
        res.json(data)
    }).catch(err=>{
        res.json( {
            success:  false,
            pageIndex: 0,
            totalCount: 0,
            resultList: []
        })
    })
};

let getSource=(req,res)=>{
    let promiseArray=[];
    let name=req.query.name;
    let pageIndex=req.query.pageIndex||1;
    let type=0;
    config.sites.forEach(p=>{
        promiseArray.push(_innerSearch(name,pageIndex,type));
        type++;
    });
    Promise.all(promiseArray).then(values=>{
        let list=[];
        values.forEach(p=>{
            if(!p){
                return
            }
            let temp= (p.resultList||[]).filter(n=>  n.name.trim()===name);
           // console.log(temp);
            if(temp.length>0){
                list.push(temp[0]);
            }
        });
        list=list.sort((a,b)=>{
            return a.dateModified-b.dateModified;
        });
        res.send({
            success:list.length>0,
            resultList:list
        })
    }).catch(err=>{
        console.log("get source error:",err);
        res.send({
            success:false,
            resultList:[]
        })
    });
};

let chapterList=(req,res)=>{
    let url=req.query.url;
    let type=req.query.type||2;
    let tempConfig=_getConfig(type);
    _getHtml(url,tempConfig.charset).then(html=>{

        let array = [];
        let chapterList = $(html).find(tempConfig.list) || [];
        let index=0;
        chapterList.each((i, p) => {
            let obj = $(p);
            let chapterUrl=obj.attr("href");
            if(chapterUrl.indexOf("#")>-1){
                return;
            }
            index++;
            array.push({
                title: obj.text(),
                url: _createUrl(tempConfig.host,url,chapterUrl),
                chapter_index:index,
                type:type
            })
        });
        res.json({
            success: array.length>0?true:false,
            resultList: array
        })
    }).catch(err=>{
        console.log("get chapter list error:",err);
        res.json({
            success: false,
            resultList: []
        })
    })
};

let chapterInfo=(req,res)=>{
    let url=req.query.url;
    let type=req.query.type||2;
    let tempConfig=_getConfig(type);
    _getHtml(url,tempConfig.charset).then(html=>{
        let regexp=new RegExp(tempConfig.special_chars,"ig");
        html=html.replace(/(<br>)|(<br\/>)|(<br \/>)|(<br >)/ig,"\n");
        html=html.replace(/(<p>)/ig,"\r");
        html=html.replace(regexp,"");
        let htmlJQ=$(html);

        let result={
            title: htmlJQ.find(tempConfig.detail.title).text(),
            content: he.decode(htmlJQ.find(tempConfig.detail.content).text())||"",
            type:type,
            url:url
        };
       // result.content=result.content.replace(regexp,"" );
        res.send({
            success: result.content?true:false,
            result: result
        });
    }).catch(err=>{
        console.log("get chapter error:",err);
        res.json({
            success: false,
            result: ""
        })
    })
};

let getConfig=(req,res)=>{
    let index=-1;
    res.json({
        success: true,
        resultList: config.sites.map(p=>{
            index++;
            return { type:index,name:p.name,host:p.host};
        })
    })
};
module.exports={
    search,
    chapterList,
    chapterInfo,
    getSource,
    getConfig
};
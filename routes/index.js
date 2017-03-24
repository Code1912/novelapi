"use strict";
var express = require('express');
var router = express.Router();
const  LuoQiu=require("../biz/luoqiu").luoQiu;
const BiQuGe=require("../biz/biquge").biQuGe;
String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: `Novel` });
});
router.get('/search', function (req, res) {
    execute(req,res,"search");
});
router.get('/chapterList', function (req, res) {
    execute(req,res,"chapterList");
});
router.get('/chapterInfo', function (req, res) {
    execute(req,res,"chapterInfo");
});
router.get('/source', function (req, res) {
     let name=req.param("name").trim();
     let author=req.param("author").trim();

     Promise.all([LuoQiu.searchBiz(name,1,res),BiQuGe.searchBiz(name,1,res)]).then(resultArray=>{
         let list=[];
         resultArray.forEach(p=>{

             if(!p){
                 return
             }
            let temp= (p.resultList||[]).filter(n=>  n.name.trim()===name &&n.author_name===author);
             console.log(temp)
             if(temp.length>0){
                 list.push(temp[0]);
             }
         })
         res.send({
             success:list.length>0,
             resultList:list
         })

     },rej=>{
         res.send({
             success:false,
             message:"get error"
         })
     })
});
 function execute(req, res, funcName){
     try {
         if(req.param("type")==1){
             LuoQiu[funcName](req,res);
         }
         else  if(req.param("type")==2){
             BiQuGe[funcName](req,res);
         }
         else{

             res.send({
                 success:false,
                 message:"type error."
             })
         }
     }catch(e){
         res.send({
             success:false,
             message:e
         })
     }

}
module.exports =router
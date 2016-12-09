var express = require('express');
var router = express.Router();
const  LuoQiu=require("../biz/luoqiu").luoQiu;
const BiQuGe=require("../biz/biquge").biQuGe;
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: `Novel` });
});
router.get('/search', function (req, res) {
    excute(req,res,"search");
});
router.get('/chapterList', function (req, res) {
    excute(req,res,"chapterList");
});
router.get('/chapterInfo', function (req, res) {
    excute(req,res,"chapterInfo");
});
 function excute(req,res,funcName){
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
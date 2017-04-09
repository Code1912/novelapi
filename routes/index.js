"use strict";
let express = require('express');
let router = express.Router();
const  query=require("../biz/search");
router.get('/', function (req, res) {
    res.render('index', { title: `Novel` });
});
router.get('/search',query.search);
router.get('/sourceConfig',query.getConfig);
router.get('/chapterList', query.chapterList);
router.get('/chapterInfo', query.chapterInfo);
router.get('/source',  query.getSource);

module.exports =router;
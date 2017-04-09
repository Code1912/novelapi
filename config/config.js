const  config= {
    common_special_chars: "\<script[^\>]*\>[\\s\\S]*?\<\/[^\>]*script\>",
    sites: [{
        "name": "落秋中文",
        "host": "http://www.luoqiu.com",
        "charset": "GBK",
        "search_id": "17782022296417237613",
        "list": "#defaulthtml4>table .dccss a",
        "detail": {
            "title": ".bname_content",
            "content": "#content"
        },
        "special_chars": ""
    },
    {
       "name":"笔趣阁",
       "host": "http://www.biquge.com",
       "charset":"UTF8",
       "search_id":"287293036948159515",
       "list": "#list dl dd a",
       "detail": {
       "title": ".bookname>h1",
       "content": "#content"
       },
       "special_chars":"wz1\(\)"
       },
        {
       "name":"顶点小说",
       "host": "http://www.23us.cc",
       "charset":"UTF8",
       "search_id": "1682272515249779940",
       "list": "#main .chapterlist dd a",
       "detail": {
       "title": "#BookCon>h1",
       "content": "#content"
       },
       "special_chars":""
       },
        {
            "name": "平板电子书",
            "host": "http://www.pbtxt.com",
            "charset": "GBK",
            "search_id": "13386898804301110817",
            "get_list_page_url": url => {
                return url.replace(/http:\/\/m/ig,"http://www")
            },
            "list": "#main dl dd a",
            "detail": {
                "title": "#main>.xiaoshuo>.title>h1",
                "content": ".content"
            },
            "special_chars": "章节目录"
        },
        //冷门书都有这个t5
        {
            "name": "爱上书屋",
            "host": "http://www.23sw.net",
            "charset": "gb2312",
            "search_id": "3762194758325881047",
            "list": ".book_article_texttable dl dd a",
            "detail": {
                "title": ".book_middle_title>a",
                "content": "#booktext"
            },
            "special_chars": ""
        },
        //奇书网 垃圾 删数据
       /* {
            "name": "奇书网",
            "host": "http://www.126shu.com",
            "charset": "GBK",
            "search_id": "12622474051500695548",
            "list": "#list dl dd a",
            "detail": {
                "title": "#info>.hh",
                "content": "#content"
            },
            "special_chars": ""
        },*/
        {
            "name": "乐文小说",
            "host": "http://www.lewendudu.com",
            "charset": "GBK",
            "search_id": "6329054699686151327",
            "list": "#defaulthtml4 table tr td .dccss a",
            "detail": {
                "title": ".border_l_r h1",
                "content": "#content"
            },
            "special_chars": ""
        },
        {
            "name": "天籁小说",
            "host": "http://www.23txt.com",
            "charset": "GBK",
            "search_id": "135583757670965703",
            "list": "#list dl dd a",
            "detail": {
                "title": ".bookname h1",
                "content": "#content"
            },
            "special_chars": ""
        },
        //这个也有冷门书 还是最新的书阁网 就是pagelist url不对
        {
            "name": "书阁网",
            "host": "http://m.shuge.net",
            "charset": "UTF8",
            "search_id": "9899457626870309549",
            "list": "#chapterlist p a",
            "get_list_page_url": url => {
                let array=url.split("/");
                return `http://m.shuge.net/wapbook/${array[array.length-2]}/`
            },
            "detail": {
                "title": ".title",
                "content": "#chaptercontent"
            },
            "special_chars": ""
        },{
            "name":"八一中文网",
            "host": "http://www.81zw.com",
            "charset":"GBK",
            "search_id": "3975864432584690275",
            "list": "#list dl dd a",
            "detail": {
                "title": ".bookname h1",
                "content": "#content"
            },
            "special_chars":""
        },{
            "name":"新笔趣阁",
            "host": "http://www.xxbiquge.com",
            "charset":"UTF8",
            "search_id": "8823758711381329060",
            "list": "#list dl dd a",
            "detail": {
                "title": ".bookname h1",
                "content": "#content"
            },
            "special_chars":""
        }
        /* 破网站 不怎么更新 不要了{
       "name":"爱去小说网",
       "host": "http://www.aiquxs.com",
       "charset":"GBK",
       "search_id": "6248948607543145425",
       "list": "#list dl dd a",
       "detail": {
       "title": ".bookname h1",
       "content": "#booktext"
       },
       "special_chars":""
       }*/]
};
module.exports= {
    config
};


//新笔趣阁 这个比较新 可以要 http://www.xxbiquge.com     8823758711381329060
//八一中文网 这个新书 冷门都能搜 http://www.81zw.com    3975864432584690275
// 备用 新书有 冷门没  http://www.panqis.cn/
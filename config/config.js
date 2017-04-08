const  config={
  common_special_chars:"\<script[^\>]*\>[\\s\\S]*?\<\/[^\>]*script\>",
  t1: {
    "name":"落秋中文",
    "host": "http://www.luoqiu.com",
    "charset":"GBK",
    "search_id":"17782022296417237613",
    "list": "#defaulthtml4>table .dccss a",
    "detail": {
      "title": ".bname_content",
      "content": "#content"
    },
    "special_chars":""
  },
  t2: {
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
  t3: {
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
  t4: {
    "name":"平板电子书",
    "host": "http://www.pbtxt.com",
    "charset":"UTF8",
    "search_id": "13386898804301110817",
    "list": "#main dl dd a",
    "detail": {
      "title": "#main>.xiaoshuo>.title>h1",
      "content": ".content"
    },
    "special_chars":"章节目录"
  },
  t5: {
    "name":"爱上书屋",
    "host": "http://www.23sw.net",
    "charset":"gb2312",
    "search_id": "3762194758325881047",
    "list": ".book_article_texttable dl dd a",
    "detail": {
      "title": ".book_middle_title>a",
      "content": "#booktext"
    },
    "special_chars":""
  },
  t6: {
    "name":"奇书网",
    "host": "http://www.126shu.com",
    "charset":"GBK",
    "search_id": "12622474051500695548",
    "list": "#list dl dd a",
    "detail": {
      "title": "#info>.hh",
      "content": "#content"
    },
    "special_chars":""
  },
  t7: {
    "name":"乐文小说",
    "host": "http://www.lewendudu.com",
    "charset":"GBK",
    "search_id": "6329054699686151327",
    "list": "#defaulthtml4 table tr td .dccss a",
    "detail": {
      "title": ".border_l_r h1",
      "content": "#content"
    },
    "special_chars":""
  },
  t8: {
    "name":"天籁小说",
    "host": "http://www.23txt.com",
    "charset":"GBK",
    "search_id": "135583757670965703",
    "list": "#list dl dd a",
    "detail": {
      "title": ".bookname h1",
      "content": "#content"
    },
    "special_chars":""
  }
};
module.exports= {
    config
};
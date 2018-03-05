/*
* @file 生成随机占位文本
* */
var seize = (function () {
    
    var random = function () {
        var word='\\u' + (Math.round(Math.random() * 20901) + 19968).toString(16);
        lord =unescape(word.replace(/\\/g,'%'));
        return lord;
    };
    
    function replace(str) {
      return str.replace(/[^0-9]/ig,"");
    }
    
    var set = function (options) {
        var default_options = {
            line: 1,
            fsize: '16px',
            gap: '1em',
            area: 'dom'
        };
        options = Object.assign(default_options,options);

        // dom args
        var target = document.querySelector(options.area);
        var area_width = target.style.clientWidth || window.innerWidth;
        var size = replace(options.fsize);

        var space = area_width / size;
        
        var template= '';
        
        for (var i = 0; i < space * options.line; i++) {
            template += random();
        }
        target.style.fontSize = options.fsize;
        target.style.lineHeight = options.gap;
        target.innerText = template;
        
    }
    
    return {
        set: set
    }
})();

/* eslint-disable */
/**
 * @file 扩展滑动(加速度抛物线)
 * @author yan
 * @param {Object} options 携带参数
 * @param {number} options.toL 这里是侧移值
 * @return {Function} that's a extend function
 * @description ==
 */
var roll = function (options) {
    var defaults = {
        toT: 0,    // 置顶距离
        toL: 0,    // 左侧距离
        durTime: 500,  // 过渡动画时间
        delay: 50,     // 定时器时间
        callback: null,   // 回调函数
        area: 'dom',   // 作用的dom区域
        type: 'uni-deceler'  // 定义运动类型
    };
    var opts = Object.assign(defaults, options);
    var timer = null;
    var _this = document.querySelector(opts.area);
    var index = 0;
    var dur = Math.round(opts.durTime / opts.delay);

    var initArgs = function (args) {
        var direction = '';
        var entry = {};
        if (args.toL === 0) {
            direction = 'scrollTop';
            entry = getCompute(direction, args.toT);

        }
        if (args.toT === 0) {
            direction = 'scrollLeft';
            entry = getCompute(direction, args.toL);
        }
        return entry;
    };

    var getCompute = function (flag, axis) {
        // const
        var curGap = _this[flag]; // 滚动条
        var subGap = axis - curGap;    // 目标-当前值
        var a = Math.round(2 * subGap / Math.pow((opts.durTime * 0.001), 2)); //加速度

        return {
            curGap: curGap,
            subGap: subGap,
            a: a,
            to: flag,
            target: axis
        }
    };

    var smoothScroll = function (aim) {
        index++;
        var a = aim.a;
        var curGap = aim.curGap;
        var subGap = aim.subGap;
        var to = aim.to;
        var axis = aim.target;

        var v0 = Math.sqrt(2 * a * subGap); // 初速度
        var hop = a * Math.pow(opts.delay * 0.001, 2) / 2;  // 第一段位移
        if (index >= dur) {
            _this[to] = axis;
            window.clearInterval(timer);

            if (opts.callback && typeof opts.callback === 'function') {
                opts.callback();
            }
            return;
        } else {
            switch (opts.type) {
                // 匀加速运动
                case "uni-acceler":
                    _this[to] = curGap + Math.pow(index, 2) * hop;
                    break;
                // 匀减速运动
                case "uni-deceler":
                    var v_s = v0 - a * opts.delay * 0.001 * (index - 1);
                    var v_e = v0 - a * opts.delay * 0.001 * index;
                    curGap = _this[to];
                    _this[to] = curGap + ((Math.pow(v_s, 2) - Math.pow(v_e, 2)) / 2 / a);
                    break;
                //  匀速运动  
                case "uniform":
                    var v0 = axis / (opts.durTime * 0.001);
                    _this[to] = curGap + v0 * opts.delay * 0.001 * index;
                    break;
            }
        }
    };

    // init

    var aim = initArgs(opts);
    timer = window.setInterval(function () {
        smoothScroll(aim);
    }, opts.delay);

};

if (typeof module !== 'undefined' && typeof module.exports !=='undefined') {
    module.exports = roll;
} else {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return roll;
        });
    } else {
        window.roll = roll;
    }
}

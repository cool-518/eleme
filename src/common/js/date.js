/*
*正则表达式-时间戳
*顺便做笔记
*/

/*
*正则常用方法: test()、exec()
*/
// test()：如果输入字符串与模式相匹配，test就返回真，没有则返回假
// exec()：如果输入字符串与模式相匹配，则返回一个数组，没有匹配就返回null

/*
*字符串对象与正则表达式
*在string对象中有不少以正则表达式对象作为参数的方法
*/

// match(regexp): 返回正则表达式regexp的匹配结果
// replace(searchValue,replaceValue): 将searchValue(正则表达式或是字符串值)
//                                    替换为replaceValue(替换值)，并返回响应的字符串

// search(regexp): 返回正则表达式regexp匹配位置的下标,没有匹配就返回-1
// split(separator,limit): 通过参数separator（字符串或是正则表达式）
//                         对字符串进行分割，并返回一个字符串数组

/*
*正则表达式-字符篇
*/
// 正则-特别字符(): 可以标记一个子表达式的开始和结束位置。
// 子表达式可以获取供以后使用。要匹配这些字符，请使用(),也就是 \( 和 \)。

// 正则-特别字符+: 匹配前面的子表达式一次或多次。要匹配 + 字符，请使用 \+。
// 正则-特别字符$: 匹配输入字符串的结尾位置。

export function formatDate (date, fmt) {
    // /(y+)/以y开头，一个或多个字符串。
    if (/(y+)/.test(fmt)) { // 与模式相匹配，test就返回真，没有则返回假
        // 使用test方法，匹配到传入数据fmt中，y开头的部分
        // 使用replace方法，将传入的/(y+)/匹配到最后一位。RegExp.$1 === /(y+)/
        // date.getFullYear() + ‘’ == 获取年份并转化为字符串
        // substr(start,length) 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
        // 这里是从零开始，也就是获取完整年份
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = { // 遍历时间为正则
        'M+': date.getMonth() + 1, // 因为月份是从零开始算
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) { // 遍历对象
        // 遍历对象为正则表达式
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '' // 把对应时间转换成字符串
            // 字符长度不允许超过一，如果超过一，则只取个位数
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero (str) {
    // 若传入0~9,则返回01~09
    // 若传入10以上，则返回0+第二个下标（即是个人数）。如：12会返回02
    return ('00' + str).substr(str.length)
}

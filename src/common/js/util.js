/*
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 * window.location.search: 从问号 (?) 开始的 URL（查询部分）
*/
export function urlParse () {
    let url = window.location.search
    let obj = {}
    // ?或&后面的字符，跟着所有非?或&的字符，一个或多个
    // 等号匹配等于号
    // 最后所有非?或&的字符，一个或多个，全局匹配
    let reg = /[?&][^?&]+=[^?&]+/g
    // match(regexp): 检索返回正则表达式regexp的匹配结果
    let arr = url.match(reg)
    // ['?id=12345', '&a=b']
    if (arr) {
        arr.forEach((item) => {
            // substring(start,stop) 用于提取字符串中介于两个指定下标之间的字符。
            // start开始位置,stop结束位置（不写则默认匹配到结尾）

            // split() 方法用于把一个字符串分割成字符串数组。
            // 此处为去掉字符串第一位，以及将等于号两边的字符串分割成了两份，变成数组
            let tempArr = item.substring(1).split('=')// tempArr = [‘id’, ‘12345’]
            // decodeURIComponent() 函数
            // 可对encodeURIComponent()函数编码的 URI 进行解码。
            // 请求服务器真实数据必须解码
            let key = decodeURIComponent(tempArr[0]) // key = ‘id’
            let val = decodeURIComponent(tempArr[1]) // val = ‘12345’
            obj[key] = val
        })
    }
    return obj
}

/*
 * [保存数据到localstorage]
 * @param  {[Number]} id  [商家id]
 * @param  {[type]} key [属性值]
 * @param  {[type]} value [value值]
 * @return {[type]}       [description]
*/

export function saveToLocal (id, key, value) {
    let seller = window.localStorage.__seller__ // 使用双下划线表示私有
    if (!seller) { // 判断是否存在存储对象
        seller = {} // 定义储存空对象（因为是第一级，所以是对象。对象可以储存更多东西）
        // 通过id向__seller__添加一个空缓存对象
        seller[id] = {}
    } else {
        // 若存在存储对象，则把对象存储为Json对象
        seller = JSON.parse(seller)
        if (!seller[id]) { // 是否存在已保存id对象（已保存商家）
            // 通过id向__seller__添加一个空缓存对象
            seller[id] = {} // 为不存在的id对象（新商家）赋予空对象
        }
    }
    // value赋值给[id]对象下的[key]：于是id对象下存在key:value键值对
    seller[id][key] = value
    // 把json对象存储为json字符串（localStorage不能直接存储对象）
    window.localStorage.__seller__ = JSON.stringify(seller)
}

/*
 * [从localstorage读取数据]
 * @param  {[Number]} id  [商家id]
 * @param  {[type]} key [属性值]
 * @param  {[type]} def [属性值的默认取值，当没有保存key时，返回默认值]
 * @return {[type]}     [属性值对应的value值]
*/

// 此函数返回一个布尔值
export function loadFromLocal (id, key, def) {
    let seller = window.localStorage.__seller__
    // 默认值
    if (!seller) { // 如果没有存储对象，则返回默认值
        return def
    }
    // 从id下获取缓存的对象
    seller = JSON.parse(seller)[id]
    if (!seller) { // 如果拿不到json对象，还是返回默认值
        return def
    }
    let ret = seller[key] // 定义返回值是key
    return ret || def
}

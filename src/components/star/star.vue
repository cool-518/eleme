<template>
    <div class="star" :class="starType">
        <!-- 2.2.0+ 的版本里，当在组件中使用 v-for 时，key 现在是必须的 -->
        <span v-for="(itemClass,idx) in itemClasses" :class="itemClass" class="star-item" :key="idx"></span>
    </div>
</template>

<script type="text/ecmasrcipt-6">
    const LENGTH = 5
    const CLS_ON = 'on'
    const CLS_HALF = 'half'
    const CLS_OFF = 'off'

    export default {
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number
            }
        },
        computed: { // 计算属性
            starType() {
                return 'star-' + this.size
            },
            itemClasses() {
                let result = []
                // 获取数值乘以2，然后向下取整，再除以2。获取0.5倍数
                let score = Math.floor(this.score * 2) / 2
                let hasDecimal = score % 1 !== 0 // 取余，不为零则有小数
                let integer = Math.floor(score) // 再次取整，有多少全星
                for (let i = 0; i < integer; i++) { // 遍历星星长度
                    result.push(CLS_ON)
                }
                if (hasDecimal) { // 有半星就加入
                    result.push(CLS_HALF)
                }
                while (result.length < LENGTH) { // 默认用空星星填满星星个数
                    result.push(CLS_OFF)
                }
                return result // 返回星星长度数组
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    .star
        .star-item
            display inline-block
            background-repeat no-repeat
        &.star-48
            .star-item
                width 40px
                height 40px
                margin-right 44px
                background-size 40px 40px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('star48_on')
                &.half
                    bg-image('star48_half')
                &.off
                    bg-image('star48_off')
        &.star-36
            .star-item
                width 30px
                height 30px
                margin-right 12px
                background-size 30px 30px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('star36_on')
                &.half
                    bg-image('star36_half')
                &.off
                    bg-image('star36_off')
        &.star-24
            .star-item
                width 20px
                height 20px
                margin-right 6px
                background-size 20px 20px
                &:last-child
                    margin-right: 0
                &.on
                    bg-image('star24_on')
                &.half
                    bg-image('star24_half')
                &.off
                    bg-image('star24_off')

</style>
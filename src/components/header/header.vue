<template>
    <div>
        <div class="header">
            <div class="content-wrapper">
                <div class="avatar">
                    <img :src="seller.avatar" />
                </div>
                <div class="content">
                    <div class="title">
                        <span class="brand"></span>
                        <span class="name">{{ seller.name }}</span>
                    </div>
                    <div class="description">
                        {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
                    </div>
                    <div v-if="seller.supports" class="support">
                        <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                        <span class="text">{{ seller.supports[0].description }}</span>
                    </div>
                    <div v-if="seller.supports" class="support-count" @click="showDetail">
                        <span class="count">{{ seller.supports.length }}个</span>
                        <i class="icon-keyboard_arrow_right"></i>
                    </div>
                </div>
            </div>
              <div class="bulletin-wrapper" @click="showDetail">
                  <!-- 并排消除标签间隙 -->
                <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
            <div class="backgroud">
                <img :src="seller.avatar" width="100%" height="100%">
            </div>
            <transition name="fade">
            <div v-show="detailShow" class="detail">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{ seller.name }}</h1>
                        <div class="star-wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <!-- 弹性布局使用span可能有Bug -->
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <!-- v-for遍历数组多个元素，必须加入index索引，而对象遍历则必须加入key值 -->
                            <!-- 进阶 -->
                            <!-- 采用其他如v-for提供的index, key等值，在改变渲染出来的DOM结构时，
                            会触发所有元素的重新渲染，当数据过大时，可能会造成性能负担。 -->
                            <!-- 我们在使用v-for进行渲染时，尽可能使用渲染元素自身属性的id给渲染的元素绑定一个key值，
                            这样在当前渲染元素的DOM结构发生变化时，能够单独响应该元素而不触发所有元素的渲染。 -->
                            <li class="support-item" v-for="(item,index) in seller.supports">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{ seller.supports[index].description }}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{ seller.bulletin }}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="hideDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
            </transition>
        </div>
    </div>
</template>
<script type="text/ecmasrcipt-6">

    import star from '../star/star.vue'

export default {
    props: { // 父子传递数据
      seller: {
        type: Object
      }
    },
    data() {
        return {
            detailShow: false // 数据都是返回给data的，相当于小程序的设置默认数据
        }
    },
    methods: { // 英文意思是方法：放置函数的地方
        showDetail() {
            this.detailShow = true;
        },
        hideDetail() {
            this.detailShow = false;
        }
    },
    created() {// 钩子函数，生命周期初始化
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    components: {// 子模板注册
        star
    }
}
</script>
<style lang="stylus">
@import "../../common/stylus/mixin";
    .header
        width: 100%
        // height: 212px
        position: relative
        background-color: rgba(7,17,27,0.5) //非实心，不占空间
        color: #fff
        .content-wrapper
            position: relative
            padding: 48px 24px 46px 48px
            font-size: 0 // 解决inline元素间的空白间隙
            .avatar
                display: inline-block
                vertical-align: top
                img
                    width: 128px
                    height: 128px
                    border-radius: 4px
            .content
                display: inline-block
                margin-left: 32px
                font-size: 24px
                .title
                    margin: 4px 0 16px 0
                    .brand
                        width: 60px
                        height: 46px
                        display: inline-block
                        bg-image('brand')
                        background-size: 60px 36px
                        background-repeat: no-repeat
                        vertical-align: top
                    .name
                        font-size: 32px
                        line-height: 36px
                .description
                    font-size: 24px
                    line-height: 24px
                    margin-top: 16px
                    margin-bottom: 20px
                .support
                    .icon
                        display: inline-block
                        width: 24px
                        height: 24px
                        margin-right: 8px
                        vertical-align: top
                        background-size: 24px 24px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                .text
                    line-height: 24px
                    font-size: 20px
            .support-count
                position: absolute
                right: 24px
                bottom: 36px
                padding: 0 16px
                height: 48px
                line-height: 48px
                border-radius: 28px
                background: rgba(0,0,0,0.2)
                text-align: center
                .count
                    font-size: 20px
                .icon-keyboard_arrow_right
                    margin-left: 4px
                    line-height: 48px
                    font-size: 20px
        .bulletin-wrapper
            height: 56px
            line-height: 56px
            position: relative
            padding: 0 44px 0 24px
            white-space: nowrap // 不换行
            overflow: hidden
            text-overflow: ellipsis // 溢出时触发省略号
            background-color: rgba(7,17,27,0.5)
            .bulletin-title
                display: inline-block
                width: 44px
                height: 24px
                margin-top: 14px; //(56-24)/2
                vertical-align: top
                bg-image('bulletin')
                background-size: 44px 24px
                background-repeat: no-repeat
            .bulletin-text
                font-size: 20px
                margin: 0 8px
                vertical-align: top
            .icon-keyboard_arrow_right
                position: absolute
                font-size: 20px
                right: 24px
                top: 16px
        .backgroud
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            z-index -1
            filter blur(10px) // 过滤器，滤镜
        .detail
            position fixed
            z-index 100
            width 100%
            height 100%
            top 0
            left 0
            right 0
            overflow auto
            backdrop-filter: blur(10px)
            opacity: 1
            background: rgba(7, 17, 27, 0.8)
            /* 可以设置不同的进入和离开动画 */
            /* 设置持续时间和动画函数 */
            &.fade-enter-active, &.fade-leave-active
                transition: all 1s
            &.fade-enter, &.fade-leave-active
            // 进入时立即出发样式，离开时按动画时间过渡
                opacity: 0
                background: rgba(7, 17, 27, 0)
            .detail-wrapper
                width 100%
                min-height 100%
                .detail-main
                    margin-top 128px
                    padding-bottom 128px
                    .name
                        line-height 32px
                        text-align center
                        font-size 32px
                        font-weight 700
                    .star-wrapper
                        margin-top 36px
                        padding 4px 0
                        text-align center
                    .title
                        display flex
                        width 80%
                        margin 60px auto 48px auto // 左右自适应
                        .line
                            flex 1
                            position relative
                            top: -12px
                            border-bottom: 1px solid rgba(255, 255, 255, 0.2)
                        .text
                            padding 0 24px
                            font-size 28px
                            font-weight 700
                    .supports
                        width 80%
                        margin 0 auto
                        .support-item
                            padding 0 24px
                            margin-bottom 24px
                            font-size 0
                            &.last-child
                                margin-bottom 0 //考虑兼容性
                            .icon
                                display inline-block
                                width 32px
                                height 32px
                                vertical-align top
                                margin-right 12px
                                background-size 32px 32px
                                background-repeat no-repat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                line-height 32px // 与icon高度一样垂直居中
                                font-size 24px
                    .bulletin
                        width 80%
                        margin 0 auto
                        .content
                            padding 0 24px
                            line-height 48px
                            font-size 24px

            .detail-close
                position: relative
                width: 64px
                height: 64px
                margin: -128px auto 0 auto
                clear: both
                font-size: 64px
</style>

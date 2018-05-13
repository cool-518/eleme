<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <!-- 购物组件 -->
                    <div class="cartcontrol-wrapper">
                        <cartControl @add="addFood" :food="food"></cartControl>
                    </div>
                    <transition name="fade">
                        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">
                        加入购物车
                        </div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                    <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <!-- 评价选项组件 -->
                    <!-- 父组件处理子组件传过来的事件时，仍旧需要v-bind绑定数据 -->
                    <ratingSelect @select="selectRating" @toggle="toggleContent" 
                    :selectType="selectType" :only-content="onlyContent" 
                    :desc="desc" :ratings="food.ratings"></ratingSelect>
                    <!-- 评价列表 -->
                    <div class="rating-wrapper">
                        <!-- 评论不为空时 -->
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" 
                                v-for="rating in food.ratings" class="rating-item">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="24" height="24" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <!-- 评论为空时 -->
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    import Vue from 'vue'
    import {formatDate} from '../../common/js/date.js'// 引入暴露的单个或多个函数需要花括号
    import cartControl from '../cartcontrol/cartcontrol.vue'
    import ratingSelect from '../ratingselect/ratingselect.vue'
    import split from '../split/split.vue'

    const POSITIVE = 0
    const NEGATIVE = 1
    const ALL = 2

    export default {
        props: {// 父子通信
            food: {
                type: Object
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',//2
                    positive: '推荐',//0
                    negative: '吐槽'//1
                }
            }
        },
        methods: {//属性方法
            show() {
                this.showFlag = true;
                this.selectType = ALL;// 使用常量控制选中
                this.onlyContent = true;
                this.$nextTick(() => {
                    // 是否存在滑动
                    if (!this.scroll) {
                        // 异步加载滑动插件
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true// 允许点击事件
                        });
                    } else {
                            this.scroll.refresh();
                    }
                })
            },
            hide() {
                this.showFlag = false;
            },
            // 绑定购物按钮
            addFood(target) {
                this.$emit('add', target);
            },
            // 点击过滤评论；列表
            needShow(type, text) {
                // 只有内容时
                if (this.onlyContent && !text) {
                    return false;
                }
                // 全部显示
                if (this.selectType === ALL) {
                    return true;
                } else {
                    // 显示对应type的内容
                    return type === this.selectType;
                }
            },
            // 监听购物车
            addFirst(event) {
                if (!event._constructed) {
                    return;
                }
                // 使用$emit绑定监听add
                // $emit触发自定义事件，附加参数返回给监听回调
                // 在 cartcontrol 组件里点击+时,将点击的dom元素,
                // 通过 $emit 派发给父组件 goods.vue
                this.$emit('add', event.target);
                // Vue.set(this.food, 'count', 1);
                // 注意：在methods中不能使用Vue.set
                // 如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
                // Tip:Vue.set()在methods中可以写成this.$set()
                this.$set(this.food, 'count', 1);
            },
            // 选择评论标签类型
            selectRating(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            // 切换评论内容
            toggleContent() {
                this.onlyContent = !this.onlyContent;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            }
        },
        // 时间戳（时间格式转换）
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        components: {
            cartControl,
            ratingSelect,
            split
        }
    }
</script>

<style lang="stylus">
    @import "../../common/stylus/mixin.styl"

    .food
        position: fixed
        left: 0
        top: 0
        bottom: 96px
        z-index: 30
        width: 100%
        background: #fff
        transform: translate3d(0, 0, 0)//translate3d(x,y,z)
        &.move-enter-active, &.move-leave-active
            transition: all 0.2s linear
        &.move-enter, &.move-leave-active
            transform: translate3d(100%, 0, 0)
        .food-content
            .image-header
                position: relative
                width: 100%
                height: 0
                padding-top: 100%//相对于宽度100%
                img
                    position: absolute
                    top: 0
                    left: 0
                    width: 100%
                    height: 100%
                .back
                    position: absolute
                    top: 20px
                    left: 0
                    .icon-arrow_lift
                        display: block
                        padding: 20px
                        font-size: 40px
                        color: #fff
            .content
                position: relative
                padding: 36px
                .title
                    line-height: 28px
                    margin-bottom: 16px
                    font-size: 28px
                    font-weight: 700
                    color: rgb(7, 17, 27)
                .detail
                    margin-bottom: 36px
                    line-height: 20px
                    height: 20px
                    font-size: 0
                    .sell-count, .rating
                        font-size: 20px
                        color: rgb(147, 153, 159)
                    .sell-count
                        margin-right: 24px
                .price
                    font-weight: 700
                    line-height: 48px
                    .now
                        margin-right: 16px
                        font-size: 28px
                        color: rgb(240, 20, 20)
                    .old
                        text-decoration: line-through
                        font-size: 20px
                        color: rgb(147, 153, 159)
                .cartcontrol-wrapper
                    position: absolute
                    right: 24px
                    bottom: 24px
                .buy
                    position: absolute
                    right: 36px
                    bottom: 36px
                    z-index: 20
                    height: 48px
                    line-height: 48px
                    padding: 0 24px
                    box-sizing: border-box
                    border-radius: 24px
                    font-size: 20px
                    color: #fff
                    background: rgb(0, 160, 220)
                    opacity: 1
                    &.fade-enter-active, &.fade-leave-active
                        transition: all 0.2s
                    &.fade-enter, &.fade-leave-active
                        opacity: 0
                        z-index: -1
        .info
            padding: 36px
            .title
                line-height: 24px
                margin-bottom: 12px
                font-size: 28px
                color: rgb(7, 17, 27)
            .text
                line-height: 48px
                padding: 0 16px
                font-size: 24px
                color: rgb(77, 85, 93)
        
        .rating
            padding-top: 36px
            .title
                line-height: 28px
                margin-left: 18px
                font-size: 28px
                color: rgb(7, 17, 27)
            .rating-wrapper
                padding: 0 36px
                .rating-item
                    position: relative
                    padding: 32px 0
                    border-top 1px solid rgba(7, 17, 27, 0.1)
                    .user
                        position: absolute
                        right: 0
                        top: 32px
                        line-height: 24px
                        font-size: 0
                        .name
                            display: inline-block
                            margin-right: 12px
                            vertical-align: top
                            font-size: 20px
                            color: rgb(147, 153, 159)
                        .avatar
                            border-radius: 50%
                    .time
                        margin-bottom: 12px
                        line-height: 24px
                        font-size: 20px
                        color: rgb(147, 153, 159)
                    .text
                        line-height: 32px
                        font-size: 24px
                        color: rgb(7, 17, 27)
                        .icon-thumb_up, .icon-thumb_down
                            margin-right: 8px
                            line-height: 32px
                            font-size: 24px
                        .icon-thumb_up
                            color: rgb(0, 160, 220)
                        .icon-thumb_down
                            color: rgb(147, 153, 159)

                .no-rating
                    padding: 16px 0
                    font-size: 12px
                    color: rgb(147, 153, 159)
</style>

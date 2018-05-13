<template>
<div>
    <!-- 整个购物车底部 -->
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <!-- vue阻止事件冒泡和默认事件click.stop.prevent -->
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">{{payDesc}}</div>
            </div>
        </div>
        <!-- 小球容器 -->
        <div class="ball-container" v-for="ball in balls">
                <!-- 过度钩子函数 -->
                <transition 
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:after-enter="afterEnter"
                    name="drop">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
        </div>
        <!-- 购买列表 -->
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                    <li class="food" v-for="food in selectFoods">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{food.price*food.count}}</span>
                        </div>
                        <div class="cartcontrol-wrapper">
                            <cartControl @add="addFood" :food="food"></cartControl>
                        </div>
                    </li>
                    </ul>
                </div>
            </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import cartControl from '../cartcontrol/cartcontrol.vue'

    export default{
        // 父子传递
        props: {
            // 购物车数据
            selectFoods: {
                type: Array,
                default() {// 设置默认数据
                    return [
                        {
                        price:10,
                        count:3
                    }
                    ];
                }
            },
            deliveryPrice: {// 配送费
                type: Number,
                default: 0
            },
            minPrice: { // 起送价
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                // 小球
                balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
                ],
                dropBalls: [],// 已经下落的小球
                fold: true // 购物列表是否折叠
            };
        },
        // 计算属性
        computed: {
            // 购物车价格
            totalPrice() {
                let total = 0;// 初始化
                // 遍历selectFoods传入商品数据
                this.selectFoods.forEach((food) => {
                    // 累积增加 total +=商品价格*商品数量
                    total += food.price * food.count;
                });
                return total;
            },
            // 购物车商品数
            totalCount() {
                let count = 0;
                // 遍历selectFoods传入商品数据
                this.selectFoods.forEach((food) => {
                    // 累积增加 count数量
                    count += food.count;
                });
                return count;
            },
            // 显示是否可以付款
            payDesc() {
                if(this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`;
                }else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                }else{
                    return '去结算';
                }
            },
            // 改变付款按钮样式
            payClass() {
                if(this.totalPrice < this.minPrice){
                    return 'not-enough'
                }else{
                    return 'enough'
                }
            },
            // 购物列表
            listShow() {
                // 不存在商品则折叠购物车，并返回列表false
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                // 存在商品则不折叠购物车
                let show = !this.fold;
                // 若购物车商品展开，则加载滑动插件
                if (show) {
                // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调
                // 在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
                this.$nextTick(() => {
                    // 是否存在滑动
                    if (!this.scroll) {
                        // 异步加载滑动插件到购物列表listContent
                        this.scroll = new BScroll(this.$refs.listContent, {
                        click: true// 允许点击事件
                    });
                    } else {
                        // 存在滑动则刷新高度状态
                        this.scroll.refresh();
                    }
                });
            }14
            return show;
        }
        },

        // 属性方法
        methods: {
            // 切换购物列表
            toggleList() {
                // 是否存在商品
                if(!this.totalCount) {
                    return;
                }
                // 若存在商品，则取反
                this.fold = !this.fold;
            },
            // 隐藏购买列表
            hideList() {
                // 触发listShow的重新计算
                this.fold = true;
            },
            // 清空购买列表
            empty() {
                // 遍历购物车商品
                this.selectFoods.forEach((food) => {
                // 清空购买商品数量
                food.count = 0;
                });
            },
            // 支付
            pay() {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                window.alert(`支付${this.totalPrice}元`);
            },
            addFood(target) {
                this.drop(target);
            },

            // 小球下落动画
            drop(el) {
                //触发一次事件就会将所有小球进行遍历
                for (let i = 0; i < this.balls.length; i++) {
                    // 把遍历数组赋给ball
                    let ball = this.balls[i];
                    // 判断ball.show是否为假
                    if (!ball.show) {
                        ball.show = true;// 改为真
                        ball.el = el;// 保存数据,设置小球的el属性为一个dom对象
                        this.dropBalls.push(ball);//把已经下落的小球Push进数组
                        return;
                    }
                }
            },
            beforeEnter(el){ //这个方法的执行是因为这是一个vue的监听事件
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
                        el.style.display = ''; //清空display
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`; 
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        //处理内层动画
                        let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;
                    }
                }
            },
            enter(el, done) { //这个方法的执行是因为这是一个vue的监听事件
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight; //触发重绘html
                this.$nextTick(() => { //让动画效果异步执行,提高性能
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                //处理内层动画
                let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
                el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
                });
            },
            afterEnter(el) { //这个方法的执行是因为这是一个vue的监听事件
                let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
                if (ball) {
                ball.show = false;
                el.style.display = 'none'; //隐藏小球
                }
            },

        },
        components: {
             cartControl
        }
    }
</script>

<style lang="stylus">
    .shopcart
        position fixed
        left 0
        right 0
        bottom 0
        z-index 50
        width 100%
        height 96px
        .content
            display flex
            background #141d27
            font-size 0
            color rgba(255,255,255,0.4)            
            .content-left
                flex 1
                .logo-wrapper
                    display inline-block
                    position relative
                    top -20px
                    margin 0 24px
                    padding 12px
                    width 112px
                    height 112px
                    box-sizing border-box
                    vertical-align top
                    border-radius 50%
                    background #141d27
                    .logo
                        width 100%
                        height 100%
                        border-radius 50%
                        background #2b343c
                        text-align center
                        &.highlight
                            background rgb(0,160,220)
                        .icon-shopping_cart// 字体文件
                            line-height 88px
                            font-size 48px
                            color #80858a
                            &.highlight
                                color #fff
                    .num
                        position absolute
                        top 0
                        right 0
                        width 48px
                        height 32px
                        line-height 32px
                        text-align center 
                        border-radius 32px
                        font-size 18px
                        font-weight 700
                        color #fff
                        background rgb(240,20,20)
                        box-shadow 0 8px 16px 0 rgba(0,0,0,0.4)
                .price
                    display inline-block
                    vertical-align top
                    line-height 48px
                    margin-top 24px
                    padding-right 24px
                    box-sizing border-box
                    border-ringht 1px solid rgba(255,255,255,0.1)
                    font-size 32px
                    font-weight 700
                    &.highlight
                        color #fff
                .desc
                    display inline-block
                    vertical-align top
                    margin 24px 0 0 24px
                    line-height 48px
                    font-size 20px
            .content-right
                flex 0 0 210px
                width 210px
                .pay
                    height 96px
                    line-height 96px
                    text-align center 
                    font-size 24px
                    font-weight 700
                    background #2b333b
                    &.not-enough
                        background #2b333b
                    &.enough
                        background #00b43c
                        color #fff
        .ball-container
            .ball
                position: fixed
                left 64px
                bottom 44px
                z-index 200
                // y轴 贝塞尔曲线
                transition all 0.4s cubic-bezier(.49, -.29, .75, .41)
                .inner
                    width 32px
                    height 32px
                    border-radius 50%
                    background: rgb(0, 160, 220)
                    transition all 0.4s linear// x轴只需要线性缓动
        .shopcart-list
            position: absolute
            left: 0
            top: 0
            z-index: -1
            width: 100%
            transform: translate3d(0, -100%, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s
            &.fold-enter, &.fold-leave-active
                transform: translate3d(0, 0, 0)
            .list-header
                height: 80px
                line-height: 80px
                padding: 0 36px
                background: #f3f5f7
                border-bottom: 1px solid rgba(7, 17, 27, 0.1)
                .title
                    float: left
                    font-size: 24px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 24px
                    color: rgb(0, 160, 220)
        .list-content
            padding: 0 36px
            max-height: 434px
            overflow: hidden
            background: #fff
            .food
                position: relative
                padding: 24px 0
                box-sizing: border-box
                border-top 1px solid rgba(7, 17, 27, 0.1)
                .name
                    line-height: 48px
                    font-size: 28px
                    color: rgb(7, 17, 27)
                .price
                    position: absolute
                    right: 180px
                    bottom: 24px
                    line-height: 48px
                    font-size: 28px
                    font-weight: 700
                    color: rgb(240, 20, 20)
                .cartcontrol-wrapper
                    position: absolute
                    right: 0
                    bottom: 12px
    .list-mask
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 40
        backdrop-filter: blur(10px)
        opacity: 1
        background: rgba(7, 17, 27, 0.6)
        &.fade-enter-active, &.fade-leave-active
            transition: all 0.5s
        &.fade-enter, &.fade-leave-active
            opacity: 0
            background: rgba(7, 17, 27, 0)
</style>

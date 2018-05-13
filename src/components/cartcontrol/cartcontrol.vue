<template>
    <div class="cartcontrol">
        <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
            <span class="inner icon-remove_circle_outline"></span>
        </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'Vue'

    export default {
        props: {// 父子传递
            food: {
                type: Object
            }
        },
        methods: {// 事件方法
            addCart(event) {
                //event._constructed是vue事件，默认为true
                //原生没有此事件,我们可以手动把原生return干掉
                //（阻止非vue事件）
                if(!event._constructed) {
                    return;
                }
                // 判断是否存在购买数
                if(!this.food.count) {
                    // this.food.count = 1;
                    // vue特性，给观测对象添加不存在的dom节点属性时
                    // 无法直接赋值/无法直接增加节点属性
                    // 想要增删节点，必须使用vue其他接口
                    // Vue.set(this.food, 'count', 1);
                    // 注意：在methods中不能使用Vue.set
                    // 如果在实例创建之后添加新的属性到实例上，它不会触发视图更新
                    // Tip:Vue.set()在methods中可以写成this.$set()
                    this.$set(this.food, 'count', 1);
                } else {
                    this.food.count++;
                }
                // 使用$emit绑定监听add
                // $emit触发自定义事件，附加参数返回给监听回调
                // 在 cartcontrol 组件里点击+时,将点击的dom元素,
                // 通过 $emit 派发给父组件 goods.vue
                this.$emit('add', event.target);
            },
            decreaseCart(event) {
                if (!event._constructed) {
                    return;
                }
                if(this.food.count) {
                    this.food.count--;
                }
            }
        },            
        }
</script>

<style lang="stylus">
    .cartcontrol
        font-size: 0
    .cart-decrease
      display: inline-block
      .inner
        display: inline-block
        line-height: 48px
        font-size: 48px
        opacity: 1
        transform: translate3d(0, 0, 0)
        transition: all 0.4s linear
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active// 过渡时间
        transition all 0.4s linear
      &.move-enter, &.move-leave-active//开始与向结束过渡
        opacity: 0
        transform: translate3d(48px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 24px
      padding-top: 12px
      line-height: 48px
      text-align: center
      font-size: 20px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 12px
      line-height: 48px
      font-size: 48px
      color: rgb(0, 160, 220)
</style>

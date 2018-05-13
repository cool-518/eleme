<template>
<div>
  <div class="goods">
      <div class="menu-warpper" ref="menuWrapper">
          <ul>
              <!-- 遍历goods时，双方都会有index值，
              因此item的index与goods的index始终相等，
              此设置，始终显示index相等的class -->
              <li v-for="(item, index) in goods" class="menu-item"
                :class="{'current':currentIndex===index}"
                @click="selectMenu(index, $event)">
                  <span class="text">
                      <span v-show="item.type>0" class="icon" 
                          :class="classMap[item.type]"></span>{{item.name}}
                  </span>
              </li>
          </ul>
      </div>
      <div class="foods-warpper" ref="foodsWrapper">
          <ul>
              <li v-for="item in goods" class="food-list food-list-hook">
                  <h1 class="title">{{item.name}}</h1>
                  <ul>
                      <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item">
                          <div class="icon">
                              <img width="100%" :src="food.icon"/>
                          </div>
                          <div class="content">
                              <h2 class="name">{{food.name}}</h2>
                              <p class="desc">{{food.description}}</p>
                              <div class="extra">
                                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                              </div>
                              <div class="price">
                                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                              </div>
                              <div class="cartcontrol-wrapper">
                                  <!-- 父组件监听子组件@add="addFood" -->
                                <cartControl @add="addFood" :food="food"></cartControl>
                            </div>
                          </div>
                      </li>
                  </ul>
              </li>
          </ul>
      </div>
      <!-- 访问子组件(dom)ref:shopCart -->
      <shopCart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>
  </div>
  <food @add="addFood" :food="selectedFood" ref="food"></food>
</div>
</template>

<script>
import BScroll from 'better-scroll'
import shopCart from '../shopcart/shopcart.vue'
import cartControl from '../cartcontrol/cartcontrol.vue'
import food from '../food/food.vue'

export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        }
  },
  computed: {// 计算属性
     
        // 左边目录与右边商品相同索引，计算绑定高度
      currentIndex() {
          for(let i = 0; i < this.listHeight.length; i++) {
              // 获取当前索引值的高度
              let height1 = this.listHeight[i];
              // 获取下个索引值的高度
              let height2 = this.listHeight[i + 1];
              // 判断当前高度与下一高度的区间
            if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                return i;//当前索引
            }
          }
          return 0;
      },
      // 子父通信计算
      selectFoods() {
          let foods = [];
          // 遍历goods里面的数据给good
          this.goods.forEach((good) => {
              // 遍历good里面的数据给food
              good.foods.forEach((food) => {
                  // food大于0则把数据添加给foods
                  if(food.count) {
                      foods.push(food);
                  }
              });
          });
          return foods;// 返回foods
      }
  },
  // 生命周期钩子-在模板渲染成html前调用，通常初始化某些属性值，然后再渲染成视图。
    created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

    //do something after creating vue instance
    // 获取ajax地址，传入数据
    this.$http.get('/api/goods').then(res => {
        this.goods = res.body.data
        this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
        })
    }, err => {
        console.log(err)
    });
  },
  // 事件方法
  methods: {
      // 调用访问
      addFood(target) {
        this._drop(target);
      },
      // 访问子组件(dom)
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopCart.drop(target);
        });
      },

      // 点击获取列表索引，并让列表滑动到索引高度
      selectMenu(index, event) {
          //event._constructed是vue事件，默认为true
          //原生没有此事件,我们可以手动把原生return干掉
          //（阻止非vue事件）
          if(!event._constructed) {
              return;
          }
          // 获取绑定样式列表
          let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
          let el = foodList[index];// 获取列表索引
          this.foodsScroll.scrollToElement(el, 300);
          // scrollToElement插件里的函数：滑动到指定位置
      },

      // 商品详情页
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },

    // 小技巧：能被外部调用的方法，使用下划线前缀去区分
      // 插件使用滑动事件
    _initScroll() {
        this.meunScroll = new BScroll(this.$refs.menuWrapper, {
          click: true //插件监听元素，默认阻止默认事件，需设置开启白名单
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3// 允许上下左右滑动
        });
        // 监听滚动事件
        this.foodsScroll.on('scroll', (pos) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (pos.y <= 0) {
            this.scrollY = Math.abs(Math.round(pos.y));
          }
        });
      },

      //获取每个列表区间高度高度
        _calculateHeight() {
            // 获取样式
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            let height = 0; // 高度清空
            this.listHeight.push(height);// 从零开始，默认高度为零
            // 循环获取所有列表
            for(let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                //clientHeight：元素客户区的大小，指的是元素内容及其边框所占据的空间大小
                height += item.clientHeight;// 拿到每个列表区间累积的高度
                this.listHeight.push(height);// 依次添加每个列表高度
            }
        }
  },
  components: {
      shopCart,
      cartControl,
      food
  }
};
</script>

<style lang="stylus">
@import "../../common/stylus/mixin.styl"
    .goods
        display flex
        position absolute
        top 364px
        bottom 92px
        width 100%
        overflow hidden
        .menu-warpper
            flex 0 0 160px // 等分 缩放 占位空间
            width 160px
            background #f3f5f7
            .menu-item
                display table // 垂直居中的王者
                height 108px
                width 112px
                line-height 28px
                padding 0 24px
                &.current
                    position relative
                    z-index 10
                    margin-top -1px
                    background #fff
                    font-weight 700
                    
                .icon
                    display: inline-block
                    width: 24px
                    height: 24px
                    margin-right: 8px
                    vertical-align: top
                    background-size: 24px 24px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                       bg-image('special_3')
                .text
                    display table-cell
                    width 112px
                    font-size 24px
                    vertical-align middle
                    border-top 1px solid rgba(7,17,27,0.1)
        .foods-warpper
            flex 1
            .title
                padding-left 28px
                height 52px
                line-height 52px
                border-left 2px solid #d9dde1
                font-size 24px
                color rgb(147,153,159)
                background #f3f5f7
            .food-item
                display flex
                margin 36px
                padding-bottom 36px //这里不能使用margin，会重合
                border-bottom 1px solid rgba(7,17,27,0.1)
                &.last-child
                    margin-bottom 0
                .icon
                    flex 0 0 114px
                    margin-right 20px
                .content
                    flex 1
                    position relative
                    .name
                        margin 4px 0 16px 0
                        height 28px
                        line-height 28px
                        font-size 28px
                        color rgb(7,17,27)
                    .desc, .extra
                        line-height 24px
                        font-size 20px
                        color rgb(147,153,159)
                    .desc
                        margin-bottom 16px
                    .extra
                        line-height 20px
                        .count
                            margin-right 24px
                    .price
                        font-weight 700
                        line-height 48px
                        .now
                            margin-right 16px
                            font-size 28px
                            color rgb(240,20,20)
                        .old
                            text-decoration line-through
                            font-size 20px
                            color rgb(147,153,159)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 24px
</style>


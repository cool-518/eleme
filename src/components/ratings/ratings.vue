<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <!-- 综合评分 -->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!-- 服务星星评分 -->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <!-- 分割条 -->
      <split></split>
      <!-- 评论选项卡 -->
      <ratingselect @select="selectRating" @toggle="toggleContent" 
      :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="ratings"></ratingselect>
      <!-- 评论列表 -->
      <div class="rating-wrapper">
        <ul>
          <!-- 遍历ratings.json的所有数据（评论） -->
          <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="48" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {formatDate} from '../../common/js/date'
  import star from '../star/star'
  import ratingselect from '../ratingselect/ratingselect'
  import split from '../split/split'
  const response = require('../../common/data/ratings.json')

  const ALL = 2// 默认显示全部
  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [], // 缓存评论数据，用于改变选项卡时实时显示
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      // this.$http.get('/api/ratings').then((response) => {
      //   response = response.body;
      //   if (response.errno === ERR_OK) {
      //     this.ratings = response.data;
      //     this.$nextTick(() => {
      //       this.scroll = new BScroll(this.$refs.ratings, {
      //         click: true
      //       });
      //     });
      //   }
      // });

      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings, {
            click: true
          });
        });
      }
    },
    methods: {
      // 点击过滤选项卡评论,真正刷新视图
      // v-show不管初始条件是什么，元素总是会被渲染
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
      // 切换评论选项卡
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
    // 时间戳
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      star,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratings
    position: absolute
    top: 348px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 36px 0
      .overview-left
        flex: 0 0 274px
        padding: 12px 0
        width: 274px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 240px
          width: 240px
        .score
          margin-bottom: 12px
          line-height: 56px
          font-size: 48px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 16px
          line-height: 24px
          font-size: 24px
          color: rgb(7, 17, 27)
        .rank
          line-height: 20px
          font-size: 20px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 12px 0 12px 48px
        @media only screen and (max-width: 320px)
          padding-left: 12px
        .score-wrapper
          margin-bottom: 16px
          font-size: 0
          .title
            display: inline-block
            line-height: 36px
            vertical-align: top
            font-size: 24px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 24px
            vertical-align: top
          .score
            display: inline-block
            line-height: 36px
            vertical-align: top
            font-size: 24px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 36px
            font-size: 24px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 24px
            font-size: 24px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 36px
      .rating-item
        display: flex
        padding: 36px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 56px
          width: 56px
          margin-right: 24px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 8px
            line-height: 24px
            font-size: 20px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 12px
            font-size: 0
            .star
              display: inline-block
              margin-right: 12px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 24px
              font-size: 20px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 16px
            line-height: 36px
            color: rgb(7, 17, 27)
            font-size: 24px
          .recommend
            line-height: 32px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              margin: 0 16px 8px 0
              font-size: 18px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .item
              padding: 0 12px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 24px
            font-size: 20px
            color: rgb(147, 153, 159)
</style>
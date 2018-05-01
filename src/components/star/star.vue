<template>
  <div class="star" :class="starType">
    <!-- 根据计算好的result数组，不同index的不同值，在循环时根据动态的class来显示不同的星星 -->
    <span v-for=" (itemClass,index) in itemClasses" class="star-item"  :class="itemClass"  :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size;
      },
      itemClasses () {
        let result = [];
        // 星星状态为0 0.5 1，故先向下取整；
        let score = Math.floor(this.score * 2) / 2;
        // 不为0的话说明为.5，取出小数部分；
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        // 向五颗星里加入integer个满星
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        // 是否加入半星
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        // 若满星和半星数量不足5个,剩余的补上灰星星
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image ('star48_on')
        &.half
          bg-image ('star48_half')
        &.off
          bg-image ('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image ('star36_on')
        &.half
          bg-image ('star36_half')
        &.off
          bg-image ('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image ('star24_on')
        &.half
          bg-image ('star24_half')
        &.off
          bg-image ('star24_off')
</style>
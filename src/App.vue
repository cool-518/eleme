<template>
	<div>
		<Heador :seller="seller"></Heador>
			<div class="top">
				<div class="item">
				<router-link to="/goods">商品</router-link>
				</div>
				<div class="item">
				<router-link to="/ratings">评论</router-link>
				</div>
				<div class="item">
				<router-link to="/seller">商家</router-link>
				</div>
			</div>
		<!-- 缓存组件,避免多次加载相应的组件,减少性能消耗 -->
		<keep-alive>
			<router-view :seller="seller"></router-view>
		</keep-alive>
	</div>
</template>
<script type="text/ecmascript-6">
import { urlParse } from "./common/js/util.js"
import Heador from "./components/header/header.vue"

const ERR_OK = 0

	export default {
	data() {
		// 数据缓存
		return {
		seller: {
			id: (() => {
				// 获取每个页面ID
				let queryParam = urlParse()
				console.log(queryParam)
				return queryParam.id
			})()
		}
		}
	},
	created() {
		// do something after creating vue instance
		// 获取ajax地址，传入数据
		this.$http.get('./api/seller?id=' + this.seller.id).then((res)=>{
		var resData  = res.data
		if(resData.errno  === ERR_OK){
			/* this.seller =  resData.data; 会覆盖掉id */
			/* 防止把id覆盖掉，使用es6的一个语法:扩展了对象的属性，在原来的基础上添加response.data的值，不会覆盖掉原来的id属性 */
			this.seller = Object.assign({},this.seller,resData.data)
			console.log(this.seller.id)
		}
		},(res)=>{
			alert(res.status)
		});
	},
	components: {
		Heador
	}
	};
	</script>
	<style lang="stylus">
	.top 
		display: flex
		width: 100%
		height: 80px
		line-height: 80px
		border-bottom: 1px solid rgba(7, 17, 27, 0.1)
		.item
			flex: 1
			text-align: center
			& > a
				display: block
</style>

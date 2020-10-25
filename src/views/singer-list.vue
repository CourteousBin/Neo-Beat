<template>
  <div class="page-singer-list">
    <mt-cell
      v-for="(item, index) in list"
      :to="`/singer/info/${item.singerid}`"
      is-link
      :title="item.singername"
      :key="index">
      <img slot="icon" :src="item.imgurl.replace('{size}', '400')" width="60" height="60">
    </mt-cell>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import request from '@/request'
export default {
  data () {
    return {
      list: [
        {
          singername: 'Public Domain Music',
          imgurl: 'http://admin.impool18.com:8080/ipfs/QmY3UihcA14h2vfNbMjXsuQHwRLXBgKFtUJqnJBF7F3yYc',
          singerid: '3520'
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('showHead', true)
      vm.$store.commit('setHeadStyle', { 'background': '#5dc0b6' })
      vm.getList()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('showHead', false)
    this.$store.commit('resetHeadStyle')
    next()
  },
  methods: {
    getList () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      setTimeout(() => {
        this.$store.commit('setHeadTitle', 'Global singer')
        Indicator.close()
      }, 300)
    }
  }
}
</script>

<style lang="scss">
  .page-singer-list {
    .mint-cell-title img {
      margin-right: 10px
    }
    .mint-cell-wrapper {
      padding: 10px 5px;
    }
  }
</style>

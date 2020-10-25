<template>
  <div class="page-plist">
    <mt-cell
      v-for="(item, index) in list"
      :title="item.specialname"
      is-link
      :label="String(item.playcount)"
      :to="`/plist/info/${item.specialid}`"
      :key="index">
      <img slot="icon" :src="item.imgurl.replace('{size}', '400')" width="60" height="60" />
    </mt-cell>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'

export default {
  data () {
    return {
      list: [
        {
          specialname: '每周推荐歌曲',
          imgurl: 'http://admin.impool18.com:8080/ipfs/QmeiC7W6zCWwu7CK2NGBJX8YzF1SGHa82S3biBQMiYjbC5',
          playcount: '141367',
          specialid: '3167439'
        }
      ]
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="scss">
  .page-plist {
    .mint-cell-text {
      position: absolute;
      left: 90px;
      top: 23px;
      padding-right: 40px;
      height: 16px;
      overflow: hidden;
      line-height: 16px;
    }
    .mint-cell-label {
      position: absolute;
      left: 90px;
      top: 38px
    }
    .mint-cell-label:before {
      content: '';
      display: inline-block;
      margin-right: 6px;
      width: 12px;
      height: 12px;
      background: url("~@/assets/images/icon_music.png") no-repeat center;
      background-size: 100%;
    }
    .mint-cell-wrapper {
      padding: 10px 5px;
    }
  }
</style>

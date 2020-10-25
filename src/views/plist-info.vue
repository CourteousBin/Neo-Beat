<template>
  <div class="page-plist-info">
    <div class="banner-wrap" :style="{backgroundImage: `url(${imgurl})`}"></div>

    <div class="plist-desp container">
      <p class="plist-desp-p" :class="{'plist-desp-hide': hideDesp }">{{desp}}</p>
      <img
        v-if="hideDesp"
        src="@/assets/images/close_icon.png"
        @click="toggleDesp"
        class="plist-desp-icon"/>
      <img
        v-else
        src="@/assets/images/open_icon.png"
        @click="toggleDesp"
        class="plist-desp-icon"/>
    </div>
    <div style="height: 5px; background-color: #f1f1f1"></div>

    <mt-cell
      v-for="(item, index) in songList"
      :title="item.filename"
      @click.native="playAudio(index)"
      :key="index">
      <img src="@/assets/images/download_icon.png" width="20" height="20" />
    </mt-cell>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { PLAY_AUDIO } from '../mixins'
import request from '@/request'
import ipfsRequest from '@/ipfsRequest'
import DefalutLogo from '@/assets/images/default.png'
export default {
  mixins: [PLAY_AUDIO],
  data () {
    return {
      imgurl: '',
      title: '',
      songList: [],
      updateTime: '',
      desp: '',
      hideDesp: true,
      opacity: 0
    }
  },
  computed: {
    songImg () {
      return DefalutLogo
    }
  },
  methods: {
    getList () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      const infoID = this.$route.params.id
      request.get(`/plist/list/${infoID}?json=true`).then(({ data }) => {
        Indicator.close()
        const info = data.info.list
        const list = data.list.list.info
        this.songList = list
        this.imgurl = info.imgurl.replace('{size}', '400')
        this.desp = info.intro
        this.$store.commit('setHeadTitle', info.specialname)
      })
    },
    ipfsGetSongs () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      // 发送 POST 请求
      ipfsRequest().then(res => {
        // 歌单
        this.imgurl = 'http://admin.impool18.com:8080/ipfs/QmeiC7W6zCWwu7CK2NGBJX8YzF1SGHa82S3biBQMiYjbC5'
        this.desp = '每周，给你不一样的歌曲'
        this.$store.commit('setHeadTitle', '每周歌单')

        let data = res.data.data[2]
        let { host } = res.data
        let songSrc = `${host}${data.cid}/`
        this.songSrc = songSrc
        let songList = data.song
        this.songList = songList
        Indicator.close()
      })
    },
    toggleDesp () {
      this.hideDesp = !this.hideDesp
    }
  },
  // 通过路由的before钩子解除router-view缓存限制
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('showHead', true)
      vm.ipfsGetSongs()
      window.onscroll = () => {
        vm.opacity = window.pageYOffset / 250
        vm.$store.commit('setHeadStyle', { background: `rgba(93,192,182,${vm.opacity})` })
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('showHead', false)
    window.onscroll = null
    next()
  }
}
</script>

<style lang="scss">
  .page-plist-info {
    .banner-wrap {
      width: 100%;
      margin-top: -43px;
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      height: 250px;
    }

    .mint-cell-title {
      padding-left: 5px
    }

    .plist-desp {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      position: relative;
      text-align: justify;
      .plist-desp-p {
        padding-right: 40px;
        line-height: 135%
      }
      .plist-desp-icon {
        display: block;
        width: 24px;
        height: 24px;
        position: absolute;
        right: 10px;
        top: 10px
      }
      .plist-desp-hide {
        overflow: hidden;
        height: 1.35em;
      }
    }
  }
</style>

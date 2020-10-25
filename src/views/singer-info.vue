<template>
  <div class="page-singer-info">
    <div class="banner-wrap" :style="{backgroundImage: `url(${imgurl})`}">
    </div>

    <div class="plist-desp container">
      <p class="plist-desp-p" :class="{'plist-desp-hide': hideDesc }">{{desc}}</p>
      <img src="@/assets/images/close_icon.png" @click="toggleDesc" class="plist-desp-icon" v-if="hideDesc">
      <img src="@/assets/images/open_icon.png" @click="toggleDesc" class="plist-desp-icon" v-else>
    </div>
    <div style="height: 5px;background-color: #f1f1f1"></div>

    <mt-cell v-for="(item,index) in songList" :title="item.filename" @click.native="playAudio(index)" :key="index">
      <img src="@/assets/images/download_icon.png" width="20" height="20">
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
      songList: [],
      updateTime: '',
      desc: '',
      hideDesc: true,
      opacity: 0
    }
  },
  computed: {
    songImg () {
      return DefalutLogo
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
  },
  methods: {
    ipfsGetSongs () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      // 发送 POST 请求
      ipfsRequest({
        url: '/ipns/QmR2f2HMQy3JyP6XfH25BzJSEPGAqg9qTPwfX31mu2xPAe/class.json',
        method: 'get'
      }).then(res => {
        let data = res.data.data[3]
        let { host } = res.data
        let songSrc = `${host}${data.cid}/`
        this.songSrc = songSrc
        let songList = data.song
        this.songList = songList
        this.$store.commit('setHeadTitle', 'Public Domain Music')

        this.imgurl = 'http://admin.impool18.com:8080/ipfs/QmY3UihcA14h2vfNbMjXsuQHwRLXBgKFtUJqnJBF7F3yYc'
        this.desc = '公有领域（英语：Public Domain）是人类的一部分作品与一部分知识的总汇，可以包括文章、艺术品、音乐、科学、发明等等。对于领域内的知识财产，任何个人或团体都不具所有权益（所有权益通常由版权或专利体现）。这些知识发明属于公有文化遗产，任何人可以不受限制地使用和加工它们（此处不考虑有关安全、出口等的法律）。创立版权制度的初衷是借由给予创作者一段时期的专有权利作为（经济）刺激以鼓励作者从事创作。当专有权利期间届止，作品便进入公有领域。公有领域的作品由于没有专属权利人，因此公众有权自由使用它们。'
        Indicator.close()
      })
    },
    toggleDesc () {
      this.hideDesc = !this.hideDesc
    }
  }
}
</script>
<style lang="scss">
  .page-singer-info {
    .banner-wrap {
      width: 100%;
      margin-top: -43px;
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
      height: 250px;
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

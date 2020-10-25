<template>
  <div class="page-rank-info">
    <div class="banner-wrap" :style="{backgroundImage:'url('+ imgurl + ')'}">
      <div class="rank-status container">
        <p>上次更新时间：{{getToday()}}</p>
      </div>
    </div>

    <div class="rank-info-list">
      <mt-cell
        v-for="(item, index) in songList"
        :title="item.filename"
        @click.native="playAudio(index)"
        :key="index">
        <span :class="getRankItemClass(index)">{{index + 1}}</span>
        <img src="@/assets/images/download_icon.png" width="20" height="20" />
      </mt-cell>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { PLAY_AUDIO } from '../mixins'
import ipfsRequest from '@/ipfsRequest'
import DefalutLogo from '@/assets/images/default.png'
export default {
  mixins: [PLAY_AUDIO],
  data () {
    return {
      imgurl: '',
      songList: [],
      updateTime: '',
      opacity: 0
    }
  },
  computed: {
    songImg () {
      return DefalutLogo
    }
  },
  methods: {
    getRankItemClass (index) {
      return {
        'rank-index': true,
        'rank-list-good': index < 3,
        'rank-list-first': index === 0,
        'rank-list-second': index === 1,
        'rank-list-third': index === 2
      }
    },
    getToday () {
      const time = new Date()
      const year = time.getFullYear()
      let month = time.getMonth() + 1
      let date = time.getDate()
      if (month < 10) month = '0' + month
      if (date < 10) date = '0' + date
      return `${year}-${month}-${date}`
    },
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
        // 封面
        const { banner7url, rankname } = {
          banner7url: 'http://admin.impool18.com:8080/ipfs/Qma1VLN4GriYzUbWhgsDhaJUscJ4wruP74qnE2qRfSo7nQ',
          rankname: 'Neo Beat Rank'
        }
        this.$store.commit('setHeadTitle', rankname)
        this.imgurl = banner7url

        let data = res.data.data[1]
        let { host } = res.data
        let songSrc = `${host}${data.cid}/`
        this.songSrc = songSrc
        let songList = data.song
        this.songList = songList
        Indicator.close()
      })
    }
  },
  // 通过路由的before钩子解除keep-alive缓存限制
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('showHead', true)
      vm.ipfsGetSongs()
      window.onscroll = () => {
        vm.opacity = window.pageYOffset / 250
        vm.$store.commit('setHeadStyle', { background: `rgba(93, 192, 182,${vm.opacity})` })
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('showHead', false)
    window.onscroll = null
    next()
  },
  mounted () {
    window.onscroll = () => {
      this.opacity = window.pageYOffset / 200
      this.$store.commit('setHeadStyle', { background: `rgba(43,162,251,${this.opacity})` })
    }
  }
}
</script>

<style lang="scss">
  .page-rank-info {
    .banner-wrap {
      width: 100%;
      height: 200px;
      margin-top: -43px;
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%
    }

    .rank-status {
      height: 43px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: -webkit-linear-gradient(bottom, rgba(0, 0, 0, .6), rgba(0, 0, 0, 0));
      line-height: 43px;
      font-size: 15px;
      color: #fff
    }

    .rank-info-list {
      .rank-index {
        position: absolute;
        left: 20px;
        font-size: 12px;
        margin-top: 4px
      }

      .mint-cell-title {
        padding-left: 35px;
      }
      .rank-list-first {
        background-color: #e80000;
      }

      .rank-list-second {
        background-color: #ff7200;
      }

      .rank-list-third {
        background-color: #f8b300;
      }
    }
  }

  .rank-list-good {
    display: inline-block;
    padding: 2px 8px;
    left: 12px !important;
    border-radius: 8px;
    color: #fff;
    margin-top: 3px !important;
  }
</style>

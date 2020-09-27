<template>
  <div>
    <mt-swipe :auto="5000">
      <mt-swipe-item v-for="(banner, index) in banners" :key="index">
        <a>
          <img :src="banner.imgurl" :title="banner.title" />
        </a>
      </mt-swipe-item>
    </mt-swipe>

    <mt-cell
      v-for="(song, index) in songList"
      :title="song.filename"
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
import { createPow } from '@textile/powergate-client'

export default {
  mixins: [PLAY_AUDIO],
  data () {
    return {
      banners: [],
      songList: []
    }
  },
  methods: {
    getSongs () {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      })
      request({
        url: '/?json=true',
        method: 'get'
      }).then(({ data }) => {
        this.banners = data.banner
        this.songList = data.data
        Indicator.close()
      })
    },
    async connectIPFS () {
      const host = 'http://Adi.impool18.com:6002' // or whatever powergate instance you want

      const pow = createPow({ host })

      const { status, messagesList } = await pow.health.check()

      const { peersList } = await pow.net.peers()

      // alert(status)
      console.log(status)
      console.log(messagesList)
      console.log(peersList)
    }
  },
  mounted () {
    this.connectIPFS()
    this.getSongs()
  }
}
</script>

<style>
.mint-swipe {
  height: 39vw !important;
}

.mint-swipe-indicator {
  width: 12px !important;
  height: 12px !important;
}

.mint-swipe-indicators {
  bottom: 5px !important;
}
</style>

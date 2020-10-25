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
      :title="song.filename + ' - Public Domain Music'"
      @click.native="playAudio(index)"
      :key="index">
      <img src="@/assets/images/download_icon.png" width="20" height="20" />
    </mt-cell>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { PLAY_AUDIO } from '../mixins'
import ipfsRequest from '@/ipfsRequest'
import DefalutLogo from '@/assets/images/default.png'
// import { createPow } from '@textile/powergate-client'

export default {
  mixins: [PLAY_AUDIO],
  data () {
    return {
      banners: [
        {
          imgurl: 'http://admin.impool18.com:8080/ipfs/QmSarCeeyRQQypR5Lx3XZxLympaFkXBMWrtxaRQ9SLeS4Z'
        },
        {
          imgurl: 'http://admin.impool18.com:8080/ipfs/QmU1LmsCKGYoXFDDMmyYKbQCJ3hvajeJXjBKXoHDciucic'
        },
        {
          imgurl: 'http://admin.impool18.com:8080/ipfs/QmdNzARvFE4oc48wAnJArw5thJJeYCtoM7KnUMaAufUpxJ'
        },
        {
          imgurl: 'http://admin.impool18.com:8080/ipfs/QmT5m3fyGZy1svAMCYkwh2xCxra5b89wTrJRz6ByvCxr1b'
        }
      ],
      songList: [],
      songSrc: ''
    }
  },
  computed: {
    songImg () {
      return DefalutLogo
    }
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
        let data = res.data.data[0]
        let { host } = res.data
        let songSrc = `${host}${data.cid}/`
        this.songSrc = songSrc
        let songList = data.song
        this.songList = songList
        Indicator.close()
      })
    }
  },
  async mounted () {
    await this.ipfsGetSongs()
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

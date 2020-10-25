<template>
  <div class="page-search">
    <div class="search-panel">
      <div class="search-input">
        <span class="search-icon"></span>
        <input type="text" v-model="keyword" placeholder="请输入歌名" @keydown.enter="search" />
      </div>
      <a href="javascript:;" @click="search" class="search-btn">搜索</a>
    </div>

    <div class="songs-list" v-show="!togglePanel">
      <div class="search-total">共有{{total}}条搜索结果</div>
      <mt-cell
        v-for="(item, index) in songList"
        :title="item.filename+ ' - Public Domain Music'"
        @click.native="playAudio(index)"
        :key="index">
        <img src="@/assets/images/download_icon.png" width="20" height="20" />
      </mt-cell>
    </div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import { PLAY_AUDIO } from '../mixins'
import axios from 'axios'
import { Ls } from 'dayjs'
import ipfsRequest from '@/ipfsRequest'
import DefalutLogo from '@/assets/images/default.png'
export default {
  mixins: [PLAY_AUDIO],
  data () {
    return {
      keyword: '',
      hotList: [],
      togglePanel: true,
      total: null,
      songList: [],
      searchList: [],
      host: '',
      songSrc: ''
    }
  },
  created () {
    // this.getList()
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
      setTimeout(() => {
        Indicator.close()
        this.hotList = [
          {
            jumpurl: 'https://activity.kugou.com/music-area/dist/#/mobile/home/35',
            keyword: '新歌',
            sort: 1
          },
          {
            jumpurl: 'https://activity.kugou.com/music-area/dist/#/mobile/home/35',
            keyword: 'Neo Beat Rank',
            sort: 2
          },
          {
            jumpurl: 'https://activity.kugou.com/music-area/dist/#/mobile/home/35',
            keyword: '每周推荐',
            sort: 3
          },
          {
            jumpurl: 'https://activity.kugou.com/music-area/dist/#/mobile/home/35',
            keyword: 'Public Domain Music',
            sort: 4
          }
        ]
      }, 300)
    },
    replaceInput (keyword) {
      this.keyword = keyword
      this.search()
    },
    search () {
      this.togglePanel = false

      if (this.songList.length === 0) {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        })
        if (this.keyword) {
          ipfsRequest({
            url: '/ipns/QmR2f2HMQy3JyP6XfH25BzJSEPGAqg9qTPwfX31mu2xPAe/full.json',
            method: 'get'
          }).then(res => {
            let { data, host } = res.data
            this.searchList = data
            this.host = host
            this.handleSearch()
            Indicator.close()
          })
        }
      } else {
        this.handleSearch()
      }
    },
    handleSearch () {
      let searchList = this.searchList
      let key = this.keyword.substring(0, 3)

      let result = searchList.filter((item, index) => {
        return item.name === key
      })
      console.log(result)
      let resultTwo = result[0].song.filter((item, index) => {
        if (item.filename.includes(this.keyword)) {
          console.log(item)
          return item
        }
      })
      this.total = resultTwo.length
      this.songList = resultTwo
      let songSrc = `${this.host}${result[0].cid}/`
      this.songSrc = songSrc
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/reset.scss';
  .page-search {
    .search-panel {
      padding: 10px;
      background-color: #fbfbfb;
      height: 55px;
    }
    .search-input {
      width: 80%;
      height: 100%;
      display: block;
      border: 1px solid #e5e5e5;
      border-radius: 7px;
      float: left;
      background-color: #fff
    }
    .search-icon {
      display: block;
      float: left;
      width: 10%;
      height: 100%;
      background: url("http://m.kugou.com/v3/static/images/index/search_icon.png") no-repeat center;
      background-size: auto 100%
    }
    .search-input input {
      width: 90%;
      height: 100%;
      display: inline-block;
      padding: 0 10px 0 0;
      border: none;
      outline: none;
      background-color: transparent
    }
    .search-btn {
      display: block;
      height: 100%;
      width: 18%;
      background-color: $theme;
      float: right;
      border-radius: 7px;
      color: #fff;
      font-size: 15px;
      text-align: center;
      line-height: 35px;
      border: none;
      outline: none
    }
    .search-list-title {
      padding: 10px;
      color: $theme
    }
    .search-total {
      padding: 5px 10px;
      background-color: #e1e1e1;
      color: #484848
    }
  }
</style>

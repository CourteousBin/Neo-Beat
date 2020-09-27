/**
 * Created by Administrator on 2016/11/5.
 */
import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import request from '@/request'
import { Toast } from 'mint-ui'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    audio: {
      songUrl: '',
      imgUrl: '',
      title: '',
      singer: '',
      currentLength: 0,
      songLength: 0,
      currentFlag: false,
      lrc: ''
    },
    head: {
      toggle: false,
      title: '',
      style: {'background': 'rgba(43,162,251,0)'}
    },
    audioLoading: false,
    detailPlayerFlag: false,
    showPlayer: false,
    listenCount: 0,
    isPlay: true,
    listInfo: {
      songList: [],
      songIndex: 0
    }
  },
  getters: {
    audio: state => state.audio,
    head: state => state.head,
    audioLoading: state => state.audioLoading,
    detailPlayerFlag: state => state.detailPlayerFlag,
    showPlayer: state => state.showPlayer,
    isPlay: state => state.isPlay
  },
  mutations: {
    setAudio (state, audio) {
      if (!state.listenCount) {
        state.showPlayer = true // 首次进入应用时不可打开播放详情
      }
      state.listenCount++
      state.audio = {...(state.audio), ...audio}
    },
    setAudioTime (state, time) {
      state.audio.currentLength = time
    },
    setCurrent (state, flag) {
      state.audio.currentFlag = flag
    },
    showHead (state, flag) {
      state.head.toggle = flag
    },
    setHeadTitle (state, title) {
      state.head.title = title
    },
    setHeadStyle (state, style) {
      state.head.style = style
    },
    resetHeadStyle: state => {
      state.head.style = {'background': 'rgba(43,162,251,0)'}
    },
    toggleAudioLoading: (state, flag) => {
      state.audioLoading = flag
    },
    showDetailPlayer: (state, flag) => {
      state.detailPlayerFlag = flag
    },
    showPlayer: (state, flag) => {
      state.showPlayer = flag
    },
    isPlay: (state, flag) => {
      state.isPlay = flag
    },
    setLrc: (state, lrc) => {
      state.audio = {...state.audio, lrc}
    },
    setListInfo: (state, {list, index}) => {
      state.listInfo.songList = list
      state.listInfo.songIndex = index
    }
  },
  actions: {
    getSong ({commit, dispatch}, hash) {
      if (hash) {
        commit('toggleAudioLoading', true)
        request.get(`/api/v1/song/get_song_info?cmd=playInfo&hash=${hash}`).then((res) => {
          const data = res.data
          const songUrl = data.url
          if (songUrl === '') {
            Toast('此歌曲暂无版权')
          }
          const imgUrl = data.imgUrl.replace('{size}', 400)
          const title = data.songName
          const songLength = data.timeLength
          const singer = data.singerName
          const currentLength = 0
          const audio = { songUrl, imgUrl, title, singer, songLength, currentLength }
          // dispatch('getLrc', hash, songLength * 1000)
          commit('setAudio', audio)
          commit('toggleAudioLoading', false)
        })
      }
    },
    getLrc ({commit}, { hash, timelength }) {
      if (hash && timelength) {
        request.get(`/app/i/krc.php?cmd=100&timelength=${timelength}&hash=${hash}`).then(res => {
          commit('setLrc', res.data)
        })
      }
    },
    prev ({dispatch, state}) {
      const list = state.listInfo.songList
      if (state.listInfo.songIndex === 0) {
        state.listInfo.songIndex = list.length
      } else {
        state.listInfo.songIndex--
      }
      const hash = list[state.listInfo.songIndex] && list[state.listInfo.songIndex].hash
      const timelength = list[state.listInfo.songIndex] && list[state.listInfo.songIndex].duration * 1000
      dispatch('getSong', hash)
      dispatch('getLrc', {hash, timelength})
    },
    next ({dispatch, state}) {
      const list = state.listInfo.songList
      if (state.listInfo.songIndex === list.length - 1) {
        state.listInfo.songIndex = 0
      } else {
        ++state.listInfo.songIndex
      }
      const hash = list[state.listInfo.songIndex] && list[state.listInfo.songIndex].hash
      const timelength = list[state.listInfo.songIndex] && list[state.listInfo.songIndex].duration * 1000
      dispatch('getSong', hash)
      dispatch('getLrc', {hash, timelength})
    }
  }
})

export default store

module.exports = {
  'PLAY_AUDIO': {
    methods: {
      playAudio (index) {
        const songInfo = this.songList[index]
        this.$store.commit('setListInfo', {
          list: this.songList,
          index: index
        })
        let { filename } = songInfo
        let songUrl = `${this.songSrc}${filename}`
        let audio = new Audio(songUrl)
        setTimeout(() => {
          console.log(audio.duration)
          let { duration } = audio
          let songData = {
            url: songUrl,
            songName: filename,
            singerName: 'Public Domain Music',
            timeLength: duration,
            imgUrl: this.songImg,
            path: this.songSrc
          }
          this.$store.dispatch('getSong', songData)
        }, 500)

        // this.$store.dispatch('getSong', songInfo)
        // this.$store.dispatch('getSong', songInfo.hash)
        // this.$store.dispatch('getLrc', {
        //   hash: songInfo.hash,
        //   timelength: songInfo.duration * 1000
        // })
      }
    }
  }
}

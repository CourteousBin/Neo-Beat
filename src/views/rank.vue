<template>
  <div class="page-rank">
    <mt-cell
      v-for="(item, index) in songList"
      :title="item.rankname"
      :to="`/rank/info/${item.rankid}`"
      is-link
      :key="index">
      <img slot="icon" :src="item.imgurl.replace('{size}', '400')" width="60" height="60" />
    </mt-cell>
  </div>
</template>

<script>
export default {
  data () {
    return {
      songList: [
        {
          imgurl: 'http://admin.impool18.com:8080/ipfs/Qma1VLN4GriYzUbWhgsDhaJUscJ4wruP74qnE2qRfSo7nQ',
          rankname: 'Neo Beat Rank',
          rankid: 6666
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
.page-rank {
  .mint-cell-title img {
    margin-right: 10px;
  }

  .mint-cell-wrapper {
    font-size: 16px;
    padding: 10px 5px;
  }
}
</style>

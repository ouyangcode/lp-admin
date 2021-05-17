<template>
  <elFrame :src="url" />
</template>
<script>
import elFrame from '@/components/Iframe/index'
import { getUrl } from '@/api/lpitmgr/gamePackageOnline/getGamePackageCheckURL'
export default {
  name: 'GamePackageCheckURL',
  components: { elFrame },
  data() {
    return {
      url: ''
    }
  },
  created() {
    getUrl().then(res => {
      console.log(res)
      this.url = res.url
    })
  }
}
</script>

<template>
    <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in list" :key="index">
            <a :href="item.jumpInfo">
                <img :src="item.picInfo" width="90%" height="100%" style="margin-left: 5%;border-radius: 8px">
            </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>
<script>
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  props: {
    list: {
      type: Array
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: {
          delay: 4000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        speed: 500,
        loop: true,
        loopAdditionalSlides: 3,
        roundLengths: true
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  }
}
</script>
<style type="text/css">
    .swiper-pagination-bullet {
        opacity: 1;
        display: inline-block;
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.5);
    }

    .swiper-pagination-bullet-active {
        opacity: 1;
        background: #C20C0C;
    }
</style>

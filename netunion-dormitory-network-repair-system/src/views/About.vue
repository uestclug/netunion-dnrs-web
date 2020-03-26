<template>
  <div class="about">
    <h1>this is about page</h1>
  </div>
</template>

<script>
import Bus from '@/Bus'

export default {
  name: 'About',
  created () {
    Bus.$emit('tokenCheck')
  }
}
</script>

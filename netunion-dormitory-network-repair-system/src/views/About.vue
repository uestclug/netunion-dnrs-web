<template>
  <div class="about">
    <h1>this is about page</h1>
  </div>
</template>

<script>
export default {
  data: () => ({
    role: null
  }),
  name: 'About',
  created () {
    this.role = this.$store.state.role
    console.log('about page role: ' + this.role)
  }
}
</script>

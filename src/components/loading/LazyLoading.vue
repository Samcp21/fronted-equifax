<template>
    <div style="display: flex; flex-direction: column; align-items: center">
        <v-progress-circular indeterminate :color="color" :size="80" :width="7" />
    </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary',
    },
  },
};
</script>

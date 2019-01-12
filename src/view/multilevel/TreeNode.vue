<template>
  <div class="tree-node">
    <slot
      name="tree-node"
    />
  </div>
</template>

<script>
  export default {
    name: "TreeNode",
    props: {
      selected: {
        type:Boolean,
        default: false,
      },
      depth: {
        type: Number,
        default: 0,
      }
    }
  }
</script>

<style lang="less" scoped>
  .tree-node{
    cursor: default;
    position: relative;
    &:hover {
      background: #f2fdff;

      .dropdown {
        visibility: inherit;
      }
    }
  }
  .dropdown {
    visibility: hidden;
  }
</style>

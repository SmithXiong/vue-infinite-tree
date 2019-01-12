<template>
  <div class="dynamic-scroller-demo" ref="tree">
<!--  <DynamicScroller
    class="scroller"
    :items="tree.nodes"
    :min-item-height="rowHeight"
    ref="virtualList"
  >
    <template slot-scope="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
            item.name,
        ]"
        :data-index="index"
        :data-active="active"
      >
        <slot
          v-bind="{
          node: tree.nodes[index],
          tree: tree,
          index,
          active,
        }"
        />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>-->
    <RecycleScroller class="scroller"
                     :items="tree.nodes"
                     :item-height="32"
                     ref="virtualList"
                     :emit-update="emitUpdate"
                     @update="treeUpdate"
    >
      <div slot-scope="{ item }" class="user">
        <slot
          v-bind="{
          node: item,
          tree: tree,
        }"
        />
      </div>
    </RecycleScroller>
  </div>
</template>

<script>
  import {DynamicScroller, DynamicScrollerItem, RecycleScroller} from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
  import InfiniteTree from 'infinite-tree';

  const lcfirst = (str) => {
    str += '';
    return str.charAt(0).toLowerCase() + str.substr(1);
  };
  export default {
    name: 'InfiniteTree',
    components: {
      DynamicScroller,
      DynamicScrollerItem,
      RecycleScroller
    },
    props: {
      autoOpen: {
        type: Boolean,
        default: false,
      },
      selectable: {
        type: Boolean,
        default: true,
      },
      tabIndex: {
        type: Number,
        default: 1,
      },
      data: {
        type: [Array,Object],
        default: () => {
          return [];
        },
      },
      rowHeight: {
        type: Number,
        default: 32,
      },
      loadNodes: {
        type: Function,
        default: () => {},
      },
      shouldSelectNode: {
        type: Function,
        default: () => {},
      },
      shouldLoadNodes: {
        type: Function,
        default: () => {},
      },
      // Callback invoked before updating the tree.
      onContentWillUpdate: {
        type: Function,
        default: null,
      },

      // Callback invoked when the tree is updated.
      onContentDidUpdate: {
        type: Function,
        default: null,
      },

      // Callback invoked when a node is opened.
      onOpenNode: {
        type: Function,
        default: null,
      },

      // Callback invoked when a node is closed.
      onCloseNode: {
        type: Function,
        default: null,
      },

      // Callback invoked when a node is selected or deselected.
      onSelectNode: {
        type: Function,
        default: null,
      },

      // Callback invoked before opening a node.
      onWillOpenNode: {
        type: Function,
        default: null,
      },

      // Callback invoked before closing a node.
      onWillCloseNode: {
        type: Function,
        default: null,
      },

      // Callback invoked before selecting or deselecting a node.
      onWillSelectNode: {
        type: Function,
        default: null,
      },
    },
    mounted() {
      this.tree = new InfiniteTree({
        el: this.$refs.tree,
        ...this.$props,
      });

      /*this.tree.scrollToNode = (node) => {
        if (!this.$refs.tree || !this.$refs.virtualList) {
          return false;
        }

        const nodeIndex = this.tree.nodes.indexOf(node);
        if (nodeIndex < 0) {
          return false;
        }

        //const offset = this.$refs.virtualList.getOffsetForIndex(nodeIndex);
        this.$refs.virtualList.scrollToItem(nodeIndex);

        return true;
      };*/

      // Updates the tree.
      this.tree.update = () => {
        this.tree.emit('contentWillUpdate');
        this.nodes = this.tree.nodes;
        this.$nextTick(function () {
          this.tree.emit('contentDidUpdate');
        })
      };

      Object.keys(this.eventHandlers).forEach(key => {
        if (!this[key]) {
          return;
        }

        const eventName = lcfirst(key.substr(2)); // e.g. onContentWillUpdate -> contentWillUpdate
        this.eventHandlers[key] = this[key];
        this.tree.on(eventName, this.eventHandlers[key]);
      });

    },
    beforeDestroy() {
      Object.keys(this.eventHandlers).forEach(key => {
        if (!this.eventHandlers[key]) {
          return;
        }

        const eventName = lcfirst(key.substr(2)); // e.g. onUpdate -> update
        this.tree.removeListener(eventName, this.eventHandlers[key]);
        this.eventHandlers[key] = null;
      });

      this.tree.destroy();
      this.tree = null;
    },
    inheritAttrs: false,
    data() {
      return {
        nodes: [],
        tree: {nodes:[]},
        emitUpdate: true,
        eventHandlers: {
          onContentWillUpdate: null,
          onContentDidUpdate: null,
          onOpenNode: null,
          onCloseNode: null,
          onSelectNode: null,
          onWillOpenNode: null,
          onWillCloseNode: null,
          onWillSelectNode: null
        },
      }
    },
    computed: {},
    methods: {
      treeUpdate(s,e) {
        console.log('treeUpdate',s,e);
        console.log('afterTreeUpdate'+ new Date().getTime());
      }
    }
  }
</script>
<style scoped>
  .dynamic-scroller-demo,
  .scroller {
    height: 400px;
  }
  .dynamic-scroller-demo {
    overflow: hidden;
  }

  .message {
    display: flex;
    min-height: 32px;
    padding: 12px;
    box-sizing: border-box;
    max-width: 400px;
  }
</style>

<template>
  <InfiniteTree ref="tree" :data="data" :auto-open="false" :selectable="true" :tab-index="0" style="border: 1px solid #ccc" width="100%" height="400" :load-nodes="loadNodes" :should-load-nodes="shouldLoadNodes" :should-select-node="shouldSelectNode" :on-content-did-update="onContentDidUpdate" :on-content-will-update="onContentWillUpdate" :on-open-node="onOpenNode" :on-close-node="onCloseNode" :on-select-node="onSelectNode" :on-will-open-node="onWillOpenNode" :on-will-close-node="onWillCloseNode" :on-will-select-node="onWillSelectNode">
    <template slot-scope="{ node, tree }">
      <div class="tree-node" :style="nodeStyle(node)" @click="clickNode($event,node,tree)">
        <Icon :type="toggleIcon(node)" @click="toggleClick($event,node,tree)"></Icon>
        <span class="tree-text">{{node.name}}</span>
      </div>
    </template>
  </InfiniteTree>
</template>

<script>
  const generate = (size = 1000) => {
    const data = [];
    const source = '{"id":"<root>","name":"<root>","props":{"droppable":true},"children":[{"id":"alpha","name":"Alpha","props":{"droppable":true}},{"id":"bravo","name":"Bravo","props":{"droppable":true},"children":[{"id":"charlie","name":"Charlie","props":{"droppable":true},"children":[{"id":"delta","name":"Delta","props":{"droppable":true},"children":[{"id":"echo","name":"Echo","props":{"droppable":true}},{"id":"foxtrot","name":"Foxtrot","props":{"droppable":true}}]},{"id":"golf","name":"Golf","props":{"droppable":true}}]},{"id":"hotel","name":"Hotel","props":{"droppable":true},"children":[{"id":"india","name":"India","props":{"droppable":true},"children":[{"id":"juliet","name":"Juliet","props":{"droppable":true}}]}]},{"id":"kilo","name":"Kilo","loadOnDemand":true,"props":{"droppable":true}}]}]}';
    for (let i = 0; i < size; ++i) {
      data.push(JSON.parse(source.replace(/"(id|name)":"([^"]*)"/g, '"$1": "$2.' + i + '"')));
    }
    return data;
  };
  import InfiniteTree from './infiniteTree';
  export default {
    name: "tree",
    components: {
      InfiniteTree,
    },
    data() {
      return {
        data: [{
          id: "parent",
          name: "parent",
          props: {
            droppable: true
          },
          children: generate(10000),
        }],
        node: null
      }
    },
    mounted() {
      // Select the first node
      console.log(this.$refs.tree.tree.getChildNodes())
      this.$refs.tree.tree.selectNode(this.$refs.tree.tree.getChildNodes()[0]);
    },
    methods: {
      toggleState(node) {
        const hasChildren = node.hasChildren();
        let toggleState = '';
        if ((!hasChildren && node.loadOnDemand) || (hasChildren && !node.state.open)) {
          toggleState = 'closed';
        }
        if (hasChildren && node.state.open) {
          toggleState = 'opened';
        }
        return toggleState;
      },
      toggleIcon(node) {
        const hasChildren = node.hasChildren();
        let toggleIcon = 'ios-arrow-forward';
        if ((!hasChildren && node.loadOnDemand) || (hasChildren && !node.state.open)) {
          toggleIcon = 'ios-arrow-forward';
        }
        if (hasChildren && node.state.open) {
          toggleIcon = 'ios-arrow-down';
        }
        return toggleIcon;
      },
      nodeStyle(node) {
        return {
          'line-height': '30px',
          'background': node.state.selected ? '#deecfd' : '#fff',
          'border': node.state.selected ? '1px solid #06c' : '1px solid #fff',
          'padding-left': (node.state.depth * 18).toString() + 'px',
        }
      },
      clickNode(e, node, tree) {
        let toggleState = this.toggleState(node);
        if (toggleState === 'closed') {
          tree.openNode(node);
        } else if (toggleState === 'opened') {
          tree.closeNode(node);
        }
        tree.selectNode(node);
        console.log('afterSelectNode'+ new Date().getTime());
      },
      toggleClick(e, node, tree) {
        e.stopPropagation();
        let toggleState = this.toggleState(node);
        if (toggleState === 'closed') {
          tree.openNode(node);
        } else if (toggleState === 'opened') {
          tree.closeNode(node);
        }
        console.log('afterToggleNode'+ new Date().getTime());
      },
      loadNodes(parentNode, done) {
        const suffix = parentNode.id.replace(/(\w)+/, '');
        const nodes = [
          {
            id: 'node1' + suffix,
            name: 'Node 1'
          },
          {
            id: 'node2' + suffix,
            name: 'Node 2'
          }
        ];
        setTimeout(() => {
          console.log('111');
          done(null, nodes);
        }, 1000);
      },
      shouldLoadNodes(node) {
        return !node.hasChildren() && node.loadOnDemand;
      },
      shouldSelectNode(node) { // Defaults to null
        if (!node || (node === this.$refs.tree.tree.getSelectedNode())) {
          return false; // Prevent from deselecting the current node
        }
        return true;
      },
      onUpdate(node) {
        //为了及时更新dom也可以直接使用$forceUpdate
        this.node = node;
      },
      onContentWillUpdate() {
        console.log('onContentWillUpdate');
      },
      onContentDidUpdate() {
        console.log('onContentDidUpdate');
        this.onUpdate(this.$refs.tree.tree.getSelectedNode());
      },
      onOpenNode(node) {
        console.log('onOpenNode:', node);
        this.onUpdate(node);
      },
      onCloseNode(node) {
        console.log('onCloseNode:', node);
        this.onUpdate(node);
      },
      onSelectNode(node) {
        console.log('onSelectNode:', node);
        this.onUpdate(node);
      },
      onWillOpenNode(node) {
        console.log('onWillOpenNode:', node);
      },
      onWillCloseNode(node) {
        console.log('onWillCloseNode:', node);
      },
      onWillSelectNode(node) {
        console.log('onWillSelectNode:', node);
      },
    }
  }
</script>

<style lang="less" scoped>
  .tree-node{
    cursor: default;
    position: relative;
    &:hover {
      background: #f2fdff;
    }
  }
  .tree-text{
    margin-left: 2px;
    user-select: none;
  }
</style>

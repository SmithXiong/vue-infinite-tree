<template>
  <InfiniteTree ref="tree" :data="data" :auto-open="false" :selectable="true" :tab-index="0" class-name="tree" :load-nodes="loadNodes" :should-load-nodes="shouldLoadNodes" :should-select-node="shouldSelectNode" :on-content-did-update="onContentDidUpdate" :on-content-will-update="onContentWillUpdate" :on-open-node="onOpenNode" :on-close-node="onCloseNode" :on-select-node="onSelectNode" :on-will-open-node="onWillOpenNode" :on-will-close-node="onWillCloseNode" :on-will-select-node="onWillSelectNode" :on-key-down="onKeyDown" :on-key-up="onKeyUp">
    <template slot-scope="{ node, tree }">
      <div class="tree-node" :style="nodeStyle(node)" @click="clickNode($event,node,tree)">
        <Icon :type="toggleIcon(node)" @click="toggleClick($event,node,tree)" v-if="node.nodeType==='area'"></Icon>
        <Icon type="ios-loading" class="icon-load" v-if="node.state.loading"></Icon>
        <span class="tree-text">{{node.name}}</span>
      </div>
    </template>
  </InfiniteTree>
</template>

<script>
import InfiniteTree from './infiniteTree'
import HttpRequest from '../libs/axios'
import { Icon } from 'iview'
const generate = (size = 1000) => {
  const data = []
  const source = '{"id":"<root>","name":"<root>","props":{"droppable":true},"children":[{"id":"alpha","name":"Alpha","props":{"droppable":true}},{"id":"bravo","name":"Bravo","props":{"droppable":true},"children":[{"id":"charlie","name":"Charlie","props":{"droppable":true},"children":[{"id":"delta","name":"Delta","props":{"droppable":true},"children":[{"id":"echo","name":"Echo","props":{"droppable":true}},{"id":"foxtrot","name":"Foxtrot","props":{"droppable":true}}]},{"id":"golf","name":"Golf","props":{"droppable":true}}]},{"id":"hotel","name":"Hotel","props":{"droppable":true},"children":[{"id":"india","name":"India","props":{"droppable":true},"children":[{"id":"juliet","name":"Juliet","props":{"droppable":true}}]}]},{"id":"kilo","name":"Kilo","loadOnDemand":true,"props":{"droppable":true}}]}]}'
  for (let i = 0; i < size; ++i) {
    data.push(JSON.parse(source.replace(/"(id|name)":"([^"]*)"/g, '"$1": "$2.' + i + '"')))
  }
  return data
}
const axios = new HttpRequest('http://172.20.32.33:10001')
export default {
  name: 'tree',
  components: {
    InfiniteTree,
    Icon,
  },
  data () {
    return {
      data: [ {
          id: "parent",
          name: "parent",
          props: {
            droppable: true
          },
          children: generate(10000),
        } ],
      node: null,
      tree: null
    }
  },
  mounted () {
    this.tree = this.$refs.tree.tree;
    /*axios.request({
      url: '/server-sysmanager/queryAreaAndVidByParentIdUserId',
      data: {
        areaId: 'root',
        deviceLabel: ''
      },
      method: 'put'
    }).then(res => {
      this.data = [...res.data.data.area, ...res.data.data.device]
      console.log(res.data.data)
      console.log(this.$refs.tree.tree)
    })*/
  },
  methods: {
    toggleState (node) {
      const hasChildren = node.nodeType === 'area'
      let toggleState = ''
      if ((!hasChildren && node.loadOnDemand) || (hasChildren && !node.state.open)) {
        toggleState = 'closed'
      }
      if (hasChildren && node.state.open) {
        toggleState = 'opened'
      }
      return toggleState
    },
    toggleIcon (node) {
      const hasChildren = node.hasChildren()
      let toggleIcon = 'ios-arrow-forward'
      if ((!hasChildren && node.loadOnDemand) || (hasChildren && !node.state.open)) {
        toggleIcon = 'ios-arrow-forward'
      }
      if (hasChildren && node.state.open) {
        toggleIcon = 'ios-arrow-down'
      }
      return toggleIcon
    },
    nodeStyle (node) {
      return {
        'line-height': '30px',
        'background': node.state.selected ? '#deecfd' : '#fff',
        'border': node.state.selected ? '1px solid #06c' : '1px solid #fff',
        'padding-left': (node.state.depth * 18).toString() + 'px'
      }
    },
    clickNode (e, node, tree) {
      let toggleState = this.toggleState(node)
      if (toggleState === 'closed') {
        tree.openNode(node)
      } else if (toggleState === 'opened') {
        tree.closeNode(node)
      }
      tree.selectNode(node)
      console.log('afterSelectNode' + new Date().getTime())
    },
    toggleClick (e, node, tree) {
      e.stopPropagation()
      let toggleState = this.toggleState(node)
      if (toggleState === 'closed') {
        tree.openNode(node)
        tree.selectNode(node)
      } else if (toggleState === 'opened') {
        tree.closeNode(node)
      }
      console.log('afterToggleNode' + new Date().getTime())
    },
    loadNodes (parentNode, done) {
      /* const suffix = parentNode.id.replace(/(\w)+/, '');
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
        }, 1000); */
    },
    shouldLoadNodes (node) {
      return !node.hasChildren() && node.loadOnDemand
    },
    shouldSelectNode (node) { // Defaults to null
      if (!node || (node === this.$refs.tree.tree.getSelectedNode())) {
        return false // Prevent from deselecting the current node
      }
      return true
    },
    onUpdate (node) {
      // 为了及时更新dom也可以直接使用$forceUpdate
      this.node = node
    },
    onKeyUp () {
      console.log('onKeyUp')
    },
    onKeyDown () {
      console.log('onKeyDown')
    },
    onMouseLeave () {
      console.log('onMouseLeave')
    },
    onMouseEnter () {
      console.log('onMouseEnter')
    },
    onContentWillUpdate () {
      console.log('onContentWillUpdate')
    },
    onContentDidUpdate () {
      console.log('onContentDidUpdate')
      console.log(this.tree)
      this.onUpdate(this.$refs.tree.tree.getSelectedNode())
    },
    onOpenNode (node) {
      console.log('onOpenNode:', node)
      this.onUpdate(node)
    },
    onCloseNode (node) {
      console.log('onCloseNode:', node)
      this.onUpdate(node)
    },
    onSelectNode (node) {
      console.log('onSelectNode:', node)
      this.onUpdate(node)
    },
    onWillOpenNode (node) {
      console.log('onWillOpenNode:', node)
      /*if (node.deviceId) return
      if (node.children && node.children.length > 0) return
      node.state.loading = true
      axios.request({
        url: '/server-sysmanager/queryAreaAndVidByParentIdUserId',
        data: {
          areaId: node.id,
          deviceLabel: ''
        },
        method: 'put'
      }).then(res => {
        // node.children =  [...res.data.data.area,...res.data.data.device];
        this.tree.addChildNodes([...res.data.data.area, ...res.data.data.device], this.tree.getSelectedNode())
        node.state.loading = false
        console.log(res.data.data)
      })*/
    },
    onWillCloseNode (node) {
      console.log('onWillCloseNode:', node)
    },
    onWillSelectNode (node) {
      console.log('onWillSelectNode:', node)
    }
  }
}
</script>

<style lang="less" scoped>
  .tree {
    width: 400px;
    height: 650px;
    border: 1px solid #ccc;
  }
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
  .icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>

<template>
  <div>
    <span class="nav-item" :style="{color: '#fff', fontSize: '16px'}">
      首页
    </span>
    <a-popover ref="popover" trigger="click" overlayClassName="pop-div">
      <div slot="content" :style="{width: '600px', height: '300px'}">
        <template v-for="(d, i) in data">
          <div :style="{marginBottom: '8px'}" :key="i" >
            <span class="line-start"></span><span class="line-content">{{ d.meta.title }}</span>
          </div>
          <a-list
            :key="'second' + i"
            :grid="{ gutter: 8, column: 6 }"
            :dataSource="d.children"
          >
            <a-list-item slot="renderItem" slot-scope="item" >
              <a-card @click="() => handleCardClick(item)" hoverable :bodyStyle="{padding: '6px', textAlign: 'center'}" :style="{borderRadius: '5px'}">
                <a-icon :type="item.icon" :style="{fontSize: '20px', color: '#096dd9'}" />
                <div >{{ item.meta ? item.meta.title : '' }}</div>
              </a-card>
            </a-list-item>
          </a-list>
        </template>
      </div>

      <span class="nav-item" :style="{color: '#fff', fontSize: '16px'}">
        应用
      </span>
    </a-popover>

  </div>
</template>

<script>
const data = [
  {
    name: 'sysManager',
    icon: 'apple',
    meta: { title: '系统管理' },
    children: [
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        icon: 'bars',
        meta: {
          title: '工作台'
        }
      },
      {
        path: '/other/list/user-list',
        name: 'user-list',
        icon: 'book',
        meta: {
          title: '用户列表'
        }
      },
      {
        path: '/other/list/role-list',
        name: 'role-list',
        icon: 'delete',
        meta: {
          title: '角色列表'
        }
      },
      {
        path: '/other/list/permission-list',
        name: 'permission-list',
        icon: 'file-pdf',
        meta: {
          title: '权限列表'
        }
      }
    ]
  }
]
export default {
  data () {
    return { data }
  },
  methods: {
    handleCardClick (item) {
      this.$refs.popover.$children[0].sVisible = false
      this.$router.push(item.path)
    }
  }
}
</script>
<style >
.pop-div .ant-popover-inner-content {
  overflow: scroll;
}
</style>

<style scoped>
  .line-content {
    font-size: 16px;
    vertical-align: 31%;
    margin-left: 10px;
    color: #faad14;
  }
  .line-start {
    display: inline-block;
    background: #faad14;
    width: 6px;
    height: 28px;
  }
  .nav-item {
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    transition: all 0.3s;
    height: 100%;
  }
  .nav-item:hover {
    background: rgba(255, 255, 255, 0.16);
  }
  .nav-item-text {
    color: '#fff';
    font-size: '18px';
  }
</style>

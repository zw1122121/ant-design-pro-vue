增加全局 Loading 遮罩动画
====



## 需求

> 为了让操作不被用户中断，或体现一个全局的加载让用户得知当前状态时



## 实现方案

1. 使用 `spin` 组件实现
2. 增加一个 `Vue` 原型链属性 方法 `$loading.show()`  `$loading.hide()`，去控制 `vuex` 中的 `app.globalLoading` 属性

具体参考 `src/App.vue`、`src/utils/helper/loadingWrap.js` 已经实现内容
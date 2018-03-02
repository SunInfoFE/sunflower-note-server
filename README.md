# sunflower-note 周报管理平台

## 目录

* [结构树](#结构树)
* [功能模块](#功能模块)
* [接口文档](#接口文档)

## 结构树
```
.
├── demo                                // 一些demo
│   ├── other                           // 作者 - other
│   └── zx                              // 作者 - zx
│       ├── koa-bodyparser              //      koa-bodyparser 中间件
│       ├── koa-cookie                  //      koa 使用 cookie
│       ├── koa-ejs                     //      koa-ejs
│       ├── koa-get                     //      get请求处理
│       ├── koa-post                    //      post请求处理
│       ├── koa-router                  //      koa-router示例
│       ├── koa-router-simple           //      koa原生路由实现
│       ├── koa-session-minimal         //      koa-session-minimal
│       ├── koa-static-server           //      koa-static 中间件
│       ├── koa-static-server-simple    //      koa原生静态资源服务器
│       ├── koa-test                    //      单元测试
│       ├── koa-upload-async            //      异步上传图片
│       ├── koa-upload-simple-busboy    //      使用busboy实现简单的文件上传
│       ├── koa-views                   //      koa加载模板引擎ejs
│       ├── mysql-hello                 //      连接mysql简单demo
│       ├── mysql-init                  //      初始化mysql数据库
│       ├── mysql-pool                  //      mysql连接池
│       └── mysql-promise               //      async/await封装mysql
├── node_modules
├── .gitignore
├── package.json
├── README.md
└── yarn.lock
```


## 功能模块
- [ ] 用户登录
- [ ] 用户管理
- [ ] 权限管理
- [ ] 附件上传

## 接口文档

> 返回值格式
```
// 成功
{
    status: true,
    data: '成功数据'
}
// 失败
{
    status: false,
    data: '失败原因'
}
```

### 1. 注册
**请求方式：** `POST` \
**接口：** `/user/register` \
**参数：** 
```
{
    name: 'user111',
    password: 'password',
    email: 'suninfo@suninfo.com',
    sex: 'male/female/nuknow',
    remark: '备注',
    group: 'groupID'
}
```
**成功返回值：** 
```
{
    status: true,
    data: '注册成功'
}
```


### 2. 登录
**请求方式：** `POST` \
**接口：** `/user/login` \
**参数：** 
```
{
    email: 'suninfo@suninfo.com',
    password: 'password'
}
```
**成功返回值：** 
```
{
    status: true,
    data: '登录成功'
}
```


### 更改密码
**请求方式：** `POST` \
**接口：** `/user/changPassword` \
**参数：** 
```
{
    password: 'newPassword',
    email: 'newSuninfo@suninfo.com'
}
```
**成功返回值：** 
```
{
    status: true,
    data: '密码更改成功'
}
```


### 3. 本周周报（获取所有本周周报/新增/修改/删除）

#### 3.1 获取所有本周周报
**请求方式：** `GET` \
**接口：** `/report/currentWeekReport/get` \
**参数：** 
```
 无
```
**成功返回值：** 
```
{
    status: true,
    data: [
        {
            title: '',
            ...
        }
        ...
    ]
}
```

#### 3.2 新增
**请求方式：** `POST` \
**接口：** `/report/currentWeekReport/add` \
**参数：** 
```
 {
    title: '标题',
    summary: '内容',
    plan: '内容'
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '新增成功'
}
```

#### 3.3 修改
**请求方式：** `POST` \
**接口：** `、/report/currentWeekReport/edit` \
**参数：** 
```
 {
    id: '周报ID',
    title: '标题',
    summary: '内容',
    plan: '内容'
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '修改成功'
}
```

#### 3.4 删除/批量删除
**请求方式：** `POST` \
**接口：** `/report/currentWeekReport/delete` \
**参数：** 
```
 {
    idList： ['周报ID',...]
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '删除成功'
}
```

#### 3.4 提交周报（将本周周报中的一份提交至小组周报）
**请求方式：** `POST` \
**接口：** `/report/currentWeekReport/submit` \
**参数：** 
```
 {
    id：周报ID
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '提交成功'
}
```


### 4. 我的周报（获取周报（条件获取：年、第几周、是否已提交或所有）/获取周报详情/删除）

#### 4.1 获取我的周报
**请求方式：** `POST` \
**接口：** `/report/myReport/get` \
**参数：** 
```
 {
    ...
 }
```
**成功返回值：** 
```
{
    status: true,
    data: [
        {
            title: '',
            ...
        }
        ...
    ]
}
```

#### 4.2 删除/批量删除
**请求方式：** `POST` \
**接口：** `/report/myReport/delete` \
**参数：** 
```
 {
    idList: ['周报ID',...]
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '删除成功'
}
```


### 5. 已提交的周报

#### 5.1 获取当前用户所有已提交的周报
**请求方式：**`GET` \
**接口：**`/report/submitedReport/get` \
**参数：**
```
无
```
**成功返回值：** 
```
{
    status: true,
    data: [
        {
            title: '',
            ...
        }
        ...
    ]
}
```


### 6. 小组周报

#### 6.1 获取用户所在组所有已提交的周报
**请求方式：**`GET` \
**接口：**`/report/groupReport/get` \
**参数：**
```
无
```
**成功返回值：** 
```
{
    status: true,
    data: [
        {
            title: '',
            ...
        }
        ...
    ]
}
```


### 7. 小组管理（获取所有小组/添加小组/编辑小组/删除小组（空小组可删除）/搜索用户）

#### 7.1 获取所有小组
**请求方式：**`GET` \
**接口：**`/group/groupManage/get` \
**参数：**
```
无
```
**成功返回值：** 
```
{
    status: true,
    data: [
        id: ...
        name: ...
        ...
    ]
}
```

#### 7.2 添加小组
**请求方式：**`POST` \
**接口：**`/group/groupManage/add` \
**参数：**
```
{
    name: '组名',
    remark: '备注（小组信息）'
}
```
**成功返回值：** 
```
{
    status: true,
    data: '新增成功'
}
```

#### 7.3 编辑小组
**请求方式：**`POST` \
**接口：**`/group/groupManage/edit` \
**参数：**
```
{
    id: 小组ID,
    name: '小组名'
    remark: '备注（小组信息）'
}
```
**成功返回值：** 
```
{
    status: true,
    data: '编辑成功'
}
```

#### 7.4 删除小组（空小组可删除）
**请求方式：**`POST` \
**接口：**`/group/groupManage/delete` \
**参数：**
```
{
    idList: [id1, id2, ...]
}
```
**成功返回值：** 
```
{
    status: true,
    data: '删除成功'
}
```

#### 7.5 查看小组内所有成员
**请求方式：**`GET` \
**接口：**`/group/groupManage/getGroupMember` \
**参数：**
```
{
    id: 小组ID
}
```
**成功返回值：** 
```
{
    status: true,
    data: [{
            email: '',
            name: '',
            ...
        },...]
}
```

#### 7.6 删除组内人员
**请求方式：**`POST` \
**接口：**`/group/groupManage/deleteGroupMember` \
**参数：**
```
{
    idList: [id1, id2, ...]
}
```
**成功返回值：** 
```
{
    status: true,
    data: '删除成功'
}
```

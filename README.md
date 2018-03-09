# sunflower-note 周报管理平台-服务端文档

## 目录

* [结构树](#结构树)
* [功能模块](#功能模块)
* [接口文档](#接口文档)

## 结构树
```
.
├── index.js
├── common
│   └── utils
│       └── getMonday.js
├── config
│   └── default.js
├── controller
│   ├── group
│   │   ├── group.js
│   │   └── README.md
│   ├── report
│   │   ├── currentWeekReport.js
│   │   ├── groupReport.js
│   │   ├── myReport.js
│   │   └── README.md
│   └── user
│       ├── index.js
│       └── README.md
├── doc
│   └── sunflower-note.sql
├── lib
│   └── mysql.js
├── LICENSE
├── middlewares
│   ├── check.js
│   ├── logger.js
│   └── session.js
├── public
├── routers
│   ├── group.js
│   ├── index.js
│   ├── report.js
│   └── user.js
└── views

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
    name: 'user111',                    // 姓名
    sex: 'male/female/nuknow',          // 性别
    email: 'suninfo@suninfo.com',       // 邮箱/账号
    remark: '备注',                     // 备注/个人说明
    groupId: 'groupID',                 // 所属组的id
    password: 'password',               // 登录密码
}
```
**成功返回值：** 
```
{
    status: true,
    data: '注册成功'
}
```


### 2. 普通用户登录
**请求方式：** `POST` \
**接口：** `/user/login` \
**参数：** 
```
{
    email: 'suninfo@suninfo.com',           // 邮箱/账号
    password: 'password'                    // 密码
}
```
**成功返回值：** 
```
{
    status: true,
    data: '登录成功'
}
```

### 2. 管理员登录
**请求方式：** `POST` \
**接口：** `/user/adminLogin` \
**参数：**
```
{
    email: 'suninfo@suninfo.com',           // 管理员邮箱/账号
    password: 'password'                    // 密码
}
```
**成功返回值：**
```
{
    status: true,
    data: '登录成功'
}
```

### 2. 注销/退出系统
**请求方式：** `GET` \
**接口：** `/user/logOut` \
**参数：**
```
无
```
**成功返回值：**
```
{
    status: true,
    data: '系统已退出！'
}
```


### 获取用户信息
**请求方式：** `GET` \
**接口：** `/user/getUserInfo` \
**参数：**
```
无
```
**成功返回值：**
```
{
    status: true,
    data: [{
        email: 'suninfo@suninfo.com',       // 邮箱/账号
        name: 'name',                       // 姓名
        sex: 'male/female/unknow',          // 性别 male(男)/female(女)/unknow(保密)
        remark: '备注说明',                  // 备注说明
        groupId: 'groupId',                 // 所属组id
        groupName: 'name'                   // 所属组组名
    }]
}
```


### 更改密码
**请求方式：** `POST` \
**接口：** `/user/changePassword` \
**参数：** 
```
{
    oldPassword: 'oldPassword'                // 旧密码
    newPassword: 'newPassword'                // 要更改的新密码
}
```
**成功返回值：** 
```
{
    status: true,
    data: '密码更改成功'
}
```


### 更改个人信息（只支持更改个人姓名、性别、备注说明信息）
**请求方式：** `POST` \
**接口：** `/user/changUserInfo` \
**参数：**
```
{
    name: 'name'                        // 要更改的新密码
    sex: 'male/female/unknow',          // 性别 male(男)/female(女)/unknow(保密)
    remark: '备注说明'                   // 备注说明
}
```
**成功返回值：**
```
{
    status: true,
    data: '个人信息更改成功！'
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
            id: id,                                           // 周报id
            title: '标题',                                    // 周报标题
            summary: '上周总结',                              // 上周总结
            plan: '下周计划',                                 // 下周计划
            createTime: '2018-03-05 16:50:21',               // 创建时间
            lastUpdateTime '2018-03-05 16:50:21',            // 上次更新时间
            week: '2018-03-05',                              // 周报所属周的周一日期
            status: 'private/public',                        // 周报状态  private(隐私/未提交) public(公开/已提交)
            email: 'suninfo@suninfo.com'                     // 周报所属人员的email(邮箱/账号)
        },
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
    title: '标题',            // 标题
    summary: '内容',          // 本周总结
    plan: '内容'              // 下周计划
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
    id: '周报ID',           // 修改的周报id
    title: '标题',          // 标题
    summary: '内容',        // 本周总结
    plan: '内容'            // 下周计划
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
    idList： ['周报ID',...]        //删除的周报id列表
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '删除成功'
}
```

#### 3.4 提交周报（将本周周报中的一份提交至小组周报,一周只能提交一份）
**请求方式：** `POST` \
**接口：** `/report/currentWeekReport/submit` \
**参数：** 
```
 {
    id：周报ID         // 要提交的周报id
 }
```
**成功返回值：** 
```
{
    status: true,
    data: '提交成功'
}
```

#### 3.5 撤销已经提交的周报（取消提交）
**请求方式：** `POST` \
**接口：** `/report/currentWeekReport/cancelSubmit` \
**参数：**
```
 {
    id：周报ID         // 要撤销提交的周报id
 }
```
**成功返回值：**
```
{
    status: true,
    data: '提交撤销成功'
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
        {
            id: 12,
            name: "afs",
            memberNum: 5,   // 人员数
            remark: "dfsf",  // 备注
            createTime: "2018-02-28T07:33:09.000Z"
        }
    ]
}
```
**失败返回值：**
```
{
    status: false,
    data: '查询失败，请重试！'
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
**失败返回值：**
```
{
    status: true,
    data: '新增失败，请重试！'
}
```
或
```
{
    status: true,
    data: '小组名已存在！！'
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
**失败返回值：**
```
{
    status: true,
    data: '编辑失败，请重试！'
}
```
或
```
{
    status: true,
    data: '小组名已存在！'
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
**失败返回值：**
```
{
    status: true,
    data: '删除失败，请重试！'
}
```
或
```
{
    status: true,
    data: '小组人员不为空无法删除！'
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
        email: "huog@suninfo.com",
        name: "霍鸽",
        sex: "female",
        remark: "前端工程师",
        groupId: 12,  // 小组id
        password: "huog"
    }]
}
```

```
**失败返回值：**
```
{
    status: false,
    data: '查询小组成员失败，请重试！'
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

**失败返回值：**
```
{
    status: true,
    data: '删除失败，请重试！'
}

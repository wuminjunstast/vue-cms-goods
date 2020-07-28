import axios from 'axios'

// 获取树形菜单
let list = (data) => axios.get('/api/menu/tree', {params: data});

// 获取子菜单
let getMenu = (data) => axios.get('/api/menu/sub', {
    params: data
});

// 添加子菜单
let addMenu = (data) => axios.post('/api/menu', data);

// 更新子菜单
let updataMenu = (data) => axios.put(`/api/menu`, data);

// 删除子菜单
let removeMenu = (data) => axios.delete(`/api/menu`, { params: data });

// 获取图标
let iconList = (data) => axios.get('/api/admin/icon/list', { params: data });

// 设置子菜单的图标
let setIcon = (data) => axios.put(`/api/menu/icon`, data);


export default {
    list,
    getMenu,
    addMenu,
    updataMenu,
    removeMenu,
    iconList,
    setIcon,
}
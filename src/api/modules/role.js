import axios from 'axios'

// 获取权限角色列表
let list = (data) => axios.get('/api/role/list');

// 添加而角色
let add = (data) => axios.post('/api/role', data);

// 修改角色
let edit = (data) => axios.put(`/api/role`, data);

// 删除角色
let remove = (data) => axios.delete(`/api/role`, { params: data });

// 获取菜单配置项
let config = (data) => axios.get('/api/role/config', { params: data });

// 添加配置项
let addConfig = (data) => axios.post('/api/role/menu', data);

// 删除配置项
let removeConfig = (data) => axios.delete(`/api/role/menu`, { params: data });

export default {
    list,
    add,
    edit,
    remove,
    config,
    addConfig,
    removeConfig,
}
import axios from 'axios'

// 获取用户列表
let list = (data) => axios.get('/api/admin/list');

// 删除用户
let remove = (data) => axios.delete(`/api/admin`, { params: data });

// 删除图片
let removeImg = (data) => axios.delete(`/api/upload`, { params: data });



export default {
    list,
    remove,
    removeImg,
}
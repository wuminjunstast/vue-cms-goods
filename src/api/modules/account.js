import axios from 'axios'

// 登录账户
let login = (data) => axios.post('/api/admin/login', data);

// 注册账户
let register = (data) => axios.post('/api/admin/register', data);

// 获取管理员个人信息
let info = (data) => axios.get('/api/admin', {
    params: data
});

// 编辑管理员个人信息
let edit = (data) => axios.put(`/api/admin`, data);



export default {
    login,
    register,
    info,
    edit,
}
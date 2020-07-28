import axios from 'axios'

// 获取商品列表
let list = (data) => axios.get('/api/admin/goods/list', { params: data });

// 删除商品
let remove = (data) => axios.delete(`/api/admin/goods`, { params: data });

// 获取子级分类
let getCategory = (data) => axios.get('/api/category/sub', { params: data });

// 获取省份
let province = (data) => axios.get('/api/pcct/province');

// 获取市级
let city = (data) => axios.get('/api/pcct/city', {
    params: data
});

// 获取县区
let county = (data) => axios.get('/api/pcct/county', {
    params: data
});

// 获取商品详情
let detail = (data) => axios.get('/api/admin/goods', {
    params: data
});

// 获取所有树形分类
let allCategory = (data) => axios.get('/api/category/all');

// 添加子分类
let addCategory = (data) => axios.post('/api/category', data);

// 更新分类
let updataCategory = (data) => axios.put(`/api/category`, data);

// 删除分类
let removeCategory = (data) => axios.delete(`/api/category`, { params: data });

// 发布新商品
let release = (data) => axios.post('/api/admin/goods', data);

// 编辑商品
let edit = (data) => axios.put(`/api/admin/goods`, data);

// 发布新商品
let newGoods = (data) => axios.post('/api/admin/goods', data);




export default{
    list,
    remove,
    getCategory,
    province,
    city,
    county,
    detail,
    allCategory,
    addCategory,
    updataCategory,
    removeCategory,
    release,
    edit,
    newGoods,
}
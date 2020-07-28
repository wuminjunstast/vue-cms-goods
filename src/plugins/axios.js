import axios from 'axios'
// Loading 服务方式
import {
    Loading,
    Message
} from 'element-ui'
// 把路由实例导入，方便跳转路由
import router from '@/router/index'

// 声明一个变量，保存loading实例
let loading;

//设置默认的baseURL
axios.defaults.baseURL = 'http://localhost:3003';

// 添加请求拦截器,config是发送请求后服务器返回的数据
axios.interceptors.request.use(function (config) {

   // 开启loading
   loading = Loading.service({
       background: 'rgba(0,0,0,.3)'
   });
    // console.log(config);
    
    // 排除登录和注册，不需要携带token 
    if (config.url == '/api/admin/register' || config.url == '/api/admin/login') return config;

    // 获取已保存的token
    let token = sessionStorage.token;

    // 若token为空,网址复制给别人的非法进入胡情况
    if (!token) {
        Message.error('无效的token，请重新登录！');
        // 进入页面一秒后跳转到登录页，并关闭加载中
        setInterval(() => {
            router.replace('/login');
            loading.close();
        }, 1000);
    }

    // 若token不为空
    config.headers.Authorization = `Bearer ${token}`;
    
    return config;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function ({
    data,
    status
}) {

    // 关闭loading
    loading.close();

    return data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
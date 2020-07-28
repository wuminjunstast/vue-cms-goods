import axios from 'axios'

// 获取所有用户胡订单
let list = (data) => axios.get('/api/admin/order/list', { params: data });

export default{
    list,
}
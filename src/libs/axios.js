import axios from 'axios'
import store from '@/store'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJwYXNzd29yZCI6IjMzNTQxMCIsImhvc3QiOiIxNzIuMjAuMzYuNTMiLCJyZW1lbWJlck1lIjpmYWxzZSwiZXhwIjoxNTQ5ODcyMzg2LCJ1c2VySWQiOiIyYzkxODQ4YzY4NTE4N2M3MDE2ODU1NjQ1OTFiMDAxNCIsIlNFQ1JFVCI6ImEzOWE3NGFmZTcxMjQwYTU5NDJhZjA5NTQ2YjRmOGJkIiwidXNlcm5hbWUiOiIwMjU1In0.g19s0H5hi746E4PVHP7nKyiECCGxsK4AIOOymBFjNjNT_h5d4ej9E7ndUqvAnYqOdvF4Ym6nfz11Y3s0fV-qQw'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest

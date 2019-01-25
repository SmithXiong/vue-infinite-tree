import axios from 'axios'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'authorization': 'eyJhbGciOiJIUzUxMiJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsImhvc3QiOiIxNzIuMjAuMzYuNTMiLCJyZW1lbWJlck1lIjpmYWxzZSwiZXhwIjoxNTUwNDU0ODIxLCJ1c2VySWQiOiIyYzkxZDU5MzY0OGQ3OTU1MDE2NDkxNmE1MzI5MDAwMCIsIlNFQ1JFVCI6IjczZDQyOTBlN2FmODQ1ZGJhOTVmYjRmNGRlYjJmNDRjIiwidXNlcm5hbWUiOiJsaXhuIn0.hKyNRvPy2IbmrUND0EAt-rNsgIfjJjNVLE2YotGEJ1kM6eV1P7u0YQktk_1JID9LKj4nUskN4TUD46xQ3eNGJA'
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
      console.error(errorInfo)
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

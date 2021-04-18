import axios from 'axios'

export function request(config?: object) {
  const inst = axios.create({
    baseURL: 'https://api.github.com',
    headers: { accept: 'application/vnd.github.v3+json' }
  });
  return inst;
}

export default request();

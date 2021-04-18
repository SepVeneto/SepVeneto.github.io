import request from '@/utils/request';

export function getRepo() {
  return request({
    url: '/repos/SepVeneto/SepVeneto.github.io/contents?ref=articles',
    method: 'get',
  })
}

export function getDetail(name: string) {
  return request({
    headers: {
      accept: 'application/vnd.github.VERSION.html'
    },
    url: `/repos/SepVeneto/SepVeneto.github.io/contents/${name}?ref=articles`,
    method: 'get',
  })
}

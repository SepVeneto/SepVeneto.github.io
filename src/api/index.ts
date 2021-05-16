import request from '@/utils/request';

export function getUserInfo() {
  return request({
    url: '/users/SepVeneto',
    method: 'get',
  })
}

export function getRepo() {
  return request({
    url: '/repos/SepVeneto/SepVeneto.github.io/issues?creator=SepVeneto',
    method: 'get',
  })
}

export function getDetail(issuesNumber: string) {
  return request({
    url: `/repos/SepVeneto/SepVeneto.github.io/issues/${issuesNumber}`,
    method: 'get',
  })
}

export function markdown2html(text: string) {
  return request({
    url: '/markdown',
    method: 'post',
    data: {
      text,
    }
  })
}

import request from '@/utils/request';

export function getRepo() {
  return request({
    url: '/users/SepVeneto/repos',
    method: 'get',
  })
}

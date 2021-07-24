import { createStore } from 'vuex';
import * as apis from '@/api';

export type State = {
  articles: Array<unknown>,
  userInfo: Record<string, unknown>,
}

const store = createStore<State>({
  state() {
    return {
      userInfo: {},
      articles: [],
    }
  },
  mutations: {
    updateInfo(state, info) {
      state.userInfo = info;
    },
    updateArticles(state, list) {
      state.articles = list;
    }
  },
  actions: {
    updateInfo(context) {
      apis.getUserInfo().then(({ data }) => {
        context.commit('updateInfo', data);
      })
    },
    updateArticles(context) {
      apis.getRepo().then(data => {
        const list = data.data as [];
        context.commit('updateArticles', list);
      })
    }
  }
})

export default store;

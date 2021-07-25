import { createStore } from 'vuex';
import * as apis from '@/api';

const store = createStore<State>({
  state() {
    return {
      userInfo: {},
      articles: [],
      categories: [],
    }
  },
  mutations: {
    updateInfo(state, info) {
      state.userInfo = info;
    },
    updateArticles(state, list) {
      state.articles = list;
    },
    updateCategories(state, data) {
      state.categories = data;
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
    },
    updateCategories(context) {
      apis.getCategories().then(({ data }) => {
        context.commit('updateCategories', data);
      })
    }
  }
})

export default store;

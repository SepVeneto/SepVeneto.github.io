import{g as e,f as a}from"./index.186f24b7.js";import{defineComponent as t,reactive as s,ref as i,pushScopeId as r,popScopeId as l,openBlock as o,createBlock as c,createVNode as d,Fragment as n,renderList as u,toDisplayString as m,withScopeId as p}from"vue";import{useRouter as v}from"vue-router";var f=t({name:"Home",setup(){const t=v(),r=s([]),l=i();return e().then((e=>{r.push(...e.data)})),{repoList:r,handleClick:function(e){t.push({path:"detail",query:{issuesNumber:e.number}})},detail:l,formatTime:a}}});const h=p("data-v-3151b979");r("data-v-3151b979");const b={class:"home-container"},k={class:"article-list"},C=d("aside",{class:"right-aside"},[d("div",{class:"card"},"最近"),d("div",{class:"card"},"档案")],-1);l();const _=h(((e,a,t,s,i,r)=>(o(),c("section",b,[d("ul",k,[(o(!0),c(n,null,u(e.repoList,(a=>(o(),c("li",{key:a.id,class:"card",onClick:t=>e.handleClick(a)},[d("div",null,m(e.formatTime(a.created_at)),1),d("div",null,m(a.title),1)],8,["onClick"])))),128))]),C]))));f.render=_,f.__scopeId="data-v-3151b979";export default f;
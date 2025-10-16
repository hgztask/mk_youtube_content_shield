import Vue from "vue";
import App from "./App.vue";

function initVueApp(el, App, props = {}) {
    return new Vue({
        render: h => h(App, {props})
    }).$mount(el);
}

const init = () => {
    if (document.head.querySelector('#element-ui-css') === null) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css'
        linkElement.id = 'element-ui-css'
        document.head.appendChild(linkElement)
        linkElement.addEventListener('load', () => {
            console.log('element-ui样式加载完成')
        })
    }
    const parentEl = document.createElement('div');
    const vueDiv = document.createElement('div');
    parentEl.appendChild(vueDiv);
    document.body.appendChild(parentEl)
    window.mk_vue_app = initVueApp(vueDiv, App);
    console.log('注入演示')
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `.v-modal{
    z-index: auto !important;
}`
    document.head.appendChild(styleEl)
}

export default {init}


export const returnTempVal = {state: false}

try {
    unsafeWindow['mk_win'] = window;
} catch (e) {
    console.warn('挂载脚本window环境到前端环境失败', e);
}

//Promise.resolve()
export const promiseResolve = Promise.resolve();

//Promise.reject()
export const promiseReject = Promise.reject();


export default {
    //加群链接_qq
    group_url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632',
    //作者B站链接
    b_url: 'https://space.bilibili.com/473239155',
    //当前脚本所在脚本猫地址
    scriptCat_js_url: 'https://scriptcat.org/zh-CN/script-show-page/4488',
    //脚本开源地址
    github_url: 'https://github.com/hgztask/mk_youtube_content_shield'
}

import {eventEmitter} from "./model/EventEmitter.js";


GM_registerMenuCommand('打开/关闭屏蔽器', () => {
    eventEmitter.send('event-drawer-show', null);
})

import gmUtil from "./utils/gmUtil.js";
import {eventEmitter} from "./model/EventEmitter.js";


gmUtil.addGMMenu('打开/关闭屏蔽器', () => {
    eventEmitter.send('event-drawer-show', null);
})

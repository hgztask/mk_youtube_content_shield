import {eventEmitter} from "./EventEmitter.js";
import ruleUtil from "../utils/ruleUtil.js";
import gmUtil from "../utils/gmUtil.js";

eventEmitter.on('event:mask_options_dialog_box', (data) => {
    const {userId, channelId, userName, videoId, userNameList} = data;
    const showList = []
    if (userId) {
        showList.push({label: `用户id精确屏蔽=${userId}`, value: 'userId_precise'})
        showList.push({label: '新标签跳转到用户主页', value: 'to_userId_precise'})
    }
    if (channelId) {
        showList.push({label: `频道id精确屏蔽=${channelId}`, value: 'channelId_precise'});
        showList.push({label: '新标签跳转到频道主页', value: 'to_channelId_precise'})
    }
    if (userName) {
        showList.push({label: `用户名精确屏蔽=${userName}`, value: 'username_precise'});
    }
    if (userNameList) {
        for (const n of userNameList) {
            showList.push({label: `用户名模糊屏蔽=${n}`, value: 'username_precise'})
        }
    }
    if (videoId) {
        showList.push({label: `视频id精确屏蔽=${videoId}`, value: 'videoId_precise'});
        showList.push({label: '新标签跳转到视频主页', value: 'to_videoId_precise'})
    }
    if (userId && userName) {
        showList.push({label: `用户Id关联用户名屏蔽=${userId}|${userName}`, value: 'userIdAndUserName'})
    }
    if (userId && channelId) {
        showList.push({label: `用户Id关联频道Id屏蔽=${userId}|${channelId}`, value: 'userIdAndChannelId'})
    }
    if (userName && channelId) {
        showList.push({label: `用户名关联频道Id屏蔽=${userName}|${channelId}`, value: 'userNameAndChannelId'})
    }
    eventEmitter.send('sheet-dialog', {
        title: "屏蔽选项",
        list: showList,
        optionsClick: (item) => {
            const {value} = item
            let results;
            if (value === 'videoId_precise') {
                results = ruleUtil.addRule(videoId, value);
            } else if (value === 'userId_precise') {
                results = ruleUtil.addRule(userId, value);
            } else if (value === 'username_precise') {
                results = ruleUtil.addRule(userName, value);
            } else if (value === 'to_userId_precise') {
                gmUtil.openInTab('https://www.youtube.com/' + userId);
            } else if (value === 'to_videoId_precise') {
                gmUtil.openInTab('https://www.youtube.com/watch?v=' + videoId);
            } else if (value === 'to_channelId_precise') {
                gmUtil.openInTab('https://www.youtube.com/' + channelId);
            } else if (value === 'userIdAndUserName') {
                results = ruleUtil.addRelationRule('userId_username', `${userName}|${userName}`);
            } else if (value === 'userIdAndChannelId') {
                results = ruleUtil.addRelationRule('userId_channelId', `${userId}|${channelId}`)
            } else if (value === 'userNameAndChannelId') {
                results = ruleUtil.addRelationRule('username_channelId', `${userName}|${channelId}`)
            } else {
                eventEmitter.send('el-msg', "出现意外的选项值");
                return
            }
            if (results) {
                const msg = results.res ? results.res : results.msg;
                eventEmitter.send('el-msg', msg).emit('event:刷新规则信息', false)
            }
        }
    })
})

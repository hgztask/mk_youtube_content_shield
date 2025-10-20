/**
 * 将时间字符串转换为秒，如果时间字符串为空，则返回 -1
 * @param timeStr {string}
 * @returns number
 */
const timeStringToSeconds = (timeStr) => {
    if (!timeStr) {
        return -1
    }
    // 按冒号分割字符串
    const parts = timeStr.split(':');
    // 根据冒号的数量决定如何转换
    switch (parts.length) {
        case 1: // 只有秒
            return Number(parts[0]);
        case 2: // 分钟和秒
            return Number(parts[0]) * 60 + Number(parts[1]);
        case 3: // 小时、分钟和秒
            return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
        default:
            throw new Error('Invalid time format');
    }
}

/**
 * 解析播放量或转字符串数字为整数
 * @param viewTxt
 * @returns {number}
 */
const parseView = (viewTxt) => {
    const ViewIntStr = viewTxt.replace(/[^0-9]/g, '');
    if (viewTxt.endsWith('万次观看') || viewTxt.endsWith('万人正在观看')) {
        return parseInt(ViewIntStr) * 10000;
    } else {
        return parseInt(ViewIntStr);
    }
}

//获取合辑用户名组
const getCompilationUserNames = (namesStr) => {
    if (namesStr === null || namesStr === undefined || namesStr === '') return null;
    const userNameList = [];
    for (const name of namesStr.split('、')) {
        if (name.endsWith('等')) {
            userNameList.push(name.substring(0, name.length - 1));
        } else {
            userNameList.push(name);
        }
    }
    return userNameList;
}

export default {
    timeStringToSeconds, parseView, getCompilationUserNames
}
import gmUtil from "./gmUtil.js";
import {eventEmitter} from "../model/EventEmitter.js";

/**
 *验证输入框的值
 * @param ruleValue 规则的实际值
 * @returns {{status: boolean, res: string}} 返回验证结果
 */
const verificationInputValue = (ruleValue) => {
    if (ruleValue === null) return {status: false, res: '内容不能为空'};
        ruleValue.trim();
    if (ruleValue === '') {
        return {status: false, res: '内容不能为空'};
    }
    return {status: true, res: ruleValue};
}

/**
 * 添加规则
 * @param ruleValue {string|number} 规则的实际值
 * @param type {string} 类型
 */
const addRule = (ruleValue, type) => {
    const verificationRes = verificationInputValue(ruleValue);
    if (!verificationRes.status) {
        return verificationRes
    }
    const arr = gmUtil.getData(type, []);
    if (arr.includes(verificationRes.res)) {
        return {status: false, res: '已存在此内容'};
    }
    arr.push(verificationRes.res);
    gmUtil.setData(type, arr);
    return {status: true, res: '添加成功'};
}

/**
 * 批量添加指定类型
 * @param ruleValues {[string]}
 * @param type {string}
 * @returns {{successList: [string], failList: [string]}}
 */
const batchAddRule = (ruleValues, type) => {
    const successList = [];
    const failList = [];
    const arr = gmUtil.getData(type, []);
    for (const v of ruleValues) {
        if (arr.includes(v)) {
            failList.push(v);
            continue;
        }
        arr.push(v);
        successList.push(v);
    }
    if (successList.length > 0) {
        gmUtil.setData(type, arr);
    }
    return {
        successList,
        failList
    }
}

/**
 * 查找规则项，返回匹配的值，如果找不到则返回null
 * @param type {string}
 * @param value {string|number}
 * @returns {number|string|null}
 */
const findRuleItemValue = (type, value) => {
    return gmUtil.getData(type, []).find(item => item === value) || null
}

/**
 * 删除单个规则值
 * @param type {string}
 * @param value {string|number}
 * @returns {{status: boolean, res: (string|number)}|{res: string, status: boolean}}
 */
const delRule = (type, value) => {
    const verificationRes = verificationInputValue(value);
    if (!verificationRes.status) {
        return verificationRes
    }
    const {res} = verificationRes
    const arr = gmUtil.getData(type, []);
    const indexOf = arr.indexOf(res);
    if (indexOf === -1) {
        return {status: false, res: '不存在此内容'};
    }
    arr.splice(indexOf, 1);
    gmUtil.setData(type, arr);
    return {status: true, res: "移除成功"}
}

/**
 * 删除规则对话框
 * @param type {string}
 * @returns {null}
 */
const showDelRuleInput = async (type) => {
    let ruleValue;
    try {
        const {value} = await eventEmitter.invoke('el-prompt', '请输入要删除的规则内容', '删除指定规则');
        ruleValue = value
    } catch (e) {
        return
    }
    const {status, res} = delRule(type, ruleValue)
    eventEmitter.send('el-msg', res)
    // status && eventEmitter.send('刷新规则信息');
}

export default {
    batchAddRule,addRule,
    findRuleItemValue,
    showDelRuleInput
}

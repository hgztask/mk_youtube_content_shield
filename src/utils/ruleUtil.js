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

/**
 * 添加关联规则
 * @param type {string}
 * @param fragment {string}
 */
const addRelationRule = (type, fragment) => {
    const fragmentsSplit = fragment.split('|');
    if (fragmentsSplit.length !== 2 || fragmentsSplit.some(item => item.trim() === '')) {
        return {status: false, msg: '非法的关联规则，只要求一个|，或内容不可为空，请检查输入'}
    }
    const gmData = gmUtil.getData(type, []);
    if (gmData.length === 0) {
        gmData.push(fragment);
        gmUtil.setData(type, gmData);
        return {status: true, msg: '添加成功'}
    }
    const [fragmentsOneV, fragmentsTwoV] = fragmentsSplit;
    for (const item of gmData) {
        const [itemOneV, itemTwoV] = item.split('|');
        if ((itemOneV === fragmentsOneV && itemTwoV === fragmentsTwoV) ||
            (itemTwoV === fragmentsOneV && itemOneV === fragmentsTwoV)
        ) {
            return {status: false, msg: '已存在此关联规则'}
        }
    }
    gmData.push(fragment);
    gmUtil.setData(type, gmData);
    return {status: true, msg: '添加成功'}
}
/**
 * 批量添加关联规则
 * @param type {string}
 * @param fragments {[string]}
 */
const batchAddRelationRule = (type, fragments) => {
    const successList = [];
    const failList = [];
    const gmData = gmUtil.getData(type, []);
    for (let fragment of fragments) {
        const fragmentsSplit = fragment.split('|');
        if (fragmentsSplit.length !== 2 || fragmentsSplit.some(item => item.trim() === '')) {
            failList.push({fragment, msg: '非法的关联规则，只要求一个|，或内容不可为空，请检查输入'});
            continue
        }
        if (gmData.length === 0) {
            gmData.push(fragment);
            successList.push(fragment);
            continue
        }
        const [fragmentsOneV, fragmentsTwoV] = fragmentsSplit;
        const exists = gmData.some(item => {
            const [itemOneV, itemTwoV] = item.split('|');
            const b = item === fragment || (itemTwoV === fragmentsOneV && itemOneV === fragmentsTwoV);
            if (b) failList.push({fragment, msg: '已存在此关联规则'});
            return b;
        })
        if (exists) {
            continue
        }
        gmData.push(fragment);
        successList.push(fragment);
    }
    if (successList.length > 0) {
        gmUtil.setData(type, gmData);
    }
    return {successList, failList}
}


export default {
    batchAddRule, addRule, addRelationRule, batchAddRelationRule,
    findRuleItemValue,
    showDelRuleInput
}

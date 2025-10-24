import {returnTempVal} from "../data/globalValue.js";
import ruleMatchingUtil from "../utils/ruleMatchingUtil.js";


/**
 * 执行精确、模糊和正则匹配的通用屏蔽检查函数
 * 根据提供的配置项依次执行三种类型的匹配检查，优先级为：精确 > 模糊 > 正则
 * @param val {string} 待匹配的字符串值
 * @param config {{}} 配置项对象
 * @param config.exactKey {string} 精确匹配规则在存储中的键名
 * @param config.exactTypeName {string} 精确匹配类型的显示名称
 * @param [config.exactRuleArr] {string[]|number[]} 精确匹配规则数组（可选，若未提供则通过exactKey从存储获取）
 * @param config.fuzzyKey {string} 模糊匹配规则在存储中的键名
 * @param config.fuzzyTypeName {string} 模糊匹配类型的显示名称
 * @param [config.fuzzyRuleArr] {string[]} 模糊匹配规则数组（可选，若未提供则通过fuzzyKey从存储获取）
 * @param config.regexKey {string} 正则匹配规则在存储中的键名
 * @param config.regexTypeName {string} 正则匹配类型的显示名称
 * @param [config.regexRuleArr] {string[]} 正则匹配规则数组（可选，若未提供则通过regexKey从存储获取）
 * @returns {{state: boolean, type: string, matching: string}|any}
 *          匹配成功返回包含状态、匹配类型和匹配值的对象；
 *          无匹配时返回returnTempVal（预定义的默认返回值对象）
 */
const blockExactAndFuzzyMatching = (val, config) => {
    if (!val) {
        return returnTempVal
    }
    const {
        exactKey, exactTypeName,
        exactRuleArr = GM_getValue(exactKey, [])
    } = config;
    if (exactKey) {
        if (ruleMatchingUtil.exactMatch(exactRuleArr, val)) {
            return {state: true, type: exactTypeName, matching: val}
        }
    }
    let matching;
    const {
        fuzzyKey, fuzzyTypeName,
        fuzzyRuleArr = GM_getValue(fuzzyKey, []),
    } = config;
    if (fuzzyKey) {
        matching = ruleMatchingUtil.fuzzyMatch(fuzzyRuleArr, val);
        if (matching) {
            return {state: true, type: fuzzyTypeName, matching}
        }
    }
    const {
        regexKey, regexTypeName,
        regexRuleArr = GM_getValue(regexKey, [])
    } = config;
    if (regexKey) {
        matching = ruleMatchingUtil.regexMatch(regexRuleArr, val);
        if (matching) {
            return {state: true, type: regexTypeName, matching}
        }
    }
    return returnTempVal
}

//根据用户名检查屏蔽
export const blockUserName = (name) => {
    return blockExactAndFuzzyMatching(name, {
        exactKey: 'username_precise', exactTypeName: '精确用户名', fuzzyKey: 'username', fuzzyTypeName: '模糊用户名',
        regexKey: 'username_regex', regexTypeName: '正则用户名'
    })
}

//根据用户id检查屏蔽
export const blockUserId = (id) => {
    if (ruleMatchingUtil.exactMatch(GM_getValue('userId_precise', []), id)) {
        return {state: true, type: '精确用户id', matching: id};
    }
    return returnTempVal;
}


export default {blockExactAndFuzzyMatching}
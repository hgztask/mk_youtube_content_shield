/**
 * 精确匹配
 * @param ruleList {[]} 规则列表
 * @param value {string|number} 要匹配的值
 * @returns {boolean}
 */
const exactMatch = (ruleList, value) => {
    if (ruleList === null || ruleList === undefined) return false;
    if (!Array.isArray(ruleList)) return false
    return ruleList.some(item => item === value);
}

/**
 * 正则匹配，匹配上则返回规则列表中的规则，反之返回null
 * @param ruleList {[]} 规则列表
 * @param value {string} 要匹配的值
 * @return {string|null}
 */
const regexMatch = (ruleList, value) => {
    if (ruleList === null || ruleList === undefined) return null;
    if (!Array.isArray(ruleList)) return null
    const find = ruleList.find(item => {
        try {
            return value.search(item) !== -1;
        } catch (e) {
            return false;
        }
    });
    return find === undefined ? null : find;
}

/**
 * 模糊匹配，匹配上则返回规则列表中的规则，反之返回null
 * @param ruleList {[string]} 规则列表
 * @param value {string} 要匹配的值
 * @return {string|null}
 */
const fuzzyMatch = (ruleList, value) => {
    if (ruleList === null || ruleList === undefined || value === null) return null;
    if (!Array.isArray(ruleList)) return null
    const find = ruleList.find(item => value.includes(item));
    return find === undefined ? null : find;
}

/**
 * 匹配方式
 */
export default {
    exactMatch,
    regexMatch,
    fuzzyMatch
}






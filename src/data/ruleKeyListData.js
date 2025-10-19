import ruleKeyListDataJson from '../res/ruleKeyListDataJson.json'

//获取选项
const getSelectOptions = () => {
    const options = [
        {
            value: '模糊匹配',
            label: '模糊匹配',
            children: []
        },
        {
            value: '正则匹配',
            label: '正则匹配',
            children: []
        },
        {
            value: '精确匹配',
            label: '精确匹配',
            children: []
        },
        {
            value: '关联匹配',
            label: '关联匹配',
            children: []
        }
    ]
    for (const {name, key, pattern} of ruleKeyListDataJson) {
        switch (pattern) {
            case '模糊':
                options[0].children.push({value: key, label: name, pattern})
                break;
            case '正则':
                options[1].children.push({value: key, label: name, pattern})
                break;
            case '精确':
                options[2].children.push({value: key, label: name, pattern});
                break;
            case '关联':
                options[3].children.push({value: key, label: name, pattern});
                break;
        }
    }
    return options
}


export default {
    getSelectOptions
}



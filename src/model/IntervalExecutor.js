//间隔执行器
export class IntervalExecutor {
    #interval = null;
    /**
     * @param func {function} 异步执行函数
     */
    #func;
    #config;


    /**
     * 创建间隔执行器
     * @param func {function} 异步执行函数
     * @param config {{}} 配置项
     * @param config.timeout {number} 间隔时间
     */
    constructor(func, config = {}) {
        const defConfig = {
            timeout: 2000, processTips: false, IntervalName: '默认'
        }
        this.#config = Object.assign(defConfig, config);
        this.#func = func;
    }

    stop(msg = null) {
        const i = this.#interval;
        if (i === null) return;
        clearInterval(i);
        this.#interval = null;
        const processTips = this.#config.processTips;
        if (msg) {
            console.log(msg);
        }
        if (processTips) {
            console.log(`stop:${this.#config.IntervalName}间隔执行器`)
        }
    }

    start() {
        if (this.#interval !== null) return;
        this.#interval = setInterval(this.#func, this.#config.timeout);
        const processTips = this.#config.processTips;
        if (processTips) {
            console.log(`start:${this.#config.IntervalName}间隔执行器`)
        }
    }

    setTimeout(timeout) {
        this.#config.timeout = timeout;
    }
}
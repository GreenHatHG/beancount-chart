import {exec} from 'child_process'
import * as fs from 'fs'
import * as CSV from 'csv-string'

function runCommand(command: string, timeout: number): Promise<string>{
    return new Promise((resolve, reject) => {
        exec(command, { timeout }, (error, stdout) => {
            if (error) {
                if (error.signal === 'SIGTERM') {
                    reject(new Error(`nodejs child_process failed due to timeout(${timeout} ms)`));
                } else {
                    reject(new Error(`nodejs child_process failed: ${error.message}`));
                }
            } else {
                resolve(stdout);
            }
        })
    })
}

class QueryResult{
    date: string;
    account: string;
    position: number; //cost
    payee: string;
    narration: string; //comment

    constructor(date: string, account: string, position: number, payee: string, narration: string) {
        this.date = date;
        this.account = account;
        this.position = position;
        this.payee = payee;
        this.narration = narration;
    }
}

function buildQueryResult(output: string): Array<QueryResult>{
    let parsedCsv = CSV.parse(output);
    parsedCsv.shift()
    return parsedCsv.map(row => {
        row = row.map(str => str.trim())
        const position = parseFloat(row[2].split(" ")[0])
        return new QueryResult(row[0], row[1], position, row[3], row[4])
    })
}

function expenseAccountSum(queryResult: Array<QueryResult>): Map<string, string>{
    let accountSumMap = new Map(); //key: account, value: position sum
    queryResult.forEach(item => {
        if(!accountSumMap.has(item.account)){
            accountSumMap.set(item.account, 0)
        }
        accountSumMap.set(item.account, accountSumMap.get(item.account) + item.position)
    })
    accountSumMap.forEach((v, k) => accountSumMap.set(k, v.toFixed(2)))
    return accountSumMap
}

function toValueNameArrayAndSave(map: Map<string, string>){
    const keyValueArray = Array.from(map.entries())
    const objectArray = keyValueArray.map(([k, v]) => ({value: v, name: k}))
    saveToJsonFile('accountSum', objectArray)
}

function saveToJsonFile(key: string, value: Object){
    const json = JSON.stringify({[key]: value})
    fs.writeFileSync('public/data.json', json,  {encoding: "utf8"})
}

function buildQueryCommand(): string {
    const baseCommand = `~/.local/bin/bean-query -f csv /home/cc/beancount/main.bean`
    const bql = `"select date, account, position, payee, narration where account ~ 'Expenses' and month = 11"`
    return baseCommand + " " + bql
}

const timeout = 10 * 1000

const beanQueryCommand = buildQueryCommand()
runCommand(beanQueryCommand, timeout)
    .then((result) => {
        const queryResult = buildQueryResult(result)
        let map = expenseAccountSum(queryResult)
        toValueNameArrayAndSave(map)
    })

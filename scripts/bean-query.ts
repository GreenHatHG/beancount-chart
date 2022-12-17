import {exec} from 'child_process'
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
    position: string; //cost
    payee: string;
    narration: string; //comment

    constructor(date: string, account: string, position: string, payee: string, narration: string) {
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
        const position = row[2].split(" ")[0]
        return new QueryResult(row[0], row[1], position, row[3], row[4])
    })
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
        const a = buildQueryResult(result)
        console.log(a)
    })

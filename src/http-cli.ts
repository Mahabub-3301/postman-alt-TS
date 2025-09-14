#!/usr/bin/env node
//http-cli.ts

import inquirer from "inquirer";
import axios from "axios";
import chalk from "chalk";

const url = process.argv[2];

if(!url) {
    console.log(chalk.red("❌ Please provide a URL as the first argument."));
    process.exit(1);
}

async function main() {
    const {method} = await inquirer.prompt([
        {
            type: "list",
            name: "method",
            message: "Select HTTP method",
            choices: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        },
    ]);

    let data: any = undefined;

    if(["POST", "PUT", "PATCH"].includes(method)) {
        const { body } = await inquirer.prompt([
            {
                type: "editor",
                name: "body",
                message: "Enter JSON body",
            },
        ]);
        try {
            data = JSON.parse(body);
        }catch (err) {
            console.log(chalk.red("❌ Invalid JSON body."));
            process.exit(1);
        }
    }
    try {
        const response = await axios({
            method,
            url,
            data,
        });
        
        console.log(chalk.green.bold(`\n✅ ${response.status} ${response.statusText}\n`));

        console.log(chalk.yellow("Headers: "));
        console.dir(response.headers, {depth: null});

        console.log(chalk.blue("\nBody: "));
        console.dir(response.data, { depth: null });

    } catch (err: any) {
        if (err.response) {
            console.log(chalk.red(`\n❌ ${err.response.status} ${err.response.statusText}`));
            console.dir(err.response.data, { depth: null });
        } else {
            console.error(chalk.red("❌ Request failed:"), err.message);
        }
    }
}

main();

#!/usr/bin/env node
"use strict";
//http-cli.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const url = process.argv[2];
if (!url) {
    console.log(chalk_1.default.red("❌ Please provide a URL as the first argument."));
    process.exit(1);
}
async function main() {
    const { method } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "method",
            message: "Select HTTP method",
            choices: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        },
    ]);
    let data = undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
        const { body } = await inquirer_1.default.prompt([
            {
                type: "editor",
                name: "body",
                message: "Enter JSON body",
            },
        ]);
        try {
            data = JSON.parse(body);
        }
        catch (err) {
            console.log(chalk_1.default.red("❌ Invalid JSON body."));
            process.exit(1);
        }
    }
    try {
        const response = await (0, axios_1.default)({
            method,
            url,
            data,
        });
        console.log(chalk_1.default.green.bold(`\n✅ ${response.status} ${response.statusText}\n`));
        console.log(chalk_1.default.yellow("Headers: "));
        console.dir(response.headers, { depth: null });
        console.log(chalk_1.default.blue("\nBody: "));
        console.dir(response.data, { depth: null });
    }
    catch (err) {
        if (err.response) {
            console.log(chalk_1.default.red(`\n❌ ${err.response.status} ${err.response.statusText}`));
            console.dir(err.response.data, { depth: null });
        }
        else {
            console.error(chalk_1.default.red("❌ Request failed:"), err.message);
        }
    }
}
main();

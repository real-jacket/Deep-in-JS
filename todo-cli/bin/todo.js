#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const { add, clear, list } = require('..')

program
    .option('-t, --test', 'console.log what you want')

program
    .command('add <taskName>')
    .description('add a task')
    .action((...args) => {
        add(args[0])
    })

program
    .command('list')
    .description("list all task")
    .action(() => {
        list()
    })

program
    .command('clear')
    .description("clear all task")
    .action(() => {
        clear()
    })

program.parse(process.args)
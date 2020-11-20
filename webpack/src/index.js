// import _ from 'lodash';
import sleep from './utils/sleep.js';
import content from './utils/lgc.lgc';

console.log('content', content);
console.log('time1', Date.now());
sleep().then(() => {
    console.log('time2', Date.now());
});
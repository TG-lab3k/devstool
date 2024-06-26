import "./style_index.css"
import "./style_theme.css"

const FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss';
const FORMAT_WITH_MILLIS_DEFAULT = 'YYYY-MM-DD HH:mm:ss.SSS';
const timestamp_Unit_SECONDS = 1;
const timestamp_Unit_MILLIS = 2;
import { initializeApp } from "firebase/app";
import { getAnalytics,logEvent } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBOUPQrHb15-5BgI_Bcp6d8tUvPWtQL6bg",
    authDomain: "devstool-14e07.firebaseapp.com",
    projectId: "devstool-14e07",
    storageBucket: "devstool-14e07.appspot.com",
    messagingSenderId: "128673254801",
    appId: "1:128673254801:web:8efb1a89470116a73c5e30",
    measurementId: "G-ZTCD49ZXM4"
  };
  
  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const googleAnalytics = getAnalytics(firebaseApp);

const logGAEvent = (eventName) => {
    logEvent(googleAnalytics, eventName);
}

function updateCurrentTime(){
    var currentTimeSpan = document.querySelector('.current-timestamp');
    currentTimeSpan.innerText = getCurrentTimestampInSecond();
}

function getCurrentTimestampInSecond() {
    var currentTimeInMills = Date.now();
    return parseInt(currentTimeInMills / 1000);
}

function launchUpdateCurrentTime() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

function convertTimestampToGMT(timestamp, offset) {
    var date = new Date(timestamp);
    var localOffset = date.getTimezoneOffset();
    var targetOffset = offset * 60;
    var offsetDiff = targetOffset - localOffset;
    date.setTime(date.getTime() + offsetDiff * 60 * 1000);
    return date.getTime();
}

function parseGMTOffset(gmtOffsetStr) {
    var offset = parseFloat(gmtOffsetStr.replace("GMT", ""));
    return offset;
}

function getCurrentUtcOffset() {
    var now = new Date();
    var timezoneOffset = now.getTimezoneOffset();
    var offsetHours = timezoneOffset / 60;
    var sign = offsetHours >= 0 ? '-' : '+';

    var absOffsetHours = Math.abs(offsetHours);
    var paddedOffsetHours = ('0' + absOffsetHours).slice(-2);

    var utcOffset = sign + paddedOffsetHours;
    return utcOffset
}

function convertSecondsToGMT(seconds, format, offset) {
    var momentObj = moment.unix(seconds);
    var formattedTime = momentObj.utcOffset(offset).format(format);
    return formattedTime;
}

function convertMillisToGMT(millis, format, offset) {
    var momentObj = moment(millis);
    var formattedTime = momentObj.utcOffset(offset).format(format);
    return formattedTime;
}

function convertGMTToSeconds(datetime, format) {
    var momentObj = moment(datetime, format);
    var seconds = momentObj.unix();
    return seconds;
}

function convertGMTToMillis(datetime, format) {
    var momentObj = moment(datetime, format);
    var millis = momentObj.valueOf();
    return millis;
}
function convertSecondsToTime() {
    logGAEvent('click_convertSecondsToDatetime');
    convertTimestampToDatetime(timestamp_Unit_SECONDS);
}

function convertMillisToTime() {
    logGAEvent('click_convertMillisToDatetime');
    convertTimestampToDatetime(timestamp_Unit_MILLIS);
}

function convertTimestampToDatetime(timestampUnit) {
    var timestampInput = document.querySelector('.timestamp-datetime-content');
    var formatInput = document.querySelector('.timestamp-datetime-format');
    var gmtInput = document.querySelector('.timestamp-datetime-timezones');
    var result = document.querySelector('.timestamp-datetime-result');
    var timestampText = String(timestampInput.value).trim();
    if(timestampText === ''){
        result.innerHTML = '';
        return;
    }

    var timestamp = Number(timestampText);
    var formatText = String(formatInput.value);
    if (formatText.trim() === '') {
        if(timestampUnit === timestamp_Unit_SECONDS){
            formatInput.value = FORMAT_DEFAULT;
            formatText = FORMAT_DEFAULT;
        } else {
            formatInput.value = FORMAT_WITH_MILLIS_DEFAULT;
            formatText = FORMAT_WITH_MILLIS_DEFAULT;
        }
    }

    var gmtText = String(gmtInput.value);
    var utcOffset = 0;
    if (gmtText.trim() !== '') {
        utcOffset = parseGMTOffset(gmtText);
    } else {
        const utcOffsetStr = getCurrentUtcOffset();
        const sign = utcOffsetStr.charAt(0);
        const utc = parseInt(utcOffsetStr.substring(1));
        gmtInput.value = 'GMT' + sign + utc;
    }

    if (utcOffset === 0 || utcOffset === NaN) {
        utcOffset = getCurrentUtcOffset();
    }
    var formattedTime;
    if(timestampUnit === timestamp_Unit_SECONDS) {
        formattedTime = convertSecondsToGMT(timestamp, formatText, utcOffset);
    } else{
        formattedTime = convertMillisToGMT(timestamp, formatText, utcOffset);
    }
    result.innerHTML = formattedTime;
}

function fillFormatTimezone() {
    var timestampInput = document.querySelector('.timestamp-datetime-content');
    var formatInput = document.querySelector('.timestamp-datetime-format');
    var gmtInput = document.querySelector('.timestamp-datetime-timezones');
    var timestampText = String(timestampInput.value).trim();
    if(timestampText === ''){
        return;
    }

    var timestamp = Number(timestampText);
    var formatText = String(formatInput.value);
    if (formatText.trim() === '') {
        if(timestamp < 1000000000000) {
            formatInput.value = FORMAT_DEFAULT;
            formatText = FORMAT_DEFAULT;
        } else {
            formatInput.value = FORMAT_WITH_MILLIS_DEFAULT;
            formatText = FORMAT_WITH_MILLIS_DEFAULT;
        }
    }

    var gmtText = String(gmtInput.value);
    if (gmtText.trim() === '') {
        const utcOffsetStr = getCurrentUtcOffset();
        const sign = utcOffsetStr.charAt(0);
        const utc = parseInt(utcOffsetStr.substring(1));
        gmtInput.value = 'GMT' + sign + utc;
    }
}

function convertTimeToTimestampSeconds() {
    logGAEvent('click_convertDatetimeToTimestamp_seconds');
    convertDatetimeToTimestamp(timestamp_Unit_SECONDS);
}

function convertTimeToTimestampMillis() {
    logGAEvent('click_convertDatetimeToTimestamp_millis');
    convertDatetimeToTimestamp(timestamp_Unit_MILLIS);
}

function convertDatetimeToTimestamp(timestampUnit){
    var datetimeInput = document.querySelector('.datetime-timestamp-text');
    var resultDiv = document.querySelector('.datetime-timestamp-result');
    var resultUnitSpan = document.querySelector('.datetime-timestamp-result-unit');
    var datetimeText = String(datetimeInput.value).trim();
    if (datetimeText === '') {
        resultDiv.innerHTML = '';
        resultUnitSpan.innerHTML = '';
        return;
    }

    var formatInput = document.querySelector('.datetime-timestamp-format');
    var formatText = String(formatInput.value).trim();
    if (formatText === '') {
        if(timestampUnit === timestamp_Unit_SECONDS){
            formatInput.value = FORMAT_DEFAULT;
            formatText = FORMAT_DEFAULT;
        } else {
            formatInput.value = FORMAT_WITH_MILLIS_DEFAULT;
            formatText = FORMAT_WITH_MILLIS_DEFAULT;
        }
    }

    if(timestampUnit === timestamp_Unit_SECONDS){
        var seconds = convertGMTToSeconds(datetimeText, formatText);
        resultDiv.innerHTML = seconds;
        resultUnitSpan.innerHTML = 'SECONDS';
    } else {
        var millis = convertGMTToMillis(datetimeText, formatText);
        resultDiv.innerHTML = millis;
        resultUnitSpan.innerHTML = 'MILLIS';
    }
}

function fillFormatForToTimestamp(){
    var datetimeInput = document.querySelector('.datetime-timestamp-text');
    var formatInput = document.querySelector('.datetime-timestamp-format');
    var datetimeText = String(datetimeInput.value).trim();
    if (datetimeText === '') {
        return;
    }

    var formatText = String(formatInput.value).trim();
    if (formatText === '') {
        formatInput.value = FORMAT_DEFAULT;
        formatText = FORMAT_DEFAULT;
    }
}

function bindingEvent(componentName, eventName, action) {
    var component = document.querySelector(componentName);
    component.addEventListener(eventName, action);
}

function app() {
    bindingEvent('.timestamp-datetime-withSeconds', 'click', convertSecondsToTime);
    bindingEvent('.timestamp-datetime-withMillis', 'click', convertMillisToTime);
    bindingEvent('.timestamp-datetime-content', 'input', fillFormatTimezone);
    bindingEvent('.datetime-timestamp-convert-seconds', 'click', convertTimeToTimestampSeconds);
    bindingEvent('.datetime-timestamp-text', 'input', fillFormatForToTimestamp);
    bindingEvent('.datetime-timestamp-convert-millis', 'click', convertTimeToTimestampMillis);
    launchUpdateCurrentTime();
}

function boost() {
    window.onload = function () {
        app();
    }
};
boost();
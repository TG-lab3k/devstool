import "./style_index.css"
import "./style_theme.css"

const FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss';

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

function convertMillisToGMT(millis, format, offset) {
    var momentObj = moment.unix(millis);
    var formattedTime = momentObj.utcOffset(offset).format(format);
    return formattedTime;
}

function convertGMTToMillis(datetime, format) {
    var momentObj = moment(datetime, format);
    var millis = momentObj.unix();
    return millis;
}

function convertTimestampToTime() {
    var timestampInput = document.querySelector('.timestamp-datetime-content');
    var formatInput = document.querySelector('.timestamp-datetime-format');
    var gmtInput = document.querySelector('.timestamp-datetime-timezones');
    var result = document.querySelector('.timestamp-datetime-result');
    var timestampText = String(timestampInput.value).trim();
    if(timestampText === ''){
        result.innerHTML = '';
        return;
    }

    /*
    const regexTimestamp = /^-?\d+$/;
    if (!regexTimestamp.test(timestampText)) {
        const currentTimestamp = getCurrentTimestampInSecond();
        result.innerHTML = 'The correct timestamp:' + currentTimestamp;
        return;
    }
    */


    var timestamp = Number(timestampText);
    var formatText = String(formatInput.value);
    if (formatText.trim() === '') {
        formatInput.value = FORMAT_DEFAULT;
        formatText = FORMAT_DEFAULT;
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
    var formattedTime = convertMillisToGMT(timestamp, formatText, utcOffset);
    result.innerHTML = formattedTime;
}

function convertTimeToTimestamp() {
    var datetimeInput = document.querySelector('.datetime-timestamp-text');
    var resultDiv = document.querySelector('.datetime-timestamp-result');
    var datetimeText = String(datetimeInput.value).trim();
    if (datetimeText === '') {
        resultDiv.innerHTML = '';
        return;
    }

    var formatInput = document.querySelector('.datetime-timestamp-format');
    var formatText = String(formatInput.value).trim();
    if (formatText === '') {
        formatInput.value = FORMAT_DEFAULT;
        formatText = FORMAT_DEFAULT;
    }
    var millis = convertGMTToMillis(datetimeText, formatText);
    resultDiv.innerHTML = millis;
}

function bindingEvent(componentName, eventName, action) {
    var component = document.querySelector(componentName);
    component.addEventListener(eventName, action);
}

function app() {
    bindingEvent('.timestamp-datetime-convert', 'click', convertTimestampToTime);
    bindingEvent('.timestamp-datetime-content', 'input', convertTimestampToTime);
    bindingEvent('.datetime-timestamp-convert', 'click', convertTimeToTimestamp);
    bindingEvent('.datetime-timestamp-text', 'input', convertTimeToTimestamp);
    launchUpdateCurrentTime();
}

function boost() {
    window.onload = function () {
        app();
    }
};
boost();
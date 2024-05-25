import "./style_index.css"
import "./style_theme.css"

const FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss';
const FORMAT_WITH_MILLIS_DEFAULT = 'YYYY-MM-DD HH:mm:ss.SSS';
const timestamp_Unit_SECONDS = 1;
const timestamp_Unit_MILLIS = 2;

let currentTimestampUnit = timestamp_Unit_SECONDS;
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

    var timestamp = Number(timestampText);
    var formatText = String(formatInput.value);
    if (formatText.trim() === '') {
        if(currentTimestampUnit === timestamp_Unit_SECONDS){
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
    if(currentTimestampUnit === timestamp_Unit_SECONDS){
        formattedTime = convertSecondsToGMT(timestamp, formatText, utcOffset);
    } else{
        formattedTime = convertMillisToGMT(timestamp, formatText, utcOffset);
    }
    result.innerHTML = formattedTime;
}

function convertTimeToTimestampSeconds() {
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
        formatInput.value = FORMAT_DEFAULT;
        formatText = FORMAT_DEFAULT;
    }
    var millis = convertGMTToSeconds(datetimeText, formatText);
    resultDiv.innerHTML = millis;
    resultUnitSpan.innerHTML = 'SECONDS';
}

function convertTimeToTimestampMillis() {
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
        formatInput.value = FORMAT_WITH_MILLIS_DEFAULT;
        formatText = FORMAT_WITH_MILLIS_DEFAULT;
    }
    var millis = convertGMTToMillis(datetimeText, formatText);
    resultDiv.innerHTML = millis;
    resultUnitSpan.innerHTML = 'MILLIS';
}

function bindingEvent(componentName, eventName, action) {
    var component = document.querySelector(componentName);
    component.addEventListener(eventName, action);
}

function changeTimestampUnit(){
    var timestampUnit = document.querySelector('.timestamp-datetime-unit');
    var timestampUnitText = String(timestampUnit.textContent).trim();
    if(timestampUnitText === 'SECONDS'){
        timestampUnit.textContent = 'MILLIS';
        currentTimestampUnit = timestamp_Unit_MILLIS;
    } else if(timestampUnitText === 'MILLIS') {
        timestampUnit.textContent = 'SECONDS';
        currentTimestampUnit = timestamp_Unit_SECONDS;
    }
    convertTimestampToTime();
}

function app() {
    bindingEvent('.timestamp-datetime-convert', 'click', convertTimestampToTime);
    bindingEvent('.timestamp-datetime-content', 'input', convertTimestampToTime);
    bindingEvent('.datetime-timestamp-convert-seconds', 'click', convertTimeToTimestampSeconds);
    bindingEvent('.datetime-timestamp-text', 'input', convertTimeToTimestampSeconds);
    bindingEvent('.datetime-timestamp-convert-millis', 'click', convertTimeToTimestampMillis);
    bindingEvent('.timestamp-datetime-unit', 'click', changeTimestampUnit);
    launchUpdateCurrentTime();
}

function boost() {
    window.onload = function () {
        app();
    }
};
boost();
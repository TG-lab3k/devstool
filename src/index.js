import "./style_index.css"
import "./style_theme.css"

const FORMAT_DEFAULT = 'YYYY-MM-DD HH:mm:ss';

function updateCurrentTime(){
    var currentTimeInMills = Date.now();
    var currentTimeDiv = document.querySelector('.current-timestamp');
    currentTimeDiv.innerHTML = currentTimeInMills;
}

function launchUpdateCurrentTime() {
    setInterval(updateCurrentTime, 500);
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
    //momentObj.utcOffset(2);
    var millis = momentObj.unix();
    return millis;
}

function clickConvertMillisToGMT() {
    var timestampInput = document.querySelector('.timestamp-datetime-text');
    var formatInput = document.querySelector('.timestamp-datetime-format');
    var gmtInput = document.querySelector('.timestamp-datetime-timezones');
    var timestampText = String(timestampInput.value);
    if (timestampText.trim() === '') {
        console.log('timestampText is null');
        return;
    }


    var timestamp = Number(timestampText);
    var formatText = String(formatInput.value);
    if (formatText.trim() === '') {
        formatText = FORMAT_DEFAULT;
    }

    var gmtText = String(gmtInput.value);
    var utcOffset = 0;
    if (gmtText.trim() !== '') {
        console.log(gmtText);
        utcOffset = parseGMTOffset(gmtText);
    }

    if (utcOffset === 0 || utcOffset === NaN) {
        utcOffset = getCurrentUtcOffset();
    }
    console.log('utcOffset', utcOffset);
    var formattedTime = convertMillisToGMT(timestamp, formatText, utcOffset);
    var result = document.querySelector('.timestamp-datetime-result');
    result.innerHTML = formattedTime;
}

function clickConvertGMTToMillis() {
    var datetimeInput = document.querySelector('.datetime-timestamp-text');
    var datetimeText = String(datetimeInput.value);
    if (datetimeText.trim() === '') {
        return;
    }

    var formatInput = document.querySelector('.datetime-timestamp-format');
    var formatText = String(formatInput.value);
    if (formatText.trim() === '') {
        formatText = FORMAT_DEFAULT;
    }

    var millis = convertGMTToMillis(datetimeText, formatText);
    var resultDiv = document.querySelector('.datetime-timestamp-result');
    resultDiv.innerHTML = millis;
}

function bindingEvent(componentName, eventName, action) {
    var component = document.querySelector(componentName);
    component.addEventListener(eventName, action);
}

function app() {
    bindingEvent('.timestamp-datetime-convert', 'click', clickConvertMillisToGMT);
    bindingEvent('.datetime-timestamp-convert', 'click', clickConvertGMTToMillis);
    launchUpdateCurrentTime();
}

function boost() {
    window.onload = function () {
        app();
    }
};
boost();
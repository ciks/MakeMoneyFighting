class StringUtil {
    public static Trim(str: string): string {
        if (str == undefined || str == null) {
            return null;
        }
        return str.trim();
    }
    public static IsUsage(value: string): boolean {
        if (value == undefined || value == null || StringUtil.Trim(value) == "" || value == "undefined") {
            return false;
        }
        return true;
    }
    public static FormatToMoney(value: string, hasSign: boolean = false): string {
        var i: number = 0;
        var count: number = 0;
        var str: string = "";
        if (hasSign) {
            if (value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57) {
                value = "+" + value;
            }
        }
        for (i = value.length - 1; i >= 0; --i) {
            str = value.charAt(i) + str;
            if (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57) {
                if (value.charCodeAt(i - 1) >= 48 && value.charCodeAt(i) <= 57) {
                    count++;
                    if (count == 3) {
                        str = "," + str;
                        count = 0;
                    }
                }
            } else {
                count = 0;
            }
        }
        return str;
    }
    public static GetSubStrCount(subString: string, source: string): number {
        var count: number = 0;
        var lastInde: number = source.lastIndexOf(subString);
        var currentIndex: number = source.indexOf(subString);
        if (currentIndex == lastInde && lastInde >= 0) {
            return 1;
        }
        else if (currentIndex != lastInde && lastInde >= 0) {
            ++count;
            while (currentIndex != lastInde) {
                currentIndex = source.indexOf(subString, currentIndex + subString.length - 1);
                if (currentIndex != -1) {
                    ++count;
                }
            }
        }
        return count;
    }
    public static FormatIntToText(value: number = 0): string {
        var str: string = "";
        if (value >= 10000) {
            str += Math.ceil(value / 10000).toFixed(0) + "万";
        } else if (value < 0) {
            str += "0";
        } else {
            str += value.toFixed(0);
        }
        return str;
    }
    public static ConvertColorToHtml(color: number = 0) {
        var colorHtml: string = "#000000";
        var colorTemp: string = "";
        try {
            colorTemp = color.toString(16);
            while (colorTemp.length < 6) {
                colorTemp = "0" + colorTemp;
            }
            colorHtml = "#" + colorTemp;
        } catch (err) {
        }
        return colorHtml;
    }
    public static HtmlFormat(value: string): string {
        if (value == null || StringUtil.Trim(value) == "") {
            return null;
        } else {
            var ampPattern: RegExp = /&/g;
            var ltPattern: RegExp = /</g;
            var gtPattern: RegExp = />/g;

            value = value.replace(ampPattern, "&amp;");
            value = value.replace(ltPattern, "&lt;");
            value = value.replace(gtPattern, "&gt;");
            return value;
        }
    }
    public static KeywordFilter(value: string): string {
        if (value == null || StringUtil.Trim(value) == "") {
            return null;
        } else {
            value = value.replace("你大爷", "***");
            value = value.replace("二逼", "***");
            return value;
        }
    }
    public static Replace(content: string, src: string, target: string): string {
        if (!StringUtil.IsUsage(content))
            return "";
        while (content.indexOf(src) >= 0)
            content = content.replace(src, target);
        return content;
    }
    public static ReplaceNumberToArray(value: number): Array<string> {
        var numVector: Array<string> = new Array<string>();
        var str: string = value.toString();
        var len: number = str.length;
        for (var i: number = 0; i < len; i++) {
            numVector.push(str.charAt(i));
        }
        return numVector;
    }
    public static SpliteToStrArr(str: string, subStr: string): Array<string> {
        var result: Array<string> = [];
        if (StringUtil.IsUsage(str)) {
            var sd: Array<string> = str.split(subStr);
            for (var i: number = 0; i < sd.length; ++i) {
                if (StringUtil.IsUsage(sd[i])) {
                    result.push(sd[i]);
                }
            }
        }
        return result;
    }
    /**
     * @param str k1,v1;k2,v2;k3,v3
     */
    public static ParseStrToPairObj(str: string, kvSp: string = ",", sp: string = ";") {
        var obj: any = {};
        if (!StringUtil.IsUsage(str))
            return obj;
        var result: Array<string> = StringUtil.SpliteToStrArr(str, sp);
        var keyValue: Array<string> = null;
        for (var i: number = 0; i < result.length; ++i) {
            keyValue = StringUtil.SpliteToStrArr(result[i], kvSp);
            if (keyValue.length = 2) {
                obj[keyValue[0]] = keyValue[1];
            }
        }
        return obj;
    }
    public static ParsePairObjToStr(obj: any, kvSp: string = ",", sp: string = ";") {
        var str: string = "";
        for (var key in obj) {
            if (key != "__class__" && key != "hashCode") {
                str += key + kvSp + obj[key] + sp;
            }
        }
        return str;
    }
    public static TimeFormat(timer: number, format: string = "00:00") {
        var str: string = "";
        var minute: number = Math.floor(timer / 60);
        if (minute < 10) {
            str = "0" + minute;
        } else {
            str = "" + minute;
        }
        str += ":";
        var second: number = Math.floor(timer % 60);
        if (second < 10) {
            str += "0" + second;
        } else {
            str += "" + second;
        }
    }
    /**
     * @param fmt "yyyy-M-d h:m:s.S" ==> 2017-4-14 0:14:3.27    "yyyy-MM-dd hh:mm:ss.S" ==> 2017-04-14 00:14:03.27
     */
    public static DateFormat(date: Date, fmt: string): string {
        var obj = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in obj) {
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[k]) : ("00" + obj[k]).substr(("" + obj[k]).length));
            }
        }
        return fmt;
    }
}

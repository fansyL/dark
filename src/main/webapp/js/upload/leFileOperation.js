var leMd5 = function () {
    function e() {
    }

    return e.getMD5 = function (e) {
        function i(e) {
            var i = (e >>> 0).toString(16);
            return "00000000".substr(0, 8 - i.length) + i
        }

        function t(e) {
            for (var i = [], t = 0; t < e.length; t++)i = i.concat(c(e[t]));
            return i
        }

        function r(e) {
            for (var i = [], t = 0; 8 > t; t++)i.push(255 & e), e >>>= 8;
            return i
        }

        function l(e, i) {
            return e << i & 4294967295 | e >>> 32 - i
        }

        function n(e, i, t) {
            return e & i | ~e & t
        }

        function o(e, i, t) {
            return t & e | ~t & i
        }

        function a(e, i, t) {
            return e ^ i ^ t
        }

        function p(e, i, t) {
            return i ^ (e | ~t)
        }

        function f(e, i) {
            return e[i + 3] << 24 | e[i + 2] << 16 | e[i + 1] << 8 | e[i]
        }

        function c(e) {
            for (var i = [], t = 0; t < e.length; t++)if (e.charCodeAt(t) <= 127) i.push(e.charCodeAt(t)); else for (var r = encodeURIComponent(e.charAt(t)).substr(1).split("%"), l = 0; l < r.length; l++)i.push(parseInt(r[l], 16));
            return i
        }

        function s() {
            for (var e = "", t = 0, r = 0, l = 3; l >= 0; l--)r = arguments[l], t = 255 & r, r >>>= 8, t <<= 8, t |= 255 & r, r >>>= 8, t <<= 8, t |= 255 & r, r >>>= 8, t <<= 8, t |= r, e += i(t);
            return e
        }

        function u(e) {
            for (var i = new Array(e.length), t = 0; t < e.length; t++)i[t] = e[t];
            return i
        }

        function F(e, i) {
            return 4294967295 & e + i
        }

        function d() {
            function e(e, i, t, r) {
                var n = b;
                b = h, h = y, y = F(y, l(F(g, F(e, F(i, t))), r)), g = n
            }

            var i = m.length;
            m.push(128);
            var t = m.length % 64;
            if (t > 56) {
                for (var c = 0; 64 - t > c; c++)m.push(0);
                t = m.length % 64
            }
            for (c = 0; 56 - t > c; c++)m.push(0);
            m = m.concat(r(8 * i));
            var u = 1732584193, d = 4023233417, v = 2562383102, O = 271733878, g = 0, y = 0, h = 0, b = 0;
            for (c = 0; c < m.length / 64; c++) {
                g = u, y = d, h = v, b = O;
                var A = 64 * c;
                e(n(y, h, b), 3614090360, f(m, A), 7), e(n(y, h, b), 3905402710, f(m, A + 4), 12), e(n(y, h, b), 606105819, f(m, A + 8), 17), e(n(y, h, b), 3250441966, f(m, A + 12), 22), e(n(y, h, b), 4118548399, f(m, A + 16), 7), e(n(y, h, b), 1200080426, f(m, A + 20), 12), e(n(y, h, b), 2821735955, f(m, A + 24), 17), e(n(y, h, b), 4249261313, f(m, A + 28), 22), e(n(y, h, b), 1770035416, f(m, A + 32), 7), e(n(y, h, b), 2336552879, f(m, A + 36), 12), e(n(y, h, b), 4294925233, f(m, A + 40), 17), e(n(y, h, b), 2304563134, f(m, A + 44), 22), e(n(y, h, b), 1804603682, f(m, A + 48), 7), e(n(y, h, b), 4254626195, f(m, A + 52), 12), e(n(y, h, b), 2792965006, f(m, A + 56), 17), e(n(y, h, b), 1236535329, f(m, A + 60), 22), e(o(y, h, b), 4129170786, f(m, A + 4), 5), e(o(y, h, b), 3225465664, f(m, A + 24), 9), e(o(y, h, b), 643717713, f(m, A + 44), 14), e(o(y, h, b), 3921069994, f(m, A), 20), e(o(y, h, b), 3593408605, f(m, A + 20), 5), e(o(y, h, b), 38016083, f(m, A + 40), 9), e(o(y, h, b), 3634488961, f(m, A + 60), 14), e(o(y, h, b), 3889429448, f(m, A + 16), 20), e(o(y, h, b), 568446438, f(m, A + 36), 5), e(o(y, h, b), 3275163606, f(m, A + 56), 9), e(o(y, h, b), 4107603335, f(m, A + 12), 14), e(o(y, h, b), 1163531501, f(m, A + 32), 20), e(o(y, h, b), 2850285829, f(m, A + 52), 5), e(o(y, h, b), 4243563512, f(m, A + 8), 9), e(o(y, h, b), 1735328473, f(m, A + 28), 14), e(o(y, h, b), 2368359562, f(m, A + 48), 20), e(a(y, h, b), 4294588738, f(m, A + 20), 4), e(a(y, h, b), 2272392833, f(m, A + 32), 11), e(a(y, h, b), 1839030562, f(m, A + 44), 16), e(a(y, h, b), 4259657740, f(m, A + 56), 23), e(a(y, h, b), 2763975236, f(m, A + 4), 4), e(a(y, h, b), 1272893353, f(m, A + 16), 11), e(a(y, h, b), 4139469664, f(m, A + 28), 16), e(a(y, h, b), 3200236656, f(m, A + 40), 23), e(a(y, h, b), 681279174, f(m, A + 52), 4), e(a(y, h, b), 3936430074, f(m, A), 11), e(a(y, h, b), 3572445317, f(m, A + 12), 16), e(a(y, h, b), 76029189, f(m, A + 24), 23), e(a(y, h, b), 3654602809, f(m, A + 36), 4), e(a(y, h, b), 3873151461, f(m, A + 48), 11), e(a(y, h, b), 530742520, f(m, A + 60), 16), e(a(y, h, b), 3299628645, f(m, A + 8), 23), e(p(y, h, b), 4096336452, f(m, A), 6), e(p(y, h, b), 1126891415, f(m, A + 28), 10), e(p(y, h, b), 2878612391, f(m, A + 56), 15), e(p(y, h, b), 4237533241, f(m, A + 20), 21), e(p(y, h, b), 1700485571, f(m, A + 48), 6), e(p(y, h, b), 2399980690, f(m, A + 12), 10), e(p(y, h, b), 4293915773, f(m, A + 40), 15), e(p(y, h, b), 2240044497, f(m, A + 4), 21), e(p(y, h, b), 1873313359, f(m, A + 32), 6), e(p(y, h, b), 4264355552, f(m, A + 60), 10), e(p(y, h, b), 2734768916, f(m, A + 24), 15), e(p(y, h, b), 1309151649, f(m, A + 52), 21), e(p(y, h, b), 4149444226, f(m, A + 16), 6), e(p(y, h, b), 3174756917, f(m, A + 44), 10), e(p(y, h, b), 718787259, f(m, A + 8), 15), e(p(y, h, b), 3951481745, f(m, A + 36), 21), u = F(u, g), d = F(d, y), v = F(v, h), O = F(O, b)
            }
            return s(O, v, d, u).toUpperCase()
        }

        var m = null, v = null;
        return "string" == typeof e ? m = c(e) : e.constructor == Array ? 0 === e.length ? m = e : "string" == typeof e[0] ? m = t(e) : "number" == typeof e[0] ? m = e : v = typeof e[0] : "undefined" != typeof ArrayBuffer ? e instanceof ArrayBuffer ? m = u(new Uint8Array(e)) : e instanceof Uint8Array || e instanceof Int8Array ? m = u(e) : e instanceof Uint32Array || e instanceof Int32Array || e instanceof Uint16Array || e instanceof Int16Array || e instanceof Float32Array || e instanceof Float64Array ? m = u(new Uint8Array(e.buffer)) : v = typeof e : v = typeof e, v && alert("MD5 type mismatch, cannot process " + v), d()
    }, e
}(), leFileOperation = function () {
    function leFileOperation() {
    }

    return leFileOperation.videoUpload_fileList = [], leFileOperation.addFileCallback = function () {
    }, leFileOperation.fileUploadList = {}, leFileOperation.fileTypes = "wmv|avi|dat|asf|rm|rmvb|ram|mpg|mpeg|mp4|mov|m4v|mkv|flv|vob|qt|divx|cpk|fli|flc|mod|dvix|dv|f4v|ts", leFileOperation.getFileType = function (e) {
        return e.name.split(".").pop()
    }, leFileOperation.calculateFileSize = function (e) {
        var i = e.size / 1024;
        return i = i > 1024 ? ((i / 1024 * 10 >> 0) / 10).toFixed(1) + "M" : ((10 * i >> 0) / 10).toFixed(1) + "K"
    }, leFileOperation.getFileKey = function (e) {
        var i = leMd5.getMD5([leFileOperation.getFileType(e), e.size, e.lastModifiedDate || e.name].join("_")).toLowerCase();
        return i
    }, leFileOperation.checkParentFileList = function (e) {
        if (leFileOperation.videoUpload_fileList)for (var i = 0; i < leFileOperation.videoUpload_fileList.length; i++) {
            var t = leFileOperation.getFileKey(e);
            if (leFileOperation.videoUpload_fileList[i].md5 == t)return !0
        }
        return !1
    }, leFileOperation.checkFileName = function () {
        return !1
    }, leFileOperation.inputFileChange = function (e, element, callback) {
        for (var files = e.target.files, fileAddInfoObj = {
            errorFiles: [],
            successFiles: []
        }, i = 0; i < files.length; i++) {
            var file = files[i], fType = leFileOperation.getFileType(file);
            if (file.size <= 0) {
                var tempErrorFile = new Object;
                tempErrorFile.file = file, tempErrorFile.errorMsg = "大小为0的文件", tempErrorFile.code = "101", fileAddInfoObj.errorFiles.push(tempErrorFile)
            } else if (leFileOperation.checkParentFileList(file)) {
                var tempErrorFile = new Object;
                tempErrorFile.file = file, tempErrorFile.errorMsg = "文件已在上传列表当中", tempErrorFile.code = "103", fileAddInfoObj.errorFiles.push(tempErrorFile)
            } else if (eval("/" + leFileOperation.fileTypes + "$/i").test(fType))if (leFileOperation.fileUploadList[leFileOperation.getFileKey(file)]) {
                var tempErrorFile = new Object;
                tempErrorFile.file = file, tempErrorFile.errorMsg = "选择了相同的文件", tempErrorFile.code = "104", fileAddInfoObj.errorFiles.push(tempErrorFile)
            } else if (leFileOperation.checkFileName(file)) {
                var tempErrorFile = new Object;
                tempErrorFile.file = file, tempErrorFile.errorMsg = "视频名称不合法", tempErrorFile.code = "105", fileAddInfoObj.errorFiles.push(tempErrorFile)
            } else {
                var tempSuccessFile = new Object;
                tempSuccessFile.file = file, tempSuccessFile.successMsg = "成功", tempSuccessFile.code = "0", tempSuccessFile.md5 = leFileOperation.getFileKey(file), fileAddInfoObj.successFiles.push(tempSuccessFile), leFileOperation.fileUploadList[tempSuccessFile.md5] = {
                    md5: tempSuccessFile.md5,
                    file: file
                }, callback && (leFileOperation.fileUploadList[tempSuccessFile.md5].parameter = callback({
                        file: file,
                        element: element,
                        md5: tempSuccessFile.md5
                    }) || "")
            } else {
                var tempErrorFile = new Object;
                tempErrorFile.file = file, tempErrorFile.errorMsg = "不支持的视频格式", tempErrorFile.code = "102", fileAddInfoObj.errorFiles.push(tempErrorFile)
            }
        }
        leFileOperation.addFileCallback(fileAddInfoObj)
    }, leFileOperation.addFile = function (e, i) {
        $("#fileUploadId_Hsc").remove();
        var t = document.getElementById("fileUploadId_Hsc");
        if (t) t.click && e.target != t && t.click(); else {
            t = document.createElement("input"), $("body").append(t), t.setAttribute("id", "fileUploadId_Hsc"), t.setAttribute("type", "file");
            for (var r = leFileOperation.fileTypes.split("|"), l = 0; l < r.length; l++)r[l] = "." + r[l];
            var n = r.join(",");
            t.setAttribute("accept", n), t.setAttribute("autocomplete", "off"), t.setAttribute("multiple", "true"), t.style.display = "none", t.addEventListener("change", function (t) {
                leFileOperation.inputFileChange(t, e, i)
            }, !1), t.click && e.target != t && t.click()
        }
    }, leFileOperation.addSingleFile = function (e, i) {
        $("#fileUploadId_Hsc").remove();
        var t = document.getElementById("fileUploadId_Hsc");
        if (t) t.click && e.target != t && t.click(); else {
            t = document.createElement("input"), $("body").append(t), t.setAttribute("id", "fileUploadId_Hsc"), t.setAttribute("type", "file");
            for (var r = leFileOperation.fileTypes.split("|"), l = 0; l < r.length; l++)r[l] = "." + r[l];
            var n = r.join(",");
            t.setAttribute("accept", n), t.style.display = "none", t.addEventListener("change", function (t) {
                leFileOperation.inputFileChange(t, e, i)
            }, !1), t.click && e.target != t && t.click()
        }
    }, leFileOperation.initOption = {}, leFileOperation.init = function (e) {
        leFileOperation.initOption = e, leFileOperation.fileTypes = e.fileTypes || leFileOperation.fileTypes, leFileOperation.videoUpload_fileList = e.videoUpload_fileList, leFileOperation.addFileCallback = e.addFileCallback;
        for (var i = 0; i < e.multipleDomElement.length; i++) {
            var t = e.multipleDomElement[i];
            $(t).on("click", function (i) {
                leFileOperation.addFile(i, e.multipleCallback)
            })
        }
    }, leFileOperation
}();
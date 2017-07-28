var category_obj = {},
    params_modal = {},
    albumName_modal_arr = [],
    uploadIngCount = 0,
    uploadQueArr = [],
    uploadFileList = {};//上传文件列表
    
var domOperationFn = {
    init: function() {
        this.selectAlbumId(); //专辑Id选择
        this.catagory(".category", "customCategory_con"); //选择专辑弹框
        this.remove(); //删除
        this.upload(); //上传
        this.dozen(); //批量三级联动
        this.logoSiteSet();
    },
    albumCategory: function(albumInput, join_albumId, catagory, categoryId, customCategory, customCategoryId) {
        $(albumInput).val(join_albumId).attr("album-customCategory-id", customCategoryId);
        $(catagory).attr("data-id", categoryId);
        $(catagory + " option[data-id='" + categoryId + "']").prop("selected", true);
        category_obj.category = categoryId;
        $("#" + customCategory).html("");
        if (buildEdit.start) {
            return
        }
        buildEdit.init(customCategory);
        $("#addDataType_con select:first").removeClass("ml-3");
        if (customCategoryId != 0 && customCategoryId != null) {
            var obj = classfiyObject.getPidAndId(customCategoryId, window.classfiyObject_obj, 1);
            if (obj._level == 1) {
                $("#" + customCategory).find("select").eq(0).find("option[data-id=" + customCategoryId + "]").prop("selected", true);
            } else if (obj._level == 2) {
                $("#" + customCategory).find("select").eq(0).find("option[data-id=" + obj._pid + "]").prop("selected", true);
                $("#" + customCategory).find("select").eq(0).change();
//                $("#" + customCategory).find("select").eq(1).find("option[data-id=" + obj._id + "]").prop("selected", true);
            } 
//            else if (obj._level == 3) {
//                var obj3 = classfiyObject.getPidAndId(obj._pid, window.classfiyObject_obj, 1);
//                $("#" + customCategory).find("select").eq(0).find("option[data-id=" + obj3._pid + "]").prop("selected", true);
//                $("#" + customCategory).find("select").eq(0).change();
//                $("#" + customCategory).find("select").eq(1).find("option[data-id=" + obj._pid + "]").prop("selected", true);
//                $("#" + customCategory).find("select").eq(1).change();
//                $("#" + customCategory).find("select").eq(2).find("option[data-id=" + obj._id + "]").prop("selected", true);
//            }
        }
    },
    selectAlbumId: function() {
        //触发选择专辑弹框
        $("#maintable").on("click", ".joinEditor", function() {
            params_modal = {};
            var md5Id = $(this).closest("tr").attr("md5");
            $("#modal-select-zhuanjiId").modal('show').attr("md5-id", md5Id);
        });
        buildEdit.albumTable_upload();
        $("#btn-zhuanji").click(function() {
            var join_albumId = $("input[name='albumId']:checked").attr("data-albumid");
            var categoryId = $("input[name='albumId']:checked").attr("category-id");
            var customCategoryId = $("input[name='albumId']:checked").attr("customCategory-id");
            var md5Id = $("#modal-select-zhuanjiId").attr("md5-id");
            var tr = $("#maintable tbody tr");
            if (md5Id) { //单个
                if($("#uploadstatus_"+md5).val() != "1") {
                    domOperationFn.albumCategory("#albumId_" + md5Id, join_albumId, "#addCatagory_" + md5Id, categoryId, "add_customCategory_con_" + md5Id, customCategoryId);
                }
            } else { //批量
                domOperationFn.albumCategory("#piLiangAbumlId", join_albumId, "#addDataType", categoryId, "addDataType_con", customCategoryId);
                for (var i = 0; i < tr.length; i++) {
                    var md5 = $(tr[i]).attr("md5");
                    if($("#uploadstatus_"+md5).val() != "1") {
                        domOperationFn.albumCategory("#albumId_" + md5, join_albumId, "#addCatagory_" + md5, categoryId, "add_customCategory_con_" + md5, customCategoryId);
                    }
                }

            }
        });
    },
    catagory: function(catagory, customCategory_con) {
        $.getJSON(
            basePath + "customCategoryController/getCategorys.do",
            function(data) {
                var system_channel = '';
                system_channel += '<option data-id="0" value=' + LCT("请选择") + '>' + LCT("请选择") + '</option>';
                for (var i = 0; i < data.length; i++) {
                    var showName = data[i].showName;
                    var dicValue = data[i].dicValue;
                    system_channel += '<option data-id=' + dicValue + ' value=' + showName + '>' + showName + '</option>';
                }
                $(catagory).attr("data-id", '0').html(system_channel);
            }
        );
        //数据分类
        $("body").on("change", catagory, function() {
            var categoryId = $(this).children('option:selected').attr("data-id");
            $(catagory).attr("data-id", categoryId);
            category_obj.category = categoryId;
            if (categoryId == '0') {
                $("#" + customCategory_con).html(vrsFn.customCategoryInitDom);
            } else {
                $("#" + customCategory_con).html('');
                buildEdit.init(customCategory_con);
                $("#addDataType_con select:first").removeClass("ml-3");
            }
            if (catagory == "#addDataType") {
                var tr = $("#maintable tbody tr");
                for (var i = 0; i < tr.length; i++) {
                    var md5 = $(tr[i]).attr("md5");
                    if($("#uploadstatus_"+md5).val() != "1") {
                        $("#addCatagory_" + md5).attr("data-id", categoryId);
                        $("#addCatagory_" + md5 + " option[data-id='" + categoryId + "']").prop("selected", true);
                        $("#add_customCategory_con_" + md5).html("");
                        buildEdit.init("add_customCategory_con_" + md5);
                        $("#albumId_" + md5).val("").removeAttr("album-customcategory-id");
                        $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("待上传")).css({
                            color: "#333"
                        });
                    }
                }
                $("#piLiangAbumlId").val("");
            } else {
                var md5 = $(this).parents("tr").attr("md5");
                if($("#uploadstatus_"+md5).val() != "1") {
                    $("#albumId_" + md5).val("");
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("待上传")).css({
                        color: "#333"
                    });
                    $("#albumId_" + md5).val("").removeAttr("album-customcategory-id");
                }
            }
            $("#customCategory_con select").removeClass("ml-3");
        });
    },
    addFiles: function(fileDetail) {
        var logsite_sp = $("#spLogoSite_v").val();
        var logoStatus_sp = $("#spLogoStatus_v").val();
        var lastIndex = fileDetail.file.name.lastIndexOf(".");
        var nameLength = fileDetail.file.name.length;
        var md5 = fileDetail.md5;
        var name = fileDetail.file.name.substring(0, lastIndex);
        var type = fileDetail.file.name.substring(lastIndex + 1, nameLength);
        var size = fileDetail.file.size;
        
        var uploadFileParams = {};//上传文件对应的配置参数
        uploadFileParams["file"] = fileDetail.file;
        uploadFileParams["type"] = type;
        uploadFileParams["fileSize"] = size;
        uploadFileParams["uploadStatus"] = "0";//待上传
        uploadFileList[md5] = uploadFileParams;
        
        var addFiles_html = '';
        addFiles_html += '<tr md5="' + md5 + '">';
        //基本信息
        addFiles_html += '<td>';
        addFiles_html += '<p class="videoName" style="text-align: left;">' + LCT("名称：") + name + '</p>';
        addFiles_html += '<p style="text-align: left;">' + LCT("类型：") + type + '</p>';
        addFiles_html += '<p style="text-align: left">' + LCT("大小：") + formatMb(size) + '</p>';
        addFiles_html += '</td>';
        //视频名称
        addFiles_html += '<td><input type="text" class="form-control" videoname="videoName" maxlength="50" value="' + name + '"></td>';
        //所属专辑
        addFiles_html += '<td>';
        addFiles_html += '<input type="text" class="form-control" readonly="readonly" value="" albumId="albumId" id="albumId_' + md5 + '" upalbumidr="upalbumIdr">';
        addFiles_html += '<input type="button" id="selectAlbum_button_'+md5+'" class="joinEditor" value="' + LCT("选择") + '"  style="color:blue; background:transparent;border:0px;outline: none;">';
        addFiles_html += '</td>';
        //上传状态
        addFiles_html += '<td><p uploadStatus="uploadStatus">' + LCT("待上传") + '</p>';
        addFiles_html += '<progress id="'+ md5 +'_progressBar" value="0" max="100" style="width: 100%"> </progress>';
        addFiles_html += '<p id="'+ md5+'_baifenbi" style="display: none;"> </p></td>';
        //分类
        addFiles_html += '<td style="text-align: left;padding:15px 0px;">';
        addFiles_html += '<div class="form-inline">';
        addFiles_html += '<div class="form-group">';
        addFiles_html += '<label class="mr-5" style="width:95px;text-align:right;">' + LCT("根分类 ：") + '</label>';
        addFiles_html += '<select class="form-control addCatagory ml-3" classify="typeData" id="addCatagory_' + md5 + '"></select>';
        addFiles_html += '<br><br>';
        addFiles_html += '<label class="mr-5" style="width:95px;text-align:right;">' + LCT("自定义分类 ：") + '</label>';
        addFiles_html += '<span class="add_customCategory_con" id="add_customCategory_con_' + md5 + '">' +
            '<select class="form-control ml-3"><option>' + LCT("请选择") + '</option></select>' +
            '<select class="form-control ml-3"><option>' + LCT("请选择") + '</option></select></span></td>';
        //转码logo位置
        addFiles_html += '<td style="padding:0;text-align:center">';
        addFiles_html += '<select class="form-control logosite" id="logosite_'+md5+'">';
        if(logoStatus_sp == 1){
            addFiles_html += "<option value='-1'>"+LCT('无')+"</option>" ;
            if(logsite_sp == 0){
                addFiles_html += "<option value='0' selected>"+LCT('左上')+"</option>" ;
            }else {
                addFiles_html += "<option value='0' >"+LCT('左上')+"</option>" ;
            }
            if(logsite_sp == 1){
                addFiles_html += "<option value='1' selected>"+LCT('右上')+"</option>" ;
            }else {
                addFiles_html += "<option value='1' >"+LCT('右上')+"</option>" ;
            }
            if(logsite_sp == 2){
                addFiles_html += "<option value='2' selected>"+LCT('左下')+"</option>" ;
            }else {
                addFiles_html += "<option value='2' >"+LCT('左下')+"</option>" ;
            }
            if(logsite_sp == 3){
                addFiles_html += "<option value='3' selected>"+LCT('右下')+"</option>" ;
            }else {
                addFiles_html += "<option value='3' >"+LCT('右下')+"</option>" ;
            }
        }else {
            addFiles_html += "<option value='-1' selected>"+LCT('无')+"</option>" ;
            addFiles_html += "<option value='0' >"+LCT('左上')+"</option>" ;
            addFiles_html += "<option value='1' >"+LCT('右上')+"</option>" ;
            addFiles_html += "<option value='2' >"+LCT('左下')+"</option>" ;
            addFiles_html += "<option value='3' >"+LCT('右下')+"</option>" ;
        }
        addFiles_html += '</select>';
        addFiles_html += '</td>';

        addFiles_html += '<td><input type="button" id="upload_'+md5+'" class="uploadItem" style="background:transparent;border:0px;outline: none;" value="' + LCT("上传") + '"><br>';
        addFiles_html += '<input type="button" id="startOrstop_'+md5+'" class="startOrstopItem" style="background:transparent;border:0px;outline: none;display: none;" value="' + LCT("暂停") + '"><br>';
        addFiles_html += '<input type="button" id="del_'+md5+'" class="delItem" style="background:transparent;border:0px;outline: none;" value="' + LCT("删除") + '">';
        addFiles_html += '<input type="hidden" id="vid_'+md5+'" value=""/>';
        addFiles_html += '<input type="hidden" id="star_state_'+md5+'" value="0"/>';
        addFiles_html += '<input type="hidden" id="time_'+md5+'" value=""/>';
        addFiles_html += '<input type="hidden" id="uploadstatus_'+md5+'" value=""/>';
        addFiles_html += '<input type="hidden" id="uploadId_'+md5+'" value=""/>';
        addFiles_html += '<input type="hidden" id="vidkey_'+md5+'" value=""/></td>';

        addFiles_html += '</tr>';
        $("#maintable tbody").append(addFiles_html);
        domOperationFn.catagory("#addCatagory_" + md5, "add_customCategory_con_" + md5);
    },
    logoSiteSet: function() {
       $("#logosite_all").change(function() {
           var logosite_val = $(this).val();
           $(".logosite option[value='" + logosite_val + "']").prop("selected", true);
       });
   },
    remove: function() {
        //删除--单个
        $("#maintable").on("click", ".delItem", function() {
            var md5 = $(this).parents("tr").attr("md5");

            var star_state_ = $("#star_state_"+md5).val();
            var uploadStatus = $("#uploadstatus_"+md5).val();
            if(uploadStatus == "1") {
            	if(star_state_ == "1"){
                    var vId = $("#vid_"+md5).val();
                    delete leFileOperation.fileUploadList[md5];
                    delete uploadFileList[md5];
                    $(this).parents("tr").remove();
                    if(uploadIngCount > 0){
                        uploadIngCount--;
                    }
                    if(uploadQueArr.length > 0){
                        var que_md5 =  uploadQueArr.shift();
                        $("#upload_"+que_md5).click();
                    }
                    var url = basePath + "videoController/uploadRemove.do?videoId="+vId;
                    $.post(url,function(data){});
            	    return ;
                }
                var params = {
                        "title": LCT("错误"),
                        "discription": LCT("文件正在上传,不允许删除"),
                        "iconType": "triangle",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                return false;
            } else {
            	delete leFileOperation.fileUploadList[md5];
            	delete uploadFileList[md5];
                $(this).parents("tr").remove();
                if(uploadIngCount > 0){
                    uploadIngCount--;
                }
                if(uploadStatus == "3"){
                    uploadQueArr.remove(md5);
                }
            }
        });
        //删除--批量
        $("#delMulti").click(function() {
            $("#maintable tbody tr").each(function(){
            	var md5 = $(this).attr("md5");
            	var star_state_ = $("#star_state_"+md5).val();
            	var uploadStatus = $("#uploadstatus_"+md5).val();
            	if(uploadStatus == "1") {
            		if(star_state_ == "1"){
            			var vId = $("#vid_"+md5).val();
            			delete leFileOperation.fileUploadList[md5];
            			delete uploadFileList[md5];
                        if(uploadIngCount > 0){
                            uploadIngCount--;
                        }
            			$(this).remove();
                        if(uploadQueArr.length > 0){
                            var que_md5 =  uploadQueArr.shift();
                            $("#upload_"+que_md5).click();
                        }
            			var url = basePath + "videoController/uploadRemove.do?videoId="+vId;
            			$.post(url,function(data){});

            			return ;
            		}
            		
            	}else { // 队列中
                    delete leFileOperation.fileUploadList[md5];
                    delete uploadFileList[md5];
                    $("tr[md5='" + md5 + "']").remove();
                    if(uploadIngCount > 0){
                        uploadIngCount--;
                    }
                    if(uploadStatus == "3"){
                        uploadQueArr.remove(md5);
                    }
                }
            });
            $("#piLiangAbumlId").val("");
            // $("#logosite_all option[value='0']").prop("selected", true);
            $("#addDataType").attr("data-id", '0');
            $("#addDataType option[data-id='0']").prop("selected", true);
            $("#addDataType_con").html('<select class="form-control"><option>' + LCT("请选择") + '</option></select><select class="form-control ml-3"><option>' + LCT("请选择") + '</option></select>');
        });
    },
    upload: function() {
        //使用demo
        leFileOperation.init({
            multipleDomElement: [$("#addFiles")[0]], //一次允许选择多个文件，需要传递页面元素对象
            multipleCallback: function(data) {
                return "";
            }, //如果需要额外加什么参数在这里设置如果不需要则 return "";
            // videoUpload_fileList:window.vaasFileUpload.fileUploadList, //上传列表中现有的文件列表//临时需要传递null
            addFileCallback: function(data) {
                var errorFiles = data.errorFiles;
                var successFiles = data.successFiles;
                if (errorFiles.length) {
                    var code_101 = 0,
                        code_102 = 0,
                        code_103 = 0,
                        code_104 = 1,
                        code_105 = 0;
                    var errormsg_html = "";
                    for (var i = 0; i < errorFiles.length; i++) {
                        var code = errorFiles[i].code;
                        if (code == 101) {
                            code_101++;
                        } else if (code == 102) {
                            code_102++;
                        } else if (code == 103) {
                            code_103++;
                        } else if (code == 104) {
                            code_104++;
                        }
                    }
                    if (code_101 > 0) {
                        errormsg_html += LCT("文件大小为零！") + "<br/>";
//                        errormsg_html += LCT("大小为0的文件数量为：") + code_101 + "<br/>";
                    }
                    if (code_102 > 0) {
                        errormsg_html += LCT("不支持的视频格式！") + "<br/>";
//                        errormsg_html += LCT("不支持的视频格式数量为：") + code_102 + "<br/>";
                    }
                    if (code_103 > 0) {
                        errormsg_html += LCT("文件已在上传列表当中！") + "<br/>";
//                        errormsg_html += LCT("文件已在上传列表当中的数量为：") + code_103 + "<br/>";
                    }
                    if (code_104 > 1) {
                        errormsg_html += LCT("已经存在相同的文件！") ;
//                        errormsg_html += LCT("相同的文件的数量为：") + code_104;
                    }
                    var params = {
                        "title": LCT("错误！"),
                        "discription": errormsg_html,
                        "iconType": "text",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                }
                if (successFiles.length) {
                    for (var i = 0; i < successFiles.length; i++) {
                        domOperationFn.addFiles(successFiles[i]);
                    }
                }

            }, //本次选择文件的回调函数
            fileTypes: "wmv|avi|dat|asf|rm|rmvb|ram|mpg|mpeg|mp4|mov|m4v|mkv|flv|vob|qt|divx|cpk|fli|flc|mod|dvix|dv|f4v|ts"
        });

        $("#maintable").on("click",".startOrstopItem",function () {
            var md5 = $(this).parents("tr").attr("md5");
            var star_state_ = $("#star_state_"+md5).val();
            if(star_state_ == "0"){
                // $("#uploadstatus_"+md5).val("0");
                $("#star_state_"+md5).val("1");
                $("#startOrstop_"+md5).val(LCT("继续"));
                $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("上传暂停")).css({
                    color: "red"
                });
                // uploadFileParams["uploadStatus"] = "-1";
            }
            if(star_state_ == "1"){
                // uploadFileParams["uploadStatus"] = "1";
                // $("#uploadstatus_"+md5).val("1");
                $("#star_state_"+md5).val("0");
                $("#startOrstop_"+md5).val(LCT("暂停"));

                $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html('').css({
                    color: "#333"
                });

                upload2(md5);
            }

        })

        //上传--单个
        $("#maintable").on("click", ".uploadItem", function() {

            if(!spInfoInitCheck()){
                var params = {
                    "title": LCT("错误"),
                    "discription": LCT("请先完善bucket、域名等信息"),
                    "iconType": "triangle",
                    "confirmBtn": true //确定按钮显示与否true or fasle
                };
                $("body").toolsalert(params);
                return false;
            }

            var md5 = $(this).parents("tr").attr("md5");
            var uploadFileParams = uploadFileList[md5];
            if($("#uploadstatus_"+md5).val() == "1") {
                var params = {
                    "title": LCT("错误"),
                    "discription": LCT("文件正在上传中......"),
                    "iconType": "triangle",
                    "confirmBtn": true //确定按钮显示与否true or fasle
                };
                $("body").toolsalert(params);
                return false;
            } else {
                var fileName = $(this).parents("tr").find("input[videoname='videoName']").val();
                var logosite = $("#logosite_" + md5).val();
                var albumId = $("#albumId_" + md5).val();
                var albumCustomcategoryId = $(this).parents("tr").find("input[albumid='albumId']").attr("album-customcategory-id");
                var categoryId = $("#addCatagory_" + md5).attr("data-id");
                var customCategoryId;
                var arr_option = $("#add_customCategory_con_" + md5 + " option:selected");
                //var reg = /^[\u4e00-\u9fa5 a-zA-Z0-9\•\！\【\】\？\“\”\‘\’\《\》\（\）\，\。\—\*\：\!\[\]\?\"\'\<\>\(\)\,\.\-\_\*\:]{1,50}$/;
                var boo = true;
                if (vrsFn.getStringLen(fileName) < 2 || vrsFn.getStringLen(fileName) > 50) {
                    boo = false;
                }
                if (!boo) {
                    var params = {
                        "title": LCT("错误"),
                        "discription": LCT("视频名称最小长度为2，上限长度为50"),
                        "iconType": "triangle",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("视频名称格式不正确")).css({
                        color: "red"
                    });
                    return false;
                } else {
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("待上传")).css({
                        color: "#333"
                    });
                }
                for (var j = arr_option.length - 1; j >= 0; j--) {
                    if ($(arr_option).eq(j).attr("data-id")) {
                        customCategoryId = $(arr_option).eq(j).attr("data-id");
                        break;
                    } else {
                        customCategoryId = 0;
                    }
                }
                if (!albumCustomcategoryId || (albumCustomcategoryId == customCategoryId)) {
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("待上传")).css({
                        color: "#333"
                    });
                } else {
                    var params = {
                        "title": LCT("错误"),
                        "discription": LCT("专辑所属分类与所选分类不符"),
                        "iconType": "triangle",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("专辑所属分类与所选分类不符")).css({
                        color: "red"
                    });
                    return false;
                }
                uploadFileParams["uploadStatus"] = "1";//上传中
                $("#uploadstatus_"+md5).val("1");

                uploadFileParams["param"] = "&mmsType=0&albumId=" + albumId + "&category=" + categoryId + "&customCategoryId=" + customCategoryId+"&videoName="+fileName+"&md5="+md5+"&logosite="+logosite;
                // uploadFileParams["param"] = "&mmsType=0&albumId=" + albumId + "&category=" + categoryId + "&customCategoryId=" + customCategoryId+"&videoName="+fileName+"&md5="+md5;

                $("#selectAlbum_button_"+md5).attr("disabled","disabled");
                $("#addCatagory_"+md5).attr("disabled","disabled");
                $("#albumId_"+md5).attr("disabled","disabled");
                // $("#add_customCategory_con_"+md5).attr("disabled","disabled");
                $("#add_customCategory_con_"+md5+" select").attr("disabled","disabled");
                if(uploadIngCount > 4){
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("队列中")).css({
                        color: "red"
                    });
                    uploadQueArr.push(md5);
                    uploadFileParams["uploadStatus"] = "3";//队列中
                    $("#uploadstatus_"+md5).val("3");
                    $("#upload_"+md5).css("display","none");
                }else {
                    uploadIngCount++;
                    ksUpload(md5);
                }

            }
        });

        //上传--批量
        $("#allUpload_Btn").on("click", function() {
            // 每条数据都要加上 leFileOperation.fileUploadList[md5].fileName = "";
            // 全部上传的时候需要对 leFileOperation.fileUploadList[md5].parameter 进行参数传递  如：parameter = "&hsc=1&album=123";
            //parent.window.vaasFileUpload.addFileCallback();
            var tr = $("#maintable tbody tr");
            var md5_arr = [];
            if (tr.length) {
                //校验bucket、域名信息
                if(!spInfoInitCheck()){
                    var params = {
                        "title": LCT("错误"),
                        "discription": LCT("请完善bucket、域名等信息"),
                        "iconType": "triangle",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                    return;
                }

                var fileName_arr = [];
                for (var i = 0; i < tr.length; i++) {
                    var md5 = $(tr[i]).attr("md5");
                    var uploadFileParams = uploadFileList[md5];
                    if($("#uploadstatus_"+md5).val() == "1" || uploadFileParams["uploadStatus"] == "1" || uploadFileParams["uploadStatus"] == "2") {
                    	continue;
                    }
                    var fileName = $(tr[i]).find("input[videoname='videoName']").val();
                    var logosite = $("#logosite_" + md5).val();
                    var albumId = $("#albumId_" + md5).val();
                    var albumCustomcategoryId = $(tr[i]).find("input[albumid='albumId']").attr("album-customcategory-id");
                    var categoryId = $("#addCatagory_" + md5).attr("data-id");
                    var customCategoryId;
                    var arr_option = $("#add_customCategory_con_" + md5 + " option:selected");
                    //var reg = /^[\u4e00-\u9fa5 a-zA-Z0-9\•\！\【\】\？\“\”\‘\’\《\》\（\）\，\。\—\*\：\!\[\]\?\"\'\<\>\(\)\,\.\-\_\*\:]{1,50}$/;
                    var boo = true;
                    if (vrsFn.getStringLen(fileName) < 2 || vrsFn.getStringLen(fileName) > 50) {
                        boo = false;
                    }
                    if (!boo) {
                        var params = {
                            "title": LCT("错误"),
                            "discription": LCT("视频名称最小长度为2，上限长度为50"),
                            "iconType": "triangle",
                            "confirmBtn": true //确定按钮显示与否true or fasle
                        };
                        $("body").toolsalert(params);
                        $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("视频名称格式不正确")).css({
                            color: "red"
                        });
                        return false;
                    } else {
                        $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("待上传")).css({
                            color: "#333"
                        });
                    }
                    fileName_arr.push(fileName);
                    for (var j = arr_option.length - 1; j >= 0; j--) {
                        if ($(arr_option).eq(j).attr("data-id")) {
                            customCategoryId = $(arr_option).eq(j).attr("data-id");
                            break;
                        } else {
                            customCategoryId = 0;
                        }
                    }
                    if (!albumCustomcategoryId || (albumCustomcategoryId == customCategoryId)) {
                        $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("待上传")).css({
                            color: "#333"
                        });
                    } else {
                        var params = {
                            "title": LCT("错误"),
                            "discription": LCT("专辑所属分类与所选分类不符"),
                            "iconType": "triangle",
                            "confirmBtn": true //确定按钮显示与否true or fasle
                        };
                        $("body").toolsalert(params);
                        $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("专辑所属分类与所选分类不符")).css({
                            color: "red"
                        });
                        return false;
                    }
                    md5_arr.push(md5);
                    uploadFileParams["uploadStatus"] = "1";//上传中
                    $("#uploadstatus_"+md5).val("1");
                    uploadFileParams["param"] = "&mmsType=0&albumId=" + albumId + "&category=" + categoryId + "&customCategoryId=" + customCategoryId+"&videoName="+fileName+"&md5="+md5+"&logosite="+logosite;
                    // uploadFileParams["param"] = "&mmsType=0&albumId=" + albumId + "&category=" + categoryId + "&customCategoryId=" + customCategoryId+"&videoName="+fileName+"&md5="+md5;
                }
                if (unique(fileName_arr).length != fileName_arr.length) {
                    var params = {
                        "title": LCT("错误"),
                        "discription": LCT("当前视频列表中有名称相同的视频"),
                        "iconType": "triangle",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                    return false;
                } else {
                    //$("#maintable tbody tr").remove();
                    //parent.window.vaasFileUpload.addFileCallback();
                	//金山云上传
                	for(var i=0; i<md5_arr.length; i++) {
                		var md5 = md5_arr[i];
                        $("#selectAlbum_button_"+md5).attr("disabled","disabled");
                        $("#addCatagory_"+md5).attr("disabled","disabled");
                        $("#albumId_"+md5).attr("disabled","disabled");
                        $("#add_customCategory_con_"+md5+" select").attr("disabled","disabled");
                        if(uploadIngCount > 4){
                            $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("队列中")).css({
                                color: "red"
                            });
                            uploadQueArr.push(md5);
                            uploadFileParams["uploadStatus"] = "3";//队列中
                            $("#uploadstatus_"+md5).val("3");
                            $("#upload_"+md5).css("display","none");
                        }else {
                            uploadIngCount++;
                            ksUpload(md5);
                        }
                	}
                }

            } else {
                var params = {
                    "title": LCT("错误"),
                    "discription": LCT("没有要上传的视频"),
                    "iconType": "triangle",
                    "confirmBtn": true //确定按钮显示与否true or fasle
                };
                $("body").toolsalert(params);
                return false;
            }

        });

        function multipartUploadNew(params, cb) {

            var config;
            var bucketName = Ks3.config.bucket;
            var key = params.Key ;
            key = Ks3.encodeKey(key);
            var region = params.region || Ks3.config.region;
            Ks3.config.baseUrl =  Ks3.ENDPOINT[region];
            var file = params.File;
            var trMd5 = params.trMd5;
            var totalSize = params.TotalSize; //文件总大小
            var progressKey = getProgressKey(file.name, file.lastModified, bucketName, key);
            var contentType = params.ContentType;
            var progressBar =  document.getElementById(trMd5+"_progressBar");
            $("#startOrstop_"+trMd5).css("display","inline-block");

            // 分块上传
            async.auto({
                    /**
                     * 初始化配置文件,如果没有就新建一个
                     */
                    init: function(callback) {
                        //重置暂停标识
                        Ks3.config.stopFlag = false;

                        if ( !localStorage[progressKey]) {
                            configInit(file.name,totalSize, progressKey, function(err) {
                                callback(null);
                            })
                        } else {
                            callback(null);
                        }
                    },
                    show: ['init', function(callback) {
                        // console.log('  开始上传文件: ' + progressKey)
                        config = JSON.parse(localStorage.getItem(progressKey));

                        progressBar.max = config['count'];
                        progressBar.value = config['index'];

                        var begintime = new Date().getTime();
                        $("tr[md5='" + trMd5 + "']").find("p[uploadStatus='uploadStatus']").html(showSpeed(begintime,trMd5,0)).css({
                            color: "#333"
                        });
                        $("#time_"+trMd5).val(begintime);

                        var baifenbi = getBaifenbi(progressBar.value,progressBar.max);

                        $("#"+trMd5+"_baifenbi").html(baifenbi);
                        $("#"+trMd5+"_baifenbi").css("display","block");

                        callback(null);
                    }],
                    /**
                     * 获取uploadId,如果有就直接读取,没有就从服务器获取一个
                     */
                    getUploadId: ['init', function(callback) {
                        config = JSON.parse(localStorage.getItem(progressKey));
                        var uploadId = config['uploadId'];

                        if ( !! uploadId) {
                            callback(null, uploadId);
                        } else {
                            Ks3.multitpart_upload_init(params, function(err, uploadId) {
                                if(err) {
                                    console.log(err);
                                    callback(err);
                                }else {
                                    config['uploadId'] = uploadId;
                                    $("#uploadId_"+trMd5).val(uploadId);
                                    localStorage.setItem(progressKey, JSON.stringify(config));
                                    saveVidUploadId(trMd5);
                                    callback(null, uploadId);
                                }
                            });
                        }
                    }],
                    upload: ['getUploadId', function(callback, result) {
                        if(result.getUploadId) {
                            var uploadId = result.getUploadId;
                            Ks3.config.currentUploadId = uploadId;
                            config = JSON.parse(localStorage.getItem(progressKey));
                            var count = config['count'];
                            var index = config['index'];
                            var chunkSize = config['chunkSize'];
                            var currentRetries = config['retries'];
                            up();
                        }else {
                            callback({'msg':'未获取到上传ID，请点击继续或者删除重新上传！'});
                        }

                        // 在报错的时候重试
                        function retry(err) {
                            console.log('upload ERROR:', err);
                            if (currentRetries > Ks3.config.retries) {
                                cb({'msg':'重试'+currentRetries+'次失败，请检查网络是否畅通！请点击继续或者删除重新上传！'});
                            } else {
                                currentRetries = currentRetries + 1;
                                config['retries'] = currentRetries;
                                localStorage.setItem(progressKey, JSON.stringify(config));
                                console.log('第 ' + currentRetries + ' 次重试');
                                up();
                            }
                        }
                        // 真正往服务端传递数据
                        function up() {
                            // console.log('正在上传 ', 'index: ' + index);
                            var start = (index - 1) * chunkSize;
                            // 判断是否已经全部都传完了
                            if (index <= count) {
                                getFileContent(file, totalSize,chunkSize, start, function(body) {
                                    delete params.File;
                                    params.UploadId = uploadId;
                                    params.PartNumber = index;
                                    params.body = body;
                                    params.type = contentType;
                                    // console.log('正在上传第 ', index, ' 块,总共: ', + count + ' 块');
                                    try {
                                        Ks3.upload_part(params, function(err, partNumber, etag) {
                                            if (err) {
                                                if(err.status == 413 || err.status == 415) {
                                                    console.log(err);
                                                    cb({'msg':'上传请求拒绝，请点击继续或者删除重新上传！'});
                                                }else {
                                                    retry(err);
                                                }
                                            } else {
                                                var stopFlag =  $("#star_state_"+trMd5).val();
                                                if(stopFlag == "0") {
                                                    config['index'] = index;
                                                    progressBar.value = index;

                                                    var ot = $("#time_"+trMd5).val();
                                                    $("tr[md5='" + trMd5 + "']").find("p[uploadStatus='uploadStatus']").html(showSpeed(ot,trMd5,index)).css({
                                                        color: "#333"
                                                    });
                                                    $("#"+trMd5+"_baifenbi").html(getBaifenbi(index,count));

                                                    config['etags'][index] = etag;
                                                    localStorage.setItem(progressKey, JSON.stringify(config));
                                                    index = index + 1;

                                                    up();
                                                }else {
                                                    cb({'msg': "上传暂停"});
                                                }
                                            }
                                        });
                                    } catch(e) {
                                        retry(e);
                                    }
                                })
                            } else {
                                // console.log('发送合并请求，'+trMd5);
                                delete params.File;
                                params.UploadId = uploadId;
                                params.body = generateCompleteXML(progressKey);

                                Ks3.upload_complete(params, function(err, res) {
                                    if (err) throw err;
                                    cb(err, res);
                                })
                            }
                        };

                    }],
                    /**
                     * 对文件进行上传
                     * 上传后要把信息写到本地存储配置文件中
                     * 如果都上传完了,就把相关本地存储信息删除
                     * 并通知服务器,合并分块文件
                     */
                },
                function(err, results) {
                    console.log(err);
                    if (err) {
                        //throw err;
                        cb(err,results);
                    }else{
                        //删除配置
                        localStorage.removeItem(progressKey);
                    }
                    if (cb) {
                        cb(err, results);
                    }
                });
            
        }

        function saveVidUploadId(md5) {
            var uploadId = $("#uploadId_"+md5).val();
            var vid = $("#vid_"+md5).val();
            $.post(basePath + "videoController/saveVidUploadId.do",{
                    vid : vid,uploadId:uploadId
                },
                function(data){
                    var res = $.parseJSON(data);
                    console.log("uploadidSave="+res.msg);
                });
        }

        /**
         * 计算用于记录上传任务进度的key
         * @param name
         * @param lastModified
         * @param bucket
         * @param key
         */
        function getProgressKey(name, lastModified, bucket, key) {
            var result = name + "-" + lastModified + "-" + bucket + "-" + key;
            return result;
        }

        /**
         * 把配置信息写到localStorage里,作为缓存
         * @param file 上传文件的句柄
         * @param progressKey  文件上传进度缓存在localStorage中的标记key
         * @param cb
         */
        function configInit(fileName,fileSize, progressKey, cb) {
            var count = parseInt(fileSize / Ks3.config.chunkSize) + ((fileSize % Ks3.config.chunkSize == 0 ? 0: 1));

            if (count == 0) {
                console.log('The file is empty.')
            } else {
                config = {
                    name: fileName,
                    size: fileSize,
                    chunkSize : Ks3.config.chunkSize,
                    retries : Ks3.config.retries,
                    count:count,
                    index: 1,
                    etags:{}
                }
                localStorage.setItem(progressKey, JSON.stringify(config));
                if(cb) {
                    cb(null);
                }
            }
        }
        
        function showSpeed(ot,md5,index) {
            var nt = new Date().getTime();//获取当前时间
            var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
            $("#time_"+md5).val(new Date().getTime());
            var speed ;
            if(index == 0){
                speed = 0;
            }else{
                speed = Ks3.config.chunkSize/pertime;//单位b/s
            }
            // var bspeed = speed;
            var units = 'KB/s';//单位名称
            if(speed/1024>1){
                speed = speed/1024;
                units = 'KB/s';
            }
            if(speed/1024>1){
                speed = speed/1024;
                units = 'M/s';
            }
            speed = speed.toFixed(1);
            return  speed+units ;
            // var resttime = ((count-index*Ks3.config.chunkSize)/bspeed).toFixed(1);
            //+//'，预计剩余时间：'+resttime+'s';

        }

        function getBaifenbi(index,count) {
            var start = (index - 1) / count;
            return Math.round(start * 100) + "%";
        }

        /**
         * 获取指定的文件部分内容
         */
        function getFileContent(file,fileSize, chunkSize, start, cb) {
            var start = start;
            var bufferSize = fileSize;
            var index = start / chunkSize;
            // console.log('正在读取下一个块的文件内容 index:' + index);
            if (start + chunkSize > bufferSize) {
                chunkSize = bufferSize - start;
            }
            // console.log('分块大小:', chunkSize);

            if(file.slice) {
                var blob = file.slice(start, start + Ks3.config.chunkSize);
            }else if(file.webkitSlice) {
                var blob = file.webkitSlice(start, start + Ks3.config.chunkSize);
            }else if(file.mozSlice) {
                var blob = file.mozSlice(start, start + Ks3.config.chunkSize);
            }else{
                throw new Error("blob API doesn't work!");
            }

            var reader = new FileReader();
            reader.onload = function(e) {
                cb(e.target.result);
            };
            reader.readAsArrayBuffer(blob);
        }

        /**
         * 生成合并分块上传使用的xml
         */
        function generateCompleteXML(progressKey) {
            var content = JSON.parse(localStorage.getItem(progressKey));
            var index = content.index;
            var str = '';
            if (index > 0) {
                str = '<CompleteMultipartUpload>';
                for (var i = 1; i <= index; i++) {
                    str += '<Part><PartNumber>' + i + '</PartNumber><ETag>' + content.etags[i] + '</ETag></Part>'
                }
                str += '</CompleteMultipartUpload>';
            }
            return str;
        }
        /**********ks 分块上传 end**********/

        //金山云上传
        Ks3.config.AK = '';
        Ks3.config.SK = '';
        Ks3.config.region = 'BEIJING';
        Ks3.config.bucket = '';

        function ksUpload(md5) {
        	var uploadFileParams= uploadFileList[md5];
        	var param = uploadFileParams["param"];
        	var file = uploadFileParams["file"];
        	var gfmt = uploadFileParams["type"];
        	var fileSize = uploadFileParams["fileSize"];
        	var url = basePath + "videoController/uploadFileInit.do?gfmt="+gfmt+"&fileSize="+fileSize+param;
        	$.post(url,function(data){
        		var res = $.parseJSON(data);
                if(res.success) {
                    Ks3.config.AK = res.obj.ksak;
                    Ks3.config.SK = res.obj.kssk;
                    Ks3.config.bucket = res.obj.bucket;
        			var objKey = res.obj.originPath;
        			var vId = res.obj.vid;
        			$("#vid_"+md5).val(vId);
        			$("#vidkey_"+md5).val(objKey);
                    $("#upload_"+md5).css("display","none");

                    upload2(md5);
        		}else {
                    var params = {
                        "title": LCT("错误"),
                        "discription": LCT(res.msg),
                        "iconType": "triangle",
                        "confirmBtn": true //确定按钮显示与否true or fasle
                    };
                    $("body").toolsalert(params);
                }
        	});
        	
        }

        function upload2(md5) {
            var uploadFileParams = uploadFileList[md5];
            var param = uploadFileParams["param"];
            var file = uploadFileParams["file"];
            var gfmt = uploadFileParams["type"];
            var fileSize = uploadFileParams["fileSize"];
            var postcurrentRetries = 0;

            var vId = $("#vid_"+md5).val();
            var objKey = $("#vidkey_"+md5).val();

            multipartUploadNew({
                Key: objKey,
                File: file,
                region : Ks3.config.region,
                ACL: 'public-read',
                TotalSize:fileSize,
                ContentType:gfmt,
                Sinature: '',
                trMd5:md5
            },function(err,res) {
                if(err) {
                    console.log(err);
                    $("#star_state_"+md5).val("1");
                    $("#startOrstop_"+md5).val(LCT("继续"));
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT(err.msg)).css({
                        color: "red"
                    });
                    // if(err.msg != 'stop') {
                    //     uploadFileParams["uploadStatus"] = "-1";
                    //     $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("上传失败，请重新上传")).css({
                    //         color: "red"
                    //     });
                    //     //删除
                    //     var url = basePath + "videoController/uploadRemove.do?videoId="+vId;
                    //     $.post(url,function(data){});
                    // }else{
                    //     $("#star_state_"+md5).val("1");
                    //     $("#startOrstop_"+md5).val(LCT("继续"));
                    //     $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("上传暂停")).css({
                    //         color: "red"
                    //     });
                    // }
                }else{
                    //上传完成保存到待转码任务信息表
                    retryPostComplent(vId);
                }
            });
            
            function retryPostComplent(vid){
            	if(postcurrentRetries < 2){
            		postcurrentRetries++;
            		$.post(basePath + "videoController/pendingTranscodeTask.do?videoId="+vid,
                    		function(data){
                    			var res = $.parseJSON(data);
    	                    	if(res.success){
    	                    		$("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("上传完成"));
                                    uploadFileParams["uploadStatus"] = "2";//上传完成
    	                            delete uploadFileList[md5];
    	                            delete leFileOperation.fileUploadList[md5];
                                    //继续上传下一个任务
                                    if(uploadQueArr.length > 0){
                                        var que_md5 =  uploadQueArr.shift();
                                        ksUpload(que_md5);
                                    }
                                    $("tr[md5='" + md5 + "']").remove();

    	                    	}else{
    	                    		retryPostComplent(vid);
    	                    	}
                    });
            	}else {
                    uploadFileParams["uploadStatus"] = "-1";
                    $("tr[md5='" + md5 + "']").find("p[uploadStatus='uploadStatus']").html(LCT("上传失败，请重新上传")).css({
                        color: "red"
                    });
                    //删除
                    var url = basePath + "videoController/uploadRemove.do?videoId="+vid;
                    $.post(url,function(data){});
                    //继续上传下一个任务
                    if(uploadQueArr.length > 0){
                        var que_md5 = uploadQueArr.shift();
                        ksUpload(que_md5);
                    }
                }
            }

        }

        
    },
    dozen: function() {
        $("#addDataType_con").change(function() {
            var categoryId = $("#addDataType").attr("data-id");
            var customCategoryId = "";
            var arr = $("#addDataType_con option:selected");
            var tr = $("#maintable tbody tr");
            for (var i = arr.length - 1; i >= 0; i--) {
                var val = $(arr).eq(i).val();
                if (val != LCT("请选择")) {
                    customCategoryId = $(arr).eq(i).attr("data-id");
                    break;
                } else {
                    customCategoryId = 0;
                }
            }
            if (customCategoryId != 0 && customCategoryId != null) {
                var obj = classfiyObject.getPidAndId(customCategoryId, window.classfiyObject_obj, 1);
                for (var i = 0; i < tr.length; i++) {
                    category_obj = {};
                    var md5 = $(tr[i]).attr("md5");
                    $("#addCatagory_" + md5).attr("data-id", categoryId);
                    $("#addCatagory_" + md5 + " option[data-id='" + categoryId + "']").prop("selected", true);
                    category_obj.category = categoryId;
                    if (categoryId == '0') {
                        $("#add_customCategory_con_" + md5).html(vrsFn.customCategoryInitDom);
                    } else {
                        $("#add_customCategory_con_" + md5).html('');
                        buildEdit.init("add_customCategory_con_" + md5);
                        $("#add_customCategory_con_" + md5 + " select:first").removeClass("ml-3");
                    }
                    if (obj._level == 1) {
                        $("#add_customCategory_con_" + md5).find("select").eq(0).find("option[data-id=" + customCategoryId + "]").prop("selected", true);
                        $("#add_customCategory_con_" + md5).find("select").eq(0).change();
                    } else if (obj._level == 2) {
                        $("#add_customCategory_con_" + md5).find("select").eq(0).find("option[data-id=" + obj._pid + "]").prop("selected", true);
                        $("#add_customCategory_con_" + md5).find("select").eq(0).change();
//                        $("#add_customCategory_con_" + md5).find("select").eq(1).find("option[data-id=" + obj._id + "]").prop("selected", true);
                    } 
//                    else if (obj._level == 3) {
//                        var obj3 = classfiyObject.getPidAndId(obj._pid, window.classfiyObject_obj, 1);
//                        $("#add_customCategory_con_" + md5).find("select").eq(0).find("option[data-id=" + obj3._pid + "]").prop("selected", true);
//                        $("#add_customCategory_con_" + md5).find("select").eq(0).change();
//                        $("#add_customCategory_con_" + md5).find("select").eq(1).find("option[data-id=" + obj._pid + "]").prop("selected", true);
//                        $("#add_customCategory_con_" + md5).find("select").eq(1).change();
//                        $("#add_customCategory_con_" + md5).find("select").eq(2).find("option[data-id=" + obj._id + "]").prop("selected", true);
//                    }
                }
            } else {
                for (var i = 0; i < tr.length; i++) {
                    var md5 = $(tr[i]).attr("md5");
                    $("#add_customCategory_con_" + md5).find("option").eq(0).prop("selected", true);
                    $("#add_customCategory_con_" + md5).find("select").eq(0).change();
                }
            }
        });
    }
};
var buildEdit = {
    init: function(id) {
        this.connect(id);
    },
    start: false,
    connect: function(id) { //请求ajax
        $.ajax({
            url: basePath + "customCategoryController/dataGrid.do",
            data: category_obj,
            type: "get",
            async: false,
            dataType: "json",
            success: function(data) {
                window.classfiyObject_obj = data;
                buildEdit.createDom(data, id);
            }
        })
    },
    createDom: function(data, id) {
        var s1 = new buildEdit.createClass(id, data);
        s1.init(3, id);
    },
    createClass: function(id, data) {
        this.oParent = document.getElementById(id);
        this.data = data;
        this.aSel = this.oParent.getElementsByTagName("select");
    },
    albumTable_upload: function() {
        //渲染数据分类

        domOperationFn.catagory("#addDataType", "addDataType_con");
        //渲染三级分类
        if (buildEdit.start) {
            return
        }
        $("#customCategory_con").html(vrsFn.customCategoryInitDom);

        //渲染专辑列表
        var lcsetting_modal = {
            "ajax": basePath + "albumController/dataGrid.do?albumStatus=1",
            "pagekey": "page",
            "rowskey": "rows",
            "rowsvalue": 5,
            "dataType": "text", //到时候去掉此参数
            "highlight": true,
            "columns": [{
                "data": "lcall",
                "format": function(i, j, d) {
                    return '<input data-albumId="' + d.albumId + '" category-id="' + d.category + '" customCategory-id="' + (d.customCategoryId || 0) + '" type="radio" class="icheckFlatRed" name="albumId">';
                }
            }, {
                "data": "albumId"
            }, {
                "data": "lcall",
                "format": function(i, j, d) {
                    var albumName = d.albumName;
                    albumName_modal_arr.push(albumName);
                    return '';
                }
            }, {
                "data": "videoCount"
            }, {
                "data": "lcall",
                "format": function(i, j, d) {
                    if (d.customCategoryId && d.customCategoryId != 0) {
                        return d.customCategoryName;
                    } else {
                        return d.categoryName;
                    }
                }
            }],
            "pages": "#pages",
            "emptymsg": LCT("暂无数据"),
            "errormsg": LCT("数据请求错误，请稍后再试"),
            "waitmsg": LCT("加载中，请稍后") + "...",
            "callback": function(data) {
                $('.icheckFlatRed').iCheck({
                    cursor: true,
                    checkboxClass: 'icheckbox_flat-red',
                    radioClass: 'iradio_flat-red',
                    increaseArea: '20%'
                });
                //专辑名称title
                var tr = $("#maintable_modal tbody tr");
                for (var i = 0; i < tr.length; i++) {
                    var remark_html = albumName_modal_arr[i];
                    $(tr[i]).find("td:eq(2)").text(remark_html);
                }
                albumName_modal_arr = [];
            }
        };
        $("#maintable_modal").lctable(lcsetting_modal, params_modal, ".page-zj");
        //专辑选择搜索
        $(".btn_search_modal").bind("click", function() {
            var value_name = $.trim($(".search_name_modal").val());
            var categoryId = $(".category").attr("data-id");
            var arr = $("#customCategory_con option:selected");
            var customCategoryId = "";
            for (var i = arr.length - 1; i >= 0; i--) {
                var val = $(arr).eq(i).val();
                if (val != LCT("请选择")) {
                    customCategoryId = $(arr).eq(i).attr("data-id");
                    break;
                }
            }
            if (value_name) {
                params_modal["albumName"] = value_name;
            } else {
                delete params_modal["albumName"];
            }
            if (categoryId == "0") {
                delete params_modal["category"];
            } else {
                params_modal["category"] = categoryId;
            }
            if (customCategoryId == "") {
                delete params_modal["customCategoryId"];
            } else {
                params_modal["customCategoryId"] = customCategoryId;
            }
            lcsetting_modal.thisPage = 1;
            $("#maintable_modal").lctable(lcsetting_modal, params_modal, ".page-zj");
        });
        //去除搜索bind事件
        $('#modal-select-zhuanjiId').on('hide.bs.modal', function() {
            category_obj = {};
            params_modal = {};
            $("#customCategory_con").html(vrsFn.customCategoryInitDom);
            $(".category option[data-id='0']").prop("selected", true);
            $(".category").attr("data-id", "0");
            $("#modal-select-zhuanjiId").removeAttr("md5-id");
            $(".btn_search_modal").click();
        });
    }
}
buildEdit.createClass.prototype = {
    init: function(num, id) {
        var This = this;
        for (var i = 0; i < 2; i++) {
            var oSel = document.createElement("select");
            oSel.index = i;
            oSel.className = "form-control ml-3";
            this.oParent.appendChild(oSel);
            oSel.onchange = function() {
                This.change(this.index);
            }
        }
        this.first();
    },
    change: function(iNow) {
        switch (iNow) {
            case 0: //改变1级时候处理select
                var now = this.aSel[iNow].selectedIndex; //option的index
                this.zero(now);
                break;
            case 1: //改变2级时候处理
                var now = this.aSel[iNow].selectedIndex;
                this.one(now);
//            case 2: //改变3级时候处理
//                var now = this.aSel[iNow].selectedIndex;
//                this.two(now);
        }
    },
    noting: function() {
        for (var i = 0; i < 1; i++) {
            var opt = document.createElement("option");
            opt.innerHTML = LCT("请选择");
            this.aSel[i + 1].appendChild(opt);
        }
    },
    zero: function(n) { //改变一级处理函数
        for (var i = 0; i < 2; i++) { //清空源信息;
            if (i == 0) {
                continue
            }
            this.aSel[i].innerHTML = "";
        }
        if (n == 0) { //选择的请选择
            this.noting();
            return
        }
        var arr = this.data[n - 1]; //第一级select
        if (arr.children.length) { //第二级select option
            for (var i = 0; i < arr.children.length; i++) {
                var opt = document.createElement("option");
                opt.innerHTML = arr.children[i].text;
                opt.setAttribute("data-id", arr.children[i].id);
                opt.setAttribute("category-id", arr.children[i].category);
                this.aSel[1].appendChild(opt);
            }
        } else {
            this.noting();
            return;
        }

//        if (arr.children[0].children.length) { //第三级select option
//            for (var i = 0; i < arr.children[0].children.length; i++) {
//                var opt = document.createElement("option");
//                opt.innerHTML = arr.children[0].children[i].text;
//                opt.setAttribute("data-id", arr.children[0].children[i].id);
//                opt.setAttribute("category-id", arr.children[0].children[i].category);
//                this.aSel[2].appendChild(opt);
//            }
//        } else {
//            var opt = document.createElement("option");
//            opt.innerHTML = LCT("请选择");
//            this.aSel[2].appendChild(opt);
//        }
    },
    one: function(n) { //改变二级处理函数
        var a1 = this.aSel[0].selectedIndex - 1;
        var arr = this.data[a1].children[n];
        // this.aSel[2].innerHTML = "";
        if (arr.children.length != 0) {

            for (var i = 0; i < arr.children.length; i++) {
                var opt = document.createElement("option");
                opt.innerHTML = arr.children[i].text;
                opt.setAttribute("data-id", arr.children[i].id);
                opt.setAttribute("category-id", arr.children[i].category);

                // this.aSel[2].appendChild(opt);
            }
        } else {
            var opt = document.createElement("option");
            opt.innerHTML = LCT("请选择");
            // this.aSel[2].appendChild(opt);
        }

    },
    two: function(n) {

    },
    first: function() { //上来初始化
        var arr = this.data;
        for (var i = 0; i < 2; i++) {
            var opt = document.createElement("option");
            opt.innerHTML = LCT("请选择");
            this.aSel[i].appendChild(opt);
        }
        for (var i = 0; i < arr.length; i++) {
            var opt = document.createElement("option");
            opt.innerHTML = arr[i].text;
            $(opt).attr("data-id", arr[i].id);
            $(opt).attr("category-id", arr[i].category);
            this.aSel[0].appendChild(opt);
        }
    }
}
$(function() {
    domOperationFn.init();
    $("#customCategory_con select").removeClass("ml-3");
})

function spInfoInitCheck() {
    var boo = true;
    $.ajax({
        url: basePath + "videoController/spInfoInitCheck.do",
        type: "GET",
        async: false,
        success: function(data) {
            var res = $.parseJSON(data);
            if(res.success){
                boo = true;
            }else {
                boo = false;
            }
        }
    })
    return boo;
}




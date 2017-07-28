<%@ page import="java.util.Date" %>
<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    //String path = request.getContextPath();
    //String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="renderer" content="webkit">
	<title>视频管理-视频上传</title>
<!--  <jsp:include page="/inc_css.jsp" />-->	
</head>
<body>
<div class="main">
    <!-- context/s-->
    <!-- search-info/s-->
    <div class="search-info search-info-audit mt-20 clearfix">
        <div class="pull-left">
            <a href="javascript:void(0)" id="addFiles" class="btn btn-query btn-l">添加文件</a >
        </div>
        <!-- <a href="javascript:void(0)" class="btn btn-gray btn-l ml-15" id="malvSetting" data-toggle="modal"
              data-target="#modal-malv-set">设置</a > -->
        <div class="live-alarm-tips">
            <ul>
                <li>1）平台支持的视频格式：
                    <a href="javascript:void(0)" id="ViewDetails">查看</a >
                </li>
                <li>2）如因网络原因导致上传失败，请尝试继续或重新上传！</li>
                <li>3）视频上传过程中，请勿离开此页面或者刷新此页面，否则会导致视频上传任务失败！</li>
                <li>4）视频名称最小长度为2，上限长度为50！</li>
                <li>5）批量上传任务上限5个，如果任务大于5个，系统会自动分解，分批次上传；（适合无人值守，可以选择多个批量上传）</li>
            </ul>
            <div class="alert alert-tip alert-success hide" role="alert" id="PromptMess">
                <p>.wmv/.wm/.dat/.asf/.rm/.rmvb/.ram/.mpg/.mpeg/.mp4</p >
                <p>.mov/.m4v/.mkv/.flv/.vob/.qt/.divx/.cpk/.fli/.flc</p>
                <p>.mod/.dvix/.dv/.ts</p >
            </div>
        </div>

    </div>
    <!-- app table-->
    <div class="media-upload-box mt-10 clearfix">
        <table id="maintable"
               class="table table-default table-bordered table-center break-all table-padding">
            <thead>
            <tr>
                <th width="15%">基本信息</th>
                <th width="10%">视频名称</th>
                <th width="15%">所属专辑</th>
                <th width="10%">上传状态</th>
                <th width="35%">视频分类</th>
                <th width="8%">转码logo位置</th>
                <th width="7%">操作</th>
            </tr>
            </thead>
            <tbody class="le-text-xs">

            </tbody>
            <tfoot class="le-text-xs">
            <tr>
                <td></td>
                <%--<td class="text-center">--%>
                    <%--<a href="javascript:void(0)" id="allUpload_Btn" class="btn btn-danger" style="background: #1396e5;border-color: #1396e5;">全部上传</a>--%>
                <%--</td>--%>
                <td></td>
                <td>
                    <div class="form-group">
                        <label class="ml-10">
                            <%--批量--%>
                            <input type="text" id="piLiangAbumlId" readonly="readonly" maxlength="10" class="form-control ml-5" value="" albumId="albumId" placeholder="" style="width: 60%;display: inline-block;">
                            <!--<a data-toggle="modal" href="#modal-select-zhuanjiId" class="joinEditor">选择</a>-->
                            <input type="button" class="joinEditor" style="color:blue; background:transparent;border:0px;outline: none;" value="选择" />
                        </label>
                    </div>
                </td>
                <td></td>
                <td>
                    <div class="form-inline">
                        <div class="form-group">
                            <!--<label class="ml-10 mr-10">批量</label>-->
                            <label class="mr-5" style="width:95px;text-align:right;">根分类 ：</label>
                            <select class="form-control" id="addDataType">
                                <option value="addDataType">请选择</option>
                            </select>
                            <br/><br />
                            <label class="mr-5" style="width:95px;text-align:right;">自定义分类 ：</label>
                            <span id="addDataType_con">
                            <select class="form-control" classify="allTypeOne">
                                <option value="allTypeOne" fatherId="allTypeOne">请选择</option>
                            </select>
                                <select class="form-control" classify="allTypeTwo">
                            <option value="allTypeTwo" fatherId="allTypeTwo">请选择</option>
                                </select>
	                      <!--   </select> <select class="form-control" classify="allTypeThree">
	                            <option value="allTypeThree" fatherId="allTypeThree">请选择</option>
	                        </select> -->
                                </span>
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <input type="hidden" id="spLogoSite_v" value="${spLogoSite}">
                    <input type="hidden" id="spLogoStatus_v" value="${spLogoStatus}">
                    <select class="form-control logosite" id="logosite_all">
                        <option <c:if test="${spLogoStatus==0}">selected</c:if> value="-1">无</option>
                        <option <c:if test="${spLogoSite==0 and spLogoStatus==1}">selected</c:if> value="0">左上</option>
                        <option <c:if test="${spLogoSite==1 and spLogoStatus==1}">selected</c:if> value="1">右上</option>
                        <option <c:if test="${spLogoSite==2 and spLogoStatus==1}">selected</c:if> value="2">左下</option>
                        <option <c:if test="${spLogoSite==3 and spLogoStatus==1}">selected</c:if> value="3">右下</option>
                    </select>
                </td>
                <td class="text-center">
                    <a href="javascript:void(0)" id="allUpload_Btn" class="btn btn-danger" style="background: #1396e5;border-color: #1396e5;">批量上传</a>
                    <a href="javascript:void(0)" class="btn btn-danger" id="delMulti">批量删除</a>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
    <!-- context/e-->
    <!-- modal-malv-set/s-->
    <!-- <div class="modal fade" id="modal-malv-set">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header modal-header-primary">
                    <button type="button" class="close" data-dismiss="modal"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title">码率设置</h4>
                </div>
                <div class="modal-body">
                    <form action="" method="post"
                          class="form-horizontal margin-30 clearfix">
                        <div id="malvContent" class="form-group text-center clearfix">

                        </div>
                        <div class="form-group mt-50 text-center clearfix">
                            <input type="button" id="malvQueDing"
                                   class="btn btn-primary btn-xxl" value="确定" /> <a href="###"
                                                                                    data-dismiss="modal" class="btn btn-primary btn-xxl ml-20">取消</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div> -->
    <!-- modal-select-zhuanjiId/s-->
    <div class="modal fade modal-select-videoId" id="modal-select-zhuanjiId">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header modal-header-primary">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">选择专辑</h4>
                </div>

                <div class="modal-body">
                    <form action="" method="post" class="form-horizontal clearfix">
                        <div class="form-inline mt-10 text-center clearfix">
                            <div class="col-28">
                                <input type="text" class="search_name_modal form-control" name="" value=""
                                       placeholder="输入专辑名称">
                            </div>
                            <div class="col-18">
                                <label class="mtb-7">根分类：</label>
                            </div>
                            <div class="col-28">
                                <select class="form-control category" data-id="0"></select>
                            </div>
                        </div>
                        <div class="form-inline mt-20 text-center clearfix">
                            <div class="col-20">
                                <label class="mtb-7">自定义分类：</label>
                            </div>
                            <div id="customCategory_con" class="form-inline col-62"></div>
                            <div class="col-18" style="padding-right:0">
                                <a href="javascript:void(0)" class="btn_search_modal btn btn-primary" style="width: 100%;">搜素</a>
                            </div>
                        </div>
                        <div class="mt-20 clearfix">
                            <table id="maintable_modal" class="table table-hover table-default table-borded">
                                <thead>
                                <tr>
                                    <th width="12%">选择</th>
                                    <th width="15%">专辑ID</th>
                                    <th width="32%">专辑名称</th>
                                    <th width="16%">视频个数</th>
                                    <th width="25%">所属分类</th>
                                </tr>
                                </thead>
                                <tbody style="font-size:13px;"></tbody>
                                <tfoot>
                                <tr>
                                    <td colspan="5" style="background:none;">
                                        <!--page/s-->
                                        <div class="ui-page text-center" style="padding:5px 0;">
                                            <span class="page-zj"></span>
                                            <div class="clear"></div>
                                        </div>
                                        <!--page/e-->
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="form-group mt-10 text-center clearfix">
                            <a href="javascript:void(0)" data-dismiss="modal" class="btn btn-primary-transparent btn-xxl ml-20">取消</a>
                            <a href="javascript:void(0)" data-dismiss="modal" id="btn-zhuanji" class="btn btn-primary btn-xxl ml-20">确定</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- modal-select-zhuanjiId/e-->
  <!--  <jsp:include page="/inc_dom.jsp"/> --> 
</div>
	<!-- modal-malv-set/e-->
	<!-- alert/e-->
<!-- 	<jsp:include page="/inc_js.jsp" />-->
    <script type="application/javascript" >
        $(document).ready(function() {
            $("#ViewDetails").mouseover(function (){
                $("#PromptMess").removeClass("hide");
            }).mouseout(function (){
                $("#PromptMess").addClass("hide");
            });

        });
        setInterval("refSession()", 600000); //10分钟请求一次
        /*前端心跳轮询,防止上传时间过长session丢失*/
        function refSession(){
            $.post("http://test.mam.cnlive.com/indexController/polling.do");
        }
    </script>
</body>
</html>

$(function() {
	/* Javascript代码片段 */
	var t = $('#sample-table').DataTable(
			{
				ajax : {
					// 指定数据源
					url : "../ad/findAllAdContent.do"
				},
				// 每页显示十条数据
				pageLength : 10,
				
				columns : [ {//每列绑定的数据(和数据源中返回的数据对应,data:"param" param要和返回的json数据中的属性对应)
					"data" : null//复选框
				
				}, {
					"data" : "id"//ID
				}, {
					"data" : "sort"//排序
				}, {
					"data" : "categoryname3"//分类
				}, {
					"data" : "img"//图片
				}, {
					"data" : "imgSize"//尺寸（大小）
				}, {
					"data" : "url"//链接地址
				}, {
					"data" : "createTime"//加入时间
				}, {
					"data" : "status"//状态
				}, {
					"data" : "productId"//操作
				}],
				"columnDefs" : [ //每列定义
						{
							"orderable": false,//复选框不排序
							"targets": 0,
							"render": function(data, type, row, meta) {
								// 渲染 把数据源中的标题和url组成超链接
								return '<th width="25px"><label><input type="checkbox"><span class="lbl"></span></label></th>';
							}
						},
						{
							"orderable":false,
							//分类不排序
							"targets":3
						},
						{
							"orderable":false,
							"targets":4,
							"render":function(data,type,row,meta){
								return '<td><img src="'+data+'" width="160px" height="80px"></td>';
							}
							
						},
						{
							"orderable":false,
							"targets":6,
							"render":function(data,type,row,meta){
								return '<td><a href="http://'+data+'" target="_blank">'+data+'</a></td>';
							}
						},
						{
							"targets":7,
							"render":function(data,type,row,meta){
								return '<td>'+data+'</td>';
							}
						},
						{
							"orderable":false,//状态不排序
							"targets":8,
							"render":function(data,type,row,meta){
								//渲染 把数据源中的标题和url组成超链接
								return "<td>"
										+"<span class=\"label label-success radius td-status\">显示</span></td>";
							}
						},
						{
							"orderable":false,//操作不排序
							//"visible":false,//设置列不展示
							"targets":9,
							"render":function(data,type,row,meta){
								//渲染 把数据源中的标题和url组成超链接
								return "<td><a onClick=\"member_stop(this,"
										+data
										+")\" href=\"javascript:;\" title=\"停用\" class=\"btn btn-xs btn-success td-manage\"><i class=\"fa fa-check bigger-120\"></i></a>"
										+"<a title=\"编辑\" onclick=\"member_edit(\"编辑\",\"member-add.html\","
										+data
										+",'','510')\" href=\"javascript:;\" class=\"btn btn-xs btn-info\"><i class=\"fa fa-edit bigger-120\"></i></a>"
										+"<a title=\"删除\" href=\"javascript:;\" onclick=\"member_del(this,"
										+data
										+")\" class=\"btn btn-xs btn-warning\"><i class=\"fa fa-trash bigger-120\"></i></a></td>";
							},
							
						}],
			});
	//DataTable复选框，全选
	$('table td input:checkbox').on('click',function(){
		var that = this;
		$(this).closest('table').find('tr>td:first-child input:checkbox').each(function(){
			this.checked = that.checked;
			$(this).closest('tr').toggleClass('selected');
		});
	});
});
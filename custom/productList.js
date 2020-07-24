$(function() {
	/* Javascript代码片段 */
	var t = $('#sample-table').DataTable(
			{
				ajax : {
					// 指定数据源
					url : "../prod/findAllProd.do"
				},
				// 每页显示十条数据
				pageLength : 10,
				
				columns : [ {//每列绑定的数据(和数据源中返回的数据对应,data:"param" param要和返回的json数据中的属性对应)
					"data" : null
				// 此列不绑定数据源，用来显示序号
				}, {
					"data" : "productId"
				}, {
					"data" : "productName"
				}, {
					"data" : "price"
				}, {
					"data" : "price"
				}, {
					"data" : null
				}, {
					"data" : "caption"
				}, {
					"data" : null
				}, {
					"data" : null
				}, {
					"data" : "productId"
				}],
				"columnDefs" : [ //每列定义
						{
							"orderable": false,//复选框不排序
							"targets": 0,
							"render": function(data, type, row, meta) {
								// 渲染 把数据源中的标题和url组成超链接
								return '<th width="25px"><label><input type="checkbox" class="ace"><span class="lbl"></span></label></th>';
							}
						},
						{
							"orderable":false,
							//指定是第三列
							"targets":2
							
							
						},
						{
							"orderable":false,//所属地区/国家 不排序
							"targets":5,
							"render":function(data,type,row,meta){
								//渲染 把数据源中的标题和url组成超链接
								return '<td class="text-1">中国</td>';
							}
						},
						{
							"orderable":false,//审核状态不排序
							"targets":7,
							"render":function(data,type,row,meta){
								//渲染 把数据源中的标题和url组成超链接
								return '<td class="text-1">通过</td>';
							},
						},
						{
							"orderable":false,//状态不排序
							"targets":8,
							"render":function(data,type,row,meta){
								//渲染 把数据源中的标题和url组成超链接
								return "<td>"
										+"<span class=\"label label-success radius td-status\">已启用</span></td>";
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
										+")\" href=\"javascript:;\" title=\"停用\" class=\"btn btn-xs btn-success td-manage\"><i class=\"icon-ok bigger-120\"></i></a>"
										+"<a title=\"编辑\" onclick=\"member_edit(\"编辑\",\"member-add.html\","
										+data
										+",'','510')\" href=\"javascript:;\" class=\"btn btn-xs btn-info\"><i class=\"icon-edit bigger-120\"></i></a>"
										+"<a title=\"删除\" href=\"javascript:;\" onclick=\"member_del(this,"
										+data
										+")\" class=\"btn btn-xs btn-warning\"><i class=\"icon-trash bigger-120\"></i></a></td>";
							},
							
						}],
				"lengthMenu": [10, 25, 50, 75, 100] //指定每页数量
			});
});
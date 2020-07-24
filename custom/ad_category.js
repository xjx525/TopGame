$(function(){
	var t = $("#sample-table").DataTable({
		ajax:{
			//指定数据源
			url:"../ad/findAllAdCatDT.do"
		},
		//每页显示10条数据
		pageLength:10,
		columns:[{
			"data":null
		},{
			"data":"id"
		},{
			"data":"name"
		},{
			"data":"num"
		},{
			"data":"desc"
		},{
			"data":"createTime"
		},{
			"data":"status"
		},{
			"data":"id"
		}],
		"columnDefs":[
			{
				"orderable":false,
				"targets":0,
				"render":function(data,type,row,meta){
					return '<td width="25px"><label><input type="checkbox"><span class="lbl"></span></label></td>';
				}
			},
			{
				"ordertable":false,//下标为2,4,6的列不进行排序（从0开始）
				"targets":[2,4,6,7]
			},
			{
				"targets":6,
				"render":function(data,type,row,meta){
					return "<td>"+"<span class=\"label label-success radius td-status\">显示</span></td>";
				}
			},
			{
				"targets":7,
				"render":function(data,type,row,meta){
					return "<td><a onClick=\"member_stop(this,'"
							+data
							+"')\" href=\"javascript:;\" title=\"停用\" class=\"btn btn-xs btn-success td-manage\"><i class=\"fa fa-check bigger-120\"></i></a>"
							+"<a title=\"编辑\" onclick=\"member_edit(\"编辑\",\"member-add.html\",'"
							+data
							+"','','510')\" href=\"javascript:;\" class=\"btn btn-xs btn-info\"><i class=\"fa fa-edit bigger-120\"></i></a>"
							+"<a title=\"删除\" href=\"javascript:;\" onclick=\"member_del(this,'"
							+data
							+"')\" class=\"btn btn-xs btn-warning\"><i class=\"fa fa-trash bigger-120\"></i></a>"
							+"<a href=\"javascript:void()\" name=\"Ads_list.html\" class=\"btn btn-xs btn-pink ads_link\" onclick=\"AdlistOrders('"+
							data+"');\" title=\"广告内容列表\"><i class=\"fa fa-bars bigger-120\"></i></a></td>";
				}
			}]
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
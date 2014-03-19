Ext.define("Ozone.components.admin.dashboard.DashboardDetailPanel",{extend:"Ext.panel.Panel",alias:["widget.dashboarddetailpanel","widget.dashboarddetail"],viewDashboard:null,loadedRecord:null,initComponent:function(){Ext.tip.QuickTipManager.init(true,{dismissDelay:60000,showDelay:2000});this.viewDashboard=Ext.create("Ext.view.View",{store:Ext.create("Ext.data.Store",{storeId:"storeDashboardItem",fields:[{name:"name",type:"string"},{name:"layout",type:"string"},{name:"EDashboardLayoutList",type:"string"},{name:"isGroupDashboard",type:"boolean"},{name:"groups",model:"Group"},{name:"description",type:"string"},{name:"createdDate",type:"string"},{name:"prettyCreatedDate",type:"string"},{name:"editedDate",type:"string"},{name:"prettyEditedDate",type:"string"},{name:"createdBy",model:"User"},{name:"stack",model:"Stack"}]}),deferEmptyText:false,tpl:new Ext.XTemplate('<tpl for=".">','<div class="selector">','<div id="detail-info" class="detail-info">','<div class="dashboard-detail-icon-block">',"{[this.renderIconBlock(values)]}","</div>",'<div class="dashboard-detail-info-block">','<div class="detail-header-block">',"{[this.renderDetailHeaderBlock(values)]}","</div>",'<div class="detail-block">','<div><span class="detail-label">Description:</span> {description:htmlEncode}</span></div><br>','<div><span class="detail-label">Groups:</span> {[this.renderGroups(values)]}</div>','<div><span class="detail-label">Created:</span> <span {createdDate:this.renderToolTip}>{prettyCreatedDate:this.renderDate}</span></div>','<div><span class="detail-label">Author:</span> {[this.renderUserRealName(values)]}</div>','<div><span class="detail-label">Last Modified:</span> <span {editedDate:this.renderToolTip}>{prettyEditedDate:this.renderDate}</span></div>',"</div>","</div>","</div>","</div>","</tpl>",{compiled:true,renderDate:function(a){return a?a:""},renderToolTip:function(a){var b='data-qtip="'+a+'"';return b},renderUserRealName:function(a){var b=a.createdBy;return(b.userRealName?Ext.htmlEncode(b.userRealName):"")},renderGroups:function(c){var b=c.groups;var a=c.stack;var e="";if(!a&&b&&b.length>0){for(var d=-1;++d<b.length;){e+=Ext.htmlEncode(b[d].name)+", "}e=e.substring(0,e.length-2)}return e},renderIconBlock:function(b){var a="dashboard-default-icon-layout";var c='<div class="dashboard-icon '+a+'"></div>';return c},renderDetailHeaderBlock:function(a){var b=a.isGroupDashboard;var d=a.name;var c='<div class="dashboard-title-block">';c+='<div class="dashboard-title detail-title">'+Ext.htmlEncode(d)+"</div>";c+=(b)?"<div>This is a group dashboard.</div>":"";c+="</div>";return c}}),emptyText:"No dashboard selected",itemSelector:"div.selector",autoScroll:"true"});this.items=[this.viewDashboard];this.callParent(arguments)},loadData:function(a){this.viewDashboard.store.loadData([a],false);this.loadedRecord=a},removeData:function(){this.viewDashboard.store.removeAll(false);this.loadedRecord=null}});
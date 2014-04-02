Ext.define("Ext.ux.RowExpander",{extend:"Ext.AbstractPlugin",alias:"plugin.rowexpander",rowBodyTpl:null,expandOnEnter:true,expandOnDblClick:true,rowBodyTrSelector:".x-grid-rowbody-tr",rowBodyHiddenCls:"x-grid-row-body-hidden",rowCollapsedCls:"x-grid-row-collapsed",renderer:function(d,b,a,c,e){if(e===0){b.tdCls="x-grid-td-expander"}return'<div class="x-grid-row-expander">&#160;</div>'},constructor:function(){this.callParent(arguments);var b=this.getCmp();this.recordsExpanded={};if(!this.rowBodyTpl){throw"RowExpander: rowBodyTpl is not defined."}var a=new Ext.XTemplate(this.rowBodyTpl);b.features=[{ftype:"rowbody",columnId:this.getHeaderId(),recordsExpanded:this.recordsExpanded,rowBodyHiddenCls:this.rowBodyHiddenCls,rowCollapsedCls:this.rowCollapsedCls,getAdditionalData:this.getRowBodyFeatureData,getRowBodyContents:function(c){return a.applyTemplate(c)}},{ftype:"rowwrap"}];b.columns.unshift(this.getHeaderConfig());b.on("afterlayout",this.onGridAfterLayout,this,{single:true})},getHeaderId:function(){if(!this.headerId){this.headerId=Ext.id()}return this.headerId},getRowBodyFeatureData:function(c,a,b,f){var d=Ext.grid.feature.RowBody.prototype.getAdditionalData.apply(this,arguments),e=this.columnId;d.rowBodyColspan=d.rowBodyColspan-1;d.rowBody=this.getRowBodyContents(c);d.rowCls=this.recordsExpanded[b.internalId]?"":this.rowCollapsedCls;d.rowBodyCls=this.recordsExpanded[b.internalId]?"":this.rowBodyHiddenCls;d[e+"-tdAttr"]=' valign="top" rowspan="2" ';if(f[e+"-tdAttr"]){d[e+"-tdAttr"]+=f[e+"-tdAttr"]}return d},onGridAfterLayout:function(){var b=this.getCmp(),a,c;if(!b.hasView){this.getCmp().on("afterlayout",this.onGridAfterLayout,this,{single:true})}else{a=b.down("gridview");c=a.getEl();if(this.expandOnEnter){this.keyNav=new Ext.KeyNav(c,{enter:this.onEnter,scope:this})}if(this.expandOnDblClick){a.on("dblclick",this.onDblClick,this)}c.on("click",this.onViewElClick,this,{delegate:".x-grid-row-expander"});this.view=a}},onViewElClick:function(b,a){b.stopEvent();var c=b.getTarget(".x-grid-row");this.toggleRow(c)},onEnter:function(h){var b=this.view,g=b.store,j=b.getSelectionModel(),a=j.getSelection(),f=a.length,c=0,d;for(;c<f;c++){d=g.indexOf(a[c]);this.toggleRow(d)}},toggleRow:function(d){var c=this.view.getNode(d),e=Ext.get(c),b=Ext.get(e).down(this.rowBodyTrSelector),a=this.view.getRecord(c);if(e.hasCls(this.rowCollapsedCls)){e.removeCls(this.rowCollapsedCls);b.removeCls(this.rowBodyHiddenCls);this.recordsExpanded[a.internalId]=true;this.view.fireEvent("expandbody")}else{e.addCls(this.rowCollapsedCls);b.addCls(this.rowBodyHiddenCls);this.recordsExpanded[a.internalId]=false;this.view.fireEvent("collapsebody")}this.view.up("gridpanel").invalidateScroller()},onDblClick:function(b,a,d,c,f){this.toggleRow(d)},getHeaderConfig:function(){return{id:this.getHeaderId(),width:24,sortable:false,fixed:true,hideable:false,menuDisabled:true,cls:Ext.baseCSSPrefix+"grid-header-special",renderer:function(b,a){a.tdCls=Ext.baseCSSPrefix+"grid-cell-special";return'<div class="'+Ext.baseCSSPrefix+'grid-row-expander">&#160;</div>'}}}});
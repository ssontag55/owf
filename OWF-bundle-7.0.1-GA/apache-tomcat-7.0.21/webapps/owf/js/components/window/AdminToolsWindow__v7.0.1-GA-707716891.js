Ext.define("Ozone.components.window.AdminToolsWindow",{extend:"Ozone.components.window.ModalWindow",alias:["widget.admintoolswindow","widget.Ozone.components.window.AdminToolsWindow"],plugins:[new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.ADMINISTRATION),new Ozone.components.draggable.DraggableWidgetView({itemSelector:".tool",dragNodeSelector:".thumb-wrap"})],title:"Administration",id:"admToolsWindow",cls:"system-window settings-window",ui:"system-window",iconCls:"admin-tools-header-icon",layout:"auto",closable:false,resizable:false,draggable:false,modal:true,modalAutoClose:true,shadow:false,autoScroll:false,minToolsInRow:3,maxToolsInRow:5,dashboardContainer:null,activeDashboard:null,store:null,initComponent:function(){var b=this,a=b.dashboardContainer.widgetStore;b.store=Ext.create("Ext.data.Store",{fields:[{name:"name",sortType:Ext.data.SortTypes.asUCString},"image","guid","singleton"]});b.dashboardContainer.activeDashboard.widgetStore.each(function(c){var d=c.get("widgetTypes");if(d.length>0&&d[0].name=="administration"&&c.get("definitionVisible")){b.store.add(c)}});b.store.sort("name","ASC");this.view=Ext.create("Ozone.components.view.ToolDataView",{store:b.store,multiSelect:false,singleSelect:true,autoScroll:true,listeners:{refresh:{fn:b.setupModalFocus,scope:b},viewready:{fn:this.updateWindowSize,scope:this,single:true}}});this.items=[this.view];this.on("resize",this.center,this);this.callParent(arguments)},setupModalFocus:function(){var a=this.down("tooldataview");this.setupFocus(Ext.get(a.getNode(0)),Ext.get(a.getNode(a.store.getCount()-1)));Ext.defer(function(){Ext.get(a.getNode(0)).focus()},100)},callBtnHandler:function(c,b,a){this.close();this.dashboardContainer.launchWidgets(this.store.getAt(this.store.find("name",c)),a)},updateWindowSize:function(e){var h,d,c;c=e.getNode(0);if(!c){return}var b=Ext.get(c),f=b.getMargin("r"),a=e.getStore().getCount(),g=0;h=b.getWidth();if(a<this.minToolsInRow){g=this.minToolsInRow}else{if(a>this.maxToolsInRow){g=this.maxToolsInRow}else{g=a}}d=(h+f)*g;this.view.doComponentLayout(d)}});
var guid=guid||{};var Ozone=Ozone||{};Ozone.util=Ozone.util||{};guid.util=function(){function a(){return(((1+Math.random())*65536)|0).toString(16).substring(1)}return{guid:function(){return(a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a())}}}();Ozone.util.guid=function(){return guid.util.guid()};Ext.define("Ozone.data.Dashboard",{extend:"Ext.data.Model",idProperty:"guid",fields:["alteredByAdmin","guid",{name:"id",mapping:"guid"},{name:"isdefault",type:"boolean",defaultValue:false},{name:"dashboardPosition",type:"int"},"EDashboardLayoutList","name",{name:"state",defaultValue:[]},"removed","groups","isGroupDashboard","description","createdDate","prettyCreatedDate","editedDate","prettyEditedDate",{name:"stack",defaultValue:null},{name:"locked",type:"boolean",defaultValue:false},{name:"layoutConfig",defaultValue:null},{name:"createdBy",model:"User"},{name:"user",model:"User"}],constructor:function(b,c,a){if(b.layoutConfig&&typeof b.layoutConfig==="string"&&b.layoutConfig!==Object.prototype.toString()){b.layoutConfig=Ext.JSON.decode(b.layoutConfig)}if(b.layoutConfig===Object.prototype.toString()){b.layoutConfig=""}if(!b.guid){b.guid=guid.util.guid()}this.callParent(arguments)}});Ext.define("Ozone.data.stores.AdminDashboardStore",{extend:"Ozone.data.OWFStore",model:"Ozone.data.Dashboard",alias:"store.admindashboardstore",remoteSort:true,totalProperty:"results",sorters:[{property:"dashboardPosition",direction:"ASC"}],constructor:function(a){Ext.applyIf(a,{api:{read:"/dashboard",create:"/dashboard",update:"/dashboard",destroy:"/dashboard"},reader:{root:"data"},writer:{root:"data"}});this.callParent(arguments)},reorder:function(){if(this.getCount()>0){for(var b=0;b<this.getCount();b++){var a=this.getAt(b);a.set("dashboardPosition",b+1)}}}});Ext.define("Ozone.data.Group",{extend:"Ext.data.Model",idProperty:"id",fields:[{name:"name",type:"string"},{name:"id",type:"int"},{name:"description",type:"string"},{name:"totalWidgets",type:"int"},{name:"totalUsers",type:"int"},{name:"totalStacks",type:"int"},{name:"automatic",type:"boolean"},{name:"stackDefault",type:"boolean"},{name:"status",type:"string"},{name:"displayName",type:"string"},{name:"email",type:"string"},{name:"title",mapping:"displayName"}]});Ext.define("Ozone.data.GroupStore",{extend:"Ozone.data.OWFStore",model:"Ozone.data.Group",sorters:[{property:"displayName",direction:"ASC"}],constructor:function(a){a=a?a:{};Ext.applyIf(a,{api:{read:"/group",create:"/group",update:"/group",destroy:"/group"},fields:["id","name","description","totalWidgets","totalUsers","totalStacks","automatic","stackDefault","status","displayName","email"],autoDestroy:true});this.callParent(arguments)}});Ext.define("Ozone.components.admin.GroupsGrid",{extend:"Ext.grid.Panel",alias:["widget.groupsgrid"],plugins:new Ozone.components.focusable.FocusableGridPanel(),title:"Groups",columns:[{itemId:"id",header:"ID",dataIndex:"id",sortable:true,hidden:true},{header:"Group Name",dataIndex:"displayName",flex:3,renderer:function(e,b,a,f,d,c){return this.renderCell(Ext.htmlEncode(e?e:a.data.name),b,a)}},{header:"Users",dataIndex:"totalUsers",flex:1,sortable:false,renderer:function(e,b,a,f,d,c){return this.renderCell(e,b,a)}},{header:"Widgets",dataIndex:"totalWidgets",flex:1,sortable:false,renderer:function(e,b,a,f,d,c){return this.renderCell(e,b,a)}},{header:"Stacks",dataIndex:"totalStacks",flex:1,sortable:false,renderer:function(e,b,a,f,d,c){return this.renderCell(e,b,a)}}],defaultPageSize:50,multiSelect:true,initComponent:function(){Ext.apply(this,{columnLines:true});this.store=Ext.create("Ozone.data.GroupStore",{id:"groupstore",autoLoad:false,pageSize:this.defaultPageSize});this.bbar=Ext.create("Ext.toolbar.Paging",{itemId:"bottomBar",store:this.store,pageSize:this.pageSize,displayInfo:true});this.relayEvents(this.store,["datachanged"]);this.callParent(arguments)},applyFilter:function(d,a){this.store.proxy.extraParams=undefined;if(d){var c=[];for(var b=0;b<a.length;b++){c.push({filterField:a[b],filterValue:d})}this.store.proxy.extraParams={filters:Ext.JSON.encode(c),filterOperator:"OR"}}if(this.baseParams){this.setBaseParams(this.baseParams)}this.store.loadPage(1,{params:{offset:0,max:this.pageSize}})},clearFilter:function(){this.store.proxy.extraParams=undefined;if(this.baseParams){this.setBaseParams(this.baseParams)}this.store.load({params:{start:0,max:this.pageSize}})},renderCell:function(b,c,a){if(a.get("status")=="inactive"){c.tdCls+=" x-item-disabled"}return b},setBaseParams:function(a){this.baseParams=a;if(this.store.proxy.extraParams){Ext.apply(this.store.proxy.extraParams,a)}else{this.store.proxy.extraParams=a}},setStore:function(b,c){this.reconfigure(b,c);var a=this.getBottomToolbar();if(a){a.bindStore(b)}},getTopToolbar:function(){return this.getDockedItems('toolbar[dock="top"]')[0]},getBottomToolbar:function(){return this.getDockedItems('toolbar[dock="bottom"]')[0]},load:function(){this.store.loadPage(1)},refresh:function(){this.store.loadPage(this.store.currentPage)}});Ext.define("Ozone.components.EditWidgetPanel",{extend:"Ext.panel.Panel",alias:["widget.editwidgetpanel","widget.Ozone.components.EditWidgetPanel"],layout:"card",bodyCls:"editpanel-body",initComponent:function(){this.addEvents("itemcreated","itemupdated","initialdataloaded");this.widgetStateHandler=Ozone.state.WidgetStateHandler.getInstance();OWF.Eventing.subscribe(this.channel,Ext.bind(this.handleSubscriptionEvent,this));this.launchConfig=OWF.Launcher.getLaunchData();if(this.launchConfig!=null){this.launchData=Ozone.util.parseJson(this.launchConfig)}this.widgetState=Ozone.state.WidgetState.getInstance({autoInit:true,onStateEventReceived:Ext.bind(this.handleStateEvent,this)});this.store.on("write",function(d,e,a,c,b){OWF.Eventing.publish(this.channel,{action:e,domain:this.domain,records:a})},this);this.on("itemcreated",function(a){this.recordId=a;OWF.Eventing.publish(this.channel,{action:"created",id:a})},this);this.on("itemupdated",function(a){OWF.Eventing.publish(this.channel,{action:"modified",id:a})},this);this.on("afterrender",function(a,c){if(this.launchConfig!=null){if(!this.launchData.isCreate){this.store.load({params:{id:this.launchData.id},callback:function(){this.record=this.store.getById(this.launchData.id);this.recordId=this.record?this.record.getId():null;this.fireEvent("initialdataloaded",this.record);this.enableTabs()},scope:this})}}else{this.record={};this.fireEvent("initialdataloaded",this.record)}var d=[];for(var b=0;this.items&&b<this.items.getCount();b++){d.push({xtype:"button",pressed:b==0,disabled:this.items.getAt(b).initDisabled,toggleGroup:"editorTabs",allowDepress:false,text:this.items.getAt(b).title,iconCls:this.items.getAt(b).iconCls,icon:this.items.getAt(b).iconCls==undefined?this.items.getAt(b).icon:undefined,iconAlign:"top",scale:"xlarge",index:b,handler:function(f,g){this.getLayout().setActiveItem(f.index)},scope:this})}this.addDocked([{itemId:"editorToolbar",hidden:this.hideEditorToolbar,xtype:"toolbar",cls:"editor-tabs",dock:"top",items:d,enableOverflow:true,listeners:{afterlayout:function(e){e.setHeight(e.getHeight())}}}])},this);this.callParent(arguments)},handleStateEvent:function(a,b){if(b.eventName.indexOf("afterEventIntercept_")==-1){if(b.eventName=="beforeclose"){this.widgetState.removeStateEventOverrides({events:["beforeclose"],callback:Ext.bind(function(){this.widgetState.closeWidget()},this)})}}},handleSubscriptionEvent:function(a,b){if(b.action=="delete"&&b.id==this.recordId){this.closeWidget()}},closeWidget:function(){this.widgetStateHandler.handleWidgetRequest({fn:"closeWidget",params:{guid:Ozone.getInstanceId()}})},enableTabs:function(){var a=this.getDockedComponent("editorToolbar");for(var c=0;a.items&&c<a.items.getCount();c++){var b=a.items.getAt(c);if(b){b.setDisabled(false)}}}});Ext.define("Ozone.components.admin.GroupsTabPanel",{extend:"Ext.panel.Panel",alias:["widget.groupstabpanel","widget.Ozone.components.admin.GroupsTabPanel"],editPanel:null,initComponent:function(){var a=this;Ext.apply(this,{layout:"fit",preventHeader:true,border:true,initDisabled:true,widgetLauncher:null,widgetEventingController:null,widgetStateHandler:null,items:[{xtype:"groupsgrid",itemId:"groupsgrid",preventHeader:true,border:false}],dockedItems:[{xtype:"toolbar",itemId:"tbGroupsGridHdr",cls:"tbGroupsGridHdr",dock:"top",items:[{xtype:"tbtext",itemId:"lblGroupsGrid",cls:"tbGroupsGridHdr",text:"Groups"},"->",{xtype:"searchbox",listeners:{searchChanged:{fn:function(c,d){var b=this.getComponent("groupsgrid");if(b!=null){b.applyFilter(d,["name","description"])}},scope:this}}}]},{xtype:"toolbar",dock:"bottom",ui:"footer",defaults:{minWidth:80},items:[{xtype:"button",text:"Add",itemId:"addButton",handler:function(){this.onAddClicked()},scope:this},{xtype:"button",text:"Remove",itemId:"removeButton",handler:function(){var d=this.down("#groupsgrid");if(d){var c=d.getSelectionModel().getSelection();if(c&&c.length>0){var b=d.store;b.remove(c);b.on({save:{fn:function(f,e,g){b.reload()}}});b.save()}else{a.editPanel.showAlert("Error","You must select at least one group to remove.")}}},scope:this}]}]});this.widgetStateHandler=Ozone.state.WidgetStateHandler.getInstance();this.on({activate:{scope:this,fn:function(g,b){var e=g.ownerCt;var c=g.down("#groupsgrid");c.setStore(Ext.create("Ozone.data.GroupStore",g.storeCfg));var f=function(k){if(k.action=="destroy"||k.action=="create"){var l=c.getBottomToolbar();l.doRefresh()}};c.store.proxy.callback=f;c.store.on("write",function(n,o,k,m,l){OWF.Eventing.publish(this.ownerCt.channel,{action:o,domain:this.ownerCt.domain,records:k})},this);if(c&&e){if(Ext.isNumeric(e.recordId)){e.record=e.recordId>-1?e.store.getAt(e.store.findExact("id",e.recordId)):undefined}else{e.record=e.recordId?e.store.getAt(e.store.findExact("id",e.recordId)):undefined}}if(e.record){var j=Ext.htmlEncode(Ext.util.Format.ellipsis(e.record.get("title"),25));if(!j){j=Ext.htmlEncode(Ext.util.Format.ellipsis(e.record.get("name"),25))||"Groups"}var h=g.getDockedItems('toolbar[dock="top"]')[0].getComponent("lblGroupsGrid");h.setText(j)}OWF.Preferences.getUserPreference({namespace:"owf.admin.GroupEditCopy",name:"guid_to_launch",onSuccess:function(k){g.guid_EditCopyWidget=k.value},onFailure:function(k){a.editPanel.showAlert("Preferences Error","Error looking up Group Editor: "+k)}});if(c&&e){var i;if(Ext.isNumeric(e.recordId)){i=e.recordId>-1?e.recordId:-1}else{i=e.recordId?e.recordId:-1}var d={tab:"groups"};d[g.componentId]=i;c.setBaseParams(d);c.on({itemdblclick:{fn:function(){var k=c.getSelectionModel().getSelection();if(k&&k.length>0){for(var l=0;l<k.length;l++){g.doEdit(k[l].data.id,k[l].data.displayName)}}else{a.editPanel.showAlert("Error","You must select at least one group to edit.")}},scope:this}})}},single:true}});this.on({activate:{fn:function(){var c=this.getComponent("groupsgrid");var b=c.getStore();if(b){b.load({params:{offset:0,max:b.pageSize}})}},scope:this}});this.callParent()},onAddClicked:function(b,f){var a=this.ownerCt.record,c=a.get("name")?a.get("name"):a.get("userRealName");var d=Ext.widget("admineditoraddwindow",{addType:"Group",itemName:c,editor:this.editor,focusOnClose:this.down(),existingItemsStore:this.getComponent("groupsgrid").getStore(),searchFields:["displayName"],grid:Ext.widget("groupsgrid",{itemId:"groupsaddgrid",border:false,preventHeader:true,enableColumnHide:false,sortableColumns:false})});d.show()},doEdit:function(d,c){var a=this;var b=Ozone.util.toString({id:d,copyFlag:false});OWF.Launcher.launch({guid:this.guid_EditCopyWidget,title:"$1 - "+c,titleRegex:/(.*)/,launchOnlyIfClosed:false,data:b},function(e){if(e.error){a.editPanel.showAlert("Launch Error","Group Editor Launch Failed: "+e.message)}})},refreshWidgetLaunchMenu:function(){if(this.widgetStateHandler){this.widgetStateHandler.handleWidgetRequest({fn:"refreshWidgetLaunchMenu"})}}});Ext.define("Ozone.components.PropertiesPanel",{extend:"Ext.form.Panel",alias:["widget.propertiespanel","widget.Ozone.components.PropertiesPanel"],layout:"anchor",bodyCls:"properties-body",border:false,bodyBorder:true,preventHeader:true,padding:5,autoScroll:true,editPanel:null,initComponent:function(){var b=this;b.buttonAlign=b.buttonAlign||"left";b.buttons=[{text:"Apply",itemId:"apply",handler:b.onApply,scope:b}];b.defaults=Ext.apply(b.defaults||{},{labelSeparator:"",margin:"5 5 0 5",msgTarget:"side",anchor:"100%",listeners:{blur:{fn:b.handleBlur},change:{fn:b.handleChange},afterrender:{fn:function(e,c){var d=e.getComponentLayout();if(d.errorStrategies!=null){d.previousBeforeLayout=d.beforeLayout;d.beforeLayout=function(g,f){return this.previousBeforeLayout()||!this.owner.preventMark};d.errorStrategies.side={prepare:function(f){var h=f.findParentByType("widgeteditpropertiestab");var g=h?h.loadedFromDescriptor:false;var j=f.errorEl;var i=f.fieldLabel.indexOf("required-label")<0?false:true;if((f.hasActiveError()&&f.changed)||(i&&Ext.isEmpty(f.getValue())&&g)){j.removeCls(["owf-form-valid-field","x-form-warning-icon","owf-form-unchanged-field"]);j.addCls(Ext.baseCSSPrefix+"form-invalid-icon");d.tip=d.tip?d.tip:Ext.create("Ext.tip.QuickTip",{baseCls:Ext.baseCSSPrefix+"form-invalid-tip",renderTo:Ext.getBody()});d.tip.tagConfig=Ext.apply({},{attribute:"errorqtip"},d.tip.tagConfig);j.dom.setAttribute("data-errorqtip",f.getActiveError()||"");if(i&&Ext.isEmpty(f.getValue())){j.setDisplayed(true)}else{j.setDisplayed(f.hasActiveError())}}else{if(f.hasActiveWarning&&f.hasActiveWarning()&&f.changed){j.removeCls([Ext.baseCSSPrefix+"form-invalid-icon","owf-form-valid-field","owf-form-unchanged-field"]);j.addCls("x-form-warning-icon");d.tip=d.tip?d.tip:Ext.create("Ext.tip.QuickTip",{iconCls:"x-form-warning-icon",renderTo:Ext.getBody()});d.tip.tagConfig=Ext.apply({},{attribute:"errorqtip"},d.tip.tagConfig);j.dom.setAttribute("data-errorqtip",f.getActiveWarning()||"");j.setDisplayed(f.hasActiveWarning())}else{if(f.changed&&!g){if(d.tip){d.tip.unregister(j)}j.removeCls([Ext.baseCSSPrefix+"form-invalid-icon","x-form-warning-icon","owf-form-unchanged-field"]);j.addCls("owf-form-valid-field");j.dom.setAttribute("data-errorqtip","");j.setDisplayed(true)}else{j.removeCls([Ext.baseCSSPrefix+"form-invalid-icon","x-form-warning-icon","owf-form-valid-field"]);j.dom.setAttribute("data-errorqtip","");j.setDisplayed(false)}}}},adjustHorizInsets:function(f,g){if(f.autoFitErrors){g.insets.right+=f.errorEl.getWidth()}},adjustVertInsets:Ext.emptyFn,layoutHoriz:function(f,g){f.errorEl.setStyle("left",g.width-g.insets.right+"px")},layoutVert:function(f,g){f.errorEl.setStyle("top",g.insets.top+"px")},onFocus:Ext.emptyFn}}},scope:b}}});b.on("afterrender",function(d){var e=d.ownerCt;if(e.record){d.initFieldValues(e.record)}else{e.on("initialdataloaded",d.initFieldValues,d)}if(e.store){e.store.on("write",function(g,f,i){var h=f.getRecords();if(h){var j=h[0];if(j){var k=j.get("id");if(k){e.recordId=k}}}e.enableTabs();b.showApplyAlert("Your changes have been saved.")});if(e.store.proxy){var c=d;e.store.proxy.on("exception",function(j,g,f,i){if("create"==f.action){e.store.removeAll();if(Ext.isFunction(c.initFieldValues)){c.initFieldValues({})}}var h;try{h=(typeof g)=="string"?Ext.JSON.decode(g):g}catch(k){h={errorMsg:g}}b.editPanel.showAlert("Server Error!",Ext.htmlEncode(h.errorMsg))})}}});if(Ozone.config.freeTextEntryWarningMessage!=null&&Ozone.config.freeTextEntryWarningMessage!=""){var a=Ozone.config.freeTextEntryWarningMessage;this.items=this.items||[];this.items.splice(0,0,{xtype:"component",renderTpl:'<div id="{id}" class="{cls}"><div class="headerSpacer"></div>{message}</div>',renderData:{cls:(a&&a.length>0)?"dialogHeader":"",message:a?a:""}})}this.widgetStateHandler=Ozone.state.WidgetStateHandler.getInstance();b.callParent()},initFieldValues:Ext.emptyFn,handleBlur:function(a){a.changed=true;a.doComponentLayout();if(a.getXType()=="textfield"){a.setValue(Ext.String.trim(a.getValue()))}},handleChange:function(d,c,a,b){if(!d.changed&&d.isDirty()){d.changed=true}},refreshWidgetLaunchMenu:function(){if(this.widgetStateHandler){this.widgetStateHandler.handleWidgetRequest({fn:"refreshWidgetLaunchMenu"})}},onApply:function(){this.validateFields();if(!this.getForm().hasInvalidField()){var b=this;var c=b.ownerCt;var e=this.getValues();if(c.store.data.length>0){var a=c.store.getById(c.recordId);a.beginEdit();for(var d in e){if(!Ext.isFunction(d)){a.set(d,e[d])}}a.endEdit()}else{c.store.add(e);c.store.data.items[0].phantom=true;if(Ext.isFunction(b.initFieldValues)){b.initFieldValues(c.store.data.items[0])}}if(c.store.getNewRecords().length===0&&c.store.getUpdatedRecords().length===0){b.showApplyAlert("Your changes have been saved.")}c.store.save()}else{this.showApplyAlert("Invalid field, changes cannot be saved.",3000)}},showApplyAlert:function(d,c){var b=this,a=this.getDockedItems()[0];if(!a.getComponent(b.applyAlert)){b.applyAlert=Ext.widget("displayfield",{itemId:"applyAlert",name:"applyAlert",cls:"applyAlert",width:450,html:d});a.add(b.applyAlert);Ext.defer(function(){a.remove(b.applyAlert)},c?c:2000)}},validateFields:function(){var a=this.query("textfield");for(var b=0;b<a.length;b++){var c=a[b];if(!Ext.isFunction(c)){c.isValid();this.handleBlur(c)}}}});Ext.define("Ozone.components.admin.dashboard.DashboardEditPropertiesTab",{extend:"Ozone.components.PropertiesPanel",alias:["widget.dashboardeditproperties","widget.dashboardeditpropertiestab","widget.Ozone.components.admin.dashboard.DashboardEditPropertiesTab"],cls:"dashboardeditpropertiestab",initComponent:function(){Ext.apply(this,{title:"Properties",iconCls:"properties-tab",items:[{xtype:"hidden",name:"guid",preventMark:true,itemId:"guid"},{xtype:"textfield",name:"name",fieldLabel:Ozone.util.createRequiredLabel("Name"),allowBlank:false,maxLength:200,enforceMaxLength:true,itemId:"name",labelWidth:140},{xtype:"textarea",name:"description",fieldLabel:"Description",allowBlank:true,maxLength:255,enforceMaxLength:true,itemId:"description",labelWidth:140},{xtype:"textarea",fieldLabel:Ozone.util.createRequiredLabel("Definition"),name:"definition",itemId:"definition",allowBlank:true,labelWidth:140,height:160,minHeight:160,validator:function(b){try{Ext.decode(b)}catch(a){return"This field must be a valid JSON Object string"}if(b!=null&&b.length>0&&b.charAt(0)=="["&&b.charAt(b.length-1)=="]"){return"This field must be a valid JSON Object string"}return true}}]});this.callParent(arguments)},initFieldValues:function(a){var c=a?a.data:a;if(c!=null){this.getComponent("guid").setValue(c.guid!=null?c.guid:"");this.getComponent("name").setValue(c.name!=null?c.name:"");this.getComponent("description").setValue(c.description!=null?c.description:"");var b=null;if(c!=null){b=owfdojo.toJson(c,true)}this.getComponent("definition").setValue(b!=null?b:"")}},onApply:function(){this.validateFields();if(!this.getForm().hasInvalidField()){var a=this;var d=a.ownerCt;var f=this.getValues();var b=f.name;var i=f.description;var c=f.definition;var h=Ext.decode(c);if(f.guid!=""&&f.guid!=null){h.guid=f.guid}h.name=b;h.description=i;var e=d.store.getAt(0);if(e!=null){e.beginEdit();e.data={};for(var g in h){if(!Ext.isFunction(g)){e.set(g,h[g])}}e.endEdit()}else{if(d.launchData==null||d.launchData.isCreate||f.guid==""||f.guid==null){h.guid=guid.util.guid()}d.store.add(h);e=d.store.data.items[0];e.phantom=true}d.store.on({write:{fn:function(k,j,l){var m=j.getRecords();if(m){var n=m[0];if(n){var o=n.getId();if(o){d.recordId=o}this.initFieldValues(n);d.enableTabs()}}d.fireEvent("itemcreated",d.recordId)},scope:this,single:this}});d.store.sync()}else{this.showApplyAlert("Invalid field, changes cannot be saved.",3000)}}});Ext.define("Ozone.components.admin.dashboard.DashboardEditGroupsTab",{extend:"Ozone.components.admin.GroupsTabPanel",alias:["widget.dashboardeditgroups","widget.dashboardeditgroupstab","widget.Ozone.components.admin.dashboard.DashboardEditGroupsTab"],cls:"dashboardeditgroupstab",initComponent:function(){Ext.apply(this,{padding:5,iconCls:"groups-tab",editor:"Dashboard",componentId:"dashboard_id",title:"Groups",storeCfg:{api:{read:"/group",create:"/dashboard",update:"/group",destroy:"/dashboard"},methods:{read:"GET",load:"GET",create:"PUT",update:"PUT",save:"POST",destroy:"PUT"},updateActions:{destroy:"remove",create:"add"},pageSize:50}});this.callParent(arguments)},initBaseParams:function(a){this.baseParams={dashboard_id:a.data.id};this.applyFilter()}});Ext.define("Ozone.components.admin.dashboard.DashboardEditPanel",{extend:"Ozone.components.EditWidgetPanel",alias:["widget.dashboardedit","widget.dashboardeditpanel","widget.Ozone.components.admin.dashboard.DashboardEditPanel"],mixins:["Ozone.components.WidgetAlerts"],cls:"dashboardeditpanel",initComponent:function(){var a=this;this.launchConfig=Ozone.launcher.WidgetLauncherUtils.getLaunchConfigData();if(this.launchConfig!=null){this.launchData=Ozone.util.parseJson(this.launchConfig);this.hideEditorToolbar=!this.launchData.isGroupDashboard}Ext.apply(this,{xtype:"editwidgetpanel",cls:"adminEditor",bodyCls:"adminEditor-body",dragAndDrop:false,launchesWidgets:false,domain:"Dashboard",channel:"AdminChannel",store:Ext.StoreMgr.lookup({type:"admindashboardstore"}),items:[{xtype:"dashboardeditproperties",itemId:"dashboardeditproperties",editPanel:a},{xtype:"dashboardeditgroups",itemId:"dashboardeditgroups",editPanel:a}]});this.callParent(arguments);this.store.proxy.extraParams={adminEnabled:true};if(this.launchConfig!=null){this.launchData=Ozone.util.parseJson(this.launchConfig);this.store.proxy.extraParams.isGroupDashboard=this.launchData.isGroupDashboard;if(this.launchData.isGroupDashboard){this.store.proxy.extraParams.group_id=this.launchData.group_id}else{this.store.proxy.extraParams.user_id=this.launchData.user_id}}else{this.store.proxy.extraParams.isGroupDashboard=true}}});
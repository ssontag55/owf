Ext.define("Ozone.components.window.CreateDashboardWindow",{extend:"Ozone.layout.window.ManagerWindow",alias:["widget.createdashboardwindow","widget.Ozone.components.window.CreateDashboardWindow"],title:Ozone.layout.tooltipString.createDashboardTitle,constrain:Ext.isIE,constrainHeader:true,cls:"manageContainer",draggable:true,closeAction:"destroy",mixins:{escHelper:"Ozone.components.focusable.EscCloseHelper"},dashboardContainer:null,existingDashboardModel:null,ownerCt:null,initComponent:function(){var c=this;var b=c.ownerCt.getHeight();var a=c.ownerCt.getWidth();if(c.height==null){c.height=(b>379)?370:b-10}if(c.width==null){c.width=(a>559)?550:a-10}if(c.minHeight==null){c.minHeight=250}c.items=[{xtype:"owfCreateDashboardsContainer",dashboardContainer:c.dashboardContainer,hideViewSelectRadio:c.hideViewSelectRadio,winId:c.id,existingDashboardRecord:c.existingDashboardRecord}];c.callParent();c.on("afterrender",c.setupModalFocus,c,{single:true});c.on("show",c.focusFirstEl,c);c.addEvents("cancel")},setupModalFocus:function(){this.setupFocus(this.down("textfield").inputEl,this.down("#cancelBtn").getEl())},focusFirstEl:function(){this.down("textfield").inputEl.focus(250)}});
Ext.define("Ozone.components.focusable.FocusableGridPanel",{extend:"Ext.AbstractPlugin",init:function(b){var a=b.getView();if(a!==null){a.on("afterrender",function(d){var c=d.getEl();c.dom.tabIndex=b.isDisabled()?-1:0;a.on({beforeitemmousedown:{fn:function(g,f,j,h,k,i){this.disableFocusSelect=true},scope:a}});c.on("focus",function(){if(this.getSelectedNodes().length===0&&this.getNodes().length>0&&!this.disableFocusSelect){this.select(0)}this.addCls("x-grid-view-focus");this.disableFocusSelect=false},a);c.on("click",function(){this.focus()},c);c.on("blur",function(){a.removeCls("x-grid-view-focus")},a)},b)}b.on("edit",function(){this.getView().focus()},b);b.on("disable",function(){this.getEl().dom.tabIndex=-1},a);b.on("enable",function(){this.getEl().dom.tabIndex=0},a)}});
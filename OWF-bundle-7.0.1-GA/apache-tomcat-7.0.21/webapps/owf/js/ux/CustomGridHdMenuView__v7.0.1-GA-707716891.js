var Ozone=Ozone||{};Ozone.grid=Ozone.grid||{};Ozone.grid.CustomGridHdMenuView=function(a){Ext.apply(this,a);Ozone.grid.CustomGridHdMenuView.superclass.constructor.call(this)};Ext.extend(Ozone.grid.CustomGridHdMenuView,Ext.grid.GridView,{handleHdMenuClick:function(c){var b=this.hdCtxIndex;var a=this.cm,d=this.ds;switch(c.id){default:b=a.getIndexById(c.id.substr(4));if(b!=-1){if(c.checked&&a.getColumnsBy(this.isHideableColumn,this).length<=1){this.onDenyColumnHide();return false}a.setHidden(b,c.checked)}}return true},beforeColMenuShow:function(){var a=this.cm,c=a.getColumnCount();this.colMenu.removeAll();for(var b=0;b<c;b++){if(a.config[b].fixed!==true&&a.config[b].hideable!==false){this.colMenu.add(new Ext.menu.CheckItem({id:"col-"+a.getColumnId(b),text:a.getColumnHeader(b),checked:!a.isHidden(b),hideOnClick:false,disabled:a.config[b].hideable===false}))}}},handleHdDown:function(g,d){g.stopEvent();var f=this.findHeaderCell(d);Ext.fly(f).addClass("x-grid3-hd-menu-open");var c=this.getCellIndex(f);this.hdCtxIndex=c;var b=this.colMenu.items,a=this.cm;this.colMenu.on("hide",function(){Ext.fly(f).removeClass("x-grid3-hd-menu-open")},this,{single:true});this.colMenu.showAt(g.xy)},renderUI:function(){var d=this.renderHeaders();var a=this.templates.body.apply({rows:""});var b=this.templates.master.apply({body:a,header:d});var c=this.grid;c.getGridEl().dom.innerHTML=b;this.initElements();this.mainHd.on("contextmenu",this.handleHdDown,this);this.mainHd.on("mouseover",this.handleHdOver,this);this.mainHd.on("mouseout",this.handleHdOut,this);this.mainHd.on("mousemove",this.handleHdMove,this);this.scroller.on("scroll",this.syncScroll,this);if(c.enableColumnResize!==false){this.splitone=new Ext.grid.GridView.SplitDragZone(c,this.mainHd.dom)}if(c.enableColumnMove){this.columnDrag=new Ext.grid.GridView.ColumnDragZone(c,this.innerHd);this.columnDrop=new Ext.grid.HeaderDropZone(c,this.mainHd.dom)}if(c.enableColumnHide!==false){this.colMenu=new Ext.menu.Menu({id:c.id+"-hcols-menu"});this.colMenu.on("beforeshow",this.beforeColMenuShow,this);this.colMenu.on("itemclick",this.handleHdMenuClick,this)}this.hmenu=new Ext.menu.Menu({id:c.id+"-hctx"});if(c.enableColumnHide!==false){this.hmenu.add({id:"columns",text:this.columnsText,menu:this.colMenu,iconCls:"x-cols-icon"})}this.hmenu.on("itemclick",this.handleHdMenuClick,this);if(c.enableDragDrop||c.enableDrag){this.dragZone=new Ext.grid.GridDragZone(c,{ddGroup:c.ddGroup||"GridDD"})}this.updateHeaderSortState()}});
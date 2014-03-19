Ext.define("Ozone.components.container.boxOverflow.Menu",{extend:"Ext.layout.container.boxOverflow.Menu",createMenuConfig:function(c,a){var b=Ext.apply({},c.initialConfig),d=c.toggleGroup;Ext.copyTo(b,c,["iconCls","icon","itemId","disabled","handler","scope","menu","externalHidden"]);Ext.apply(b,{text:c.overflowText||c.text||c.type,hideOnClick:a,destroyMenu:false});if(d||c.enableToggle){Ext.apply(b,{group:d,checked:c.pressed,listeners:{checkchange:function(f,e){c.toggle(e)}}})}if(c.isXType("tool")||c.isXType("widgettool")){b.type=c.type;if(a){Ext.apply(b,{listeners:{click:function(e){Ext.menu.Manager.hideAll()}}})}}b.hidden=b.externalHidden;delete b.externalHidden;delete b.ownerCt;delete b.xtype;delete b.id;return b},addComponentToMenu:function(c,a){var b=this;if(a instanceof Ext.toolbar.Separator){c.add("-")}else{if(a.isComponent){if(a.isXType("splitbutton")){c.add(b.createMenuConfig(a,true))}else{if(a.isXType("button")){c.add(b.createMenuConfig(a,!a.menu))}else{if(a.isXType("buttongroup")){a.items.each(function(d){b.addComponentToMenu(c,d)})}else{if(a.isXType("tool")||a.isXType("widgettool")){c.add(Ext.create(Ext.getClassName(a),b.createMenuConfig(a,true)))}else{c.add(Ext.create(Ext.getClassName(a),b.createMenuConfig(a)))}}}}}}},createMenu:function(a,d){var m=this,k=m.layout,n=k.parallelBefore,f=k.parallelPrefix,b=d[f],h=a.boxes,e=0,l=h.length,g;if(!m.menuTrigger){m.createInnerElements();m.menu=Ext.create("Ext.menu.Menu",{shadow:false,listeners:{scope:m,beforeshow:m.beforeMenuShow,show:function(){this.menu.alignTo(this.menuTrigger,"bl-tl")},setActiveItem:function(o){var i=this;if(o&&(o!=i.activeItem&&o!=i.focusedItem)){i.deactivateActiveItem();if(i.canActivateItem(o)){if(o.activate){o.activate();if(o.activated){i.activeItem=o}}}o.el.scrollIntoView(i.layout.getRenderTarget())}}}});m.menu.addCls("box-overflow-menu");m.menu.on("destroy",function(){m.menu.clearListeners()});m.menuTrigger=Ext.create("Ext.button.Button",{ownerCt:m.layout.owner,iconCls:Ext.baseCSSPrefix+k.owner.getXType()+"-more-icon",ui:k.owner instanceof Ext.toolbar.Toolbar?"default-toolbar":"default",menu:m.menu,tooltip:Ozone.layout.Menu.overflowMenuButtonTooltip,getSplitCls:function(){return""},renderTo:m.afterCt,handler:function(o,i){i.stopPropagation()},tabIndex:0})}m.showTrigger();b-=m.afterCt.getWidth();m.menuItems.length=0;for(;e<l;e++){g=h[e];if(g[n]+g[f]>b){var j=g.component.hidden;m.menuItems.push(g.component);g.component.hide();c(g.component,j)}}function c(i,o){if(!i.hide.customized){i.externalHidden=o;i.menuItemHide=i.hide;i.hide=function(){this.menuItemHide();if(arguments.callee.caller!==m.createMenu){this.externalHidden=true}};i.hide.customized=true}if(!i.show.customized){i.menuItemShow=i.show;i.show=function(){this.menuItemShow();this.externalHidden=false};i.show.customized=true}}}});
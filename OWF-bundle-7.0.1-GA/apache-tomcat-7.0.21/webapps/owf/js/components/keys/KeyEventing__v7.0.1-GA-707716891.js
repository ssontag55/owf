(function(){gadgets.rpc.register("_widget_iframe_ready",function(a){var b=Ext.getCmp(Ozone.util.parseJson(a).id);if(b){b.iframeReady=true}});gadgets.rpc.register("_key_eventing",function(a,d){var c=Ext,b;if(d.focusParent){b=c.get(a);if(b){b.blur()}}if(!d.keydown){Ozone.KeyMap.handleKey(c.apply(d,{fromWidget:true}),a)}else{Ozone.MoveKeyMap.handleKey(c.apply(d,{fromWidget:true}),a)}})})();
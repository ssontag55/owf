var Ozone=Ozone||{};Ozone.metrics=Ozone.metrics||{};Ozone.metrics.logMetric=function(d,g,c,e,f,i,a,h){var b=new Date();Ozone.util.Transport.send({url:OWF.getContainerUrl()+"/metric",method:"POST",onSuccess:function(j){},autoSendVersion:false,content:{metricTime:b.getTime(),userId:d,userName:g,site:c,userAgent:navigator.userAgent,component:e,componentId:f,instanceId:i,metricTypeId:a,widgetData:h}})};Ozone.metrics.logBatchMetrics=function(b){var a=new Date();Ozone.util.Transport.send({url:OWF.getContainerUrl()+"/metric",method:"POST",onSuccess:function(c){},autoSendVersion:false,content:{data:b}})};Ozone.metrics.logWidgetRender=function(a,c,d,b){if(Ozone.config.metric.enabled===true){Ozone.metrics.logMetric(a,c,d,b.name,b.widgetGuid,b.id,"ozone.widget.view","")}};
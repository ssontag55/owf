declare
	layout_config_val clob := '{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"617c4c83-57ae-1abc-ab3f-fb57badea94a","dashboardGuid":"54949b5d-f0ee-4347-811e-2522a1bf96fe","paneGuid":"9b1196e4-612e-3721-732a-304db671bde9","intentConfig":null,"launchData":null,"name":"Widgets","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":485,"width":798}],"paneType":"fitpane","defaultSettings":{"widgetStates":{"eb5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1347666242178},"ec5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1347666242209},"4854fbd4-395c-442b-95c6-8b60702fd2b4":{"timestamp":1347666242212}}}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"9251add0-28f1-ea2e-4bee-92f0d21d940d","dashboardGuid":"54949b5d-f0ee-4347-811e-2522a1bf96fe","paneGuid":"b8667289-c991-d331-742b-811c1a790868","intentConfig":null,"launchData":null,"name":"Users","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":485,"width":798}],"defaultSettings":{}}],"flex":0.45,"htmlText":"45%"},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox bottom","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","htmlText":"34%","items":[],"widgets":[{"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"3b65326d-7ee1-3678-b5a1-79707754b23e","dashboardGuid":"54949b5d-f0ee-4347-811e-2522a1bf96fe","paneGuid":"8007f602-0af3-d5d9-b4fc-b6325208d4c5","intentConfig":null,"launchData":null,"name":"Group Dashboards","active":false,"x":0,"y":523,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":592,"width":542}],"paneType":"fitpane","flex":0.34,"defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox right","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"66886071-0bf6-3c81-2874-90d2a8dbd19c","dashboardGuid":"54949b5d-f0ee-4347-811e-2522a1bf96fe","paneGuid":"09c2864c-7986-8c76-70eb-adda782e4215","intentConfig":null,"launchData":null,"name":"Groups","active":false,"x":546,"y":523,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":592,"width":525}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"3832d715-5d3c-4dad-86f3-6f60e0cc0dc2","uniqueId":"86ee06af-ddb4-40ec-ff91-5f0b9a867b24","dashboardGuid":"54949b5d-f0ee-4347-811e-2522a1bf96fe","paneGuid":"2fb6237b-e978-55eb-09b1-a57dbe604cd7","intentConfig":null,"launchData":null,"name":"Approvals","active":false,"x":1075,"y":523,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":592,"width":526}],"defaultSettings":{}}],"flex":0.66,"htmlText":"66%"}],"flex":0.55,"htmlText":"55%"}],"flex":3}';
begin
	update dashboard set layout_config = layout_config_val where id=322;
end;

/* Ending with a basic sql command so liquibase doesn't add trailing semi-colons. */
select 'Administration dashboard Completed' from dual;

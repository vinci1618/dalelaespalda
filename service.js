var WebSocketServer = require('ws').Server;
var uuid = require('node-uuid');
var wss = new WebSocketServer({port:8080});
wss.on('connection', onConnection);
var clients = [];
var masterApp;
var masterControl;

function onConnection(ws)
{
    ws.on('message', onMessage);
    ws.on('close', onClose);   
    var id = uuid.v1();
	console.log("connect");
    //clients[id] = {ws:ws, id:id};
    ws.id = id; 
	try {
    	ws.send(JSON.stringify({type:'uuid', data:{id:id}}));
	}
	catch (e) {

	}    
}

function onMessage(data, flags)
{
	var currentWs = this;
	var event = JSON.parse(data);
console.log(event);
	switch(event.type){
		
		case 'UserType':
			switch (event.data.user) {
				case 'client':
					currentWs.type = "client";
					clients[currentWs.id] = currentWs;
					
					break;
				case 'masterApp':
					console.log("masterApp Set");				
					currentWs.type = "masterApp";
					masterApp = currentWs;
					//initMaster();			
					break;
				case 'masterWeb':
					console.log("masterWeb Set");
					currentWs.type = "masterWeb";
					masterWeb = currentWs;
					break;
	
				default:
					break;
			}

		break;
		case 'SetHashtag':
			
			try {
				currentWs.send(JSON.stringify({type:'SetHashtag', data:{hashtag:event.data.hashtag}}));			   
			}
			catch (e) {

			}
			

		break;
		case 'BycicleCoords':
			
		for (var x in clients)
			  {
				try {

					clients[x].send(JSON.stringify({type:'BycicleCoords', data:{coords:event.data}}));                          
	                        }
                	        catch (e) {

                        	}

			  }
		break; 
	}
}
function initMaster(){
	
	var t = setInterval(function(){
		if(master){
			if(tweets.length != 0){
				var tweet = tweets.pop();
				try{
					master.send(JSON.stringify({type:'UserTweet', data:{tweet:tweet}}));
				}catch(e){

				}
			}else{
				try{
					master.send(JSON.stringify({type:'UserTweet', data:{tweet:false}}));	
				}catch(e){

				}				
			}				
		}else{
			clearInterval(t);
		}
	
	},5000);
	
}
function onClose()
{
	switch(this.type){
		case 'masterApp':
			masterApp = null;
		break;
		case 'materWeb':
			masterWeb = null;
		break;
		case 'client':		
			console.log('bye user: '+this.id);
			delete clients[this.id];			
		break;
	
	}

}
console.log("service running");
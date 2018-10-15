// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var com = require('Common');
cc.Class({
    extends: cc.Component,
    properties: {
    	is_first:0,
        groupFriendButton: cc.Node,
        friendButton: cc.Node,
        rank: cc.Sprite,//显示排行榜
    },
    onLoad () {
    	// if(com.rank_all==1){
    	// 	this.togame_friend_rank();
    	// }
    },
    togame_friend_rank: function(){
        // console.log('查看好友排行榜');
        var background = cc.find("Canvas/background");
        background.active=false;
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x2"
            });
            
        } else {
            cc.log("获取好友排行榜数据。x2");
        }
    },
    close_game_friend_rank: function(){
    	//返回游戏结束界面 
        var background = cc.find("Canvas/background");
        background.active=true;
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 4,  //请求横向好友排行榜
                MAIN_MENU_NUM: "x2"
            });
            
        } else {
            cc.log("获取好友排行榜数据。x2");
        }
    },
    togame_group_rank: function(){
        // console.log('查看群排行榜');
        var game_friend_rank = cc.find("Canvas/game_friend_rank");
        var background = cc.find("Canvas/background");
        background.active=false;
        game_friend_rank.active=false;
        if (window.wx != undefined) {
            var num=Math.floor(Math.random()*3);
            var title=com.show_data[num];
            window.wx.shareAppMessage({
                imageUrl: 'res/raw-assets/images/background/jiqiao.19679.png',
                title: title,
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "x2",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x2");
        }
    },
    close_game_group_rank: function(){
    	//关闭群排行榜 
        var game_friend_rank = cc.find("Canvas/game_friend_rank");
        var background = cc.find("Canvas/background");
        background.active=true;
        game_friend_rank.active=true;
        if (window.wx != undefined) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 4,  
                MAIN_MENU_NUM: "x2"
            });
        } else {
            cc.log("获取好友排行榜数据。x2");
        }
    },
    toreplay:function(){
        com.is_fuhuo=0;
        com.game_time=30;
        com.is_game_over=0;
        // console.log('点击再来一局按钮');
        cc.director.loadScene("game");
    },
    start () {
        window.wx.postMessage({
            messageType: 3,
            MAIN_MENU_NUM: "x2",
            score:com.game_num
        });
    	if (this.is_first==0 && com.rank_all!=1) {
    		this.getgameOverRank();
	        this.is_first=1;
    	}
    	if(com.rank_all==1){
    		this.togame_group_rank();
    	}
    	this.is_first++;
    },
    getgameOverRank(){
    	if (window.wx != undefined) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "x2"
            });
        }
    },
    // 刷新子域的纹理
    _updateSubDomainCanvas () {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            // console.log(new cc.SpriteFrame(this.tex));
            // this.rank.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});


var com = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
        //游戏区域
        gameContent: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {

        // cc.game.addPersistRootNode(this.gameContent.node);
        // if (this.gameContent && this.gameContent.content) {
        //     this.Ball = this.gameContent.content.getComponent('Ball');
        //     this.Ball.init(this);
        // }
    },

    // 游戏暂停
    game_stop: function(){
        com.game_stop=1;
        var over =cc.find("Canvas/stop");
        over.active = true;
    },

    // 游戏继续
    game_keep: function(){
        com.game_stop=0;
        var over =cc.find("Canvas/stop");
        over.active = false;
    },

    // 游戏重新开始
    game_restart: function(){
        com.game_restart=1;
        var over =cc.find("Canvas/stop");
        over.active = false;
    },

    // 返回主页
    game_return: function(){
        com.data = null;
        com.line_com=[];
        com.x=0;
        com.y=0;
        com.add_data=[];
        com.game_time=30;
        com.game_num=0;
        com.is_game_over=0;
        com.is_fuhuo=0;
        com.game_stop=0;
        com.move_action=[];
        // 参数重置
        cc.director.loadScene("index");
    }

});

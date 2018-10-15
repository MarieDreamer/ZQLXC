var com = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        // 打印游戏分数
        var number =cc.find("Canvas/game_num");
        number.getComponent(cc.Label).string=com.game_num;
    },
    to_game_score: function(){
        // 进入游戏结算页面
        cc.director.loadScene("game_score")
    },
    back_game: function(){
        // 返回游戏，看视频复活
        com.is_fuhuo=1;
        com.game_time=30;
        com.is_game_over=0;
        cc.director.loadScene("game")
    },
});

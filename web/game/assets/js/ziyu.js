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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        display: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(!wx.getStorageSync('game_biger') || wx.getStorageSync('game_biger') < com.game_num){
            wx.setStorage({
                key: 'game_biger',
                data: com.game_num,
                success: function(res) {
                    console.log(res)
                }
            })
            // cc.director.loadScene("game_first")
        }
        this.tex = new cc.Texture2D();
        var game_biger = cc.find("Canvas/background/highest_score");
        game_biger.getComponent(cc.Label).string = '历史最高分：'+ wx.getStorageSync('game_biger');

        var number = cc.find("Canvas/background/score");
        number.getComponent(cc.Label).string = com.game_num;
        
    },
    // 刷新子域的纹理
    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update () {
        this._updateSubDomainCanvas();
    }
});

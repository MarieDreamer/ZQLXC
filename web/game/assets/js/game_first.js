// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Button
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	if(!wx.getStorageSync('first') || wx.getStorageSync('first')==0){// 当没有first这个值时。那么保存
            wx.setStorage({
                key: 'first',
                data: 1,
                success: function(res) {
                    console.log(res)
                }
            })
            // cc.director.loadScene("game_first")
        }
        if(wx.getStorageSync('first')==1){// 当有first这个值时。那么跳转
            // cc.director.loadScene("index")
        }
    },

    toScene: function(){
        // wx.login({
        //     success: function (res){
        //         wx.request({
        //             url: 'http://wechat.square.com/WechatUser/login_do',
        //             data: {
        //               code: res.code
        //             },
        //             success: function (res) {
        //               wx.setStorageSync('userid', res.data.data.userid);
        //               that.data.user_id = res.data.data.userid;
        //               if (res.data.data.username) {
        //                 that.data.user_name = res.data.data.username;
        //               }
        //             }
        //           })
        //         wx.getUserInfo({
        //             success: function(res) {
        //                 var userInfo = res.userInfo
        //                 var nickName = userInfo.nickName
        //                 var avatarUrl = userInfo.avatarUrl
        //                 // console.log(avatarUrl)
        //                 // console.log(nickName)
        //             }
        //         })
        //     }
        // })
        // console.log(wx.getStorageSync('first'));
        cc.director.loadScene("game")
    },
    

    start () {

    },

    // update (dt) {},
});

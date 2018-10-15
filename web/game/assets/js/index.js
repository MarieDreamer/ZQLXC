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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        wx.login({
            success: function (res){
                wx.request({
                    url: 'http://wechat.square.com/WechatUser/login_do',
                    data: {
                      code: res.code
                    },
                    success: function (res) {
                      wx.setStorageSync('userid', res.data.data.userid);
                      that.data.user_id = res.data.data.userid;
                      if (res.data.data.username) {
                        that.data.user_name = res.data.data.username;
                      }
                    }
                  })
                wx.getUserInfo({
                    success: function(res) {
                        var userInfo = res.userInfo
                        var nickName = userInfo.nickName
                        var avatarUrl = userInfo.avatarUrl
                        // console.log(avatarUrl)
                        // console.log(nickName)
                        wx.setStorage({
                            key: 'nickName',
                            data: nickName,
                            success: function(res) {
                                console.log(res)
                              }
                        })
                        wx.setStorage({
                            key: 'avatarUrl',
                            data: avatarUrl,
                            success: function(res) {
                                console.log(res)
                              }
                        })
                        // console.log(wx.getStorageSync('nickName'));
                    }
                })

                // if(!wx.getStorageSync('first')){
                //     wx.setStorage({
                //         key: 'first',
                //         data: 0,
                //         success: function(res) {
                //             console.log(res)
                //           }
                //     })
                //     cc.director.loadScene("game_first")
                // }

                
                
            }
          })
    },

    listjump: function(){
        cc.director.loadScene("game_score")
    },

    gamestartjump: function(){
        if(!wx.getStorageSync('first')){
            wx.setStorage({
                key: 'first',
                data: 0,
                success: function(res) {
                    console.log(res)
                  }
            })
            cc.director.loadScene("game_first")
        }
        if(wx.getStorageSync('first')==1){
            // cc.director.loadScene("game_first")
            cc.director.loadScene("game")
        }
    },

    forwarding: function(){
        console.log("转发");
            // window.wx.ShareAppMessage({
            //     title: '微信小程序联盟',
            //     // imageUrl: '最具人气的小程序开发联盟!',
            //     // path: '/page/user?id=123'
            //     success: function(res) {
            //         console.log(res)
            //     }
            // })
            var num=Math.floor(Math.random()*3);
            var title=com.show_data[num];
            window.wx.shareAppMessage({
                imageUrl: 'res/raw-assets/images/background/jiqiao.19679.png',
                title: title,
                // imageUrl: 'http://img2.imgtn.bdimg.com/it/u=1459111502,2135706096&fm=27&gp=0.jpg',
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
    },
    // onShareAppMessage: function () {
    //     return {
    //         title: '微信小程序联盟',
    //         desc: '最具人气的小程序开发联盟!',
    //         path: '/page/user?id=123'
    //     }
    // }

    // update (dt) {},
});

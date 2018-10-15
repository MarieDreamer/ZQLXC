var com = require('Common');
var game_content = require('game_content');
cc.Class({
    extends: cc.Component,

    properties: {
        line: {
            default: null,
            type: cc.Prefab
        },
        touch: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad () {
        var collider = cc.director.getCollisionManager();
        collider.enabled =true;
        // collider.enabledDebugDraw =true;        
    },

    start () {
        var that = this;
        var lineObject = new Object;
        var touchObject = new Object;
        // var a = that.node.getChildren()[0].getComponent(cc.Animation);

        //触摸开始
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            var line = cc.instantiate(that.line);
            let windowSize=cc.view.getVisibleSize();  
            line.parent = cc.find('Canvas/bili/gameContent/line');
            line.setLocalZOrder(1);
            //当前小球的中心点
            line.setPosition(this.x, this.y);
            lineObject = line;

            //----------------------------
            var mouse = event.getLocation();
            mouse.x -= 337.5;
            mouse.y -= 600+(windowSize.height-1200)/2;
            var touch = cc.instantiate(that.touch);
            touch.setPosition(mouse.x, mouse.y);
            touch.setLocalZOrder(3);
            touch.parent = cc.find('Canvas/bili/gameContent');
            touchObject = touch;
        })
        
        //移动
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            //鼠标坐标（以屏幕左下为原点）
            let windowSize=cc.view.getVisibleSize();  
            var mouse = event.getLocation();
            mouse.x-=337.5;
            mouse.y-=600+(windowSize.height-1200)/2;
            var pos = new Object;
            pos.x = lineObject.x;
            pos.y = lineObject.y;

            var length = Math.sqrt(Math.pow(pos.y-mouse.y,2)+Math.pow(pos.x-mouse.x,2));

            var x = mouse.x-pos.x;
            var cos = x/length;
            var radina = Math.acos(cos);//用反三角函数求弧度
            var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

            //鼠标在第一、二象限
            if(mouse.x>pos.x&&mouse.y>pos.y || mouse.x<pos.x&&mouse.y>pos.y){
                angle = 360 - angle;
            }

            lineObject.width = length;
            lineObject.rotation = angle;
            touchObject.setPosition(mouse.x,mouse.y);
        });

        //结束或取消

        this.node.on(cc.Node.EventType.TOUCH_END, function ( event ) {
            lineObject.destroy();
            touchObject.destroy();
            that.ball_array = [];
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function ( event ) {
            lineObject.destroy();
            touchObject.destroy();
            that.ball_array = [];
        });

        //鼠标拖动
        // this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
        //     var delta = event.touch.getDelta();
        //     this.x += delta.x;
        //     this.y += delta.y;
        // });
        
    },

    move_ball: function(){
        // console.log('ok');
    },

    // add_animation: function(){
    //     if(com.add_data[1]){
    //         console.log("加 "+com.add_data +" 分");
    //     }
    // }
        
});

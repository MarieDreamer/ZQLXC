var com = require('Common');
cc.Class({
    extends: cc.Component,
    properties: {
        array: [],
        ball_array: [],
        test_array: [],
        line_array: [],
        color: '',
        begin_name: '',
        has_same: 0,
        fixed_line: {
            default: [],
            type: cc.Prefab
        },
        expand: {
            default: [],
            type: cc.Prefab
        },
        audio: {
            url: cc.AudioClip,
            default: null
        },
    },
    onLoad () {
        var collider = cc.director.getCollisionManager();
        collider.enabled =true;
        // collider.enabledDebugDraw =true;
    },

    onCollisionEnter: function (other, self) {

        //如果是第一个，放进去，并确定颜色和名称
        if(!this.ball_array[0]){
            this.ball_array.push(other.node);
            var a = other.node.getChildren()[0].getComponent(cc.Animation);
            a.play('ball_scale');
            // console.log(com.line_com);

            this.current = cc.audioEngine.play(this.audio, false, 1);
            if(other.node.name == 'blueBall'){
                this.color = 0;
            }
            if(other.node.name == 'redBall'){
                this.color = 1;
            }
            if(other.node.name == 'greenBall'){
                this.color = 2;
            }
            if(other.node.name == 'yellowBall'){
                this.color = 3;
            }
            this.begin_name = other.node.name;
        }
        //从第二个开始
        else{
            //判断是否连过
            this.has_same = 0;
            for(var i=0; i<this.ball_array.length; i++){
                if(this.ball_array[i].uuid == other.node.uuid){
                    this.has_same = 1;
                }
            }
            //如果没有连过
            if(this.has_same == 0){
                //再判断颜色
                if(other.node.name == this.begin_name){
                    //起始坐标
                    var l = this.ball_array.length;
                    var beginX = this.ball_array[l-1].x;
                    var beginY = this.ball_array[l-1].y;
                    var endX = other.node.x;
                    var endY = other.node.y;
                    //长度
                    var length = Math.sqrt(Math.pow(beginX-endX,2) + Math.pow(beginY-endY,2));
                    if(length>142){
                        return;
                    }
                    //角度
                    var x = endX - beginX;
                    var cos = x/length;
                    var radina = Math.acos(cos);
                    var angle = Math.floor(180/(Math.PI/radina));
                    if(endX>beginX && endY>beginY || endX<beginX && endY>beginY)angle = 360 - angle;
                    if(endX == beginX&&endY > beginY)angle = 180 + angle;
                    //画线段
                    var segment = cc.instantiate(this.fixed_line[this.color]);
                    var fixed_line = cc.find('Canvas/bili/gameContent/fixed_line');
                    segment.parent = fixed_line;
                    segment.setLocalZOrder(1);
                    segment.setPosition(beginX, beginY);
                    segment.width = length;
                    segment.rotation = angle;
                    this.ball_array.push(other.node);
                    var a = other.node.getChildren()[0].getComponent(cc.Animation);
                    a.play('ball_scale');
                    this.current = cc.audioEngine.play(this.audio, false, 1);
                    //改变动线
                    var moveLine = cc.find('Canvas/bili/gameContent/line');
                    moveLine.children[0].setPosition(endX,endY);
                    moveLine.children[0].width = 0;
                }
            }
            //如果连过，判断是否是上一步的
            else{
                var l = this.ball_array.length;
                if(this.ball_array[l-2]){
                    if(this.ball_array[l-2].uuid == other.node.uuid){                        
                        var fixed_line = cc.find('Canvas/bili/gameContent/fixed_line').children;
                        var l = fixed_line.length;
                        if(fixed_line[l-1]){
                            fixed_line[l-1].destroy();
                        }
                        //改变动线
                        this.ball_array.pop();
                        var moveLine = cc.find('Canvas/bili/gameContent/line');
                        moveLine.children[0].setPosition(other.node.x,other.node.y);
                        moveLine.children[0].width = 0;
                    }
                }
            }
        }

        //保存数组
        com.x=this.change_x(other.node.x);
        com.y=this.change_y(other.node.y);
        if (com.line_com.length==0) {
            com.line_com=[
                {'x':com.x,'y':com.y,'color':com.game_com[com.y][com.x][0],'num':com.game_com[com.y][com.x][1]},
            ]
        }else{
            this.game_add_line_com();
        }

        com.ball_com = this.ball_array;
        
        //清除倍数
        this.clearMultiple();
        
        //放大倍数
        this.multiple();
        
    },

    getString: function(node){
        return node.getChildByName('number').getComponent(cc.Label).string;
    },

    clearMultiple: function(){
        var ar = cc.find('Canvas/bili/gameContent').getChildren();
        for(var i = 3 ; i < ar.length ; i ++){
            for(var j = 0 ; j < ar[i].getChildren().length; j ++){
                if(ar[i].getChildren()[j].name == 'expand'){
                    ar[i].getChildren()[j].destroy();
                }
                
            }
        }
    },

    multiple: function(){
        var ball_array = this.ball_array;
        //长度需超过三个
        if (ball_array.length<3) {
            return false;
        }
        var tong = [];

        for(var i = 0 ; i < ball_array.length; i ++){
            if(i == 0){
                tong.push(ball_array[0]);
            }else{
                //如果下一个数字不同，换节点
                if(this.getString(tong[0]) != this.getString(ball_array[i])){
                    tong = [];
                    tong.push(ball_array[i]);
                }
                //如果下一个数字相同
                else{
                    tong.push(ball_array[i]);
                    //已有3个及以上相同
                    if (tong.length >= 3) {
                        for(var j = 0 ; j < tong.length ; j ++){
                            var expand = new cc.instantiate(this.expand[this.color]);
                            expand.setPosition(0,0);
                            expand.parent = tong[j];
                            expand.getChildren()[0].getComponent(cc.Label).string = this.getString(tong[j]) + '0';
                        }
                    }
                }
            }
            
        }

    },
    
    //计算是否可以连线 game_com为游戏数组，line_com为连线数组，x(横，从左往右)、y(竖，从下往上)为目标位置
    game_add_line_com: function(){
        let game_com=com.game_com;
        let line_com=com.line_com;
        let x=com.x;
        let y=com.y;
        let err;
                // console.log(x);
                // console.log(y);
        if(game_com[y][x][0]==line_com[line_com.length-1]['color']){//是否同一颜色
            if(x>=line_com[line_com.length-1]['x']-1 && x<=line_com[line_com.length-1]['x']+1){
                if(y>=line_com[line_com.length-1]['y']-1 && y<=line_com[line_com.length-1]['y']+1){//是否在目前连线的边上
                    if(line_com.length>0){
                        if(line_com.length>1 && y==line_com[line_com.length-2]['y'] && x==line_com[line_com.length-2]['x']){//是否上一次连线
                            com.line_com.pop();//移除最后一个
                        }else{
                            let flag=0;
                            for (var i = 0; i < com.line_com.length; i++) {
                                if(com.line_com[i].x==x && com.line_com[i].y==y){
                                    flag=1;
                                }
                            }
                            if (flag==0) {
                                var new_line={};
                                new_line['x']=x;
                                new_line['y']=y;
                                new_line['color']=game_com[y][x][0];
                                new_line['num']=game_com[y][x][1];
                                com.line_com.push(new_line);//填入新数组
                            }
                        }
                    }else{
                        err = ['err','链接长度出错'];
                    }
                }else{
                    err = ['err','不在y范围内'];
                }
            }else{
                err = ['err','不在x范围内'];
            }
        }else{
            err = ['err','不同色'];
        }
    },
    change_x: function (x) {
        x=x+250;
        return Math.round(x/100);
    },
    change_y: function (y) {
        y=y+320;
        return Math.round(y/100);
    },

});

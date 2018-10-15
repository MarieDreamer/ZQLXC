var com = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {
        ball: {
            default: [],
            type: cc.Prefab
        },
        time_x: 0,
        time_y: 0,
        per_add_time: 0,
        add_time: 0,
        time: 30,
        audio: {
            url: cc.AudioClip,
            default: null
        },
        overAudio: {
            url: cc.AudioClip,
            default: null
        },
        clearAudio: {
            url: cc.AudioClip,
            default: null
        },
        add_s: {
            default: [],
            type: cc.Prefab
        },
        frame: 0,
        add_time_num: 1
    },

    // onLoad: function () {
        
    // },

    start: function () {
        // 初始化
        if (com.is_fuhuo==0) {//如果重新开始
            com.data=null;
            com.game_com=[];
            com.line_com=[];
            com.x=0;
            com.y=0;
            com.add_data=[];
            this.time = 30;
            com.game_time=30;
            com.game_num=0;
        }else{
            this.time = 30;
            var number = cc.find("Canvas/bili/fengshu/number");
            number.getComponent(cc.Label).string = com.game_num;
        }

        this.game_start_flag=true;
        //游戏数组
        var array = [];
        var that = this;

        array=this.start_com();

        //根据数组生成图案
        for(var i = 0; i < 6; i ++){
            for(var j = 0; j < 6; j ++){
                var node = cc.instantiate(this.ball[array[i][j][0]]);
                var label = node.getChildByName("number").getComponent(cc.Label);
                label.string = array[i][j][1];
                node.parent = this.node;
                node.setLocalZOrder(2);
                node.setPosition(-250 + j *100, -320 + i *100);
                array[i][j][2]=node;
            }
        }
        com.game_com=array;

        // 触摸结束
        this.node.on(cc.Node.EventType.TOUCH_END, function ( event ) {
            var mouse = event.getLocation();
            let windowSize=cc.view.getVisibleSize();
            mouse.x -= 337.5;
            mouse.y -= 600+(windowSize.height-1200)/2;
            that.time_x = mouse.x;
            that.time_y = mouse.y;

            // test.setPosition(that.time_x,that.time_y);

            if(com.line_com.length>2){
                that.game_integral();
                that.adjust_com();
                that.change_fengshu_number();
                cc.audioEngine.play(that.clearAudio, false, 1);
            }else{
                that.move_line();
                com.add_data = [];
            }
        });

        // 触摸取消
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function ( event ) {
            var mouse = event.getLocation();
            let windowSize=cc.view.getVisibleSize();
            mouse.x -= 337.5;
            mouse.y -= 600+(windowSize.height-1200)/2;
            that.time_x = mouse.x;
            that.time_y = mouse.y;

            // test.setPosition(that.time_x,that.time_y);
            if(com.line_com.length>2){
                that.game_integral();
                that.adjust_com();
                that.change_fengshu_number();
                cc.audioEngine.play(that.clearAudio, false, 1);
            }else{
                that.move_line();
                com.add_data = [];
            }
        });

    },
    move_line: function(){
        var fixed_line = cc.find('Canvas/bili/gameContent/fixed_line').children;
        for (var i = 0; i < fixed_line.length; i++) {
            fixed_line[i].destroy();
        }
        com.line_com=[];
    },
    game_integral: function(){
        // console.log(com.line_com);
        var line_com=com.line_com;
        //长度需超过三个
        if (line_com.length<3) {
            return false;
        }
        var tong=[0,0];
        //相同数字的数组
        var same_array = [];
        //不相同数字的和
        var unsame_add = 0;
        //相同数字的和
        var same_add = 0;
        //加的总分
        var score_add = 0;
        //加的总时间
        var time_add = 0;

        for(var i = 0 ; i < line_com.length; i ++){
            //如果下一个数字不同
            if(tong[0] != line_com[i]['num']){
                //已凑齐三个及以上
                if (tong[1]>=3) {
                    for (var j = 0; j < parseInt(tong[1]/3); j++) {
                        if ((j+1)==parseInt(tong[1]/3)) {
                            same_array.push([tong[0],(3+tong[1]%3)]);
                        }else{
                            same_array.push([tong[0],3]);
                        }
                    }
                }
                //没有凑齐三个
                else{
                    unsame_add += tong[0] * tong[1];
                }
                //tong换数字
                tong=[line_com[i]['num'],1];
            }
            //如果下一个数字相同
            else{
                tong[1] ++;
            }

            //需要处理最后一个tong
            if(i == line_com.length-1){
                if (tong[1]>=3) {
                    for (var j = 0; j < parseInt(tong[1]/3); j++) {
                        if ((j+1)==parseInt(tong[1]/3)) {
                            same_array.push([tong[0],(3+tong[1]%3)]);
                        }else{
                            same_array.push([tong[0],3]);
                        }
                    }
                }else{
                    unsame_add += tong[0] * tong[1];
                }
            }
        }
        console.log(same_array);

        if(same_array){
            let time=0.1;
            for(var i = 0 ; i < same_array.length ; i ++){
                same_add += same_array[i][0]*10 * same_array[i][1];
                time_add += same_array[i][0];
                time=time+0.2;
                var seq = cc.sequence(
                    cc.delayTime(time),
                    cc.moveTo(0.3, cc.p(-200, 330)),
                    cc.fadeOut(0.3)
                );

                //加时动画，对于多个动画需要延时
                var add_animation = cc.instantiate(this.add_s[same_array[i][0]-1]);
                add_animation.parent = cc.find('Canvas/bili/add_animation');
                add_animation.setPosition(this.time_x,this.time_y);
                // var action1 = cc.moveTo(0.5, cc.p(-200, 330));
                // action1.easing(cc.easeOut(3.0));
                // var action2 = cc.fadeOut(2.0);
                // add_animation.runAction(action1);
                add_animation.runAction(seq);

                
                // com.move_action.push(['destroy',add_animation]);

            }
        }

        score_add = same_add + unsame_add;
        com.add_data=[score_add,time_add];
    },

    //调整去除后数组,该函数可拆分，，并且插入动画效果
    adjust_com: function(){
        var game_com=com.game_com;
        var line_com=com.line_com;
        var fixed_line = cc.find('Canvas/bili/gameContent/fixed_line').children;
        for (var i = 0; i < fixed_line.length; i++) {
            this.move_lines(fixed_line[i]);
            // com.move_action.push(['move_line',fixed_line[i]]);
            // fixed_line[i].destroy();
        }
        //清除移除数组
        for(var i = 0; i < line_com.length; i ++){
            let x=line_com[i].x;
            let y=line_com[i].y;
            let node = game_com[y][x][2];
            this.ball_active(node);
            // com.move_action.push(['ball_active',node]);
            // // node.destroy()
            game_com[y][x][3]=0;
        }
        //依次下降
        for(var i = 0; i < 6; i ++){
            for(var j = 0; j < 6; j ++){
                if (game_com[i][j][3]==0) {
                    for (var z = i+1; z < 6; z++) {
                        if (game_com[z][j][3]==1 && game_com[i][j][3]==0) {
                            game_com[i][j]=[game_com[z][j][0],game_com[z][j][1],game_com[z][j][2],1];
                            game_com[z][j][3]=0;
                            //方向 哪个 坐标 下降格数
                            // com.move_action.push(['down',game_com[i][j][2],i,j,z-i]);
                            this.ball_down(game_com[i][j][2],i,j,z-i);
                            continue;
                        }
                    }
                }
            }
        }
        //填充空白
        for(var i = 0; i < 6; i ++){
            for(var j = 0; j < 6; j ++){
                if (game_com[i][j][3]==0) {
                    var color = Math.floor(Math.random()*4);
                    var number = Math.floor(Math.random()*3 + 1);
                    game_com[i][j] = [color,number,game_com[i][j][2],1];
                    // com.move_action.push(['add',i,j]);
                    this.ball_add(i,j);
                }
            }
        }
        com.game_com=game_com;
        com.line_com=[];

        // for (var i = 0; i < com.move_action.length; i++) {
        //     console.log(com.move_action[i])
        // }
        // game_content.cc.drow_com()
    },
    move_lines:function(x){
        x.destroy();
    },
    ball_active:function(x){
        var seq = cc.sequence(
            cc.scaleBy(0.1, 1.2, 1.2),
            cc.scaleBy(0.1, 0.1, 0.1),
            cc.removeSelf()
        );
        x.runAction(seq);
        // var a = x.getComponent(cc.Animation);
        // a.play("ball_move");
        // x.destroy();
    },
    ball_down:function(x,i,j,z){
        var seq = cc.sequence(
            cc.delayTime(0.2),
            cc.moveBy(0.02, cc.p(0, -z *30)),
            cc.moveBy(0.02, cc.p(0, -z *60)),
            cc.moveBy(0.01, cc.p(0, -z *10)),
            cc.moveBy(0.02, cc.p(0, -z *10)),
            cc.moveBy(0.05, cc.p(0, z *10))
        );
        x.runAction(seq);
    },
    ball_add:function(i,j){
        var seq = cc.sequence(
            cc.delayTime(0.2),
            cc.show(),
            cc.moveBy(0.02, cc.p(0, -(5-i) *30)),
            cc.moveBy(0.02, cc.p(0, -(5-i) *60)),
            cc.moveBy(0.01, cc.p(0, -(5-i) *10)),
            cc.moveBy(0.02, cc.p(0, -(5-i) *10)),
            cc.moveBy(0.05, cc.p(0, (5-i) *10))
        );

        //添加球
        var node = cc.instantiate(this.ball[com.game_com[i][j][0]]);
        var label = node.getChildByName("number").getComponent(cc.Label);
        label.string = com.game_com[i][j][1];
        node.parent = this.node;
        node.setLocalZOrder(2);
        node.setPosition(-250 + j *100, -320 + 5 *100);
        com.game_com[i][j][2]=node;
        node.runAction(cc.hide());

        node.runAction(seq);
    },

    //创建数组
    start_com: function(){
        var array=[]
        //生成数组
        for(var i = 0; i < 6; i ++){
            array[i] = [];
            for(var j = 0; j < 6; j ++){
                var color = Math.floor(Math.random()*4);//四种颜色中生成
                var number = Math.floor(Math.random()*3 + 1);//三个数字中选择
                //一个位置放的球的颜色/数字/对应的游戏对象/是否移动
                array[i][j] = [color,number,0,1];
            }
        }
        //判断是否有解，无解重置
        // var now_com=[]
        // now_com[0]=[]
        // now_com[0]['x']=0;
        // now_com[0]['y']=0;
        // now_com[0]['color']=array[0][0][0];
        // now_com[0]['num']=array[0][0][1];
        // this.move_not(array,0,0,now_com);
        // if (!this.game_start_flag) {
        //     array=this.start_com();
        // }
        com.game_com=array;
        return array;
    },
    //判断能否继续游戏
    // move_not: function (game_com,x,y,now_com){
    //     //没想好算法，先凑合用，原因当触碰到不存在的以后报错
    //     if (x==0 && y==0) {
    //         if(game_com[x][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y+1,now_com);
    //         }
    //         if(game_com[x+1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y+1,now_com);
    //         }
    //         if(game_com[x+1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y,now_com);
    //         }
    //     }else if (x==5 && y==5) {
    //         if (game_com[x-1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y-1,now_com);
    //         }
    //         if(game_com[x-1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //     }else if (x==0 && y==5) {
    //         if (game_com[x][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y-1,now_com);
    //         }
    //         if(game_com[x+1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x+1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //     }else if (x==5 && y==0) {
    //         if (game_com[x-1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y-1,now_com);
    //         }
    //         if(game_com[x-1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //     }else if (x==0) {
    //         if(game_com[x][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y+1,now_com);
    //         }
    //         if(game_com[x+1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y+1,now_com);
    //         }
    //         if(game_com[x+1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y,now_com);
    //         }
    //         if(game_com[x+1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y-1,now_com);
    //         }
    //         if(game_com[x][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //     }else if(y==0) {
    //         if(game_com[x-1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x-1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y+1,now_com);
    //         }
    //         if(game_com[x][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y+1,now_com);
    //         }
    //         if(game_com[x+1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y+1,now_com);
    //         }
    //         if(game_com[x+1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y,now_com);
    //         }
    //     }else if (x==5) {
    //         if (game_com[x-1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y-1,now_com);
    //         }
    //         if(game_com[x-1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x-1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y+1,now_com);
    //         }
    //         if(game_com[x][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //         if(game_com[x][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y+1,now_com);
    //         }
    //     }else if(y==5) {
    //         if (game_com[x-1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y-1,now_com);
    //         }
    //         if(game_com[x-1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x+1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y,now_com);
    //         }
    //         if(game_com[x+1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y-1,now_com);
    //         }
    //         if(game_com[x][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //     }else{
    //         if (game_com[x-1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y-1,now_com);
    //         }
    //         if(game_com[x-1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y,now_com);
    //         }
    //         if(game_com[x-1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x-1,y+1,now_com);
    //         }
    //         if(game_com[x][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y+1,now_com);
    //         }
    //         if(game_com[x+1][y+1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y+1,now_com);
    //         }
    //         if(game_com[x+1][y][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y,now_com);
    //         }
    //         if(game_com[x+1][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x+1,y-1,now_com);
    //         }
    //         if(game_com[x][y-1][0]==game_com[x][y][0]) {
    //             this.add_now_com(game_com,x,y-1,now_com);
    //         }
    //     }
    //     if (now_com.length==1) {
    //         if (x==5&&y==5) {
    //             console.log('没有解');
    //             return this.game_start_flag=false;
    //         }else if (x==5) {
    //             y++;
    //             x=0;
    //         }else{
    //             x++;
    //         }
    //         var array_1=[];
    //         array_1['x']=x;
    //         array_1['y']=y;
    //         array_1['color']=game_com[x][y][0];
    //         array_1['num']=game_com[x][y][1];
    //         var now_com=[]
    //         now_com[0]=array_1;
    //         this.move_not(game_com,x,y,now_com);
    //     }
    // },
    // add_now_com: function(game_com,x,y,now_com){
    //     for (var i = 0; i < now_com.length; i++) {
    //         if(now_com[i].x==x && now_com[i].y==y){
    //             console.log('有重复')
    //             return false;
    //         }
    //     }
    //     var array_1=[];
    //     array_1['x']=x;
    //     array_1['y']=y;
    //     array_1['color']=game_com[x][y][0];
    //     array_1['num']=game_com[x][y][1];
    //     now_com[now_com.length]=array_1;
    //     if(now_com.length==2){
    //         var flag=this.move_not(game_com,x,y,now_com);
    //     }else if(now_com.length==3){
    //         console.log('有解')
    //     }
    // },

    update: function (dt) {
        if (com.game_restart!=0) {
            this.game_restart();
        }
        if (com.game_stop==0) {
            if (com.is_game_over==0) {
                //如果有加分且时间间隔是5帧
                if (com.add_data[1]>0 && this.add_time>5) {
                    com.game_time++;
                    this.time++;
                    com.add_data[1]--;
                    this.add_time=0;
                    this.change_time_number()
                }else{
                    if (com.game_time-1>this.time) {
                        // console.log(com.game_time)
                        com.game_time--;
                        this.change_time_number()
                    }
                    this.time -= dt;
                }

                if (com.game_time-1>this.time) {
                    //播放倒计时
                    if(this.time < 10){
                        var daojishi = cc.audioEngine.play(this.audio, false, 1);
                    }
                }
                this.add_time++;
            }
            // this.move_action();
        }
    },

    game_restart: function () {
        com.data = null;
        com.line_com=[];
        com.x=0;
        com.y=0;
        com.add_data=[];
        com.game_time=30;
        this.time=30;
        com.game_num=0;
        com.is_game_over=0;
        com.is_fuhuo=0;
        com.game_stop=1;
        com.move_action=[];
        var number = cc.find("Canvas/bili/fengshu/number");
        number.getComponent(cc.Label).string = 0;

        // console.log(com.game_restart)
        if (com.game_restart==1) {
            //移除全部
            for(var i = 0; i < 6; i ++){
                for(var j = 0; j < 6; j ++){
                    com.game_com[i][j][2].destroy();
                    var color = Math.floor(Math.random()*4);
                    var number = Math.floor(Math.random()*3 + 1);
                    var node = cc.instantiate(this.ball[color]);
                    var label = node.getChildByName("number").getComponent(cc.Label);
                    label.string = number;
                    node.parent = this.node;
                    node.setLocalZOrder(2);
                    node.setPosition(-250 + j *100, -320 + i *100);
                    com.game_com[i][j][0]=color;
                    com.game_com[i][j][1]=number;
                    com.game_com[i][j][2]=node;
                }
            }
            com.game_restart=0;
            com.game_stop=0;
        }
    },

    change_time_number: function () {
        //如果游戏结束
        if (com.game_time==0) {
            com.is_game_over=2;
            com.line_com=[];
            com.add_data=[];
            com.move_action=[];
            cc.director.loadScene("game_score")
            // if (com.is_fuhuo==1) {
            //     cc.director.loadScene("game_score")
            // }else{
            //     cc.director.loadScene("game_over")
            // }
        }
        //label上改变时间
        let time_number= parseInt(com.game_time/60)+':'+(com.game_time%60);
        var number = cc.find("Canvas/bili/daojishi/number");
        number.getComponent(cc.Label).string = time_number;

        if(com.game_time == 0){
            cc.audioEngine.play(this.overAudio, false, 1);
        }
        //改变时间颜色
        if(com.game_time <= 10){
            number.getComponent(cc.Label).node.color = new cc.Color(255,0,0);
        }else{
            number.getComponent(cc.Label).node.color = new cc.Color(67,55,8);
        }
    },

    change_fengshu_number: function () {
        this.add_time=0;//添加时间赋值为0，
        if(com.game_num+com.add_data[0]>=this.add_time_num*1000 && com.game_num<this.add_time_num*1000){//首次到达1000分加5s
            //动画
            var anim = cc.find("Canvas/bili/add_animation");
            var a = anim.getChildByName('add_5s').getComponent(cc.Animation);
            a.play('add_5s');
            com.add_data[1]=com.add_data[1]+5;
            var number = cc.find("Canvas/bili/fengshu/number").getComponent(cc.Animation);
            number.play("num_big");
            this.add_time_num++;
            // console.log(this.add_time_num)
        }
        com.game_num = com.game_num+com.add_data[0];
        // com.game_time = com.game_time+com.add_data[1];
        var number = cc.find("Canvas/bili/fengshu/number");
        number.getComponent(cc.Label).string = com.game_num;
    },

    move_action: function () {
        if (com.move_action.length>0 && com.move_action_time>20) {
            if(com.move_action[0][0]=='move_line'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='move_line') {
                        com.move_action[i][1].destroy();
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='move_line') {
                        com.move_action.shift();
                    }
                }
                com.move_action_time=19;
            }

            else if(com.move_action[0][0]=='ball_active'){
                //消失动画
                if(com.add_data[0]){
                    for(var i = 0 ; i < com.ball_com.length ; i ++){
                        var a = com.ball_com[i].getComponent(cc.Animation);
                        a.play("ball_move");
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='ball_active') {
                        com.move_action[i][0]='move_ball';
                    }
                }
                com.move_action_time=19;
            }

            else if(com.move_action[0][0]=='move_ball'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='move_ball') {
                        com.move_action[i][1].destroy();
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='move_ball') {
                        com.move_action.shift();
                    }
                }
                com.move_action_time=19;
            }

            else if(com.move_action[0][0]=='down'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down') {
                        var down = com.move_action[i][1];
                        var action1 = cc.moveBy(0.01, cc.p(0, -com.move_action[i][4] *30));
                        down.runAction(action1);
                        com.move_action[i][0]='down_action1';
                    }
                }
                com.move_action_time=19; 
            }

            else if(com.move_action[0][0]=='down_action1'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down_action1') {
                        var down = com.move_action[i][1];
                        var action2 = cc.moveBy(0.01, cc.p(0, -com.move_action[i][4] *60));
                        down.runAction(action2);
                        com.move_action[i][0]='down_action2';
                    }
                }
                com.move_action_time=19; 
            }

            else if(com.move_action[0][0]=='down_action2'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down_action2') {
                        var down = com.move_action[i][1];
                        var action3 = cc.moveBy(0.01, cc.p(0, -com.move_action[i][4] *10));
                        down.runAction(action3);
                        com.move_action[i][0]='down_action3';
                    }
                }
                com.move_action_time=19; 
            }

            else if(com.move_action[0][0]=='down_action3'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down_action3') {
                        var down = com.move_action[i][1];
                        var action4 = cc.moveBy(0.01, cc.p(0, -com.move_action[i][4] *10));
                        down.runAction(action4);
                        com.move_action[i][0]='down_action4';
                    }
                }
                com.move_action_time=19; 
            }

            else if(com.move_action[0][0]=='down_action4'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down_action4') {
                        var down = com.move_action[i][1];
                        var action5 = cc.moveBy(0.01, cc.p(0, com.move_action[i][4] *10));
                        down.runAction(action5);

                        // label.string = com.game_com[i][j][1];
                        // node.parent = this.node;
                        // node.setLocalZOrder(2);
                        // node.setPosition(-250 + j *100, -320 + 5 *100);
                        // com.game_com[i][j][2]=node;
                        // com.move_action[x][3]=node;

                        com.move_action[i][0]='down_stop';
                    }
                }
                com.move_action_time=19; 
            }

            else if(com.move_action[0][0]=='down_stop'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down_stop') {
                        //com.move_action[i][1].setPosition(-250 + com.move_action[i][3] *100, -320 + com.move_action[i][2] *100);
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='down_stop') {
                        com.move_action.shift();
                    }
                }
                com.move_action_time=19; 
            }

            else if(com.move_action[0][0]=='move'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='move') {
                        com.move_action[i][1].destroy();
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='move') {
                        com.move_action.shift();
                    }
                }
                com.move_action_time=19;
            }

            else if(com.move_action[0][0]=='add'){
                for (var x = 0; x < com.move_action.length; x++) {
                    if (com.move_action[x][0]=='add') {
                        let i=com.move_action[x][1];
                        let j=com.move_action[x][2];
                        var node = cc.instantiate(this.ball[com.game_com[i][j][0]]);
                        var label = node.getChildByName("number").getComponent(cc.Label);
                        label.string = com.game_com[i][j][1];
                        node.parent = this.node;
                        node.setLocalZOrder(2);
                        node.setPosition(-250 + j *100, -320 + 5 *100);
                        com.game_com[i][j][2]=node;
                        com.move_action[x][3]=node;
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='add') {
                        var down = com.move_action[i][3].getComponent(cc.Animation);
                        down._clips[1].curveData.props.y[0].value= -320 + 5 * 100;
                        down._clips[1].curveData.props.y[1].value= -320 + 5 * 70 + com.move_action[i][1] * 30;
                        down._clips[1].curveData.props.y[2].value= -320 + 5 * 20 + com.move_action[i][1] * 80;
                        down._clips[1].curveData.props.y[3].value= -320 + 5 * 10 + com.move_action[i][1] * 90;
                        down._clips[1].curveData.props.y[4].value= -320 - 5 * 10 + com.move_action[i][1] * 110;
                        down._clips[1].curveData.props.y[5].value= -320 + com.move_action[i][1] *100;
                        down._clips[1].speed=6;
                        down.play("ball_down");
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='add') {
                        com.move_action[i][0]='add_stop';
                    }
                }
                com.move_action_time=19;
            }

            else if(com.move_action[0][0]=='add_stop'){
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='add_stop') {
                        
                        // com.move_action[0][3].setPosition(-250 + com.move_action[0][3] *100, -320 + com.move_action[0][2] *100);
                    }
                }
                for (var i = 0; i < com.move_action.length; i++) {
                    if (com.move_action[i][0]=='add_stop') {
                        com.move_action.shift();
                    }
                }
                com.move_action_time=19;
            }
            // com.game_stop=1;
        }else {
            // com.game_stop=0;
        }
        com.move_action_time++;
    },

});
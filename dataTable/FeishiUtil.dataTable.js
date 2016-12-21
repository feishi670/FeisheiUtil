(function(){
    function extend(a,b,flag){
        for(c in b){
            if(flag){
                a[c]=a[c]==undefined?b[c]:a[c];
            }else{
                a[c]=b[c];
            }

        }
    }
    function stepNext(current,arr,obj) {
        for(var i=0;i<arr.length;i++){
            if(obj[arr[i]]==current){
                return obj[arr[(i+1)%arr.length]];
            }
        }
        return obj[arr[0]];
    }
    function getType(current,obj){
        for(p in obj){
            if(obj[p]==current){
                return p;
            }
        }

    }
    window.FeishiUtil=window.FeishiUtil||{};
    var sortClass={
        "default":"sortring",
        "asc":"sorting_asc",
        "desc":"sorting_desc"
    };
    function dataTable(config){
        this.config=config;
        this.$http=this.config.$http;
        this.$scope=this.config.$scope;
        this.initCols();
        this.initPostParam();
        this.callBacks={};
        this.config.sortClass=this.config.sortClass||{};
        extend(this.config.sortClass,sortClass,true);
    }
    dataTable.prototype.initCols=function(){
        this.cols=this.config.cols;
        for (var i=0;i<this.cols.length;i++) {
            var col=this.cols[i];
            col.sortType=col.sort?"sortring":"";
        }
    };
    dataTable.prototype.initPostParam=function(){
        this.ajax=this.config.ajax;
        this.server=this.config.server||{};
        this.client=this.config.client||{};
        this.currentPage=1;
        this.search={};
        this.config.pageSize=this.config.pageSize||10;
        this.httpParam={
            method: 'GET',
            url: this.ajax.url,
            params: {
            }
        };
    };
    dataTable.prototype.get = function() {
        this.sendRequest("GET");
    }

    dataTable.prototype.getByUrl = function(key) {
        this.httpParam.baseUrl=this.ajax[key]||this.ajax["url"];
          this.sendRequest();
    }
    dataTable.prototype.post = function() {
        this.sendRequest("POST");
    }
    dataTable.prototype.sendRequest=function(method){
        this.setHttpParam("pageSize",this.config.pageSize);
        this.setHttpParam("currentPage",this.currentPage);
        var thisObj = this;
        var param={};
        extend(param,this.httpParam.params);
        extend(param,this.search);
        var httpParam={};
        extend(httpParam,this.httpParam);
        httpParam.params=param;
        httpParam.method=httpParam.method||"GET";
        httpParam.url=this.httpParam.baseUrl||this.ajax.url;
        var send=this.$http(httpParam);
        console.log(send.constructor);
        if(send.then){
            send.success=function(fun){
                send.successFun=fun;
            }
            send.then(function (result) {
                if(typeof send.successFun =='function'){
                    send.successFun.call(result,result.data);
                }
            });
        }
        send.success(function(result) {
            thisObj.data = result[thisObj.server.data];
            thisObj.currentPage=result[thisObj.server.currentPage]||thisObj.currentPage;
            thisObj.total=result[thisObj.server.total];
            thisObj.initCountBarNum();
        });

    };

    dataTable.prototype.setHttpParam=function(key,value){
        key=this.config.client[key]||key;
        this.httpParam.params[key]=value;
    }
    dataTable.prototype.initCountBarNum=function(){
        //this.total=326;
        this.pageNum=Math.ceil(this.total/this.config.pageSize);
        this.pageNums=[1];
        var pre,aft;
        for(var i=2;i<this.pageNum;i++){
            if(this.currentPage-i>3){
                if(!pre){
                    pre="... "
                    this.pageNums.push(pre);
                }
                continue;
            }
            if(this.currentPage-i<-3){
                if(!aft){
                    aft=" ..."
                    this.pageNums.push(aft);
                }
                continue;
            }
            this.pageNums.push(i);
        }
        if(this.pageNum>1){
            this.pageNums.push(this.pageNum);
        }
        this.start=this.config.pageSize*(this.currentPage-1)+1;
        this.end=this.start+this.data.length-1;
    };
    dataTable.prototype.getByIndex=function(pageNum,updateNum){
        this.currentPage=pageNum||this.currentPage;
        updateNum=updateNum||0;
        this.currentPage+=updateNum;
        this.currentPage=this.currentPage>0?(this.currentPage<this.pageNum?this.currentPage:this.pageNum):1;
        this.get();
    }

    dataTable.prototype.sort=function(obj){
        if(!obj.col.sort){
            return;
        }
        var orderParam=this.httpParam.params.order=this.httpParam.params.order||{};
        obj.col.sortType=stepNext(obj.col.sortType,["default","asc","desc"],this.config.sortClass);
        var orderType=getType(obj.col.sortType,this.config.sortClass);
        if(orderType&&orderType!="default"){
            orderParam={"field":obj.col.field,"order":orderType};
        }else{
            orderParam={};
        }
        this.httpParam.params.order=orderParam;
        this.httpParam.url=this.ajax.orderUrl||this.ajax.url;
        this.get();
    }
    dataTable.prototype.execute=function(obj){
        console.log(this);
        var cmd=obj.cmdNode.cmd,
            row=obj.$parent.$parent.row;
        var fun=this.callBacks[cmd];
        if(typeof fun){
            fun.call(this.$scope,row);
        }
    }

    dataTable.prototype.bind=function(key,fun){
        this.callBacks[key]=fun;
    }
    FeishiUtil.dataTable=dataTable;
})();

/**
 * Created by caixq on 12/21 021.
 */
(function () {
    var app=angular.module("myApp",[]);
    app.controller("myController",function ($scope,$http) {
        console.log(arguments)
        $scope.dataTable = new FeishiUtil.dataTable({
            $scope: $scope,
            $http: $http,
            cols: [
                {"label": "name", field: "id", "sort": true},
                {"label": "age", field: "busy"},
                {"label": "名字", field: "type"},
                {"label": "年龄", field: "zone"},
                {
                    /**
                     * 若需要操作，需绑定cmds(命令数组)
                     * */
                    "label": "操作", "type": "cmds", cmds: [
                    {
                        label: " 更新",
                        cmd: "update"
                    },
                    {
                        label: "删除",
                        cmd: "delete"
                    }
                ]
                },
            ],
            ajax: {
                url:"tsconfig.json"
                //orderUrl:"orderPageServerInfo.json",
            },
            /**
             * 服务器返回内容与本插件字段对应关系，若不写，则认为一致
             * */
            server: {
                data: "resultList",
                total: "totalSize",
                currentPage:"currPage"
            },
            /**
             * 本地页码currentPage，页面大小pageSize，排序规则order与服务器字段对应规则，若不填，则字段不变
             * */
            client:{
                pageSize:"length",
                currentPage:"currentPage",
                order:"order"
            },
            pageSize: 10,
            pageSizeList: [10, 20, 50, 100, 150]
        });


        $scope.dataTable.get();
        $scope.dataTable.bind("update", function (row) {
            console.log("update",row);
        });
    });
})();


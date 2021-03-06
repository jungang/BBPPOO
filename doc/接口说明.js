有以下四个接口
http://39.98.167.246:8096/chart/set  生成报表按钮  =》
http://39.98.167.246:8096/chart/get?id=xxxxxx(报表id)    随机数id
http://39.98.167.246:8096/chart/list?id=xxxx(  读取报表列表 		00000000-0000-0000-0000-000000000000
http://39.98.167.246:8096/chart/order?id=xxxx   保存报表列表顺序 	00000000-0000-0000-0000-000000000000

1
http://39.98.167.246:8096/chart/set         POST接口，body接收上传一个jsonObject。
{
	"id":"00000000-0000-0000-0000-000000000001",
	"title":"测试3",
	"isCreate":true,
	"dateType":"month",
	"dateValue":12,
	"projectId":"00000000-0000-0000-0000-000000000000",
	"list":[{"aaa":"bbb"},{"ccc":"ddd"}]
}
格式如上，基本按你设置的格式，但是需要增加一个projectId字段。id是你生成的报表id，uuid格式，如果你不提供服务端会自动生成一个。list里就是你填充的报表layout。
2
http://39.98.167.246:8096/chart/get?id=xxxxxx(报表id) 。 GET请求。  用于查询一个报表的详情。参数id是该报表的id
返回值
如果没有查询到数据，返 {
    "code": 20000,
    "msg": "no data"
}
如果查询成功
{
    "code": 20000,
    "msg": "success",
    "data": {
        "id": "9eb43c62-362b-4e0a-bb5d-3c12094f2e08",
        "isCreate": true,
        "title": "测试3",
        "dateType": "month",
        "dateValue": 12,
        "list": [
            {
                "aaa": "bbb"
            },
            {
                "ccc": "ddd"
            }
        ],
        "order": 0,
        "projectId": "00000000-0000-0000-0000-000000000000"
    }
}

3
如上，会在data字段里带出这个报表的结构
http://localhost:8086/chart/list?id=xxxx(项目id) 查询某项目下的所有报表列表，并按顺序输出
注意，该接口的id是指项目id而不是报表id
返回值
{
    "code": 20000,
    "msg": "success",
    "data": [
        {
            "id": "9eb43c62-362b-4e0a-bb5d-3c12094f2e08",
            "isCreate": true,
            "title": "测试3",
            "dateType": "month",
            "dateValue": 12,
            "order": 0,
            "projectId": "00000000-0000-0000-0000-000000000000"
        },
        {
            "id": "56d8d18e-6328-41da-aa37-d8808c7377c0",
            "isCreate": true,
            "title": "测试3",
            "dateType": "month",
            "dateValue": 12,
            "order": 1,
            "projectId": "00000000-0000-0000-0000-000000000000"
        },
        {
            "id": "f3bf01ad-c5fd-4a51-9d54-38e732868f5d",
            "isCreate": true,
            "title": "测试3",
            "dateType": "month",
            "dateValue": 12,
            "order": 2,
            "projectId": "00000000-0000-0000-0000-000000000000"
        }
    ]
}
是一个报表的列表，但是layout并没有给出，需要进一步查询。
第4接口，http://39.98.167.246:8096/chart/order?id=xxxx （项目id） POST请求。order就是排序接口，对一个项目下的多个报表顺序排序。id是项目id。
body如下，就是个json数组，每项一个报表id
["da2ea8e1-815d-4979-bba6-dd17c12dd083","1147fe5c-c972-4b27-ad87-fb2f2c6c8827"]
然后，该项目下的报表，就安这个id顺序重新order，以后list输出时，也就按这个顺序输出。
返回值
{
    "code": 20000,
    "msg": "success"
}
用这四个接口完成报表的存储展示。注意，set接口既可以创建，也可以更新，主要看报表的id是一个新的id还是已经存在的id

提供excel操作的四个接口
/upload/all接口，之前已经介绍过。以form的形式提交excel文件，同时提交projectId,batch,refresh字段。
可以一次性提交多个表单，系统自动分析表单内容，将数据导入系统。导入时带上refresh=true，则将以前导入的同一批该表单数据清除

/excel/list?projectId=XXXXXX&batch=XXX  GET请求 提供projectId,batch两个参数，可以看某个项目下某批数据的导入情况，结果例子如下
{
    "code": 20000,
    "msg": "success",
    "data": [
        {
            "id": "85c107d0-08ab-422c-9466-38d95abc4a61",
            "occurTime": "2020-04-10 14:14:48",
            "name": "队列-日运营",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "project_daily_operation"
        },
        {
            "id": "82d057ce-1c94-4833-b358-d0d91e76da2d",
            "occurTime": "2020-04-10 14:14:48",
            "name": "队列-月运营",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "project_monthly_operation"
        },
        {
            "id": "545bba99-f059-484f-b4cb-f5e1b6ed3b22",
            "occurTime": "2020-04-10 14:14:48",
            "name": "工资表导入",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_salary"
        },
        {
            "id": "a7b85c3b-556a-47b0-b00d-8246b88f5beb",
            "occurTime": "2020-04-10 14:14:48",
            "name": "固定费用",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "accounting_fee_misc"
        },
        {
            "id": "ab8d29ac-e115-4687-83ea-a5dff04d3e8e",
            "occurTime": "2020-04-10 14:14:48",
            "name": "考核费用及管理结费",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "accounting_penalty_management_fee"
        },
        {
            "id": "190c8a29-e377-4bd3-8f1d-a561fd48323b",
            "occurTime": "2020-04-10 14:14:48",
            "name": "考勤导入",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_attendance"
        },
        {
            "id": "1a9a31ff-d65a-48da-8c72-4cf4c87c236d",
            "occurTime": "2020-04-10 14:14:48",
            "name": "人员数据-HR",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people"
        },
        {
            "id": "de60e2e2-ef20-4c7d-831c-8441b5d742b7",
            "occurTime": "2020-04-10 14:14:48",
            "name": "人员数据-队列",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_project"
        },
        {
            "id": "63fc3547-2bdb-4eff-9b41-fc89af0f31ce",
            "occurTime": "2020-04-10 14:14:48",
            "name": "人员数据-日运营",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_daily_operation"
        },
        {
            "id": "3c2a52b1-bbd3-479a-8607-465180998068",
            "occurTime": "2020-04-10 14:14:48",
            "name": "人员数据-行政",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_admin"
        },
        {
            "id": "6d89e5e2-18a7-42f9-955b-0d25dc69b365",
            "occurTime": "2020-04-10 14:14:48",
            "name": "人员数据-月运营-队列",
            "status": 3,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_monthly_operation"
        },
        {
            "name": "人员数据-招聘",
            "status": 0,
            "projectId": "00000000-0000-0000-0000-000000000000",
            "batch": 202001,
            "description": "people_recruit"
        }
    ]
}
说明：1）id是主键（用于删除或下载）,occurTime是上传时间，name是表单名，description是表单的系统内部英文名（可以不管），projectId，batch同原来意思
2）如果一个表单还没有上传过（比如2020年3月，可能人员数据还没有来得及上传），那么id和occurTime是不存在的。也即，如果没有id和occurtime，就是没有上传数据。此时，这个表单自然也就不能删除或下载了。
3）status为状态，0为未上传，1为已经上传但是不能导入（也许文件格式内容有错误），2为已经上传并且导入成功但尚未开始计算，3为已经上传并且计算成功，4为已经上传但是计算失败（也许是其中数据有问题）

/excel/delete?id=xxxx（文件id） DELETE请求
删除某一个表单文件，同时将该表单下的数据从系统中清除

/excel/delete?id=xxxx（文件id） GET请求
下载最后一次同批同表单的excel，返回的文件名是 ${系统内部英文名}-${batch}.xlsx。
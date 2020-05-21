const data = {
  subject: [{
    name: 'use_ratio',
    title: '利用率',
    dimension: [
      {
        v_group_name: '李昊',
        data: [
          {
            time: '20200119',
            value: 30136.52
          },
          {
            time: '20200120',
            value: 30121.21
          }
        ]
      }
    ]
  }],
  res: {}
}

console.log(data)


const temp ={
  "time_granularity":"MONTH",
  "org_granularity":"people",
  "value_formula":"groupby(associateByPerson(people, people_daily_operation),\"row.v_overall_login_duration_daily_person+row.v_local_login_duration_daily_person\", null)"}
/////////

《科学技术报告、学位论文和学术论文的编写格式》关于科技论文表格内空缺项表示的规定是：
表内“空白”代表未测或无此项，“—”代表未发现，“0”代表实测结果为零。

1）“空白“的正确使用。在表格中“空白”使用的场合一般是研究对象在某种条件下没有数值或数值无意义，
该处空白，不会影响整个表格的完整性，或可以理解为表格不需要此项。此时，如果在该位置填写任何符号，
包括“—”和“0”都不仅是多余的，而且会错误表达科技论文的含意。

2）“—”的正确使用。“—”代表科学研究中未发现或未被检测到的数据，该数据需要以后进一步的研究和检测。
与空白相比较，在表格中，“—”虽然表达了一种未知数据，但是该处却不能为“空白”，
否则读者会怀疑该数据在编辑校对时被丢失。在实际工作中，为了与“空白”相区别，
可以将“—”理解为表格中需要改数据，但由于条件限制，目前未知该数值。

3）“0”的正确使用。在表格中，“0”与其他统计数字表达了同样的含义，即实际测量和计算的数值。
与“空白”相比较，“0”表示该数值是存在的，而“空白”则表示该项没有意义，在表中可以缺省。
与“—”相比较，“0”代表该项目已经被检测和计算到，而且其准确数值已经得出，而“—”则说明该数据没有被检测到。

的正确使用。在表格中“空白”使用的场合一般是研究对象在某种条件下没有数值或数值无意义，
该处空白，不会影响整个表格的完整性，或可以理解为表格不需要此项。此时，如果在该位置填写任何符号，
包括“—”和“0”都不仅是多余的，而且会错误表达科技论文的含意。

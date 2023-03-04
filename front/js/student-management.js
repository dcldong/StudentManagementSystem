
let head =
    "<tr style='background-color: rgb(218, 222, 225);height: 55px'>" +
    "<td><input id='checkAllStudent' name='selectedAllStudent' type='checkbox'></td>" +
    "<td>序号</td>" +
    "<td>学号</td>" +
    "<td>姓名</td>" +
    "<td>学院</td>" +
    "<td>专业</td>" +
    "<td>年级</td>" +
    "<td>班级</td>" +
    " <td>年龄</td>" +
    "<td>操作</td>" +
    "</tr>"

let students = new Array();
let allPage = parseInt(students.length / 10 + 1)
let currentPage = 1;
let onePage = 10;
let begin = 0;


function loadData() {
    $.ajax({
        type: "get",
        url: 'http://localhost:3000/getStudents',
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            for (let student of result.data) {
                students.push(new Student(student.id, student.name, student.department, student.major, student.grade, student.classes, student.age));

                //展示学生
                allPage = parseInt(students.length / 10 + 1)
                currentPage = 1;
                onePage = 10;
                begin = 0;
                $(document).ready(function () {
                    $(".currentPage").val(currentPage)
                    $(".allPage").val(allPage)
                    $(".studentTable").html(showStudent());
                    $(".newPage").html(renewPage())        //页数显示
                })
            }
        }
    });
}
loadData();

function showStudent() {
    let s = head;
    for (var i = begin; i < onePage && i < students.length; i++) {
        let oddNum = "<tr class='odd'>"
        let evenNum = "<tr class='even'>"

        if (i % 2 == 0) {   //判断奇偶数  增加class样式
            s = s + oddNum;
        } else {
            s = s + evenNum;
        }
        s = s +
            " <td>" + "<input class='check_student' name='selectedStudent' type='checkbox'>" + "</td>" +
            "<td>" + (i + 1) + "</td>" +
            "<td>" + students[i]._id + "</td>" +
            '<td>' + students[i]._name + '</td>' +
            "<td>" + students[i]._department + "</td>" +
            '<td>' + students[i]._major + '</td>' +
            "<td>" + students[i]._grade + "</td>" +
            '<td>' + students[i]._classes + '</td>' +
            "<td>" + students[i]._age + "</td>" +
            "<td><span class='checkStudentBtn'>查看</span><span class='delStudentBtn'>修改</span></td>" +
            "</td>" +
            '</tr>'
    }
    return s;
}
let isDisplayPages = false;
function renewPage() {
    if (students.length % 10 == 0) {
        allPage = students.length / 10
    } else {
        allPage = (parseInt(students.length / 10)) + 1
    }
    isDisplayPages = students.length > 10 ? true : false;
    if (isDisplayPages) {
        $(".bottomBox").show();

        return "第" + currentPage + "页,共" + allPage + "页（每页十条）";
    } else {
        $(".bottomBox").hide();
        return "";
    }

}

$(function () {
    //下一页
    $(".nextPage").click(function () {
        if (currentPage >= allPage) {
            alert("已经是最后一页了")
        } else {
            currentPage += 1;
            begin += 10;
            onePage += 10;
            $(".studentTable").html(showStudent());
            $(".newPage").html(renewPage())
        }
    })

    // 上一页的方法
    function prePage() {
        if (currentPage === 1) {
            alert("已经是第一页了")
        } else {
            currentPage -= 1;
            begin -= 10;
            onePage -= 10;  //begin增加，onePage同时增加
            $(".studentTable").html(showStudent());
            $(".newPage").html(renewPage())        //页数显示
        }
    }

    //上一页
    $(".prePage").click(function () {
        if (currentPage === 1) {
            alert("已经是第一页了")
        } else {
            currentPage -= 1;
            begin -= 10;
            onePage -= 10;  //begin增加，onePage同时增加
            $(".studentTable").html(showStudent());
            $(".newPage").html(renewPage())        //页数显示
        }
    })

    //查询学生信息
    $(".query").click(function () {
        $.ajax({
            type: "get",
            url: 'http://localhost:3000/getStudents?id=' + $('.queryInfo input[name="query_id"]').val(),
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                students = new Array();
                if (result.data.length > 0) {
                    for (let student of result.data) {
                        students.push(new Student(student.id, student.name, student.department, student.major, student.grade, student.classes, student.age));
                    }
                }
                allPage = parseInt(students.length / 10 + 1)
                currentPage = 1;
                onePage = 10;
                begin = 0;
                $(document).ready(function () {
                    $(".currentPage").val(currentPage)
                    $(".allPage").val(allPage)
                    $(".studentTable").html(showStudent());
                    $(".newPage").html(renewPage())        //页数显示
                })
            }
        });
    })

    //新增学生信息
    $(".addStudent").click(function () {
        $(".addStudentBox").show();
    })

    //展示增加学生中的确定按钮
    let flag
    $(".addStudentBoxYes").click(function () {

        flag = true;

        let id = $(".inputInfo input").eq(0).val();
        let name = $(".inputInfo input").eq(1).val();
        let department = $(".inputInfo input").eq(2).val();
        let major = $(".inputInfo input").eq(3).val();
        let grade = $(".inputInfo input").eq(4).val();
        let classes = $(".inputInfo input").eq(5).val();
        let age = $(".inputInfo input").eq(6).val();

        $.ajax({
            type: "get",
            url: 'http://localhost:3000/getStudents?id=' + $('.inputInfo input[name="id"]').val(),
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.data.length > 0) {
                    alert("学号重复，添加失败");
                } else {
                    $.ajax({
                        type: "post",
                        url: 'http://localhost:3000/addStudent',
                        crossDomain: true,
                        data: JSON.stringify({
                            "id": $('.inputInfo input[name="id"]').val(),
                            "name": $('.inputInfo input[name="name"]').val(),
                            "department": $('.inputInfo input[name="department"]').val(),
                            "major": $('.inputInfo input[name="major"]').val(),
                            "grade": $('.inputInfo input[name="grade"]').val(),
                            "classes": $('.inputInfo input[name="classes"]').val(),
                            "age": $('.inputInfo input[name="age"]').val()
                        }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            students.push(new Student(id, name, department, major, grade, classes, age))
                            $(".addStudentBox").hide();
                            //刷新页面
                            $(".studentTable").html(showStudent());
                            $(".newPage").html(renewPage())        //页数显示

                            //值清零下次增加为空
                            $(".inputInfo input").eq(0).val("");
                            $(".inputInfo input").eq(1).val("");
                            $(".inputInfo input").eq(2).val("");
                            $(".inputInfo input").eq(3).val("");
                            $(".inputInfo input").eq(4).val("");
                            $(".inputInfo input").eq(5).val("");
                            $(".inputInfo input").eq(6).val("");
                            alert("添加成功");
                        } // 注意不要在此行增加逗号
                    });


                }
            } // 注意不要在此行增加逗号
        });
    })

    //表单验证
    $('.id').on('blur', function () {
        let reg = /^\d{11}$/;
        let num = 11912050126
        let addId = $(".inputInfo input").eq(0).val();
        if (reg.test(addId)) {
            $(this).next().html("<img src='2.png' style='width: 15px; height: 15px'>")
        } else {
            $(this).next().html("<img src='1.png' style='width: 15px; height: 15px'>")
        }
    })
    $('.checkId').on('blur', function () {
        let reg = /^\d{11}$/;
        let num = 11912050126
        let addId = $(".changeInputInfo input").eq(0).val();
        console.log(reg.test(addId))
        if (reg.test(addId)) {
            $(this).next().html("<img src='2.png' style='width: 15px; height: 15px'>")
        } else {
            $(this).next().html("<img src='1.png' style='width: 15px; height: 15px'>")
        }
    })

    //展示增加学生中的取消按钮
    $(".addStudentBoxNo").click(function () {
        //值清零下次增加为空
        $(".inputInfo input").eq(0).val("");
        $(".inputInfo input").eq(1).val("");
        $(".inputInfo input").eq(2).val("");
        $(".inputInfo input").eq(3).val("");
        $(".inputInfo input").eq(4).val("");
        $(".inputInfo input").eq(5).val("");
        $(".inputInfo input").eq(6).val("");
        $(".addStudentBox").hide();
    })
    //查看学生
    $(document).on('click', '.checkStudentBtn', function () {
        $(".checkStudentBox").show()
        //获取序号
        let num = $(this).parents("tr").children("td").eq(1).text()

        //在学生的数组中根据序号查出该学生
        $(".checkInputInfo input").eq(0).val(students[num - 1]._id)
        $(".checkInputInfo input").eq(1).val(students[num - 1]._name)
        $(".checkInputInfo input").eq(2).val(students[num - 1]._department)
        $(".checkInputInfo input").eq(3).val(students[num - 1]._major)
        $(".checkInputInfo input").eq(4).val(students[num - 1]._grade)
        $(".checkInputInfo input").eq(5).val(students[num - 1]._classes)
        $(".checkInputInfo input").eq(6).val(students[num - 1]._age)
    })
    //查看学生确定按钮
    $(".checkStudentBoxYes").click(function () {
        $(".checkStudentBox").hide()
    })
    let clickNum;//定义全局变量，在修改学生确定按钮可以使用
    //修改学生按钮
    $(document).on('click', '.delStudentBtn', function () {
        $(".changeStudentBox").show()
        clickNum = $(this).parents("tr").children("td").eq(1).text()
        $('.changeInputInfo input[name="id"]').val(students[clickNum - 1].id)
        $('.changeInputInfo input[name="name"]').val(students[clickNum - 1].name)
        $('.changeInputInfo input[name="department"]').val(students[clickNum - 1].department)
        $('.changeInputInfo input[name="major"]').val(students[clickNum - 1].major)
        $('.changeInputInfo input[name="grade"]').val(students[clickNum - 1].grade)
        $('.changeInputInfo input[name="classes"]').val(students[clickNum - 1].classes)
        $('.changeInputInfo input[name="age"]').val(students[clickNum - 1].age)
    })

    //修改学生确定按钮
    $(".changeStudentBoxYes").click(function () {
        let id = $('.changeInputInfo input[name="id"]').val()
        let name = $('.changeInputInfo input[name="name"]').val()
        let department = $('.changeInputInfo input[name="department"]').val()
        let major = $('.changeInputInfo input[name="major"]').val()
        let grade = $('.changeInputInfo input[name="grade"]').val()
        let classes = $('.changeInputInfo input[name="classes"]').val()
        let age = $('.changeInputInfo input[name="age"]').val()

        $.ajax({
            type: "post",
            url: 'http://localhost:3000/updateStudent',
            crossDomain: true,
            data: JSON.stringify({
                "id": id,
                "name": name,
                "department": department,
                "major": major,
                "grade": grade,
                "classes": classes,
                "age": age
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $(".changeStudentBox").hide();
                students[clickNum - 1]._id = id;
                students[clickNum - 1]._name = name;
                students[clickNum - 1]._department = department;
                students[clickNum - 1]._major = major;
                students[clickNum - 1]._grade = grade;
                students[clickNum - 1]._classes = classes;
                students[clickNum - 1]._age = age;
                $(".studentTable").html(showStudent());
                $(".newPage").html(renewPage())
            }
        });
    })

    //修改学生取消按钮
    $(".changeStudentBoxNo").click(function () {
        $(".changeStudentBox").hide();
    })

    //全选
    $(document).on('click', '#checkAllStudent', function () {
        $("input[name='selectedStudent']").prop("checked", this.checked)
    })

    //删除学生
    $(".delStudent").click(function () {
        let willDeleteStudents = new Array();
        //循环当页面的check，如果选择了就加入删除数组

        for (var i = begin; i < onePage && i < students.length; i++) {
            let isCheck = $(".check_student").eq(i - begin).is(":checked")

            if (isCheck) {
                willDeleteStudents.push(students[i].id)
            }
        }

        console.log(willDeleteStudents);

        $.ajax({
            type: "post",
            url: 'http://localhost:3000/deleteStudents',
            crossDomain: true,
            data: JSON.stringify({
                "ids": willDeleteStudents
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                // for (var i = 0; i < willDeleteStudents.length; i++) {
                //     students.splice(willDeleteStudents[i] - i, 1)

                // }
                console.log('before');
                console.log(students);
                students = students.filter(student => !willDeleteStudents.includes(student.id));
                console.log('after');
                console.log(students);

                $(".newPage").html(renewPage())
                $(".studentTable").html(showStudent());

                //判断当前页数和所有页数，是否该页无学生
                if (currentPage > allPage) {
                    prePage()
                }
            } // 注意不要在此行增加逗号
        });

    })

})

class Student {
    constructor(id, name, department, major, grade, classes, age,) {
        this._id = id;
        this._name = name;
        this._department = department;
        this._major = major;
        this._grade = grade;
        this._classes = classes;
        this._age = age;
    }
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get department() {
        return this._department;
    }

    set department(value) {
        this._department = value;
    }

    get major() {
        return this._major;
    }

    set major(value) {
        this._major = value;
    }

    get grade() {
        return this._grade;
    }

    set grade(value) {
        this._grade = value;
    }

    get classes() {
        return this._classes;
    }

    set classes(value) {
        this._classes = value;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }
}




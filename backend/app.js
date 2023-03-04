var Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const { query } = require('./db/db');
const { koaBody } = require('koa-body');
const cors = require("koa2-cors");
app.use(cors());

app.use(cors({
    // 任何地址都可以访问
    origin: "*",
    // 指定地址才可以访问
    // origin: 'http://localhost:8080',
    maxAge: 2592000,
    // 必要配置
    // credentials: true
}));

app.use(koaBody());
const router = new Router();

app.use(router.routes()).use(router.allowedMethods());

router.get('/getStudents', async (ctx, next) => {
    ctx.type = 'Content-Type: application/json;charset=utf-8';
    let request = ctx.request
    let req_query = request.query

    let result = req_query.id ? await query(`SELECT * FROM student where id=${req_query.id};`) : await query('SELECT * FROM student;');
    let list = [];
    result.forEach(item => {
        list.push({
            id: item.id,
            name: item.name,
            department: item.department,
            major: item.major,
            grade: item.grade,
            classes: item.classes,
            age: item.age
        })
    });

    ctx.body = {
        code: 200,
        data: list,
        message: 'getStudents success'
    };
});

router.post('/addStudent', async (ctx, next) => {
    const postData = ctx.request.body;
    ctx.type = 'Content-Type: application/json;charset=utf-8';
    await query('INSERT INTO student SET ?', postData);

    ctx.body = {
        code: 200,
        data: [],
        message: 'add success'
    };
})

router.post('/updateStudent', async (ctx, next) => {
    const postData = ctx.request.body;

    await query('UPDATE student SET name = ?, department = ? , major = ? , grade = ?, classes = ?, age = ? WHERE id = ?;',
        [postData.name, postData.department, postData.major, postData.grade, postData.classes, postData.age, postData.id]);

    ctx.type = 'Content-Type: application/json;charset=utf-8';
    ctx.body = {
        code: 200,
        data: [],
        message: 'update success'
    }
})

router.post('/deleteStudents', async (ctx, next) => {
    ctx.type = 'Content-Type: application/json;charset=utf-8';
    const postData = ctx.request.body;

    console.log(postData);
    let ids = "";
    for (let id of postData.ids) {
        ids += parseInt(id) + ',';
    }

    if (ids.endsWith(',')) {
        ids = ids.substring(0, ids.length - 1);
    }

    console.log(ids);
    if (ids != "") {
        await query('DELETE FROM student where id in (' + ids + ')');
    }

    ctx.body = {
        code: 200,
        data: [],
        message: 'delete success'
    }
});

app.listen(3000, () => {
    console.log('Server running on https://localhost:3000')
});
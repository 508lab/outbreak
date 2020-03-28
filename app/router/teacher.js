/**
 * 教师
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/teacher/login', controller.teacher.index.login);
    router.post('/teacher/login', controller.teacher.index.login);
    router.get('/teacher/loginout', controller.teacher.index.loginout);
    //个人中心
    router.get('/teacher/index', controller.teacher.index.index);
    router.get('/teacher/user', controller.teacher.index.user);
    router.put('/teacher/user', controller.teacher.index.updateuser);
    router.get('/teacher/temperature', controller.teacher.index.temperature);
    router.post('/teacher/temperature', controller.teacher.index.temp);
    router.get('/teacher/password', controller.teacher.index.password);
    router.put('/teacher/password', controller.teacher.index.password);
    router.get('/teacher/mirror', controller.teacher.index.mirror);

    //关于学生部分

    router.get('/teacher/students', controller.teacher.students.students);
    router.put('/teacher/student', controller.teacher.students.edit);
    router.put('/teacher/students/password', controller.teacher.students.cpass);
    router.get('/teacher/students/index', controller.teacher.students.student);
    router.post('/teacher/students/index', controller.teacher.students.student);
    router.delete('/teacher/students/index', controller.teacher.students.student);
};
const { body } = require("express-validator");

const model = require("../../models/index");
const Course = model.Course;

module.exports = () => {
    return [
        body("courseName", "Tên khóa học không được để trống").notEmpty(),
        body("courseName").custom(async (value) => {
            const course = await Course.findOne({
                where: {
                    name: value,
                },
            });
            if (course) {
                throw new Error("Tên khóa học đã tồn tại");
            }
        }),
        body("tryLearn", "Học thử không được để trống").notEmpty(),
        body("coursePrice", "Học phí không được để trống").notEmpty(),
        body("courseDuration", "Thời gian không được để trống").notEmpty(),
    ];
};

const mysqlDb = require('../models/mysql');

const createSchedule = async (actionData, scheduleData, userId) => {
    try {
        const newSchedule = await mysqlDb.Schedule.create({
            userId: userId,
            ...scheduleData,
        });

        const newAction = await mysqlDb.Action.create({
            scheduleId: newSchedule.id,
            ...actionData
        });

        return { schedule: newSchedule, action: newAction };
    } catch (error) {
        throw error;
    }
};

const getAllSchedules = async (userId) => {
    try {
        const schedules = await mysqlDb.Schedule.findAll({
            where: { userId },
            include: [mysqlDb.Action]
        });
        return schedules;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getScheduleById = async (id) => {
    try {
        const schedule = await mysqlDb.Schedule.findByPk(id, {
            include: [mysqlDb.Action]  
        });
        if (!schedule) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }
        return schedule;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateSchedule = async (id, scheduleData, actionData) => {
    try {
        const updatedSchedule = await mysqlDb.Schedule.update(scheduleData, {
            where: { id },
            returning: true,
            plain: true
        });

        if (!updatedSchedule[1]) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }

        if (actionData) {
            await mysqlDb.Action.update(actionData, {
                where: { scheduleId: id }
            });
        }

        return updatedSchedule[1];
    } catch (error) {
        throw new Error(`Error updating schedule: ${error.message}`);
    }
};

const deleteSchedule = async (id) => {
    try {
        const deletedSchedule = await mysqlDb.Schedule.destroy({
            where: { id },
        });

        if (!deletedSchedule) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }

        return { message: "Schedule and related actions deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};

const Schedule = require("../models/Schedule");

const validateScheduleData = (data) => {
    const { name, action, scheduleType, recurrence, enabled } = data;
    const error = new Error();
    error.status = 400;

    if (!name || typeof name !== "string") {
        error.message = "Invalid or missing name";
        throw error;
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        error.message = "Invalid or missing userId";
        throw error;
    }

    if (
        !Array.isArray(action) ||
        action.some(
            (a) => !a.deviceId || !mongoose.Types.ObjectId.isValid(a.deviceId)
        )
    ) {
        error.message = "Invalid action data";
        throw error;
    }

    if (!scheduleType || !["one-time", "recurring"].includes(scheduleType)) {
        error.message = "Invalid or missing scheduleType";
        throw error;
    }

    if (scheduleType === "recurring") {
        const { interval, daysOfWeek } = recurrence;
        if (!interval || !["daily", "weekly", "monthly"].includes(interval)) {
            error.message = "Invalid recurrence interval";
        }

        if (
            !Array.isArray(daysOfWeek) ||
            daysOfWeek.some(
                (day) =>
                    ![
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ].includes(day)
            )
        ) {
            error.message = "Invalid daysOfWeek";
            throw error;
        }
    }

    if (typeof enabled !== "boolean") {
        error.message = "Invalid enabled flag";
        throw error;
    }
};

const createSchedule = async (data, userId) => {
    try {
        validateScheduleData(data);
        const schedule = new Schedule({ userId: userId, ...data });
        await schedule.save();
        return schedule;
    } catch (error) {
        throw error;
    }
};

const getAllSchedules = async (userId) => {
    try {
        const schedules = await Schedule.find({ userId });
        return schedules;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getScheduleById = async (id) => {
    try {
        const schedule = await Schedule.findById(id);
        if (!schedule) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateSchedule = async (id, data) => {
    try {
        validateScheduleData(data);

        const schedule = await Schedule.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('userId').populate('action.deviceId').populate('action.groupId');
        if (!schedule) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }
        return schedule;
    } catch (error) {
        throw new Error(`Error updating schedule: ${error.message}`);
    }
};

const deleteSchedule = async (id) => {
    try {
        const deletedItem = await Schedule.findByIdAndDelete(id);
        if (!deletedItem) {
            const error = new Error("Not Found");
            error.status = 404;
            throw error;
        }
        return deletedItem;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
};

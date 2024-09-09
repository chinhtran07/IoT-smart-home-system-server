const scheduleService = require('../services/schedule.services');

const createSchedule = async (req, res) => {
    try {
      const schedule = await scheduleService.createSchedule(req.body);
      res.status(201).json(schedule);
    } catch (error) {
        next(error);
    }
};
  

const getAllSchedules = async (req, res) => {
    try {
      const schedules = await scheduleService.getAllSchedules(req.user._id);
      res.status(200).json(schedules);
    } catch (error) {
      next(error);
    }
};
  
const getScheduleById = async (req, res) => {
    const { id } = req.params;
    try {
      const schedule = await scheduleService.getScheduleById(id);
      res.status(200).json(schedule);
    } catch (error) {
        next(error);
    }
};

const updateSchedule = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedSchedule = await scheduleService.updateSchedule(id, req.body);
      res.status(200).json(updatedSchedule);
    } catch (error) {
        next(error);
    }
};
  
const deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
      await scheduleService.deleteSchedule(id);
      res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}
  
const Command = require('../models/Command');

const createCommand = async (data) => {
    const command = new Command(data);
    return await command.save();
}

const getCommands = async() => {
    return await Command.find().populate('deviceId');
}

const getCommandById = async (id) => {
    return await Command.findById(id).populate('deviceId');
}

const updateCommand = async (id, data) => {
    return await Command.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}


module.exports = {
    createCommand,
    getCommands,
    getCommandById,
    updateCommand
}
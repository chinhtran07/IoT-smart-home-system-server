const mongoose = require('mongoose');

const accessControlGroupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group',
        required: true
    },
    permissionLevel: {
        type: String, enum: ['read', 'write'],
        required: true
    },
}, {
    timestamps: true
});

const AccessControlGroup = mongoose.model('AccessControlGroup', accessControlGroupSchema);

module.exports = AccessControlGroup;
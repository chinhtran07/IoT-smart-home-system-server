module.exports = (mongoose) => {
    const topicSchema = new mongoose.Schema({
        deviceId: { type: String, required: true, unique: true },
        topics: {
            publisher: [{ type: String }],
            subscriber: [{ type: String }]
        },
    });


    const Topic = mongoose.model('Topic', topicSchema);

    return Topic;
}


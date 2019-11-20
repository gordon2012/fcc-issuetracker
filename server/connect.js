const mongoose = require('mongoose');

const dbUrl =
    process.env.NODE_ENV !== 'production'
        ? 'mongodb://localhost:27017/fcc-issuetracker'
        : process.env.ATLAS_URI;

const connect = async (model, schema) => {
    const connection = await mongoose.createConnection(dbUrl, {
        useNewUrlParser: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
    });

    return connection.model(
        model,
        new mongoose.Schema(schema, {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
        })
    );
};

module.exports = connect;

const express = require('express');
const cors = require('cors');

const connect = require('./connect');
const issueSchema = require('./models/issue');

const app = express();
const origin =
    process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000'
        : 'https://issuetracker.gordondoskas.com';
app.use(cors({ origin }));
app.use(express.json());

// debug
app.get('/api/issues', async (req, res) => {
    try {
        const Issue = await connect('issue', issueSchema);
        const issues = await Issue.find();
        res.status(200).json(issues);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/issues/:projectname', async (req, res) => {
    try {
        const { projectname } = req.params;
        const data = { ...req.body, projectname, open: true };

        const Issue = await connect('issue', issueSchema);

        const issue = await Issue.create(data);
        res.status(200).json(issue.toJSON());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/issues/:projectname?', async (req, res) => {
    try {
        const { projectname } = req.params;
        const { id, ...data } = req.body;

        if (!id) {
            return res.status(200).json('missing id');
        }

        if (Object.keys(data).length === 0) {
            return res.status(200).json('no updated field sent');
        }

        const Issue = await connect('issue', issueSchema);

        const updatedIssue = await Issue.findOneAndUpdate(
            { _id: id, projectname },
            data,
            { new: true }
        );

        if (!updatedIssue) {
            return res.status(200).json(`could not update ${id}`);
        }

        res.status(200).json('successfully updated');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

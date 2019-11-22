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

app.put('/api/issues/:projectname', async (req, res) => {
    try {
        const { projectname } = req.params;
        // // console.log(req.params);
        // if (!projectname) {
        //     // console.log('ERROR');
        // }

        const { id, ...data } = req.body;
        const Issue = await connect('issue', issueSchema);

        // const issue = await Issue.findById(id);
        // console.log(issue);

        // if (issue.projectname !== projectname) {
        //     throw new Error(`Issue not found under project ${projectname}.`);
        // }

        const updatedIssue = await Issue.findOneAndUpdate(
            { _id: id, projectname },
            data,
            { new: true }
        );

        if (!updatedIssue) {
            // return res.status(400).end();
            throw new Error('Issue not found');
        }

        res.status(200).json(updatedIssue);

        // const issue = await Issue.updateOne({ name: 'Jean-Luc Picard' }, { ship: 'USS Enterprise' });

        // res.status(200).json(issue.toJSON());
        // console.log({ projectname, data });
        // res.status(200).json({ projectname, id, data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

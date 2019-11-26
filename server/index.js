const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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
// app.get('/api/issues', async (req, res) => {
//     try {
//         const Issue = await connect('issue', issueSchema);
//         const issues = await Issue.find();
//         res.status(200).json(issues);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

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
            res.status(200).json(`could not update ${id}`);
        } else {
            res.status(200).json('successfully updated');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/issues/:projectname?', async (req, res) => {
    try {
        const { projectname } = req.params;
        const { id } = req.body;

        if (!id) {
            return res.status(200).json('id error');
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(200).json(`could not delete ${id}`);
        }

        const Issue = await connect('issue', issueSchema);
        const issue = await Issue.findOneAndRemove({ _id: id, projectname });

        if (!issue) {
            res.status(200).json(`could not delete ${id}`);
        } else {
            res.status(200).json(`deleted ${id}`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/issues/:projectname?', async (req, res) => {
    // ???
    try {
        req.query.open && Boolean(req.query.open);
    } catch (error) {
        res.status(400).json({ error: 'boolean error of some sort' });
    }

    try {
        const { projectname } = req.params;

        // console.log(req.query);

        // const { open, ...query } = req.query;
        // console.log(Boolean(open));

        const Issue = await connect('issue', issueSchema);
        const issues = await Issue.find({ projectname, ...req.query });

        res.status(200).json(issues);

        // res.status(200).json(issues);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

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

app.post('/api/issues/:projectname', async (req, res) => {
    try {
        const { projectname } = req.params;
        const data = { ...req.body, projectname, open: true };

        const Issue = await connect('issue', issueSchema);

        const issue = await Issue.create(data);
        res.status(200).json(issue.toJSON());
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

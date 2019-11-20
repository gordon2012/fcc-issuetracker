import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { BASE_URL } from './index';

import Layout from './components/Layout';
import Code from './components/Code';
import Input from './components/Input';
import Button from './components/Button';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono|Ubuntu:400,700&display=swap');

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: #fae8f5;
        font-family: "Ubuntu", "Helvetica", sans-serif;
    }
`;

const Title = styled.h1`
    text-align: center;
`;

const Card = styled.section`
    background: #300a24;
    color: white;
    padding: 1rem;
    margin-bottom: 1rem;
    h3 {
        margin-top: 0;
    }
`;

const List = styled.ul``;

const App = () => {
    const [input, setRawInput] = React.useState({});
    const setInput = (name, value) => {
        setRawInput(prevState => ({ ...prevState, [name]: value }));
    };
    const [results, setResults] = React.useState({});
    const [responses, setResponses] = React.useState([]);

    const postIssue = async event => {
        event.preventDefault();

        const { projectname, ...body } = input;
        const response = await fetch(`${BASE_URL}/api/issues/${projectname}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        setResponses(prevState => [data, ...prevState]);
        setResults(prevState => ({ ...prevState, postIssue: data }));
    };

    return (
        <>
            <GlobalStyle />
            <Layout>
                <Title>
                    Information Security and Quality Assurance Boilerplate
                </Title>

                <Card>
                    <h3>User Stories</h3>
                    <List as="ol">
                        <li>...</li>
                        <li>
                            I can{' '}
                            <Code
                                inline
                            >{`POST /api/issues/{projectname}`}</Code>{' '}
                            with form data containing required issue_title,
                            issue_text, created_by, and optional assigned_to and
                            status_text.
                        </li>
                        <li>
                            The object saved (and returned) will include all of
                            those fields (blank for optional no input) and also
                            include created_on(date/time),
                            updated_on(date/time), open(boolean, true for open,
                            false for closed), and _id.
                        </li>
                    </List>
                </Card>

                <Card>
                    <h3>Example Usage</h3>
                    <Code>{`POST /api/issues/{projectname}`}</Code>
                </Card>

                <Card>
                    <h3>Example Return</h3>
                    <Code box>
                        {{
                            _id: '5dd4d79d461cfb13f05f89b1',
                            issue_title: 'Unleashed Super AI',
                            issue_text: 'HEEEEEEEEEEEELP!!!!',
                            created_by: 'bbanner',
                            assigned_to: 'tstark',
                            status_text: 'In Hiding',
                            projectname: 'ultron',
                            open: true,
                            created_at: '2019-11-20T06:05:17.276Z',
                            updated_at: '2019-11-20T06:05:17.276Z',
                            __v: 0,
                        }}
                    </Code>
                </Card>

                <Title as="h2">Front-End</Title>

                <Card>
                    <h3>
                        <Code>{`POST /api/issues/${
                            input.projectname
                                ? input.projectname
                                : '{projectname}'
                        }`}</Code>
                    </h3>

                    <form onSubmit={postIssue}>
                        <Input
                            required
                            name="projectname"
                            title="Project Name"
                            onChange={setInput}
                        />
                        <Input
                            required
                            name="issue_title"
                            title="Issue Title"
                            onChange={setInput}
                        />
                        <Input
                            required
                            name="issue_text"
                            title="Issue Text"
                            onChange={setInput}
                        />
                        <Input
                            required
                            name="created_by"
                            title="Created by"
                            onChange={setInput}
                        />
                        <Input
                            name="assigned_to"
                            title="Assigned to"
                            onChange={setInput}
                        />
                        <Input
                            name="status_text"
                            title="Status Text"
                            onChange={setInput}
                        />

                        <Button type="submit">Submit</Button>
                    </form>

                    {results.postIssue && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.postIssue}</Code>
                        </>
                    )}
                </Card>

                <Title as="h2">Debug</Title>

                <Card>
                    <h3>Input</h3>
                    <Code box>{input}</Code>
                    <h3>Results</h3>
                    <Code box>{results}</Code>
                    <h3>Responses</h3>
                    {responses.length ? (
                        responses.map((e, i) => (
                            <Code box key={i}>
                                {e}
                            </Code>
                        ))
                    ) : (
                        <Code box> </Code>
                    )}
                </Card>
            </Layout>
        </>
    );
};

export default App;

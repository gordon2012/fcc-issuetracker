import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { BASE_URL } from './index';

import Layout from './components/Layout';
import Code from './components/Code';
import Input from './components/Input';
import Button from './components/Button';
import Form from './components/Form';

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
    const [results, setResults] = React.useState({});
    const [responses, setResponses] = React.useState([]);

    // const getUrl = input =>

    const t0 = {};
    const t1 = { a: 'AAA', b: 'BBB', c: 'CCC' };
    const t2 = `?${Object.keys(t1)
        .map(k => `${k}=${t1[k]}&`)
        .join('')}`;
    const t3 = new URLSearchParams(t1).toString();
    const t4 = new URLSearchParams(t0).toString();
    console.log(t4.length);

    const createFetcher = (name, method) => async input => {
        const { projectname = '', ...body } = input;
        const options =
            method === 'GET'
                ? {
                      method,
                  }
                : {
                      method,
                      headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(body),
                  };

        // const url =
        //     method === 'GET'
        //         ? `${BASE_URL}/api/issues/${projectname}`
        //         : `${BASE_URL}/api/issues/${projectname}`;

        let url;
        if (method === 'GET') {
            const query = new URLSearchParams(body).toString();
            url = `${BASE_URL}/api/issues/${projectname}${
                query.length > 0 ? `?${query}` : ''
            }`;
        } else {
            url = `${BASE_URL}/api/issues/${projectname}`;
        }
        console.log(url);

        const response = await fetch(url, options);
        const data = await response.json();
        setResponses(prevState => [data, ...prevState]);
        setResults(prevState => ({ ...prevState, [name]: data }));
    };
    const postIssue = createFetcher('postIssue', 'POST');
    const putIssue = createFetcher('putIssue', 'PUT');
    const deleteIssue = createFetcher('deleteIssue', 'DELETE');

    // debug
    // const getIssues = async () => {
    //     const response = await fetch(`${BASE_URL}/api/issues`);
    //     const data = await response.json();
    //     setResponses(prevState => [data, ...prevState]);
    //     setResults(prevState => ({ ...prevState, getIssues: data }));
    // };

    // const getIssues = () => console.log('would get issues');

    const getIssues = createFetcher('getIssues', 'GET');

    return (
        <>
            <GlobalStyle />
            <Layout>
                <Title>Issue Tracker</Title>

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
                        <li>
                            I can{' '}
                            <Code
                                inline
                            >{`PUT /api/issues/{projectname}`}</Code>{' '}
                            with a id and any fields in the object with a value
                            to object said object. Returned will be
                            'successfully updated' or 'could not update '+id.
                            This should always update updated_on. If no fields
                            are sent return 'no updated field sent'.
                        </li>
                        <li>
                            I can{' '}
                            <Code
                                inline
                            >{`DELETE /api/issues/{projectname}`}</Code>{' '}
                            with a id to completely delete an issue. If no _id
                            is sent return 'id error', success: 'deleted '+id,
                            failed: 'could not delete '+id.
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
                        <Code>{`POST /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form blank debug onSubmit={postIssue}>
                        <Input
                            required
                            name="projectname"
                            title="Project Name"
                        />
                        <Input
                            required
                            name="issue_title"
                            title="Issue Title"
                        />
                        <Input required name="issue_text" title="Issue Text" />
                        <Input required name="created_by" title="Created by" />
                        <Input name="assigned_to" title="Assigned to" />
                        <Input name="status_text" title="Status Text" />

                        <Button type="submit">Submit</Button>
                    </Form>

                    {results.postIssue && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.postIssue}</Code>
                        </>
                    )}
                </Card>

                <Card>
                    <h3>
                        <Code>{`PUT /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form debug onSubmit={putIssue}>
                        <Input
                            required
                            name="projectname"
                            title="Project Name"
                        />
                        <Input required name="id" title="id" />
                        <Input name="issue_title" title="Issue Title" />
                        <Input name="issue_text" title="Issue Text" />
                        <Input name="created_by" title="Created by" />
                        <Input name="assigned_to" title="Assigned to" />
                        <Input name="status_text" title="Status Text" />
                        <Input
                            name="open"
                            title="Open"
                            type="dropdown"
                            options={[
                                [true, 'Yes'],
                                [false, 'No'],
                            ]}
                        />
                        <Button type="submit">Submit</Button>
                        <Button type="reset">Reset</Button>
                    </Form>

                    {results.putIssue && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.putIssue}</Code>
                        </>
                    )}
                </Card>

                <Card>
                    <h3>
                        <Code>{`DELETE /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form debug onSubmit={deleteIssue}>
                        <Input
                            required
                            name="projectname"
                            title="Project Name"
                        />
                        <Input required name="id" title="id" />
                        <Button type="submit">Submit</Button>
                    </Form>

                    {results.deleteIssue && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.deleteIssue}</Code>
                        </>
                    )}
                </Card>

                <Card>
                    <h3>
                        <Code>{`GET /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form debug onSubmit={getIssues}>
                        <Input
                            notrequired
                            name="projectname"
                            title="Project Name"
                        />
                        <Input name="_id" />
                        <Input name="issue_title" />
                        <Input name="issue_text" />
                        <Input name="created_by" />
                        <Input name="assigned_to" />
                        <Input name="status_text" />
                        <Input name="open" />
                        <Input name="created_at" />
                        <Input name="updated_at" />
                        <Button type="submit">Submit</Button>
                    </Form>

                    {results.getIssues && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.getIssues}</Code>
                        </>
                    )}
                </Card>

                <Title as="h2">Debug</Title>

                <Card>
                    {/* <Button onClick={getIssues}>Get all</Button>
                    {results.getIssues && (
                        <>
                            <h3>Results</h3>
                            {results.getIssues.map((e, i) => (
                                <Code box key={i}>
                                    {e}
                                </Code>
                            ))}
                        </>
                    )} */}

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

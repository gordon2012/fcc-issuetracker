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
    const [responses, setResponses] = React.useState([]);

    const [results, setResults] = React.useState({});
    const clearResult = name =>
        setResults(prevState => {
            const { [name]: __, ...newState } = prevState;
            return newState;
        });

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

        let url;
        if (method === 'GET') {
            const query = new URLSearchParams(body).toString();
            url = `${BASE_URL}/api/issues/${projectname}${
                query.length > 0 ? `?${query}` : ''
            }`;
        } else {
            url = `${BASE_URL}/api/issues/${projectname}`;
        }

        const response = await fetch(url, options);
        const data = await response.json();
        setResponses(prevState => [data, ...prevState]);
        setResults(prevState => ({ ...prevState, [name]: data }));
    };
    const postIssue = createFetcher('postIssue', 'POST');
    const putIssue = createFetcher('putIssue', 'PUT');
    const deleteIssue = createFetcher('deleteIssue', 'DELETE');
    const getIssues = createFetcher('getIssues', 'GET');

    return (
        <>
            <GlobalStyle />
            <Layout>
                <Title>Issue Tracker</Title>

                <Card>
                    <h3>User Stories</h3>
                    <List>
                        <li>Prevent cross site scripting (XSS) attacks.</li>
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
                        <li>
                            I can{' '}
                            <Code
                                inline
                            >{`GET /api/issues/{projectname}`}</Code>{' '}
                            for an array of all issues on that specific project
                            with all the information for each issue as was
                            returned when posted.
                        </li>
                        <li>
                            I can filter my get request by also passing along
                            any field and value in the query(ie.{' '}
                            <Code
                                inline
                            >{`/api/issues/{project}?open=false`}</Code>
                            ). I can pass along as many fields/values as I want.
                        </li>
                        <li>
                            All 11 functional tests are complete and passing.
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

                    <Form blank onSubmit={postIssue}>
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
                        <Button type="reset">Reset</Button>
                    </Form>

                    {results.postIssue && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.postIssue}</Code>
                            <Button onClick={() => clearResult('postIssue')}>
                                Clear
                            </Button>
                        </>
                    )}
                </Card>

                <Card>
                    <h3>
                        <Code>{`PUT /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form onSubmit={putIssue}>
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
                            <Button onClick={() => clearResult('putIssue')}>
                                Clear
                            </Button>
                        </>
                    )}
                </Card>

                <Card>
                    <h3>
                        <Code>{`DELETE /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form onSubmit={deleteIssue}>
                        <Input
                            required
                            name="projectname"
                            title="Project Name"
                        />
                        <Input required name="id" title="id" />
                        <Button type="submit">Submit</Button>
                        <Button type="reset">Reset</Button>
                    </Form>

                    {results.deleteIssue && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.deleteIssue}</Code>
                            <Button onClick={() => clearResult('deleteIssue')}>
                                Clear
                            </Button>
                        </>
                    )}
                </Card>

                <Card>
                    <h3>
                        <Code>{`GET /api/issues/{projectname}`}</Code>
                    </h3>

                    <Form onSubmit={getIssues}>
                        <Input
                            required
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
                        <Button type="reset">Reset</Button>
                    </Form>

                    {results.getIssues && (
                        <>
                            <h3>Result</h3>
                            <Code box>{results.getIssues}</Code>
                            <Button onClick={() => clearResult('getIssues')}>
                                Clear
                            </Button>
                        </>
                    )}
                </Card>

                {responses.length > 0 && (
                    <>
                        <Title as="h2">Responses</Title>
                        <Card>
                            {responses.map((e, i) => (
                                <Code box key={i}>
                                    {e}
                                </Code>
                            ))}
                        </Card>
                    </>
                )}
            </Layout>
        </>
    );
};

export default App;

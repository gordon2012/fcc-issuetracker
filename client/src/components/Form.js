import React from 'react';
import styled from 'styled-components';

import Code from './Code';

const StyledForm = styled.form``;

const Form = ({ children, debug, onSubmit, ...restProps }) => {
    const [input, setRawInput] = React.useState({});
    const setInput = (name, value) => {
        if (value) {
            setRawInput(prevState => ({ ...prevState, [name]: value }));
        } else {
            setRawInput(prevState => {
                const { [name]: __, ...newState } = prevState;
                return newState;
            });
        }
    };

    let elements = React.Children.toArray(children);

    elements = elements.map((ele, i) =>
        React.cloneElement(ele, { onChange: setInput })
    );

    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(input);
        // setRawInput({});
    };

    return (
        <>
            <StyledForm onSubmit={handleSubmit} {...restProps}>
                {elements}
            </StyledForm>
            {debug && <Code box>{input}</Code>}
        </>
    );
};

export default Form;

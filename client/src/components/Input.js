import React from 'react';
import styled from 'styled-components';

import { uuidv4 } from '../utils/utils';

const StyledInput = styled.div`
    display: flex;
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 0.5rem;
    }

    label {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.25rem 0.5rem;
        margin-right: 0.5rem;
        text-align: right;
        flex: 1;

        &::after {
            color: red;
            content: ' *';
            opacity: ${props => (props.required ? 1 : 0)};
        }
    }

    input {
        flex: 3;
        font-family: 'Ubuntu Mono', monospace;
        font-size: 1em;
    }
`;

const Input = ({ required, name, title, onChange }) => {
    const [id] = React.useState(() => uuidv4());
    const [value, setValue] = React.useState(() => {
        onChange(name, '');
        return '';
    });

    const handleChange = event => {
        onChange(name, event.target.value);
        setValue(event.target.value);
    };

    return (
        <StyledInput required={required}>
            <label htmlFor={`${name}-${id}`}>{title}</label>
            <input
                id={`${name}-${id}`}
                name={name}
                value={value}
                onChange={handleChange}
                required={required}
            />
        </StyledInput>
    );
};

export default Input;

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

    input,
    select {
        flex: 3;
        font-family: 'Ubuntu Mono', monospace;
        font-size: 1em;
    }
`;

const Input = ({ required, name, title, type, options, onChange, value }) => {
    const [id] = React.useState(() => uuidv4());

    const handleChange = event => {
        onChange(name, event.target.value);
    };

    return (
        <StyledInput required={required}>
            <label htmlFor={`${name}-${id}`}>{title || name}</label>

            {type === 'dropdown' ? (
                <select
                    id={`${name}-${id}`}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    required={required}
                >
                    {[['', '--Please Select--'], ...options].map(
                        ([value, label], i) => (
                            <option key={i} value={value}>
                                {label}
                            </option>
                        )
                    )}
                </select>
            ) : (
                <input
                    id={`${name}-${id}`}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    required={required}
                />
            )}
        </StyledInput>
    );
};

export default Input;

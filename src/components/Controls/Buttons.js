import styled, { css } from 'styled-components';


export const Button = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid ${ props => props.color || 'cornflowerblue'};
    color: cornflowerblue;
    margin: 0.5em 1em 0.5em 0em;
    padding: 0.25em 1em;
    color: ${props => props.color || 'cornflowerblue'};
    ${props => props.active && css`
        background: ${ props => props.color || 'cornflowerblue'};
        color: white;
    `}
`
import React, { useState } from 'react'
import styled from 'styled-components'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useSpring, animated, config, useTransition, useTrail } from 'react-spring'
import { Link } from 'react-router-dom'

const Container = styled(animated.header)`
    margin-bottom: 10vh;
    padding: 0px 1rem 0px 1rem;
    /* background-color: #ff6f61; */
    min-height:10vh;
    grid-area: header;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    /* align-items: stretch; */
    border-color:lightgrey;
    border-style:solid;
    border-width: 0px 0px 1px 0px;
`;

const LogoutButton = styled.button`
    display:flex;
    align-items:center;
    text-decoration: none;
    background-color: transparent;
    border: none;
    border-radius: 10px;
    margin-left: ${props => props.right ? "auto" : "0px"};
    font-size: 50px;
    &:hover {
    background: #e9e9e9; // <Thing> when hovered
    }

`;

const Title = styled(animated.h1)`
    margin: 1rem;
    font-family: "Times New Roman", Times, serif;
    font-size: 5rem;
    display:flex;
    flex-flow: row nowrap;
`;

const HeaderLink = styled(Link)`
    text-decoration: none;
    color:black;
`;

function Header(props) {
    const { user, show } = props;

    const headerTransition = useTransition(show, {
        from: { y: -50, opacity: 0 },
        enter: { y: 0, opacity: 1 },
        leave: { y: -50, opacity: 0 },
        config: config.tight,
    })

    const logout = () => {
        window.location.href = "api/users/logout";
    }

    return (headerTransition((style, show) => show &&
        <Container style={style}>
            {console.log("Header call !!")}
            <HeaderLink to="/">
                <Title>Mes petits menus</Title>
            </HeaderLink>
            {user != null ? <LogoutButton right onClick={logout}>
                <ExitToAppIcon fontSize='inherit' />
            </LogoutButton> : ""}
        </Container >)
    )
}

export default Header

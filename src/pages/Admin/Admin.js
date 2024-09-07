import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'; // Custom CSS for additional styles
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
const App = () => {
    const navigate = useNavigate();
    const [isMenuExpanded, setMenuExpanded] = useState(true);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 576);

    const toggleMenuWidth = () => {
        setMenuExpanded(!isMenuExpanded)
    };

    const handleResize = () => {
        setIsScreenSmall(window.innerWidth < 576);
    };
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isScreenSmall) {
            setSidebarVisible(false);
        } else {
            setSidebarVisible(true);
        }
    }, [isScreenSmall]);
    const handleClick = () => {
        navigate("/quan-ly/chuong-trinh-dao-tao");
    };
    return (
        <Container fluid style={{color:'#73879C'}}>
            <Row>
                <Col
                    md={isMenuExpanded ? 2 : 1}
                    xs = {2}
                    style={{paddingTop : '10px'}}
                    className={isScreenSmall ? isMenuExpanded ? 'menu-col nopadding' : 'd-none' : isMenuExpanded ? 'menu-col' : 'menu-col'}
                >
                    <Sidebar isMenuExpanded={isMenuExpanded} toggleMenuWidth={toggleMenuWidth} isScreenSmall={isScreenSmall} />
                </Col>
                <Col md={isMenuExpanded ? 10 : 11} xs = {isMenuExpanded ? 10 : 12} className="content-col nopadding" style={{background : '#E6E9ED68'}}>
                    <Navbar toggleMenuWidth={toggleMenuWidth}/>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
};
export default App;
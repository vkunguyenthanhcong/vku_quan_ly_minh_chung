import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; // Custom CSS for additional styles
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import MainContent from '../MainContent/MainContent';



const App = () => {
  
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
    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Automatically hide sidebar on small screens
    if (isScreenSmall) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [isScreenSmall]);

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
          <MainContent/>
        </Col>
      </Row>
    </Container>
  );
};

export default App;

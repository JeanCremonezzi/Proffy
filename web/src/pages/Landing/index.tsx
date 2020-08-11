import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

import Logo from '../../assets/images/logo.svg';
import LandingImg from '../../assets/images/landing.svg';
import StudyIcon from '../../assets/images/icons/study.svg';
import GiveClassesIcon from '../../assets/images/icons/give-classes.svg';
import PurpleHeartIcon from '../../assets/images/icons/purple-heart.svg';

import './styles.css';
import api from '../../services/api';

function Landing() {
    const [totalConnections, setTotalConnections] = useState(0);

    useEffect(() => {
        api.get('/connections').then( response => {
            const { total } = response.data;

            setTotalConnections(total);
        });
    }, []);
    
    return(
        <div id="page-landing">
            <div id="page-landing-content" className="container">
            
                <div className="logo-container">
                    <img src={Logo} alt="Proffy"/>
                    <h2>Sua plataforma de estudos online.</h2>
                </div>

                <img 
                    src={LandingImg} 
                    alt="Plataforma de estudos" 
                    className="hero-image"
                />

                <div className="buttons-container">
                    <Link to="/study" className="study">
                        <img src={StudyIcon} alt="Estudar"/>
                        Estudar
                    </Link>
                    
                   <Link to="/give-classes" className="give-classes">
                        <img src={GiveClassesIcon} alt="Dar aulas"/>
                        Dar aulas
                    </Link> 
                </div>

                <span className="total-connections">
                    Total de {totalConnections} conexões já realizadas. <img src={PurpleHeartIcon} alt="Conexões"/>
                </span>

            </div>
        </div>
    );
}

export default Landing;
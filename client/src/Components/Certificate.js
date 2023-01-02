import React from "react";
import PropTypes from "prop-types";
import '../font/AspireDemibold.ttf';
function Certificate(props) {
    const { title, name, date, hash, logo } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1000"
            height="700"
            id="certificate"
        >
            {/* <rect
        x="95"
        y="10"
        rx="20"
        ry="20"
        width="900"
        height="600"
        id="border"
      /> */}
            <image
                x="450"
                y="30"
                height="80px"
                width="120px"
                id="logo"
                href={logo}
            />
            <text x="500" y="120" text-anchor="middle" fill="black" id="header">
                VIETNAM - KOREA UNIVERSITY
            </text>
            <line x1="400" y1="125" x2="600" y2="125" id="titleUnderLine" />
            <text
                x="500"
                y="200"
                text-anchor="middle"
                fill="black"
                id="bodyTitle"
            >
                Certificate
            </text>
            <text
                x="500"
                y="255"
                text-anchor="middle"
                fill="black"
                id="bodySubTitle"
            >
                of {title}
            </text>
            <text
                x="500"
                y="400"
                text-anchor="middle"
                fill="black"
                id="subTitleHeader"
            >
                This certificate is presented to 
            </text>
            <text x="500" y="500" text-anchor="middle" fill="black" id="name" fontFamily="AspireDemibold">
                {name}
            </text>
            <line x1="200" y1="510" x2="800" y2="510" id="titleUnderLine" />
            <text
                x="500"
                y="540"
                text-anchor="middle"
                fill="black"
                id="bodySubTitle"
            >
                on
            </text>
            <text x="500" y="600" text-anchor="middle" fill="black" id="date">
                {date}
            </text>
            <line x1="400" y1="610" x2="600" y2="610" id="titleUnderLine" />
            <text x="100" y="675" text-anchor="start" fill="black" id="hash">
                ID: {hash}
            </text>
            Sorry, your browser does not support inline SVG.
        </svg>
    );
}

Certificate.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
};

export default Certificate;
// http://localhost:3001/display/certificate/62a003d86d61f06f858763a9

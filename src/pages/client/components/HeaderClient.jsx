import React from 'react';

const HeaderClient = () => {
    return (
        <div className="App">
      <div class="topnav">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Education</a>
        <a href="#">Contact us</a>
        <a href="/login" style={{ float: "right" }}>
          Login
        </a>
      </div>
    </div>
    )
}

export default HeaderClient
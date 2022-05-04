import React, { useState } from 'react';
import PropTypes from 'prop-types';

function PasswordInput (props) {
    const { tag: Tag, name, defaultValue, ...otherProps } = props;
    
    const [ value, setValue ] = useState(defaultValue);
    const [ isVisible, setIsVisible ] = useState(false);

    const handleChange = event => {
        setValue(event.target.value);
    }

    const handleToggle = event => {
        setIsVisible(!isVisible);
    }

    return (
        <div className="input-group">
            <Tag type={ isVisible ? 'text' : 'password' } name={ name } value={ value } onChange={event => handleChange(event)} {...otherProps}/>
            <span className="input-group-append">
                <span className="input-group-text" style={{ padding: 0, backgroundColor: '#FFFFF' }}>
                    <i className={ isVisible ? 'bx bxs-show font-size-16' : 'bx bxs-hide font-size-16' } style={{ margin: '0 10px', color: '#AAA' }} onClick={ handleToggle }></i>
                </span>
            </span>
        </div>
    );
}

PasswordInput.propTypes = {
    tag: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
}
  
export default PasswordInput;
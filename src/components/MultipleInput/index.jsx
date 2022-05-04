import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'reactstrap';

// CSS
import '../MultipleInput/style.css';

function NumericInput(props) {
  const { defaultValue, handle, ...otherProps } = props;
  const [ value, setValue ] = useState('');
  
  const numeric = number => {
    number += '';
    let x = number.split('.');
    let y = x[0];
    let z = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(y)) {
      // eslint-disable-next-line no-useless-concat
      y = y.replace(rgx, '$1' + ',' + '$2');
    }

    return y + z; 
  }

  const handleChange = event => {
    let value = event.target.value.replace(/[^\d]/g, '');
    setValue(numeric(value)); handle(event);
  }

  useEffect(() => {
    if (defaultValue && defaultValue !== '')
      setValue(numeric(defaultValue));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input value={ value } onChange={event => handleChange(event)} { ...otherProps }/>
  )
}

function MultipleInput(props) {
  const { handle, head, body, defaultData } = props;
  const [ data, setData ] = useState({});
  const [ element, setElement ] = useState([]);

  const addElement = () => {
    let nextData = data, id = element.length.toString();

    nextData[id] = {};
    body.forEach(item => {
      switch (item.type) {
        case 'checkbox': {
          nextData[id][item.name] = false;
          break;        
        }
        default: {
          nextData[id][item.name] = '';
          break;
        }
      }
    })

    setElement([ ...element, id ]); setData(nextData);
  }

  const removeElement = event => {
    let id = event.target.id;
    if (id === undefined)
      id = event.target.parentElement.id;
    
    id = id.substr(id.indexOf('_') + 1);
    
    let nextData = {};
    Object.keys(data).forEach(key => {
      if (id !== key) {
        nextData[key] = data[key];
      }
    })

    const nextElement = [];
    element.forEach(item => { 
      if (item !== id) {
        nextElement.push(item);
      }
    });

    setElement(nextElement); setData(nextData);
    if (nextElement.length < 1)
      handle({});
    else
      handle(nextData);
  }

  const handleChange = event => {
    let name = event.target.name;
    let id = name.substr(name.indexOf('_') + 1); name = name.substr(0, name.indexOf('_'));

    let nextData = data;
    for (let i = 0; i < body.length; i++) {
      if (body[i].name === name) {
        switch (body[i].type) {
          case 'checkbox': {
            nextData[id][name] = event.target.checked;
            break;
          }
          case 'number': {
            let number = parseFloat(event.target.value.replace(/[^\d]/g, '')); nextData[id][name] = 0;
            if (!isNaN(number))
              nextData[id][name] = number;
            break;
          }
          default: {
            nextData[id][name] = event.target.value;
            break;
          }
        }

        setData(nextData); handle(nextData);
        break;
      }
    }
  }

  useEffect(() => {
    if (defaultData && defaultData.length > 0) {
      let nextData = {}; let nextElement = [];
      defaultData.forEach((item, idx) => {
        nextData[idx] = {}; nextElement.push(idx.toString());
        body.forEach(key => {
          nextData[idx][key.name] = item[key.name];
        });
      });

      setElement(element.concat(nextElement)); setData(nextData); handle(nextData);
    }
    else
      addElement();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table className="table-multiple-input">
      { (head && head.length > 0)
        ? (
          <thead>
            <tr>
              { 
                head.map((item, idx) => { 
                  return (<th key={ 'multiple-input-head_' + idx } colSpan={ item.col }>{ item.name }</th>) 
                }) 
              }
              <th>&nbsp;</th>
            </tr>
          </thead>
        )
        : null
      }
      <tbody>
        { (element && element.length > 0)
          ? (
            <>
              {
                element.map(idx => {
                  return (
                    <tr key={ 'element_' + idx }>
                      {
                        body.map(item => {
                          switch (item.type) {
                            case 'checkbox': {
                              let value = false;
                              if (data[idx] && data[idx][item.name])
                                value = data[idx][item.name];

                              return (
                                <td className={ 'checkbox' } key={ item.name + '_' + idx }>
                                  <input type="checkbox" name={ item.name + '_' + idx } checked={ value } onChange={event => handleChange(event)}/>&nbsp;{ (item.description ? item.description : '') }
                                </td>
                              )
                            }
                            case 'number': {
                              let value = '';
                              if (data[idx] && data[idx][item.name])
                                value = data[idx][item.name];

                              return (
                                <td key={ item.name + '_' + idx }>
                                  <NumericInput name={ item.name + '_' + idx } defaultValue={ value } placeholder={ (item.description ? item.description : '') } handle={ handleChange }/>
                                </td>
                              )                              
                            }
                            default: {
                              let value = '';
                              if (data[idx] && data[idx][item.name])
                                value = data[idx][item.name];

                              return (
                                <td key={ item.name + '_' + idx }>
                                  <Input name={ item.name + '_' + idx } defaultValue={ value } placeholder={ (item.description ? item.description : '') } onChange={event => handleChange(event)}/>
                                </td>
                              )
                            }
                          }
                        })
                      }
                      <td id={ 'element_' + idx }>
                        <Button style={{ verticalAlign: 'middle' }} color="danger" size="sm" id={ 'element_' + idx } onClick={event => removeElement(event)}><i className="bx bx-x"></i></Button>
                      </td>
                    </tr>
                  );
                })
              }
            </>
          )
          :
          <tr>
            <td className="text-center" colSpan={ body.length + 1 }>{ props.t('No data') }</td>
          </tr>
        }
        <tr>
          <td>
            <Button color="success" size="sm" onClick={ addElement }><i className="bx bx-plus"></i></Button>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default MultipleInput;
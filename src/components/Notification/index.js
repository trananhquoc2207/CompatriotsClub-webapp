import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Toast,
    ToastBody
} from 'reactstrap';

const Notification = (props) => {
    const typeList = {
        success: {
            class: 'bg-success text-white',
            icon: 'fa fa-check-circle',
        },

        info: {
            class: 'bg-info text-white',
            icon: 'fa fa-info-circle',
            label: 'Info',
        },

        warning: {
            class: 'bg-warning text-white',
            icon: 'fa fa-exclamation-circle',
        },

        danger: {
            class: 'bg-danger text-white',
            icon: 'fa fa-times-circle'
        },

        secondary: {
            class: 'bg-secondary text-white',
            icon: 'fa fa-info-circle',
            label: 'Info',
        },
    }

    const { notificationList, autoDelete, autoDeleteTime } = props;
    const [listItem, setListItem] = useState(notificationList);

    const deleteNotification = id => {
        const index = listItem.findIndex(item => item.id === id);
        listItem.splice(index, 1);
        setListItem([...listItem]);
    }

    useEffect(() => {
        setListItem(notificationList);
    }, [notificationList]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoDelete && notificationList.length && notificationList[0].autoDelete !== false && listItem.length) {
                deleteNotification(notificationList[0].id);
            }
        }, autoDeleteTime);
        return () => {
            clearInterval(interval);
        }
    });

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexDirection: 'column-reverse', position: 'fixed', zIndex: '100', minHeight: '200px', bottom: '20px', right: '20px' }}>
                {
                    listItem.map((item, idx) => {
                        const type = typeList[item.type] ? typeList[item.type] : typeList.secondary;
                        return (
                            <Toast className={type.class} style={{ marginTop: '1rem', minWidth: '300px' }} key={item.id}>
                                <ToastBody>
                                    <p style={{ marginBottom: '.5rem', fontWeight: '600', fontSize: '14px' }}>
                                        <span className="mr-2"><i className={type.icon}></i></span>{item.title}
                                        <button type="button" className="ml-2 mb-1 close" onClick={() => deleteNotification(item.id)}>
                                            <span style={{ fontWeight: '400', color: 'white' }}>&times;</span>
                                        </button>
                                    </p>
                                    {item.description}
                                </ToastBody>
                            </Toast>
                        )
                    })
                }
            </div>
        </React.Fragment>
    )
}

Notification.propTypes = {
    notificationList: PropTypes.array.isRequired,
    autoDelete: PropTypes.bool,
    autoDeleteTime: PropTypes.number
}

export default Notification;
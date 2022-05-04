import React from 'react';

import Accordion from './Accordion';
import InformationDetails from './InformationSection';
import InsuranceDetails from './InsuranceSection';

const accordions = [
  {
    active: true,
    icon: 'user',
    title: 'Lý lịch cá nhân',
    children: <InformationDetails />,
  },
  {
    active: false,
    icon: 'shield',
    title: 'Bảo hiểm',
    children: <InsuranceDetails />,
  }
];

const Collapse = () => {
  return (
    accordions.map((o, i) => <Accordion key={`accordion_${i}`} active={o.active} icon={o.icon} title={o.title} children={o.children} />)
  );
};

export default Collapse;
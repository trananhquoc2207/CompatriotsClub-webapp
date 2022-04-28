import React, { useEffect, forwardRef, useState } from 'react';
import styled from 'styled-components';
import dayJS from 'dayjs';
import {
  ButtonGroup,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonDropdown,
} from 'reactstrap';
import SearchBar from 'components/SearchBar';
import { WeekPicker } from 'components/date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments } from 'pages/setting/department/actions/deparment';
import { getUnitGroup } from 'pages/unit/actions/unit';

const SearchBarWrapper = styled.div`
  > div {
    padding-bottom: 6px;
  }
`;
const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;
const StyledButtonGroup = styled(ButtonGroup)`
  & .btn {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
  }
  & .dropdown-item {
    font-size: 15px;
  }
 
`;
const StyleWeekPicker = styled(ButtonGroup)`
  margin-left: 5px;
  & .btn {
    background-color: #529bea;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
    margin-right: -1px;
  }
  & .button__date-picker {
    background-color: inherit !important;
    color: black !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    & i {
      position: absolute;
      top: 7px;
      font-size: 20px;
    }
    & .from {
      margin-right: 5px;
    }
    & .to {
      margin-left: 25px;
    }
  }
`;
const StyledDropdownToggle = styled(DropdownToggle)`
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
    text-overflow: ellipsis;
`;
const StyledDropdownMenu = styled(DropdownMenu)`
    height: 150px;
    overflow-x: hidden;
    overflow-y: auto;
    text-overflow: ellipsis;
`;
const StyledDropdownItem = styled(DropdownItem)`
    font-size: 15px;
`;

const unitType = [
  { value: 0, label: 'Khối' },
  { value: 1, label: 'Phòng ban' },
  { value: 2, label: 'Bộ phận' },
  { value: 3, label: 'Nhóm' },
];
const getMondayofWeek = (time) => {
  const day = time.getDay();
  const difference = time.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(time.setDate(difference));
};

const getDaysOfWeek = (time) => {
  const current = getMondayofWeek(time);
  const days = [];
  for (let i = 1; i <= 7; i++) {
    const first = current.getDate() - current.getDay() + i;
    const day = new Date(current.setDate(first));
    days.push(day);
  }
  return days;
};

const ShiftFilter = ({ onChange: onChangeProps }) => {
  const defaultTime = getDaysOfWeek(new Date());
  // const { department, getDepartmentsLoading } = useSelector((state) => state.department);
  // const { data: departmentList } = department;
  const [dropdownUnitTypeOpen, setDropdownUnitTypeOpen] = useState(false);
  const [dropdownUnitOpen, setDropdownUnitOpen] = useState(false);
  const [today, setToday] = useState(false);
  const [filter, setFilter] = useState({ TuNgay: dayJS(defaultTime[0]).format('YYYY-MM-DD'), DenNgay: dayJS(defaultTime[6]).format('YYYY-MM-DD') });

  const [type, setType] = useState(undefined);
  const { unitGroup, getUnitGroupLoading } = useSelector((s) => s.unit);
  const { data: unitList, totalSizes } = unitGroup;
  const dispatch = useDispatch();
  const toggleUnitTypeDropdown = () => setDropdownUnitTypeOpen(!dropdownUnitTypeOpen);
  const toggleUnitDropdown = () => setDropdownUnitOpen(!dropdownUnitOpen);

  const DatePickerButton = forwardRef((props, ref) => {
    const {
      value,
      ...rest
    } = props;
    const render = (d) => {
      const date = d !== '' ? new Date(d) : new Date();
      const week = getDaysOfWeek(date);
      return (
        <>
          <span className="from">{dayJS(week[0]).format('DD-MM-YYYY')}</span>
          <i className="bx bx-right-arrow-alt" />
          <span className="to">{dayJS(week[6]).format('DD-MM-YYYY')}</span>
        </>
      );
    };

    return (
      <Button
        innerRef={ref}
        {...rest}
        className="button__date-picker"
      >
        {value && render(value)}
        {!value && 'Thời gian'}
      </Button>
    );
  });

  const handleChange = (object) => {
    const merge = { ...filter, ...object };
    const payload =
      Object
        .keys(merge)
        .reduce((object, key) => {
          if (merge[key]) {
            object[key] = merge[key];
          }
          return object;
        }, {});
    setFilter(payload);
    if (onChangeProps) {
      onChangeProps(payload);
    }
  };
  const handleRefresh = () => {
    if (type !== undefined) {
      const payload = {
        LoaiDonVi: type,
      };
      dispatch(getUnitGroup(payload));
    } else dispatch(getUnitGroup());
  };
  useEffect(() => {
    handleRefresh();
  }, [type]);
  /* useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({}));
    }
  }, [department]); */

  return (
    <>
      <SearchBarWrapper>
        <SearchBar onChange={(k) => handleChange({ maNV: k })} />
      </SearchBarWrapper>
      <ToolbarWrapper>
        <StyledButtonGroup className="mr-2">
          <ButtonDropdown isOpen={dropdownUnitTypeOpen} toggle={toggleUnitTypeDropdown}>
            <StyledDropdownToggle caret color="secondary">
              {type
                ? (unitType).find((o) => o.value === type).label
                : 'Loại đơn vị'
              }
            </StyledDropdownToggle>
            <StyledDropdownMenu>
              <StyledDropdownItem onClick={() => setType(undefined)}>Tất cả</StyledDropdownItem>
              {(unitType).map((o) => (
                <StyledDropdownItem
                  key={`unit_${o?.value}`}
                  onClick={() => setType(o?.value)}
                >
                  {o?.label}
                </StyledDropdownItem>
              ))}
            </StyledDropdownMenu>
          </ButtonDropdown>
          <ButtonDropdown isOpen={dropdownUnitOpen} toggle={toggleUnitDropdown} className="mr-2">
            <StyledDropdownToggle caret color="warning">
              {filter?.donViId
                ? (unitList || []).find((o) => o.id === filter.donViId)?.tenDonVi ?? 'Đơn vị'
                : 'Tất cả đơn vị'
              }
            </StyledDropdownToggle>
            <StyledDropdownMenu>
              <StyledDropdownItem onClick={() => handleChange({ donViId: undefined, tenDonVi: undefined })}>Tất cả</StyledDropdownItem>
              {(unitList || []).map((o) => (
                <StyledDropdownItem
                  key={`unit_${o?.id ?? 0}`}
                  onClick={() => handleChange({ donViId: o?.id ?? 0, tenDonVi: o?.tenDonVi })}
                >
                  {o?.tenDonVi ?? ''}
                </StyledDropdownItem>
              ))}
            </StyledDropdownMenu>
          </ButtonDropdown>
        </StyledButtonGroup>
        <StyledButtonGroup>
          <Button
            color="secondary"
            onClick={() => {
              handleChange({
                TuNgay: dayJS(getDaysOfWeek(new Date(new Date(filter.TuNgay).getTime() - (7 * 24 * 60 * 60 * 1000)))[0]).format('YYYY-MM-DD'),
                DenNgay: dayJS(getDaysOfWeek(new Date(new Date(filter.TuNgay).getTime() - (7 * 24 * 60 * 60 * 1000)))[6]).format('YYYY-MM-DD'),
              });
            }}
          >
            <i className="bx bx-left-arrow-alt" />
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              handleChange({ TuNgay: dayJS(defaultTime[0]).format('YYYY-MM-DD'), DenNgay: dayJS(defaultTime[6]).format('YYYY-MM-DD') });
            }}
          >
            Tuần này
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              handleChange({
                TuNgay: dayJS(getDaysOfWeek(new Date(new Date(filter.DenNgay).getTime() + (7 * 24 * 60 * 60 * 1000)))[0]).format('YYYY-MM-DD'),
                DenNgay: dayJS(getDaysOfWeek(new Date(new Date(filter.DenNgay).getTime() + (7 * 24 * 60 * 60 * 1000)))[6]).format('YYYY-MM-DD'),
              });
            }}
          >
            <i className="bx bx-right-arrow-alt" />
          </Button>
        </StyledButtonGroup>
        <StyleWeekPicker>
          <Button
            color="secondary"
          >
            <i className="bx bx-calendar" />
          </Button>
          <WeekPicker
            range
            value={today ? new Date() : new Date(filter?.TuNgay)}
            customInput={<DatePickerButton isWeek />}
            onChange={(f, t) => handleChange({ TuNgay: dayJS(f).format('YYYY-MM-DD'), DenNgay: dayJS(t).format('YYYY-MM-DD') })}
          />
        </StyleWeekPicker>
      </ToolbarWrapper>
    </>
  );
};

export default ShiftFilter;

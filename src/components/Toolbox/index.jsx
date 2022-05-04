import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import {
    Row,
    Button,
    Input
} from 'reactstrap';

// CSS
import 'react-datepicker/dist/react-datepicker.css';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function Toolbox(props) {
    const { option } = props;
    const [filters, setFilters] = useState({
        keyword: (option.search.value !== undefined && option.search.value !== null) ? option.search.value : '',
        groupBy: (option.groupBy.value !== undefined && option.groupBy.value !== null) ? option.groupBy.value : '',
        date: (option.datePicker.value !== undefined && option.datePicker.value !== null) ? option.datePicker.value : new Date()
    });

    return (
        <Row className="mb-2">
            {
                (option.attendance.isShow)
                    ?
                    // Attendance
                    <div className="d-flex ml-3">
                        <Button type="button" className="btn-rounded font-weight-bold" color="success" onClick={() => { option.attendance.handle(option.attendance.data) }}>
                            <i className="bx bx-plus mr-1"></i> {capitalizeFirstLetter(props.t('Attendance'))}
                        </Button>
                    </div>
                    : (
                        (option.delete.isShow)
                            ?
                            // Delete
                            <div className="d-flex ml-3">
                                <Button type="button" className="btn-rounded font-weight-bold" color="danger" onClick={() => { option.delete.handle() }}>
                                    <i className="bx bx-trash-alt mr-1"></i> {props.t('Delete')}
                                </Button>
                            </div>
                            :
                            (option.datePicker.isShow)
                                ? (
                                    (option.add.isShow)
                                        ? (
                                            (option.search.isShow)
                                                ? (
                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                        ?
                                                        // Date picker - Search - Group By - Add
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <DatePicker
                                                                            className="form-control data-time-picker text-center"
                                                                            selected={filters.date}
                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                            locale={'vi'}
                                                                            dateFormat="MM/yyyy"
                                                                            fixedHeight
                                                                            showMonthYearPicker
                                                                        />
                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.search.handle(filters) }}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                    <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                        :
                                                        // Date picker - Search - Add
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <DatePicker
                                                                            className="form-control data-time-picker text-center"
                                                                            selected={filters.date}
                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                            locale={'vi'}
                                                                            dateFormat="MM/yyyy"
                                                                            fixedHeight
                                                                            showMonthYearPicker
                                                                        />
                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.search.handle(filters) }}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                    <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                )
                                                : (
                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                        ?
                                                        // Date Picker - Group By - Add
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <DatePicker
                                                                            className="form-control data-time-picker text-center"
                                                                            selected={filters.date}
                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                            locale={'vi'}
                                                                            dateFormat="MM/yyyy"
                                                                            fixedHeight
                                                                            showMonthYearPicker
                                                                        />
                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                    <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                        :
                                                        // Date Picker - Add
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <DatePicker
                                                                            className="form-control data-time-picker text-center"
                                                                            selected={filters.date}
                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                            locale={'vi'}
                                                                            dateFormat="MM/yyyy"
                                                                            fixedHeight
                                                                            showMonthYearPicker
                                                                        />
                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                    <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                )
                                        )
                                        : (
                                            (option.search.isShow)
                                                ? (
                                                    (option.groupBy.isShow)
                                                        ? (option.export.isShow)
                                                            ? (
                                                                <>
                                                                    <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                        <div className="search-box d-inline-block">
                                                                            <div className="position-relative">
                                                                                <DatePicker
                                                                                    className="form-control data-time-picker text-center"
                                                                                    style={{ width: '100%!important' }}
                                                                                    selected={filters.date}
                                                                                    onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                    locale={'vi'}
                                                                                    dateFormat="MM/yyyy"
                                                                                    fixedHeight
                                                                                    showMonthYearPicker
                                                                                />
                                                                                <i className="bx bx-calendar-week search-icon"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                        <div className="search-box d-inline-block">
                                                                            <div className="position-relative">
                                                                                <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                <i className="bx bx-search-alt search-icon"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        (option.groupBy.option.length > 1)
                                                                            ?
                                                                            <div className="ml-3" style={{ minWidth: '170px' }}>
                                                                                <Input type="select" className="form-control select-custom radius-30" value={filters.groupBy} onChange={(event) => { setFilters({ ...filters, groupBy: event.target.value }) }}>
                                                                                    {
                                                                                        option.groupBy.option.map((item, idx) => {
                                                                                            if (item.value === undefined || item.value === null)
                                                                                                return <option value={''} key={'toolbox_groupby_' + idx} disabled>{item.description}</option>;
                                                                                            return <option value={item.value} key={'toolbox_groupby_' + idx}>{item.description}</option>;
                                                                                        })
                                                                                    }
                                                                                </Input>
                                                                                <i className="bx bx-chevron-down"></i>
                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                    <div className="ml-3">
                                                                        <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                            {props.t('Filter')}
                                                                        </Button>
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={event => { option.export.handle(event) }}>
                                                                            <i className="bx bx-cloud-download mr-1"></i> {props.t('Export')}
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )
                                                            : (
                                                                <>
                                                                    <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                        <div className="search-box d-inline-block">
                                                                            <div className="position-relative">
                                                                                <DatePicker
                                                                                    className="form-control data-time-picker text-center"
                                                                                    style={{ width: '100%!important' }}
                                                                                    selected={filters.date}
                                                                                    onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                    locale={'vi'}
                                                                                    dateFormat="MM/yyyy"
                                                                                    fixedHeight
                                                                                    showMonthYearPicker
                                                                                />
                                                                                <i className="bx bx-calendar-week search-icon"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                        <div className="search-box d-inline-block">
                                                                            <div className="position-relative">
                                                                                <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                <i className="bx bx-search-alt search-icon"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        (option.groupBy.option.length > 1)
                                                                            ?
                                                                            <div className="ml-3" style={{ minWidth: '170px' }}>
                                                                                <Input type="select" className="form-control select-custom radius-30" value={filters.groupBy} onChange={(event) => { setFilters({ ...filters, groupBy: event.target.value }) }}>
                                                                                    {
                                                                                        option.groupBy.option.map((item, idx) => {
                                                                                            if (item.value === undefined || item.value === null)
                                                                                                return <option value={''} key={'toolbox_groupby_' + idx} disabled>{item.description}</option>;
                                                                                            return <option value={item.value} key={'toolbox_groupby_' + idx}>{item.description}</option>;
                                                                                        })
                                                                                    }
                                                                                </Input>
                                                                                <i className="bx bx-chevron-down"></i>
                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                    <div className="ml-3">
                                                                        <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                            {props.t('Filter')}
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )
                                                        // Date picker - Search - Group By

                                                        :
                                                        // Date picker - Search
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <DatePicker
                                                                            className="form-control data-time-picker text-center"
                                                                            selected={filters.date}
                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                            locale={'vi'}
                                                                            dateFormat="MM/yyyy"
                                                                            fixedHeight
                                                                            showMonthYearPicker
                                                                        />
                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                )
                                                : (
                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                        ?
                                                        // Date picker - Group By
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <DatePicker
                                                                            className="form-control data-time-picker text-center"
                                                                            selected={filters.date}
                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                            locale={'vi'}
                                                                            dateFormat="MM/yyyy"
                                                                            fixedHeight
                                                                            showMonthYearPicker
                                                                        />
                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                        : (
                                                            (option.export.isShow)
                                                                ? (
                                                                    // Date picker & Export
                                                                    <>
                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                            <div className="search-box d-inline-block">
                                                                                <div className="position-relative">
                                                                                    <DatePicker
                                                                                        className="form-control data-time-picker text-center"
                                                                                        selected={filters.date}
                                                                                        onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                        locale={'vi'}
                                                                                        dateFormat="MM/yyyy"
                                                                                        fixedHeight
                                                                                        showMonthYearPicker
                                                                                    />
                                                                                    <i className="bx bx-calendar-week search-icon"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                {props.t('Filter')}
                                                                            </Button>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={event => { option.export.handle(event) }}>
                                                                                <i className="bx bx-cloud-download mr-1"></i> {props.t('Export')}
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )
                                                                : (
                                                                    // Date picker
                                                                    <>
                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                            <div className="search-box d-inline-block">
                                                                                <div className="position-relative">
                                                                                    <DatePicker
                                                                                        className="form-control data-time-picker text-center"
                                                                                        selected={filters.date}
                                                                                        onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                        locale={'vi'}
                                                                                        dateFormat="MM/yyyy"
                                                                                        fixedHeight
                                                                                        showMonthYearPicker
                                                                                    />
                                                                                    <i className="bx bx-calendar-week search-icon"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                {props.t('Filter')}
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )
                                                        )
                                                )
                                        )
                                )
                                : (
                                    (option.add.isShow)
                                        ? (
                                            (option.search.isShow)
                                                ? (
                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                        ?
                                                        // Search - Group By - Add
                                                        <>
                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                <div className="search-box d-inline-block">
                                                                    <div className="position-relative">
                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ml-3">
                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                    {props.t('Filter')}
                                                                </Button>
                                                            </div>
                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                    <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                </Button>
                                                            </div>
                                                        </>
                                                        : (
                                                            (option.import.isShow)
                                                                ? (
                                                                    // Search - Add - Import
                                                                    <>
                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                            <div className="search-box d-inline-block">
                                                                                <div className="position-relative">
                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                {props.t('Filter')}
                                                                            </Button>
                                                                        </div>
                                                                        <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                            </Button>
                                                                        </div>
                                                                        <div className="mr-3">
                                                                            <Button type="button" className="btn btn-rounded btn-info font-weight-bold" onClick={() => { option.import.handle() }}>
                                                                                <i className="bx bx-import mr-1"></i> {props.t('Import')}
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )
                                                                : (
                                                                    // Search - Add
                                                                    <>
                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                            <div className="search-box d-inline-block">
                                                                                <div className="position-relative">
                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                {props.t('Filter')}
                                                                            </Button>
                                                                        </div>
                                                                        <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )
                                                        )
                                                )
                                                : (
                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                        ?
                                                        // Group By - Add
                                                        <div className="d-flex mr-3" style={{ marginLeft: 'auto' }}>
                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                            </Button>
                                                        </div>
                                                        :
                                                        // Add
                                                        <div className="d-flex mr-3" style={{ marginLeft: 'auto' }}>
                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                <i className="bx bx-plus mr-1"></i> {option.add.title ? option.add.title : props.t('Add')}
                                                            </Button>
                                                        </div>
                                                )
                                        )
                                        : (
                                            (option.datePicker.isShow)
                                                ? (
                                                    (option.add.isShow)
                                                        ? (
                                                            (option.search.isShow)
                                                                ? (
                                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                                        ?
                                                                        // Date picker - Search - Group By - Add
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.search.handle(filters) }}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                    <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        // Date picker - Search - Add
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.search.handle(filters) }}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                    <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                )
                                                                : (
                                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                                        ?
                                                                        // Date Picker - Group By - Add
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                    <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        // Date Picker - Add
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                    <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                )
                                                        )
                                                        : (
                                                            (option.search.isShow)
                                                                ? (
                                                                    (option.groupBy.isShow)
                                                                        ?
                                                                        // Date picker - Search - Group By
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            style={{ width: '100%!important' }}
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                (option.groupBy.option.length > 1)
                                                                                    ?
                                                                                    <div className="ml-3" style={{ minWidth: '170px' }}>
                                                                                        <Input type="select" className="form-control select-custom radius-30" value={filters.groupBy} onChange={(event) => { setFilters({ ...filters, groupBy: event.target.value }) }}>
                                                                                            {
                                                                                                option.groupBy.option.map((item, idx) => {
                                                                                                    if (item.value === undefined || item.value === null)
                                                                                                        return <option value={''} key={'toolbox_groupby_' + idx} disabled>{item.description}</option>;
                                                                                                    return <option value={item.value} key={'toolbox_groupby_' + idx}>{item.description}</option>;
                                                                                                })
                                                                                            }
                                                                                        </Input>
                                                                                        <i className="bx bx-chevron-down"></i>
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        // Date picker - Search
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                )
                                                                : (
                                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                                        ?
                                                                        // Date picker - Group By
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <DatePicker
                                                                                            className="form-control data-time-picker text-center"
                                                                                            selected={filters.date}
                                                                                            onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                            dateFormat="MM/yyyy"
                                                                                            fixedHeight
                                                                                            showMonthYearPicker
                                                                                        />
                                                                                        <i className="bx bx-calendar-week search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                        : (
                                                                            (option.export.isShow)
                                                                                ? (
                                                                                    // Date picker & Export
                                                                                    <>
                                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <DatePicker
                                                                                                        className="form-control data-time-picker text-center"
                                                                                                        selected={filters.date}
                                                                                                        onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                                        dateFormat="MM/yyyy"
                                                                                                        fixedHeight
                                                                                                        showMonthYearPicker
                                                                                                    />
                                                                                                    <i className="bx bx-calendar-week search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.export.handle() }}>
                                                                                                <i className="bx bx-cloud-download mr-1"></i> {props.t('Export')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    // Date picker
                                                                                    <>
                                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <DatePicker
                                                                                                        className="form-control data-time-picker text-center"
                                                                                                        selected={filters.date}
                                                                                                        onChange={dateTime => setFilters({ ...filters, date: dateTime })}
                                                                                                        dateFormat="MM/yyyy"
                                                                                                        fixedHeight
                                                                                                        showMonthYearPicker
                                                                                                    />
                                                                                                    <i className="bx bx-calendar-week search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => { option.datePicker.handle(filters) }}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                        )
                                                                )
                                                        )
                                                )
                                                : (
                                                    (option.add.isShow)
                                                        ? (
                                                            (option.search.isShow)
                                                                ? (
                                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                                        ?
                                                                        // Search - Group By - Add
                                                                        <>
                                                                            <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                <div className="search-box d-inline-block">
                                                                                    <div className="position-relative">
                                                                                        <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                        <i className="bx bx-search-alt search-icon"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                    {props.t('Filter')}
                                                                                </Button>
                                                                            </div>
                                                                            <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                    <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                        : (
                                                                            (option.import.isShow)
                                                                                ? (
                                                                                    // Search - Add - Import
                                                                                    <>
                                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                                <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <div className="mr-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-info font-weight-bold" onClick={() => { option.import.handle() }}>
                                                                                                <i className="bx bx-cloud-upload mr-1"></i> {props.t('Import')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    // Search - Add
                                                                                    <>
                                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                                <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                        )
                                                                )
                                                                : (
                                                                    (option.groupBy.isShow && option.groupBy.length > 1)
                                                                        ?
                                                                        // Group By - Add
                                                                        <div className="d-flex mr-3" style={{ marginLeft: 'auto' }}>
                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                            </Button>
                                                                        </div>
                                                                        :
                                                                        // Add
                                                                        <div className="d-flex mr-3" style={{ marginLeft: 'auto' }}>
                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.add.handle() }}>
                                                                                <i className="mdi mdi-plus mr-1"></i> {props.t('Add')}
                                                                            </Button>
                                                                        </div>
                                                                )
                                                        )
                                                        : (
                                                            (option.search.isShow)
                                                                ? (
                                                                    (option.groupBy.isShow && option.groupBy.option.length > 1)
                                                                        ? (
                                                                            (option.import.isShow)
                                                                                ? (
                                                                                    // Search - Group By - Import
                                                                                    <>
                                                                                        <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {
                                                                                            (option.groupBy.option.length > 1)
                                                                                                ?
                                                                                                <div className="ml-3" style={{ minWidth: '170px' }}>
                                                                                                    <Input type="select" className="form-control select-custom radius-30" value={filters.groupBy} onChange={(event) => { setFilters({ ...filters, groupBy: event.target.value }) }}>
                                                                                                        {
                                                                                                            option.groupBy.option.map((item, idx) => {
                                                                                                                if (item.value === undefined || item.value === null)
                                                                                                                    return <option value={''} key={'toolbox_groupby_' + idx} disabled>{item.description}</option>;
                                                                                                                return <option value={item.value} key={'toolbox_groupby_' + idx}>{item.description}</option>;
                                                                                                            })
                                                                                                        }
                                                                                                    </Input>
                                                                                                    <i className="bx bx-chevron-down"></i>
                                                                                                </div>
                                                                                                :
                                                                                                null
                                                                                        }
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <div className="d-flex mr-3" style={{ marginLeft: 'auto' }}>
                                                                                            <Button type="button" className="btn btn-rounded btn-success font-weight-bold" onClick={() => { option.import.handle() }}>
                                                                                                <i className="bx bx-cloud-upload mr-1"></i> {props.t('Import')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    // Search - Group By
                                                                                    <>
                                                                                        <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {
                                                                                            (option.groupBy.option.length > 1)
                                                                                                ?
                                                                                                <div className="ml-3" style={{ minWidth: '170px' }}>
                                                                                                    <Input type="select" className="form-control select-custom radius-30" value={filters.groupBy} onChange={(event) => { setFilters({ ...filters, groupBy: event.target.value }) }}>
                                                                                                        {
                                                                                                            option.groupBy.option.map((item, idx) => {
                                                                                                                if (item.value === undefined || item.value === null)
                                                                                                                    return <option value={''} key={'toolbox_groupby_' + idx} disabled>{item.description}</option>;
                                                                                                                return <option value={item.value} key={'toolbox_groupby_' + idx}>{item.description}</option>;
                                                                                                            })
                                                                                                        }
                                                                                                    </Input>
                                                                                                    <i className="bx bx-chevron-down"></i>
                                                                                                </div>
                                                                                                :
                                                                                                null
                                                                                        }
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-secondary font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                        )
                                                                        : (
                                                                            (option.import.isShow)
                                                                                ? (
                                                                                    // Search - Import
                                                                                    <>
                                                                                        <div className="ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="mr-2 btn btn-secondary btn-rounded font-weight-bold" onClick={() => option.search.handle(filters)}>
                                                                                                {props.t('Filter')}
                                                                                            </Button>
                                                                                        </div>
                                                                                        <div className="mr-3" style={{ marginLeft: 'auto' }}>
                                                                                            <Button type="button" className="btn btn-rounded btn-info font-weight-bold" onClick={() => { option.import.handle() }}>
                                                                                                <i className="bx bx-cloud-upload mr-1"></i> {props.t('Import')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    // Search
                                                                                    <>
                                                                                        <div className="d-flex ml-3" style={{ maxWidth: '120px' }}>
                                                                                            <div className="search-box d-inline-block">
                                                                                                <div className="position-relative">
                                                                                                    <Input type="text" className="form-control" value={filters.keyword} onChange={(event) => { setFilters({ ...filters, keyword: event.target.value }) }} />
                                                                                                    <i className="bx bx-search-alt search-icon"></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="ml-3">
                                                                                            <Button type="button" className="btn btn-rounded btn-info font-weight-bold" onClick={() => { option.search.handle(filters) }}>
                                                                                                {props.t('Search')}
                                                                                            </Button>
                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                        )
                                                                )
                                                                :
                                                                null
                                                        )
                                                )
                                        )
                                )
                    )
            }
        </Row>
    );
}

Toolbox.propTypes = {
    option: PropTypes.object.isRequired
}

export default Toolbox;
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
class DateRangePicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        // DatePicker is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value.
    }
    render() {
        if(this.props.proptype === 'start') {
            return ( <DatePicker
        ref={this.props.propsref}
        id={this.props.propsid}
        selected={this.props.selected}
        onChange={this.props.onChange}
        selectsStart
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        maxDate={this.props.maxDate}
        className="form-control"
        dateFormat="dd/MM/yyyy"
       placeholderText='DD/MM/YYYY'
       showMonthDropdown={true}
       showYearDropdown={true}
        showDisabledMonthNavigation
            />);
        }
        else if(this.props.proptype==='birth') {
            return (<DatePicker
                ref={this.props.propsref}
                id={this.props.propsid}
                selected={this.props.selected}
                showMonthDropdown={true}
                showYearDropdown={true}
                className="form-control"
                onChange={this.props.onChange}
                dateFormat="dd/MM/yyyy"
                placeholderText='DD/MM/YYYY'
            />);
        }
        else {
          return (<DatePicker
            ref={this.props.propsref}
            id={this.props.propsid}
            
            className="form-control"
            selected={this.props.selected}
            onChange={this.props.onChange}
            selectsEnd
            showMonthDropdown={true}
            showYearDropdown={true}
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            minDate={this.props.minDate}
            dateFormat="dd/MM/yyyy"
            placeholderText='DD/MM/YYYY'
            showDisabledMonthNavigation
            readOnly={this.props.readOnly}
           
       />);
        }
        
    }

}
export default DateRangePicker;
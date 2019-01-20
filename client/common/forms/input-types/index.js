import React from 'react';
import classNames from 'classnames';
import DropdownList from 'react-widgets/lib/DropdownList'
import SelectList from 'react-widgets/lib/SelectList'
import Multiselect from 'react-widgets/lib/Multiselect'

import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

Moment.locale('en')
momentLocalizer()

// export const renderInputRange = ({label, input, helperText, meta: {asyncValidating, touched, error}, ...custom}) => (
//     <div className={classNames({'async_validating': asyncValidating, 'form_item': true, 'invalid': touched && error, 'dirty': touched})}>
//
//         <div className="form_label">
//             <label>{label}</label>
//         </div>
//
//         <div className="form_input">
//             <InputRange minValue={input.minValue} />
//             <input {...input} {...custom} />
//             <span className="bottom_border"></span>
//         </div>
//
//         <div className="invalid_msg">
//             {error}
//         </div>
//
//         <div className={classNames({'helperText': true, 'active': helperText})}>
//             <span>{helperText}</span>
//         </div>
//
//     </div>
// );


// Textfield
export const renderTextField = ({label, input, helperText, meta: {asyncValidating, touched, error}, ...custom}) => (
    <div className={classNames({'async_validating': asyncValidating, 'form_item': true, 'invalid': touched && error, 'dirty': touched})}>

      <div className="form_label">
        <label>{label}</label>
      </div>

      <div className="form_input">
        <input {...input} {...custom} />
        <span className="bottom_border"></span>
      </div>

      <div className="invalid_msg">
        {error}
      </div>

      <div className={classNames({'helperText': true, 'active': helperText})}>
        <span>{helperText}</span>
      </div>
    </div>
);

// Textarea
export const renderTextarea = ({label, input, helperText, meta: {asyncValidating, touched, error}, ...custom}) => (
    <div className={classNames({'async_validating': asyncValidating, 'form_item': true, 'invalid': touched && error, 'dirty': touched})}>

      <div className="form_label">
        <label>{label}</label>
      </div>

      <div className="form_textarea">
        <textarea {...input} {...custom}></textarea>
        <span className="bottom_border"></span>
      </div>

      <div className="invalid_msg">
        {error}
      </div>

      <div className={classNames({'helperText': true, 'active': helperText})}>
        <span>{helperText}</span>
      </div>

    </div>
);


export const renderDropdownList = ({ input, label, data, valueField, textField, helperText, meta: {asyncValidating, touched, error}, ...custom}) => (
    <div className={classNames({'async_validating': asyncValidating, 'form_item': true, 'invalid': touched && error, 'dirty': touched})}>
        <div className="form_label">
            <label>{label}</label>
        </div>

        <div className="form_textarea">
            <DropdownList {...input}
                          data={data}
                          valueField={valueField}
                          textField={textField}
                          onChange={input.onChange} />
            <span className="bottom_border"></span>
        </div>

        <div className="invalid_msg">
            {error}
        </div>

        <div className={classNames({'helperText': true, 'active': helperText})}>
            <span>{helperText}</span>
        </div>

    </div>
);

export const renderMultiselect = ({ input, label, data, valueField, textField, helperText, meta: {asyncValidating, touched, error}, ...custom}) => (
    <div className={classNames({'async_validating': asyncValidating, 'form_item': true, 'invalid': touched && error, 'dirty': touched})}>
        <div className="form_label">
            <label>{label}</label>
        </div>
        <Multiselect {...input}
                     onBlur={() => input.onBlur()}
                     value={input.value || []} // requires value to be an array
                     data={data}
                     valueField={valueField}
                     textField={textField}
        />
        <div className="invalid_msg">
            {error}
        </div>

        <div className={classNames({'helperText': true, 'active': helperText})}>
            <span>{helperText}</span>
        </div>
    </div>

);

export const renderSelectList = ({ input, data }) =>
    <SelectList {...input}
                onBlur={() => input.onBlur()}
                data={data} />;

export const renderDateTimePicker = ({ input, showTime, dontShowDate, label, data, valueField, textField, helperText, meta: {asyncValidating, touched, error}, ...custom }) =>(
    <div className={classNames({'async_validating': asyncValidating, 'form_item': true, 'invalid': touched && error, 'dirty': touched})}>
        <div className="form_label">
            <label>{label}</label>
        </div>
        <DateTimePicker
            {...input}
            selected={input.value ? new Date(input.value) : null}
            format="DD MMM YYYY"
            time={false}
            {...custom}
        />
        <div className="invalid_msg">
            {error}
        </div>

        <div className={classNames({'helperText': true, 'active': helperText})}>
            <span>{helperText}</span>
        </div>
    </div>
)

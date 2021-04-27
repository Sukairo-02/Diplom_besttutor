import React from 'react';
import { useField } from 'formik';

const FormInput = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<label className='form__label' htmlFor={props.id || props.name}>
				{label}
			</label>
			<input className='form__input' {...field} {...props} />
			{meta.touched && meta.error ? (
				<span className='form__error'>{meta.error}</span>
			) : null}
		</>
	);
};

export default FormInput;

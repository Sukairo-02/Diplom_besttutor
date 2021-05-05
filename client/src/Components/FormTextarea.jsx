import React from 'react';
import { useField } from 'formik';

const FormTextarea = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<label className='form__label' htmlFor={props.id || props.name}>
				{label}
			</label>
			<textarea className='form__desc' {...field} {...props}></textarea>
			{meta.touched && meta.error ? (
				<span className='form__error'>{meta.error}</span>
			) : null}
		</>
	);
};

export default FormTextarea;

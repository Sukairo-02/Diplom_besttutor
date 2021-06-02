import { useField } from 'formik';

const FormCheckbox = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<label className='form__label' htmlFor={props.id || props.name}>
				{label}
			</label>
			<input
				type='checkbox'
				id={props.id || props.name}
				className='form__checkbox'
				{...field}
				{...props}
			/>
			{meta.touched && meta.error ? (
				<span className='form__error'>{meta.error}</span>
			) : null}
		</>
	);
};

export default FormCheckbox;

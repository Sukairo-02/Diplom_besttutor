import { useField } from 'formik';

const FormSelect = ({ label, ...props }) => {
	const [field, meta] = useField(props);
	return (
		<>
			<label className='form__label' htmlFor={props.id || props.name}>
				{label}
			</label>
			<select className='form__select' {...field} {...props} />
			{meta.touched && meta.error ? (
				<span className='form__error'>{meta.error}</span>
			) : null}
		</>
	);
};

export default FormSelect;

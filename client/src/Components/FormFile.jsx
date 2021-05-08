import React from 'react';
import { Edit } from '../assets/icons';

const FormFile = ({ setFieldValue, avatar }) => {
	const [file, setFile] = React.useState();
	const [img, setImage] = React.useState(avatar);

	React.useEffect(() => {
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
				setFieldValue('avatar', reader.result);
			};
			reader.readAsDataURL(file);
		}
	}, [file, setFieldValue]);

	const inputChangeHandler = (event) => {
		setFile(event.currentTarget.files[0]);
	};

	return (
		<>
			<input type='hidden' name='MAX_FILE_SIZE' value='5242880' />
			<input
				className='form__file'
				id='editAvatarInput'
				type='file'
				name='avatar'
				onChange={inputChangeHandler}
			/>
			<label htmlFor='editAvatarInput' className='form__drop-zone'>
				Загрузите или перетащите сюда фото
				{img ? <img src={img} alt='Аватар' className='form__img' /> : ''}
				<div className='form__edit'>
					<Edit />
				</div>
			</label>
		</>
	);
};

export default FormFile;

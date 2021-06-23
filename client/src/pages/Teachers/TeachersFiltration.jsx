import React from 'react';
import PropTypes from 'prop-types';

const TeachersFiltration = React.memo(
	({ subjects, filteringHandler, parametersItems, parametersHandler }) => {
		const setFilter = (event) => {
			filteringHandler(event.target.value);
		};

		const setParameter = (event) => {
			parametersHandler(event.target.value);
		};

		return (
			<div className='teachers__filtration'>
				<h3 className='form__title'>Фильтрация</h3>
				<form className='form'>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='filterSubjects'>
							Предмет
						</label>
						<select
							className='form__select'
							name='filtering'
							id='filterSubjects'
							onChange={setFilter}>
							<option value=''>Все</option>
							{subjects.length &&
								subjects.map((subject) => (
									<option key={subject._id} value={subject.name}>
										{subject.name}
									</option>
								))}
						</select>
					</fieldset>
					<fieldset className='form__fieldset'>
						<label className='form__label' htmlFor='filterParameters'>
							Параметры
						</label>
						<select
							className='form__select'
							name='parameters'
							id='filterParameters'
							onChange={setParameter}>
							<option value=''>Выбирите параметр</option>
							{parametersItems.map((item) => (
								<option key={item.value} value={item.value}>
									{item.name}
								</option>
							))}
						</select>
					</fieldset>
				</form>
			</div>
		);
	}
);

TeachersFiltration.propTypes = {
	subjects: PropTypes.array,
	filteringHandler: PropTypes.func,
	parametersItems: PropTypes.array,
	parametersHandler: PropTypes.func,
};

export default TeachersFiltration;

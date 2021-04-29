import React from 'react';

const Schedule = () => {
	return (
		<div className='schedule'>
			<div className='schedule__row'>
				<div className='schedule__empty'></div>
				<div className='schedule__day'>Пн</div>
				<div className='schedule__day'>Вт</div>
				<div className='schedule__day'>Ср</div>
				<div className='schedule__day'>Чт</div>
				<div className='schedule__day'>Пт</div>
				<div className='schedule__day'>Сб</div>
				<div className='schedule__day'>Вс</div>
			</div>
			<div className='schedule__row'>
				<div className='schedule__time'>6:00 - 7:00</div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
			</div>
			<div className='schedule__row'>
				<div className='schedule__time'>9:00 - 10:00</div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
			</div>
			<div className='schedule__row'>
				<div className='schedule__time'>12:30 - 13:30</div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
			</div>
			<div className='schedule__row'>
				<div className='schedule__time'>20:00 - 21:00</div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell'></div>
				<div className='schedule__cell schedule__cell--active'></div>
				<div className='schedule__cell schedule__cell--active'></div>
			</div>
		</div>
	);
};

export default Schedule;

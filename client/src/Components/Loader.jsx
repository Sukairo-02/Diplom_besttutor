import PropTypes from 'prop-types';

const Loader = ({ text }) => {
	return (
		<div className='loader'>
			<span className='loader__text'>{text}</span>
			<div className='loader-ellipsis'>
				<div className='loader-ellips'></div>
				<div className='loader-ellips'></div>
				<div className='loader-ellips'></div>
				<div className='loader-ellips'></div>
			</div>
		</div>
	);
};

Loader.propTypes = {
	text: PropTypes.string,
};

export default Loader;

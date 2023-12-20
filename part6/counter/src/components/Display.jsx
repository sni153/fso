import PropTypes from 'prop-types'

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}

Display.propTypes = {
  counter: PropTypes.number.isRequired
}

export default Display
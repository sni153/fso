import { setFilter } from '../reducers/filterReducer'; // Importing the action creator responsible for setting the filter value
import { useDispatch } from 'react-redux'; // Importing the hook to dispatch actions

const Filter = () => {
  const dispatch = useDispatch(); // Creating a dispatcher to dispatch actions

  // Handling the change in the input field and dispatching the setFilter action with the new value
  const handleChange = (event) => {
    dispatch(setFilter(event.target.value)); // Dispatching the action with the input value as payload
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange}/> {/* Input field for filter value with onChange handler */}
    </div>
  )
}

export default Filter;

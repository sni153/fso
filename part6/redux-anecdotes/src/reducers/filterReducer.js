// This function manages the part of our application's state that's responsible for filtering things.
// If we're showing a list of things and want to see only specific ones, this reducer handles that job.
const filterReducer = (state = '', action) => {
  // Here, we're checking what kind of action is happening. An action is like a message that tells the reducer what to do.
  switch (action.type) {
    // If the action type is 'SET_FILTER', it means we want to change the filter value.
    case 'SET_FILTER':
      // When we change the filter, we update the state (the part of the app that keeps track of the filter value) with the new filter we got from the action.
      return action.payload; // This updates the filter value in our state with the new value.
    default:
      return state; // If the action type doesn't match, we just keep the current state as it is.
  }
}

// This function is used when we want to create an action to set or change the filter value.
// It's like creating a note to ourselves about what kind of filter we want to apply to the list of things we're looking at.
export const setFilter = content => {
  // Here, we're making a note (an action) with a special label ('SET_FILTER') that means we want to change the filter.
  // We're also attaching some information (payload) about what the new filter should be.
  return {
    type: 'SET_FILTER', // This label tells the filterReducer function what we want to do.
    payload: content,   // This carries the new filter information we want to set in the state.
  }
}

export default filterReducer;

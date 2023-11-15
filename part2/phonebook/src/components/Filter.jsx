/* eslint-disable react/prop-types */
const Filter = ({ formData, handleSearch }) => {
  return (
    <div>
      filter shown with{" "}
      <input value={formData.search} onChange={handleSearch}></input>
    </div>
  );
};

export default Filter;

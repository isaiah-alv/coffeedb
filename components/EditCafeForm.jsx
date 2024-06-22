export const EditCafeForm = () => {
   return (
      <form className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md max-w-lg m-auto">
  <div className="flex flex-col">
    <input
      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
      type="text"
      placeholder="Enter café name..."
      required
    />
  </div>
  
  <div className="flex flex-col">
    <label htmlFor="coffee-rating" className="mb-1 text-gray-700">Coffee Rating (1-10)</label>
    <input
      className="appearance-none bg-gray-200 h-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      type="range"
      id="coffee-rating"
      name="coffee-rating"
      min="1"
      max="10"
      defaultValue="5"
    />
    <label htmlFor="atmosphere-rating" className="mb-1 text-gray-700">Cafe Atmosphere Rating (1-10)</label>
    <input
      className="appearance-none bg-gray-200 h-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      type="range"
      id="atmosphere-rating"
      name="atmosphere-rating"
      min="1"
      max="10"
      defaultValue="5"
    />
  </div>
  
  <div className="flex flex-col">
    <label htmlFor="street-address" className="mb-1 text-gray-700">Street Address</label>
    <input
      type="text"
      id="street-address"
      name="street-address"
      autoComplete="street-address"
      required
      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
      placeholder="1234 Main St"
      enterKeyHint="next"
    />
  </div>
  
  <div className="flex flex-col">
    <label htmlFor="postal-code" className="mb-1 text-gray-700">ZIP or Postal Code (optional)</label>
    <input
      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
      id="postal-code"
      name="postal-code"
      autoComplete="postal-code"
      enterKeyHint="next"
    />
  </div>
  
  <div className="flex flex-col">
    <label htmlFor="city" className="mb-1 text-gray-700">City</label>
    <input
      required
      type="text"
      id="city"
      name="city"
      autoComplete="address-level2"
      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
      placeholder="City"
      enterKeyHint="next"
    />
  </div>
  
  <div className="flex flex-col">
    <label htmlFor="country" className="mb-1 text-gray-700">Country or Region</label>
    <select
      id="country"
      name="country"
      autoComplete="country"
      required
      className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
      enterKeyHint="done"
    >
      {/* Options for countries */}
      <option value="USA">United States</option>
      {/* Add more options as needed */}
    </select>
  </div>
  
  <button
    type="submit"
    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
     Edit
  </button>
</form>
   )
}
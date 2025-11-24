const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-gray-400 text-xs font-bold mb-1 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      className="appearance-none block w-full bg-gray-800 text-white border border-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-gray-700 focus:border-blue-500 transition-colors"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

export default InputField;
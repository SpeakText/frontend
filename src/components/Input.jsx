export default function Input({ label, name, value, onChange, type = 'text' }) {
    return (
      <div>
        <label className="block text-sm font-medium">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    )
  }
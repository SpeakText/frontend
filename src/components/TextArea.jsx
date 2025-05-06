export default function TextArea({ label, name, value, onChange }) {
    return (
      <div>
        <label className="block text-sm font-medium">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    )
  }
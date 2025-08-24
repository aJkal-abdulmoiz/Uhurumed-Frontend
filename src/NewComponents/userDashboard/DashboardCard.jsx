import { useState } from 'react';

export default function DashboardCard({
  title,
  data,
  columns,
  type = 'table',
  headerRightContent,
  checkboxProps,
  buttonProps,
  emptyMessage,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusColors = {
    SCHEDULED: 'bg-cyan-100 text-cyan-700',
    PENDING: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    Unpaid: 'bg-red-100 text-red-700',
    Paid: 'bg-green-100 text-green-700',
    Unread: 'bg-red-100 text-red-700',
    Read: 'bg-green-100 text-green-700',
    'View Result': 'bg-[#00AAEE] text-white',
  };

  // Render different card types
  const renderCardContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">{emptyMessage || 'No data available'}</p>
        </div>
      );
    }

    switch (type) {
    case 'insurance':
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
            <input
              type="checkbox"
              id="covered"
              checked={checkboxProps?.checked}
              onChange={checkboxProps?.onChange}
              className="
                  appearance-none h-5 w-5 border border-[#0000004D] rounded-sm bg-white
                  checked:bg-[#00AAEE] checked:border-[#00AAEE] focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:ring-offset-2
                  relative cursor-pointer
                "
              style={{
                backgroundImage: checkboxProps?.checked
                  ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                  : 'none',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <label htmlFor="covered" className="text-sm font-medium leading-none text-gray-800">
              {checkboxProps?.label}
            </label>
          </div>
          {data.map((item, index) => (
            <p key={index} className="text-sm text-gray-700">
              {item.label}: <span className="font-semibold">{item.value}</span>
            </p>
          ))}
          <button className="bg-[#00AAEE] hover:bg-[#0099DD] text-white text-sm px-4 py-2 rounded-full shadow-sm">
            {buttonProps?.label}
          </button>
        </div>
      );

    case 'table':
    default:
      return (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-50 rounded-lg">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-4 py-2 font-medium text-gray-600 ${
                        index === 0 ? 'rounded-l-lg' : index === columns.length - 1 ? 'rounded-r-lg text-center' : ''
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                    {Object.keys(row).map((key, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-3 ${cellIndex === 0 ? 'font-medium text-gray-800' : 'text-gray-700'} ${
                          cellIndex === Object.keys(row).length - 1 ? 'text-center' : ''
                        }`}
                      >
                        {key === 'status' ? (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[row[key]] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {row[key]}
                          </span>
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {data.map((row, rowIndex) => (
              <div key={rowIndex} className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{row[Object.keys(row)[0]]}</h3>
                  {row.status && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[row.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {row.status}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {Object.keys(row)
                    .slice(1)
                    .map((key, index) => {
                      if (key === 'status') return null;

                      return (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-gray-900 font-medium">{row[key]}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-[#0000004D]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {headerRightContent && (
          <div className="relative">
            {headerRightContent.dropdown ? (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 text-gray-600 text-sm px-3 py-1 rounded-md border border-gray-300 bg-transparent hover:bg-gray-50 focus:outline-none"
                >
                  <span>{headerRightContent.label}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {headerRightContent.options.map((option, index) => (
                      <button
                        key={index}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          headerRightContent.onSelect(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              headerRightContent
            )}
          </div>
        )}
      </div>
      {renderCardContent()}
    </div>
  );
}
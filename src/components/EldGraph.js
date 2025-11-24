export default function ELDLogGraph({ dayLog, dayIndex }) {
  const width = 600;
  const height = 150;
  const pad = 40;
  const gridW = width - pad * 2;
  const gridH = height - pad;
  const rowH = gridH / 4;

  const yPos = {
    "OFF": pad + rowH * 0.5,
    "SB": pad + rowH * 1.5,
    "D": pad + rowH * 2.5,
    "ON": pad + rowH * 3.5,
  };

  const getX = (minutes) => pad + (minutes / 1440) * gridW;

  let pathD = "";
  let lastX = getX(0);
  let lastY = yPos[dayLog.entries[0]?.status || "OFF"];

  dayLog.entries.forEach((entry, i) => {
    const startX = getX(entry.startMinute);
    const endX = getX(entry.endMinute);
    const currentY = yPos[entry.status];

    if (i === 0) {
      pathD += `M ${startX} ${currentY} `;
    } else {
      pathD += `L ${startX} ${lastY} L ${startX} ${currentY} `;
    }

    pathD += `L ${endX} ${currentY} `;
    
    lastX = endX;
    lastY = currentY;
  });

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200 overflow-x-auto">
      <div className="flex justify-between mb-2 border-b pb-2">
        <h3 className="font-bold text-gray-800">Day {dayIndex + 1} - {dayLog.date}</h3>
        <div className="text-xs text-gray-500">Total Distance: {Math.round(dayLog.miles)} mi</div>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {[0, 1, 2, 3, 4].map(i => (
           <line key={i} x1={pad} y1={pad + i * rowH} x2={width - pad} y2={pad + i * rowH} stroke="#e5e7eb" strokeWidth="1" />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <g key={i}>
            <line x1={getX(i * 60)} y1={pad} x2={getX(i * 60)} y2={height} stroke="#e5e7eb" strokeWidth="1" />
            <text x={getX(i * 60)} y={pad - 10} textAnchor="middle" fontSize="10" fill="#9ca3af">{i}</text>
          </g>
        ))}
        
        <text x={10} y={yPos.OFF + 4} fontSize="10" fontWeight="bold" fill="#374151">OFF</text>
        <text x={10} y={yPos.SB + 4} fontSize="10" fontWeight="bold" fill="#374151">SB</text>
        <text x={10} y={yPos.D + 4} fontSize="10" fontWeight="bold" fill="#374151">D</text>
        <text x={10} y={yPos.ON + 4} fontSize="10" fontWeight="bold" fill="#374151">ON</text>

        <path d={pathD} stroke="#2563eb" strokeWidth="3" fill="none" />
      </svg>
      
      <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-gray-600">
        {dayLog.entries.map((entry, i) => (
          entry.duration > 0 && (
            <div key={i} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${entry.status === 'D' ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
              <span>{entry.status}: {Math.floor(entry.duration / 60)}h {entry.duration % 60}m ({entry.note})</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};
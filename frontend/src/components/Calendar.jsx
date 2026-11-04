
function Calendar({ selectedDate, onDateChange }) {
  
  const selected = new Date(`${selectedDate}T00:00:00`);

 
  const startOfWeek = new Date(selected);
  startOfWeek.setDate(selected.getDate() - selected.getDay());

 
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate().toString().padStart(2, "0"),
      fullDate: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
    };
  });

  return (
    <div className="calendar">
      {days.map((item) => (
        <div
          key={item.fullDate}
          className={`calendar-day ${
            item.fullDate === selectedDate ? "active" : ""
          }`}
          onClick={() => onDateChange(item.fullDate)}
        >
          <span>{item.day}</span>

          <strong>{item.date}</strong>

          {item.fullDate === selectedDate && (
            <span className="calendar-dot">•</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default Calendar;

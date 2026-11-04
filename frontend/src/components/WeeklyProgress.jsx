
function WeeklyProgress({ progress }) {
  return (
    <div className="weekly-progress">
      <h3>Weekly Progress</h3>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p>{progress}% completed this week</p>
    </div>
  );
}

export default WeeklyProgress;

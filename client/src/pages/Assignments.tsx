import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const Assignments = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { assignments, assignmentMetrics, fetchAssignments } = context;

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Assignments</h1>

      {assignmentMetrics && (
        <div className="mb-4">
          <p>Total Assigned: {assignmentMetrics.totalAssigned}</p>
          <p>Success Rate: {assignmentMetrics.successRate.toFixed(2)}%</p>
          <p>Average Time: {assignmentMetrics.averageTime.toFixed(2)} mins</p>
        </div>
      )}

      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.orderId} className="border-b p-2">
            Order: {assignment.orderId} → Partner: {assignment.partnerId} → Status: {assignment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;

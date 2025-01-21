"use client"
import { useOperations } from "@/hooks/useOperations";


const OperationsPage: React.FC = () => {
  const { operations, loading, error } = useOperations();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Operations</h1>
      <ul>
        {operations.map((operation) => (
          <li key={operation.id}>
            <strong>{operation.label}</strong>: {operation.amount} on {operation.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperationsPage;

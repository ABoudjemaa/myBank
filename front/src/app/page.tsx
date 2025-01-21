"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Operation {
  id: number;
  label: string; // Adjusted to match the response structure
  amount: number;
  date: string;
  category: string; // Assuming category is a string for now
}

const MyComponent: React.FC = () => {
  const [data, setData] = useState<Operation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/operations');
        
        // Extract the 'member' array from the response data
        const operations = response.data.member;

        // Ensure that 'operations' is an array
        if (Array.isArray(operations)) {
          setData(operations);
        } else {
          throw new Error('Response data is not an array');
        }
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Operations</h1>
      <ul>
        {data.map((operation) => (
          <li key={operation.id}>
            <strong>label : {operation.label}</strong><br />
            : {operation.amount} on {operation.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;

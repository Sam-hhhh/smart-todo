import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { RootState } from '../store';
import '../styles/TaskStatistics.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const TaskStatistics: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const categories = useSelector((state: RootState) => state.categories.categories);

  // 计算每个分类的待办事项数量
  const categoryStats = categories.map(category => {
    const taskCount = tasks.filter(task => task.categoryId === category.id).length;
    return {
      name: category.name,
      value: taskCount
    };
  });

  // 计算未分类的待办事项数量
  const uncategorizedCount = tasks.filter(task => !task.categoryId).length;
  if (uncategorizedCount > 0) {
    categoryStats.push({
      name: '未分类',
      value: uncategorizedCount
    });
  }

  return (
    <div className="task-statistics">
      <h3>待办事项分类统计</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskStatistics; 
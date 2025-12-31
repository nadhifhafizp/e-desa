'use client'; // Wajib untuk Chart.js

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function GenderChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.value),
      backgroundColor: ['#3b82f6', '#ec4899'], // Biru & Pink
    }]
  };
  return <Pie data={chartData} />;
}

export function JobChart({ data }: { data: any[] }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label: 'Jumlah Warga',
      data: data.map(d => d.value),
      backgroundColor: '#22c55e',
    }]
  };
  return <Bar options={{ responsive: true }} data={chartData} />;
}
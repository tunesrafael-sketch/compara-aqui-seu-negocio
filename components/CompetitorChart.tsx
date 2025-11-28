import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Competitor } from '../types';

interface CompetitorChartProps {
  competitors: Competitor[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-[#CCCCCC] shadow-lg rounded-lg text-sm">
        <p className="font-bold text-[#333333] mb-1">{data.fullName}</p>
        <div className="space-y-1">
          <p className="text-[#005EB8] font-semibold flex items-center gap-1">
            <span>{data.rating}</span> 
            <span>⭐</span> 
            <span className="text-[#666666] font-normal ml-1">Nota Média</span>
          </p>
          {data.reviews !== undefined && data.reviews > 0 ? (
            <p className="text-[#333333] flex items-center gap-1">
              <span className="font-semibold">{data.reviews}</span>
              <span className="text-[#666666]">avaliações</span>
            </p>
          ) : (
            <p className="text-[#666666] text-xs italic">Sem dados de avaliações</p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const CompetitorChart: React.FC<CompetitorChartProps> = ({ competitors }) => {
  // Filter out invalid competitors for the chart
  const data = competitors
    .filter(c => c.rating > 0)
    .map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      fullName: c.name,
      rating: c.rating,
      reviews: c.reviews || 0
    }))
    .sort((a, b) => b.rating - a.rating);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#F5F5F5] rounded-lg border-2 border-dashed border-[#CCCCCC] text-[#666666] font-medium">
        Nenhum dado de avaliação numérico disponível para gráfico.
      </div>
    );
  }

  // Sebrae Palette Colors logic
  const getColor = (rating: number) => {
      if (rating >= 4.5) return '#00A859'; // Verde Sebrae
      if (rating >= 4.0) return '#005EB8'; // Azul Sebrae
      return '#FFB800'; // Amarelo/Dourado Sebrae
  };

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow-sm border border-[#CCCCCC]">
      <h3 className="text-lg font-bold text-[#333333] mb-4">Comparativo de Avaliações (0-5)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#CCCCCC" />
          <XAxis type="number" domain={[0, 5]} hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120} 
            tick={{ fontSize: 12, fill: '#333333', fontWeight: 600 }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F5F5' }} />
          <Bar dataKey="rating" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.rating)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompetitorChart;
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import Text from '@/components/atoms/Text';
import { format, subDays, startOfDay } from 'date-fns';

const ProgressChart = ({ moodData = [], className = '' }) => {
  const chartData = useMemo(() => {
    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date,
        dateStr: format(date, 'yyyy-MM-dd'),
        dayLabel: format(date, 'EEE'),
        mood: null,
        intensity: 0
      };
    });

    // Map mood data to days
    moodData.forEach(mood => {
      const moodDate = format(startOfDay(new Date(mood.timestamp)), 'yyyy-MM-dd');
      const dayIndex = last7Days.findIndex(day => day.dateStr === moodDate);
      if (dayIndex !== -1) {
        last7Days[dayIndex].mood = mood.emotion;
        last7Days[dayIndex].intensity = mood.intensity;
      }
    });

    return last7Days;
  }, [moodData]);

  const maxIntensity = 10;
  const chartHeight = 200;

  const getMoodColor = (emotion) => {
    const colors = {
      happy: '#F59E0B',
      calm: '#3B82F6',
      grateful: '#EC4899',
      anxious: '#F97316',
      stressed: '#EF4444',
      sad: '#6B7280'
    };
    return colors[emotion] || '#9CA3AF';
  };

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <Text variant="h4" className="mb-6">Mood Trends</Text>
      
      <div className="relative">
        {/* Chart Area */}
        <div className="relative h-48 border-l-2 border-b-2 border-gray-200">
          {/* Y-axis labels */}
          <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            {[10, 8, 6, 4, 2, 0].map(value => (
              <span key={value}>{value}</span>
            ))}
          </div>

          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map(value => (
            <div
              key={value}
              className="absolute w-full border-t border-gray-100"
              style={{ bottom: `${(value / maxIntensity) * 100}%` }}
            />
          ))}

          {/* Data points and line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Connection lines */}
            {chartData.map((day, index) => {
              if (index === 0 || !day.mood || !chartData[index - 1].mood) return null;
              
              const prevDay = chartData[index - 1];
              const x1 = ((index - 1) / (chartData.length - 1)) * 100;
              const y1 = 100 - (prevDay.intensity / maxIntensity) * 100;
              const x2 = (index / (chartData.length - 1)) * 100;
              const y2 = 100 - (day.intensity / maxIntensity) * 100;

              return (
                <motion.line
                  key={`line-${index}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={getMoodColor(day.mood)}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Data points */}
            {chartData.map((day, index) => {
              if (!day.mood) return null;

              const x = (index / (chartData.length - 1)) * 100;
              const y = 100 - (day.intensity / maxIntensity) * 100;

              return (
                <motion.g key={`point-${index}`}>
                  <motion.circle
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="6"
                    fill={getMoodColor(day.mood)}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ 
                      delay: index * 0.1 + 0.5, 
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="6"
                    fill="none"
                    stroke={getMoodColor(day.mood)}
                    strokeWidth="1"
                    opacity="0.5"
                  />
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-4 px-2">
          {chartData.map((day, index) => (
            <div key={index} className="text-center">
              <Text size="xs" color="muted">
                {day.dayLabel}
              </Text>
              {day.mood && (
                <div
                  className="w-3 h-3 rounded-full mx-auto mt-1"
                  style={{ backgroundColor: getMoodColor(day.mood) }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {Object.entries({
          happy: 'Happy',
          calm: 'Calm', 
          grateful: 'Grateful',
          anxious: 'Anxious',
          stressed: 'Stressed',
          sad: 'Sad'
        }).map(([emotion, label]) => (
          <div key={emotion} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getMoodColor(emotion) }}
            />
            <Text size="xs" color="muted">{label}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
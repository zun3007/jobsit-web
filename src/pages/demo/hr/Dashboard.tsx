import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export default function DemoHRDashboard() {
  // Mock job statistics
  const jobStats = {
    total: 12,
    open: 3,
    closed: 9,
  };

  const pieData = [
    { name: 'Tin đã đóng', value: 75, color: '#86efac' },
    { name: 'Tin đang mở', value: 25, color: '#fcd34d' },
  ];

  // Mock position statistics
  const positionStats = [
    {
      id: 1,
      position: 'Business Analyst',
      icon: '🏆',
      jobs: 52,
      applicants: 152,
    },
    { id: 2, position: 'Data Analyst', icon: '🥈', jobs: 44, applicants: 140 },
    { id: 3, position: 'Tester', icon: '🥉', jobs: 31, applicants: 126 },
    { id: 4, position: 'Front end', jobs: 26, applicants: 115 },
    { id: 5, position: 'Back end', jobs: 25, applicants: 109 },
    { id: 6, position: 'Flutter', jobs: 21, applicants: 65 },
    { id: 7, position: 'Mobile', jobs: 17, applicants: 54 },
    { id: 8, position: 'Embedded', jobs: 14, applicants: 32 },
  ];

  // Mock monthly data for trend chart
  const monthlyData = [
    { month: 'T1', jobPostings: 12, applications: 150 },
    { month: 'T2', jobPostings: 15, applications: 180 },
    { month: 'T3', jobPostings: 10, applications: 120 },
    { month: 'T4', jobPostings: 18, applications: 200 },
    { month: 'T5', jobPostings: 14, applications: 170 },
    { month: 'T6', jobPostings: 16, applications: 190 },
    { month: 'T7', jobPostings: 20, applications: 220 },
    { month: 'T8', jobPostings: 18, applications: 210 },
    { month: 'T9', jobPostings: 22, applications: 240 },
    { month: 'T10', jobPostings: 25, applications: 280 },
    { month: 'T11', jobPostings: 30, applications: 320 },
    { month: 'T12', jobPostings: 35, applications: 400 },
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left column - Job statistics */}
        <div className='bg-white rounded-lg p-6'>
          <h2 className='text-lg font-semibold border-b-2 border-yellow-400 pb-2 inline-block mb-6'>
            Tin tuyển dụng
          </h2>

          <div className='flex'>
            {/* Job stats cards */}
            <div className='w-1/2 pr-4 flex flex-col gap-4'>
              <div
                className='bg-white rounded-lg shadow-md p-5 text-center relative'
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <div className='text-3xl font-bold text-gray-800'>
                  {jobStats.total}
                </div>
                <div className='text-sm text-gray-500 mt-1'>
                  Tổng số tin đăng
                </div>
              </div>

              <div
                className='bg-white rounded-lg shadow-md p-5 text-center relative'
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <div className='text-3xl font-bold text-gray-800'>
                  {jobStats.open}
                </div>
                <div className='text-sm text-gray-500 mt-1'>Tin đang mở</div>
              </div>

              <div
                className='bg-white rounded-lg shadow-md p-5 text-center relative'
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <div className='text-3xl font-bold text-gray-800'>
                  {jobStats.closed}
                </div>
                <div className='text-sm text-gray-500 mt-1'>Tin đã đóng</div>
              </div>
            </div>

            {/* Pie chart */}
            <div className='w-1/2 flex flex-col'>
              <div className='relative w-full h-48 flex-grow'>
                <PieChart width={200} height={200}>
                  <Pie
                    data={pieData}
                    cx={100}
                    cy={100}
                    innerRadius={35}
                    outerRadius={60}
                    dataKey='value'
                    startAngle={90}
                    endAngle={-270}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      // Calculate position for 75% label
                      if (value === 75) {
                        const radius = (innerRadius + outerRadius) / 2;
                        const x = cx + radius * Math.cos(-Math.PI * 0.5);
                        const y = cy + radius * Math.sin(-Math.PI * 0.5);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill='#000'
                            textAnchor='middle'
                            dominantBaseline='middle'
                            fontSize={14}
                          >
                            {`${value}%`}
                          </text>
                        );
                      }
                      // Calculate position for 25% label
                      if (value === 25) {
                        const radius = (innerRadius + outerRadius) / 2;
                        const x = cx + radius * Math.cos(-Math.PI * 0);
                        const y = cy + radius * Math.sin(-Math.PI * 0);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill='#000'
                            textAnchor='middle'
                            dominantBaseline='middle'
                            fontSize={14}
                          >
                            {`${value}%`}
                          </text>
                        );
                      }
                      return null;
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className='absolute right-0 bottom-0 text-sm'>
                  <div className='flex items-center mb-1'>
                    <div className='w-3 h-3 bg-[#fcd34d] mr-1 rounded-sm'></div>
                    <span className='text-sm'>Tin đang mở</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-[#86efac] mr-1 rounded-sm'></div>
                    <span className='text-sm'>Tin đã đóng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column - Trend chart */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-4 border-b'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-semibold border-b-2 border-yellow-400 pb-2 inline-block'>
                Tin đăng mới & lượt ứng tuyển
              </h2>
              <div className='bg-gray-50 rounded-md px-3 py-1 text-sm border border-gray-200 flex items-center cursor-pointer hover:bg-gray-100'>
                <span>Tháng</span>
                <span className='ml-2'>▼</span>
              </div>
            </div>
          </div>

          {/* Chart container */}
          <div className='p-4'>
            <div className='relative h-[378px]'>
              <div className='absolute top-0 left-8 text-xs text-gray-400'>
                40
              </div>
              <div className='absolute top-[20%] left-8 text-xs text-gray-400'>
                35
              </div>
              <div className='absolute top-[40%] left-8 text-xs text-gray-400'>
                30
              </div>
              <div className='absolute top-[60%] left-8 text-xs text-gray-400'>
                20
              </div>
              <div className='absolute top-[80%] left-8 text-xs text-gray-400'>
                10
              </div>

              <div className='absolute top-0 right-8 text-xs text-gray-400'>
                400
              </div>
              <div className='absolute top-[20%] right-8 text-xs text-gray-400'>
                350
              </div>
              <div className='absolute top-[40%] right-8 text-xs text-gray-400'>
                300
              </div>
              <div className='absolute top-[60%] right-8 text-xs text-gray-400'>
                150
              </div>
              <div className='absolute top-[80%] right-8 text-xs text-gray-400'>
                50
              </div>

              <div className='absolute top-0 left-12 right-12 bottom-8 border-b border-l border-gray-200'>
                {/* Chart grid lines */}
                <div className='absolute inset-0 flex flex-col justify-between pointer-events-none'>
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <div
                      key={i}
                      className='border-t border-gray-100 w-full h-0'
                    ></div>
                  ))}
                </div>

                {/* Chart data */}
                <div className='absolute inset-0 flex items-end pt-4'>
                  {monthlyData.map((data, index) => (
                    <div
                      key={index}
                      className='flex-1 flex flex-col items-center'
                      style={{ height: '100%' }}
                    >
                      {/* Bar for job postings */}
                      <div
                        className='w-5 bg-yellow-200 rounded-t-sm'
                        style={{ height: `${(data.jobPostings / 40) * 100}%` }}
                      ></div>

                      {/* X-axis label */}
                      <div className='absolute bottom-[-24px] text-xs text-gray-500'>
                        {data.month}
                      </div>
                    </div>
                  ))}

                  {/* Line connecting application points */}
                  <svg className='absolute inset-0 pointer-events-none'>
                    <polyline
                      points='10,180 35,160 60,170 85,150 110,160 135,155 160,145 185,150 210,140 235,130 260,120 285,100'
                      fill='none'
                      stroke='#EAB308'
                      strokeWidth='2'
                    />
                    {monthlyData.map((data, index) => {
                      const x = 10 + index * 25;
                      const y = 180 - (data.applications / 400) * 180;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r='3'
                          fill='#EAB308'
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Bottom labels */}
              <div className='absolute bottom-0 left-12 right-12 flex justify-between'>
                <div className='flex items-center text-xs text-gray-500'>
                  <span>Tin đăng mới</span>
                  <div className='w-8 h-3 bg-yellow-200 ml-2'></div>
                </div>
                <div className='flex items-center text-xs text-gray-500'>
                  <div className='w-3 h-3 bg-yellow-500 rounded-full mr-1'></div>
                  <span>Lượt ứng tuyển</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Position statistics */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-4 border-b'>
            <h2 className='text-lg font-semibold border-b-2 border-yellow-400 pb-2 inline-block'>
              Thống kê
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-white'>
                <tr className='border-b'>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    STT
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Vị trí làm việc
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Bài đăng
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ứng viên
                  </th>
                </tr>
              </thead>
              <tbody>
                {positionStats.map((stat, index) => (
                  <tr
                    key={stat.id}
                    className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          {stat.position}
                        </span>
                        {stat.icon && <span className='ml-2'>{stat.icon}</span>}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {stat.jobs}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {stat.applicants}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='absolute right-6 top-4 flex justify-end'>
            <button
              className='text-gray-400 hover:text-gray-600'
              aria-label='Tùy chọn thêm'
              title='Tùy chọn thêm'
            >
              <svg
                width='18'
                height='18'
                viewBox='0 0 18 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M9 9.75C9.41421 9.75 9.75 9.41421 9.75 9C9.75 8.58579 9.41421 8.25 9 8.25C8.58579 8.25 8.25 8.58579 8.25 9C8.25 9.41421 8.58579 9.75 9 9.75Z'
                  fill='currentColor'
                />
                <path
                  d='M9 4.5C9.41421 4.5 9.75 4.16421 9.75 3.75C9.75 3.33579 9.41421 3 9 3C8.58579 3 8.25 3.33579 8.25 3.75C8.25 4.16421 8.58579 4.5 9 4.5Z'
                  fill='currentColor'
                />
                <path
                  d='M9 15C9.41421 15 9.75 14.6642 9.75 14.25C9.75 13.8358 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.8358 8.25 14.25C8.25 14.6642 8.58579 15 9 15Z'
                  fill='currentColor'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

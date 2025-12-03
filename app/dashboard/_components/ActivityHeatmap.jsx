"use client";
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import moment from 'moment';

function ActivityHeatmap({ interviewList }) {

    // Transform interviewList to heatmap data
    // Expected format: { date: '2023-01-01', count: 1 }

    const activityMap = {};

    interviewList?.forEach(interview => {
        // Assuming createdAt is a string date or timestamp
        const date = moment(interview.createdAt, "DD-MM-YYYY").format('YYYY-MM-DD');
        if (date !== 'Invalid date') {
            activityMap[date] = (activityMap[date] || 0) + 1;
        }
    });

    const heatmapData = Object.keys(activityMap).map(date => ({
        date: date,
        count: activityMap[date]
    }));

    // Fill in some dummy data for demonstration if empty
    if (heatmapData.length === 0) {
        const today = moment().format('YYYY-MM-DD');
        heatmapData.push({ date: today, count: 1 });
    }

    return (
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                    <span className="text-lg">🔥</span>
                </div>
                <h2 className="font-bold text-gray-800">Activity Streak</h2>
            </div>
            <div className="w-full h-full flex items-center justify-center">
                <CalendarHeatmap
                    startDate={moment().subtract(6, 'months').toDate()}
                    endDate={moment().toDate()}
                    values={heatmapData}
                    gutterSize={2}
                    classForValue={(value) => {
                        if (!value) {
                            return 'color-empty';
                        }
                        return `color-scale-${Math.min(value.count, 4)}`;
                    }}
                    tooltipDataAttrs={value => {
                        return {
                            'data-tip': `${value.date} has count: ${value.count}`,
                        };
                    }}
                    showWeekdayLabels={true}
                />
                {/* Custom Styles for Heatmap Colors */}
                <style jsx global>{`
                .react-calendar-heatmap .color-empty { fill: #f3f4f6; rx: 4; }
                .react-calendar-heatmap .color-scale-1 { fill: #dcfce7; rx: 4; }
                .react-calendar-heatmap .color-scale-2 { fill: #86efac; rx: 4; }
                .react-calendar-heatmap .color-scale-3 { fill: #4ade80; rx: 4; }
                .react-calendar-heatmap .color-scale-4 { fill: #22c55e; rx: 4; }
                .react-calendar-heatmap text { font-size: 10px; fill: #9ca3af; }
                .react-calendar-heatmap rect { stroke: #fff; stroke-width: 2px; }
            `}</style>
            </div>
        </div>
    );
}

export default ActivityHeatmap;

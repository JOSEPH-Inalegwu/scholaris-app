import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiClock, FiEdit3, FiSave } from 'react-icons/fi';
import { useStudyPlan } from './StudyPlanContext';
import { usePersistentState } from '../../Hooks/usePersistentState';

const ScheduleView = ({ onSave, onBack }) => {
  const { state } = useStudyPlan();

  const flattenSchedule = (nestedSchedule) => {
    if (!nestedSchedule) return [];
    const flat = [];
    nestedSchedule.forEach(dayBlock => {
      dayBlock.timeBlocks.forEach(block => {
        flat.push({
          day: dayBlock.day,
          time: block.time,
          subject: block.subject,
          task: block.task,
          break: block.break
        });
      });
    });
    return flat;
  };

  const nestSchedule = (flatSchedule) => {
    const daysMap = {};
    flatSchedule.forEach(item => {
      if (!daysMap[item.day]) {
        daysMap[item.day] = { day: item.day, timeBlocks: [] };
      }
      daysMap[item.day].timeBlocks.push({
        time: item.time,
        subject: item.subject,
        task: item.task,
        break: item.break
      });
    });
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return weekDays.map(day => daysMap[day] || { day, timeBlocks: [] });
  };

  // persistent state
  const [schedule, setSchedule] = usePersistentState(
    'studyPlanSchedule',
    flattenSchedule(state.currentPlan?.schedule || [])
  );
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Keep schedule in sync if subjects or currentPlan change
  useEffect(() => {
    const freshSchedule = flattenSchedule(state.currentPlan?.schedule || []);
    const hasDifferentSubjects =
      state.subjects.some(subj => !schedule.some(item => item.subject === subj.name)) ||
      schedule.some(item => !state.subjects.find(subj => subj.name === item.subject));

    if (hasDifferentSubjects) {
      setSchedule(freshSchedule);
    }
  }, [state.subjects, state.currentPlan]);

  const timeSlots = useMemo(() => {
    const slots = Array.from(new Set(schedule.map(item => item.time)));
    slots.sort();
    return slots;
  }, [schedule]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getScheduleItem = (day, timeSlot) =>
    schedule.find(item => item.day === day && item.time === timeSlot);

  const updateScheduleItem = (day, timeSlot, subject) => {
    let newSchedule = schedule.filter(item => !(item.day === day && item.time === timeSlot));

    if (subject) {
      newSchedule.push({
        day,
        time: timeSlot,
        subject,
        task: '',
        break: '',
        id: Date.now()
      });
    }

    setSchedule(newSchedule);
  };

  const handleSave = () => {
    const nestedSchedule = nestSchedule(schedule);
    const planToSave = {
      ...state.currentPlan,
      schedule: nestedSchedule,
      id: Date.now(),
      name: `Study Plan - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString()
    };
    onSave(planToSave);
    setSchedule(schedule);
  };

  return (
    <div className="w-full md:max-w-6xl mx-auto lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2"
        >
          <FiEdit3 size={16} />
          {isEditing ? 'View Mode' : 'Edit Schedule'}
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-auto mb-6">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[120px_repeat(7,1fr)] border border-gray-200">
            <div className="bg-amber-200 p-3 font-semibold border-b border-r">Time</div>
            {days.map(day => (
              <div
                key={day}
                className="bg-amber-100 p-3 font-semibold border-b border-r text-center"
              >
                {day.slice(0, 3)}
              </div>
            ))}

            {timeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot}>
                <div className="p-3 bg-amber-100 border-b border-r font-mono text-xs">
                  {timeSlot}
                </div>
                {days.map(day => {
                  const item = getScheduleItem(day, timeSlot);
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="p-2 border-b border-r min-h-[60px] hover:bg-gray-50"
                    >
                      {isEditing ? (
                        <select
                          value={item?.subject || ''}
                          onChange={(e) => updateScheduleItem(day, timeSlot, e.target.value)}
                          className="w-full p-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Free</option>
                          {state.subjects.map(subject => (
                            <option key={subject.id} value={subject.name}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                      ) : item ? (
                        <div className="text-xs">
                          <div className="font-semibold text-amber-600 mb-1">{item.subject}</div>
                          <div className="text-gray-700">{item.task}</div>
                          {item.break && (
                            <div className="text-gray-400 text-[10px] italic mt-1">
                              Break: {item.break}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-300 italic text-center">Free</div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Study Plan Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <FiClock className="text-amber-500" />
            Weekly Summary
          </h3>
          <div className="space-y-2 text-gray-700">
            {state.subjects.map(subject => {
              const subjectHours =
                schedule.filter(item => item.subject === subject.name).length * 0.42;
              return (
                <div key={subject.id} className="flex justify-between">
                  <span>{subject.name}</span>
                  <span className="font-medium text-gray-700">{subjectHours.toFixed(2)}h/week</span>
                </div>
              );
            })}
            <div className="border-t pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total Study Time</span>
                <span>
                  {(schedule.length * 0.42).toFixed(2)}h/week
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">AI Recommendations</h3>
          <div className="space-y-2 text-sm">
            {state.currentPlan?.recommendations?.length ? (
              state.currentPlan.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{rec}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">
                No AI recommendations available. Generate with AI for personalized tips.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-600 font-semibold"
        >
          Back to Preferences
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2"
        >
          <FiSave size={20} />
          Save Study Plan
        </button>
      </div>
    </div>
  );
};

export default ScheduleView;

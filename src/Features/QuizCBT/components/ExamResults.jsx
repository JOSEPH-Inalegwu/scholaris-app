import React from 'react';
import { useUser } from '../../../Context/UserContext';

const getRemarkAndMessage = (percentage, studentName = 'Student') => {
  const percent = parseFloat(percentage);

  if (percent >= 70)
    return {
      remark: 'Excellent 🎉',
      message: `Fantastic job, ${studentName}! Keep up the great work — you’re mastering this!`,
    };
  if (percent >= 60)
    return {
      remark: 'Very Good 👍',
      message: `${studentName}, you’re doing very well. A little more effort and you’ll be unstoppable!`,
    };
  if (percent >= 50)
    return {
      remark: 'Good 😊',
      message: `Solid performance, ${studentName}. Now aim for even higher!`,
    };
  if (percent >= 45)
    return {
      remark: 'Fair 🤔',
      message: `${studentName}, you’re almost there. Review your weak spots and try again!`,
    };
  if (percent >= 40)
    return {
      remark: 'Pass 😅',
      message: `You passed, ${studentName} — but you can do even better with more practice!`,
    };
  return {
    remark: 'Fail 💔',
    message: `Don’t give up, ${studentName}. Every failure is a step closer to success. Try again!`,
  };
};

const ExamResults = ({ results }) => {
  const { userName } = useUser(); // 🧠 Get username from context
  const studentName = userName || 'Student';

  const { score, total, answeredCount } = results;
  const unanswered = total - answeredCount;
  const percentage = ((score / total) * 100).toFixed(2);
  const { remark, message } = getRemarkAndMessage(percentage, studentName);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-black">🎓 Exam Results</h1>

        <div className="grid grid-cols-2 gap-4 text-left text-black text-sm sm:text-base mb-6">
          <p><strong>Answered:</strong> {answeredCount}</p>
          <p><strong>Unanswered:</strong> {unanswered}</p>
          <p><strong>Score:</strong> {score}/{total}</p>
          <p><strong>Percentage:</strong> {percentage}%</p>
          <p className="col-span-2"><strong>Remark:</strong> {remark}</p>
        </div>

        <p className="text-gray-700 italic mb-6">{message}</p>

        <button
          onClick={() => {
            localStorage.removeItem('quizCBTState');
            window.location.reload();
          }}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg text-sm transition"
        >
          Restart Exam
        </button>
      </div>
    </div>
  );
};

export default ExamResults;

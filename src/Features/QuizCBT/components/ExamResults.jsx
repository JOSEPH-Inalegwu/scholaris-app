import React, { useEffect, useState } from 'react';
import { useUser } from '../../../Context/UserContext';
import { useExamStats } from '../../../Hooks/useExamStats';
import { askScholarisAI } from '../../../Utils/aiReviewRemarks';

// Fallback in case AI fails or returns invalid JSON
const getFallbackRemark = (percentage, studentName = 'Student') => {
  const percent = parseFloat(percentage);

  if (percent >= 70)
    return { remark: 'Excellent 🎉', message: `Fantastic job, ${studentName}! Keep up the great work — you're mastering this!` };
  if (percent >= 60)
    return { remark: 'Very Good 👍', message: `${studentName}, you're doing very well. A little more effort and you'll be unstoppable!` };
  if (percent >= 50)
    return { remark: 'Good 😊', message: `Solid performance, ${studentName}. Now aim for even higher!` };
  if (percent >= 45)
    return { remark: 'Fair 🤔', message: `${studentName}, you're almost there. Review your weak spots and try again!` };
  if (percent >= 40)
    return { remark: 'Pass 😅', message: `You passed, ${studentName} — but you can do even better with more practice!` };
  return { remark: 'Fail 💔', message: `Don't give up, ${studentName}. Every failure is a step closer to success. Try again!` };
};

const ExamResults = ({ graded = [], handleRestart, onReview }) => {
  const { userName } = useUser();
  const studentName = userName || 'Student';
  const { score, total, answered, unanswered, percentage } = useExamStats(graded);

  const [remark, setRemark] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const progressWidth = Math.min(percentage, 100);

  useEffect(() => {
    const fetchAIReview = async () => {
      setLoading(true);

      const randomSeed = Math.floor(Math.random() * 100000);
      const prompt = `
        A student named ${studentName} just finished an exam.
        Score: ${percentage}% (${score} out of ${total} correct)
        Answered: ${answered} | Unanswered: ${unanswered}.
        Random ID: ${randomSeed}

        Return ONLY a JSON object with:
        "remark": short exam performance label (max 10 words, can include emoji)
        "message": 1–4 sentences. Always vary the phrasing and tone motivating and guiding the student.

        Example:
        {"remark": "Excellent 🎉", "message": "Great work, Alex! Keep practicing to stay on top."}
        No extra text, no explanations, only valid JSON.
      `;

      try {
        const aiResponse = await askScholarisAI(prompt);
        if (!aiResponse) throw new Error('No AI response');

        let aiData;
        try {
          aiData = JSON.parse(aiResponse);
          setRemark(aiData.remark || 'Remark unavailable');
          setMessage(aiData.message || 'Review unavailable.');
        } catch {
          console.warn('AI returned invalid JSON.');
          setRemark('Remark unavailable');
          setMessage('Review unavailable.');
        }
      } catch (error) {
        console.error('Error fetching AI review:', error);
        setRemark('Remark unavailable');
        setMessage('Review unavailable.');
      }

      setLoading(false);
    };

    fetchAIReview();
  }, [studentName, percentage, score, total, answered, unanswered]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-6xl border border-gray-200/50 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="w-full lg:w-1/2 border-r border-gray-300 pr-0 lg:pr-6">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block p-2 sm:p-3 md:p-4 bg-gray-100 rounded-full mb-2 sm:mb-4">
              <div className="text-2xl sm:text-3xl md:text-4xl">🎓</div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-black tracking-tight">
              Exam Results
            </h1>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 bg-black mx-auto rounded-full"></div>
          </div>

          {/* Score Display */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative inline-block">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-2">
                {percentage}
                <span className="text-2xl sm:text-3xl md:text-4xl text-gray-600">%</span>
              </div>
              <div className="absolute -top-2 sm:-top-3 -right-1 sm:-right-4 bg-amber-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                {score}/{total}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-black to-gray-700 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-2">
              {loading ? '...' : remark}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center border border-gray-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">{answered}</div>
              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Answered</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center border border-gray-200">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">{unanswered}</div>
              <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wide">Unanswered</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 border border-gray-200">
            {loading ? (
              <p className="text-gray-500 italic">Generating your personalized review...</p>
            ) : (
              <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                {message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={handleRestart}
              className="group relative bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Restart Exam</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {onReview && (
              <button
                onClick={() => onReview(graded)}
                className="group bg-white hover:bg-gray-50 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold border-2 border-black transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Review Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;

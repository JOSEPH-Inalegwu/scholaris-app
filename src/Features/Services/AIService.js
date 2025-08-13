export class AIService {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    // Set the correct Groq API base URL
    this.baseUrl = baseUrl || 'https://api.groq.com/openai/v1';
    
    console.log('AIService initialized with baseUrl:', this.baseUrl);
  }

  async generateStudyPlan(subjects, goals, preferences) {
    try {
      const prompt = this.buildStudyPlanPrompt(subjects, goals, preferences);
      console.log('Prompt:', prompt);
      
      const url = `${this.baseUrl}/chat/completions`;
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Updated to correct model name
          messages: [
            {
              role: 'system',
              content: 'You are an expert study planner. Create detailed, personalized study schedules. Always respond with valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('AI Response:', data);
      console.log('AI Message Content:', data.choices?.[0]?.message?.content);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid AI response format:', data);
        throw new Error('Invalid AI response format');
      }

      const content = data.choices[0].message.content;
      console.log('Raw AI Content:', content);
      
      return this.parseStudyPlan(content);
     
    } catch (error) {
      console.error('AI Service Error:', error.message);
      // Return a more helpful fallback instead of throwing
      return this.generateFallbackPlan(subjects, goals, preferences);
    }
  }

  buildStudyPlanPrompt(subjects, goals, preferences) {
    return `Create a detailed study plan with the following information:

Subjects: ${subjects.map(s => `${s.name} (${s.difficulty})`).join(', ')}

Goals: ${goals.map(g => `${g.subject}: ${g.target} by ${g.deadline}`).join('; ')}

Preferences:
- Study hours per day: ${preferences.dailyHours}
- Preferred times: ${preferences.preferredTimes.join(', ')}
- Break intervals: ${preferences.breakIntervals}
- Learning style: ${preferences.learningStyle}

Please provide a comprehensive study plan and respond ONLY with valid JSON in this exact structure:
{
  "schedule": [
    {
      "day": "Monday",
      "timeBlocks": [
        {
          "time": "09:00-10:25",
          "subject": "Maths",
          "task": "Algebra review",
          "break": "10:25-10:50"
        }
      ]
    }
  ],
  "dailyTasks": {
    "Monday": ["Complete algebra exercises", "Review physics formulas"],
    "Tuesday": ["Practice calculus problems", "Physics lab preparation"]
  },
  "milestones": [
    {
      "week": 1,
      "date": "2025-08-18",
      "goals": ["Complete chapter 1", "First practice test"],
      "subjects": ["Maths", "Physics"]
    }
  ],
  "recommendations": [
    "Use visual aids for better understanding",
    "Take regular breaks every 25 minutes",
    "Practice problems daily"
  ]
}`;
  }

  parseStudyPlan(aiResponse) {
    try {
      // First try to parse the entire response as JSON
      const cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('{') && cleanResponse.endsWith('}')) {
        return JSON.parse(cleanResponse);
      }
      
      // If that fails, try to extract JSON from the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no valid JSON found, parse as text
      return this.parseTextResponse(aiResponse);
    } catch (error) {
      console.error('Parse error:', error);
      console.log('Raw AI Response:', aiResponse);
      return this.parseTextResponse(aiResponse);
    }
  }

  parseTextResponse(text) {
    // Basic text parsing fallback
    return {
      schedule: [
        {
          day: "Monday",
          timeBlocks: [
            {
              time: "09:00-10:25",
              subject: "Maths",
              task: "Begin study plan",
              break: "10:25-10:50"
            }
          ]
        }
      ],
      dailyTasks: { 
        "Monday": ["Review AI response and adjust plan"],
        "Tuesday": ["Continue with structured study"]
      },
      milestones: [
        { 
          week: 1, 
          date: "2025-08-18",
          goals: ["Establish study routine"],
          subjects: ["Maths", "Physics"]
        }
      ],
      recommendations: [
        "AI parsing encountered issues - manual review recommended",
        "Stay consistent with study schedule",
        "Use visual learning techniques as preferred"
      ]
    };
  }

  generateFallbackPlan(subjects = [], goals = [], preferences = {}) {
    const subjectNames = subjects.map(s => s.name) || ['General Study'];
    const dailyHours = preferences.dailyHours || 4;
    const breakInterval = preferences.breakIntervals || 25;
    
    return {
      schedule: this.generateWeeklySchedule(subjectNames, dailyHours, breakInterval),
      dailyTasks: this.generateDailyTasks(subjectNames),
      milestones: this.generateMilestones(goals),
      recommendations: this.generateRecommendations(preferences)
    };
  }

  generateWeeklySchedule(subjects, dailyHours, breakInterval) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const startHour = 9; // 9 AM start
    
    return days.map(day => ({
      day,
      timeBlocks: this.generateTimeBlocks(subjects, dailyHours, startHour, breakInterval)
    }));
  }

  generateTimeBlocks(subjects, dailyHours, startHour, breakInterval) {
    const blocks = [];
    const studyBlockDuration = breakInterval; // minutes
    const breakDuration = 25; // minutes
    const blocksPerHour = 60 / (studyBlockDuration + breakDuration);
    const totalBlocks = Math.floor(dailyHours * blocksPerHour);
    
    let currentHour = startHour;
    let currentMinute = 0;
    
    for (let i = 0; i < totalBlocks; i++) {
      const subject = subjects[i % subjects.length];
      const startTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      currentMinute += studyBlockDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
      
      const endTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      blocks.push({
        time: `${startTime}-${endTime}`,
        subject: subject,
        task: `Study ${subject}`,
        break: i < totalBlocks - 1 ? `${endTime}-${this.addMinutes(endTime, breakDuration)}` : null
      });
      
      // Add break time
      currentMinute += breakDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return blocks;
  }

  addMinutes(time, minutes) {
    const [hour, minute] = time.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + minutes;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
  }

  generateDailyTasks(subjects) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const tasks = {};
    
    days.forEach(day => {
      tasks[day] = subjects.map(subject => `Study ${subject} - Review and practice`);
    });
    
    return tasks;
  }

  generateMilestones(goals) {
    if (!goals || goals.length === 0) {
      return [
        {
          week: 1,
          date: "2025-08-18",
          goals: ["Establish study routine", "Complete initial assessments"],
          subjects: ["General"]
        },
        {
          week: 2,
          date: "2025-08-25",
          goals: ["Mid-point review", "Practice tests"],
          subjects: ["General"]
        }
      ];
    }

    return goals.map((goal, index) => ({
      week: index + 1,
      date: goal.deadline || "2025-08-20",
      goals: [goal.target || "Complete studies"],
      subjects: [goal.subject || "General"]
    }));
  }

  generateRecommendations(preferences) {
    const recs = [
      "Follow the schedule consistently",
      "Take breaks as scheduled to maintain focus",
      "Review progress weekly and adjust as needed"
    ];

    if (preferences.learningStyle === 'visual') {
      recs.push("Use diagrams, charts, and visual aids", "Create mind maps for complex topics");
    }
    
    if (preferences.preferredTimes && preferences.preferredTimes.includes('morning')) {
      recs.push("Take advantage of morning focus for difficult subjects");
    }

    return recs;
  }
}
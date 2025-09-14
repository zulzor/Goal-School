-- 🏆 Расширенная схема для отслеживания посещаемости и прогресса
-- Выполните этот SQL в Supabase SQL Editor после основных таблиц

-- 1️⃣ Таблица детализации посещаемости
CREATE TABLE attendance_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_registration_id UUID REFERENCES training_registrations(id) ON DELETE CASCADE,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES profiles(id) NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('present', 'absent', 'late', 'excused')),
  arrival_time TIMESTAMP WITH TIME ZONE,
  departure_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  behavior_rating INTEGER CHECK (behavior_rating >= 1 AND behavior_rating <= 5),
  participation_rating INTEGER CHECK (participation_rating >= 1 AND participation_rating <= 5),
  marked_by UUID REFERENCES profiles(id) NOT NULL,
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2️⃣ Таблица навыков и достижений
CREATE TABLE skills_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'physical', 'tactical', 'mental', 'social')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  icon TEXT,
  color TEXT DEFAULT '#3b82f6',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3️⃣ Таблица прогресса учеников
CREATE TABLE student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills_achievements(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 100),
  target_level INTEGER DEFAULT 100 CHECK (target_level >= 0 AND target_level <= 100),
  progress_notes TEXT,
  last_assessment_date DATE,
  assessed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, skill_id)
);

-- 4️⃣ Таблица оценок и отзывов тренера
CREATE TABLE coach_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES profiles(id) NOT NULL,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  technical_skills INTEGER CHECK (technical_skills >= 1 AND technical_skills <= 5),
  physical_fitness INTEGER CHECK (physical_fitness >= 1 AND physical_fitness <= 5),
  teamwork INTEGER CHECK (teamwork >= 1 AND teamwork <= 5),
  attitude INTEGER CHECK (attitude >= 1 AND attitude <= 5),
  improvement_areas TEXT[],
  strengths TEXT[],
  goals_for_next_training TEXT,
  private_notes TEXT, -- Видны только тренеру и администрации
  public_feedback TEXT, -- Видны родителям и ученику
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5️⃣ Таблица целей и планов развития
CREATE TABLE development_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'physical', 'tactical', 'mental', 'social')),
  target_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6️⃣ Таблица статистики посещаемости (агрегированные данные)
CREATE TABLE attendance_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  total_trainings INTEGER DEFAULT 0,
  attended_trainings INTEGER DEFAULT 0,
  missed_trainings INTEGER DEFAULT 0,
  late_arrivals INTEGER DEFAULT 0,
  excused_absences INTEGER DEFAULT 0,
  attendance_percentage DECIMAL(5,2) DEFAULT 0.0,
  avg_behavior_rating DECIMAL(3,2),
  avg_participation_rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, month, year)
);

-- 📊 Создание индексов для оптимизации
CREATE INDEX idx_attendance_details_student_id ON attendance_details(student_id);
CREATE INDEX idx_attendance_details_training_id ON attendance_details(training_id);
CREATE INDEX idx_attendance_details_coach_id ON attendance_details(coach_id);
CREATE INDEX idx_attendance_details_marked_at ON attendance_details(marked_at);

CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_skill_id ON student_progress(skill_id);
CREATE INDEX idx_student_progress_last_assessment ON student_progress(last_assessment_date);

CREATE INDEX idx_coach_feedback_student_id ON coach_feedback(student_id);
CREATE INDEX idx_coach_feedback_training_id ON coach_feedback(training_id);
CREATE INDEX idx_coach_feedback_coach_id ON coach_feedback(coach_id);

CREATE INDEX idx_development_goals_student_id ON development_goals(student_id);
CREATE INDEX idx_development_goals_status ON development_goals(status);
CREATE INDEX idx_development_goals_target_date ON development_goals(target_date);

CREATE INDEX idx_attendance_stats_student_month_year ON attendance_statistics(student_id, year, month);

-- 🔐 Настройка Row Level Security (RLS)
ALTER TABLE attendance_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_statistics ENABLE ROW LEVEL SECURITY;

-- 🛡️ Политики безопасности для attendance_details
CREATE POLICY "Тренеры видят посещаемость своих тренировок" ON attendance_details
  FOR SELECT USING (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'smm_manager')
    ) OR
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'parent' 
      AND id IN (
        SELECT parent_id FROM profiles WHERE id = attendance_details.student_id
      )
    )
  );

CREATE POLICY "Тренеры могут отмечать посещаемость" ON attendance_details
  FOR INSERT WITH CHECK (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager')
    )
  );

CREATE POLICY "Тренеры могут обновлять посещаемость" ON attendance_details
  FOR UPDATE USING (
    coach_id = auth.uid() OR
    marked_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager')
    )
  );

-- 🛡️ Политики для skills_achievements (все могут читать)
CREATE POLICY "Все могут читать навыки и достижения" ON skills_achievements
  FOR SELECT USING (true);

CREATE POLICY "Тренеры и менеджеры могут управлять навыками" ON skills_achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coach', 'manager')
    )
  );

-- 🛡️ Политики для student_progress
CREATE POLICY "Прогресс видят ученики, родители, тренеры, менеджеры" ON student_progress
  FOR SELECT USING (
    student_id = auth.uid() OR
    assessed_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'parent' 
      AND id IN (
        SELECT parent_id FROM profiles WHERE id = student_progress.student_id
      )
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coach', 'manager', 'smm_manager')
    )
  );

CREATE POLICY "Тренеры могут обновлять прогресс" ON student_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coach', 'manager')
    )
  );

-- 🛡️ Политики для coach_feedback
CREATE POLICY "Отзывы видят все заинтересованные стороны" ON coach_feedback
  FOR SELECT USING (
    student_id = auth.uid() OR
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'parent' 
      AND id IN (
        SELECT parent_id FROM profiles WHERE id = coach_feedback.student_id
      )
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'smm_manager')
    )
  );

CREATE POLICY "Тренеры могут создавать отзывы" ON coach_feedback
  FOR INSERT WITH CHECK (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager')
    )
  );

CREATE POLICY "Тренеры могут обновлять свои отзывы" ON coach_feedback
  FOR UPDATE USING (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager')
    )
  );

-- 🛡️ Политики для development_goals
CREATE POLICY "Цели видят все заинтересованные стороны" ON development_goals
  FOR SELECT USING (
    student_id = auth.uid() OR
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'parent' 
      AND id IN (
        SELECT parent_id FROM profiles WHERE id = development_goals.student_id
      )
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'smm_manager')
    )
  );

CREATE POLICY "Тренеры могут управлять целями" ON development_goals
  FOR ALL USING (
    coach_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('manager')
    )
  );

-- 🛡️ Политики для attendance_statistics
CREATE POLICY "Статистику видят все заинтересованные стороны" ON attendance_statistics
  FOR SELECT USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'parent' 
      AND id IN (
        SELECT parent_id FROM profiles WHERE id = attendance_statistics.student_id
      )
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coach', 'manager', 'smm_manager')
    )
  );

-- ⚙️ Функции для автоматического обновления статистики
CREATE OR REPLACE FUNCTION update_attendance_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем статистику при изменении посещаемости
  INSERT INTO attendance_statistics (
    student_id, 
    month, 
    year,
    total_trainings,
    attended_trainings,
    missed_trainings,
    late_arrivals,
    excused_absences,
    attendance_percentage
  )
  SELECT 
    NEW.student_id,
    EXTRACT(MONTH FROM t.date)::INTEGER,
    EXTRACT(YEAR FROM t.date)::INTEGER,
    COUNT(*) as total_trainings,
    COUNT(CASE WHEN ad.attendance_status = 'present' THEN 1 END) as attended_trainings,
    COUNT(CASE WHEN ad.attendance_status = 'absent' THEN 1 END) as missed_trainings,
    COUNT(CASE WHEN ad.attendance_status = 'late' THEN 1 END) as late_arrivals,
    COUNT(CASE WHEN ad.attendance_status = 'excused' THEN 1 END) as excused_absences,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(CASE WHEN ad.attendance_status IN ('present', 'late') THEN 1 END) * 100.0 / COUNT(*))
      ELSE 0 
    END as attendance_percentage
  FROM trainings t
  LEFT JOIN attendance_details ad ON t.id = ad.training_id AND ad.student_id = NEW.student_id
  WHERE t.date >= DATE_TRUNC('month', (SELECT date FROM trainings WHERE id = NEW.training_id))
    AND t.date < DATE_TRUNC('month', (SELECT date FROM trainings WHERE id = NEW.training_id)) + INTERVAL '1 month'
  GROUP BY 
    NEW.student_id,
    EXTRACT(MONTH FROM t.date),
    EXTRACT(YEAR FROM t.date)
  ON CONFLICT (student_id, month, year)
  DO UPDATE SET
    total_trainings = EXCLUDED.total_trainings,
    attended_trainings = EXCLUDED.attended_trainings,
    missed_trainings = EXCLUDED.missed_trainings,
    late_arrivals = EXCLUDED.late_arrivals,
    excused_absences = EXCLUDED.excused_absences,
    attendance_percentage = EXCLUDED.attendance_percentage,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 📍 Триггер для автоматического обновления статистики посещаемости
CREATE OR REPLACE TRIGGER attendance_statistics_trigger
  AFTER INSERT OR UPDATE ON attendance_details
  FOR EACH ROW EXECUTE FUNCTION update_attendance_statistics();

-- 🔄 Функция для обновления timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 📍 Триггеры для обновления updated_at
CREATE TRIGGER attendance_details_updated_at BEFORE UPDATE ON attendance_details FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER coach_feedback_updated_at BEFORE UPDATE ON coach_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER development_goals_updated_at BEFORE UPDATE ON development_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER attendance_statistics_updated_at BEFORE UPDATE ON attendance_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
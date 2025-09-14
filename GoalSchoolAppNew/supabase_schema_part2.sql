-- 🔒 Настройка Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_recommendations ENABLE ROW LEVEL SECURITY;

-- 👤 Политики безопасности для профилей
CREATE POLICY "Пользователи могут читать все профили" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 🏃‍♂️ Политики для тренировок
CREATE POLICY "Все могут просматривать тренировки" ON trainings
  FOR SELECT USING (true);

CREATE POLICY "Тренеры и менеджеры могут создавать тренировки" ON trainings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coach', 'manager')
    )
  );

CREATE POLICY "Тренеры могут обновлять свои тренировки" ON trainings
  FOR UPDATE USING (
    coach_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'manager'
    )
  );

-- 📝 Политики для регистраций на тренировки  
CREATE POLICY "Все могут просматривать регистрации" ON training_registrations
  FOR SELECT USING (true);

CREATE POLICY "Пользователи могут регистрироваться на тренировки" ON training_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Пользователи могут отменять свои регистрации" ON training_registrations
  FOR DELETE USING (user_id = auth.uid());

-- 📰 Политики для новостей
CREATE POLICY "Все могут читать новости" ON news
  FOR SELECT USING (true);

CREATE POLICY "SMM и менеджеры могут создавать новости" ON news
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('smm_manager', 'manager')
    )
  );

CREATE POLICY "Авторы могут обновлять свои новости" ON news
  FOR UPDATE USING (
    author_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'manager'
    )
  );

-- 🍎 Политики для рекомендаций по питанию
CREATE POLICY "Все могут читать рекомендации по питанию" ON nutrition_recommendations
  FOR SELECT USING (true);

CREATE POLICY "Тренеры и менеджеры могут создавать рекомендации" ON nutrition_recommendations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coach', 'manager')
    )
  );
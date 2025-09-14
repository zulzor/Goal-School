-- Создание таблиц для приложения футбольной школы
-- Запустите эти команды в Supabase SQL Editor

-- 1. Таблица профилей пользователей
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('child', 'parent', 'coach', 'manager', 'smm_manager')),
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  parent_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Таблица тренировок
CREATE TABLE IF NOT EXISTS trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  coach_id UUID REFERENCES profiles(id) NOT NULL,
  max_participants INTEGER DEFAULT 20,
  age_group TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('training', 'match', 'tournament')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Таблица регистраций на тренировки
CREATE TABLE IF NOT EXISTS training_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'missed', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(training_id, user_id)
);

-- 4. Таблица новостей
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Таблица рекомендаций по питанию
CREATE TABLE IF NOT EXISTS nutrition_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'hydration')),
  age_group TEXT NOT NULL,
  tips TEXT[] NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_trainings_date ON trainings(date);
CREATE INDEX IF NOT EXISTS idx_trainings_coach_id ON trainings(coach_id);
CREATE INDEX IF NOT EXISTS idx_training_registrations_user_id ON training_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_training_registrations_training_id ON training_registrations(training_id);
CREATE INDEX IF NOT EXISTS idx_news_author_id ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_nutrition_category ON nutrition_recommendations(category);
CREATE INDEX IF NOT EXISTS idx_nutrition_age_group ON nutrition_recommendations(age_group);

-- Настройка Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_recommendations ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для профилей
CREATE POLICY "Пользователи могут просматривать свой профиль" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свой профиль" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Публичное чтение базовой информации профилей" ON profiles
  FOR SELECT USING (true);

-- Политики для тренировок
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

-- Политики для регистраций на тренировки
CREATE POLICY "Пользователи могут просматривать свои регистрации" ON training_registrations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Пользователи могут регистрироваться на тренировки" ON training_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Пользователи могут отменять свои регистрации" ON training_registrations
  FOR DELETE USING (user_id = auth.uid());

-- Политики для новостей
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

-- Политики для рекомендаций по питанию
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

CREATE POLICY "Авторы могут обновлять свои рекомендации" ON nutrition_recommendations
  FOR UPDATE USING (
    author_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'manager'
    )
  );

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'parent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для обновления updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at BEFORE UPDATE ON trainings
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_nutrition_updated_at BEFORE UPDATE ON nutrition_recommendations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
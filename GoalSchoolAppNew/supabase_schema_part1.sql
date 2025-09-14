-- 🏗️ Создание схемы базы данных для приложения футбольной школы
-- Выполните этот SQL в Supabase SQL Editor

-- 1️⃣ Создание таблицы профилей пользователей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
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

-- 2️⃣ Создание таблицы тренировок
CREATE TABLE trainings (
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

-- 3️⃣ Создание таблицы регистраций на тренировки
CREATE TABLE training_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'missed', 'cancelled')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(training_id, user_id)
);

-- 4️⃣ Создание таблицы новостей
CREATE TABLE news (
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

-- 5️⃣ Создание таблицы рекомендаций по питанию
CREATE TABLE nutrition_recommendations (
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

-- 📊 Создание индексов для оптимизации
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_parent_id ON profiles(parent_id);
CREATE INDEX idx_trainings_date ON trainings(date);
CREATE INDEX idx_trainings_coach_id ON trainings(coach_id);
CREATE INDEX idx_training_registrations_user_id ON training_registrations(user_id);
CREATE INDEX idx_training_registrations_training_id ON training_registrations(training_id);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_published_at ON news(published_at);
CREATE INDEX idx_news_tags ON news USING GIN(tags);
CREATE INDEX idx_nutrition_category ON nutrition_recommendations(category);
CREATE INDEX idx_nutrition_age_group ON nutrition_recommendations(age_group);
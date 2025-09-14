-- Таблица для хранения дисциплин
CREATE TABLE disciplines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL, -- 'time', 'distance', 'points', etc.
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для хранения результатов по дисциплинам
CREATE TABLE discipline_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    discipline_id UUID REFERENCES disciplines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    result_value NUMERIC NOT NULL, -- в миллисекундах для времени, в см для дистанции и т.д.
    age_group VARCHAR(50), -- возрастная группа
    standard_result NUMERIC, -- стандартный результат для сравнения
    coach_id UUID REFERENCES profiles(id),
    date_recorded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT false, -- для исключения из топа
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для удаленных пользователей (soft delete)
CREATE TABLE deleted_users (
    id UUID PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(50),
    deleted_by UUID REFERENCES profiles(id),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deletion_reason TEXT,
    original_data JSONB -- сохраняем все оригинальные данные
);

-- Индексы для оптимизации
CREATE INDEX idx_discipline_results_user_id ON discipline_results(user_id);
CREATE INDEX idx_discipline_results_discipline_id ON discipline_results(discipline_id);
CREATE INDEX idx_discipline_results_date ON discipline_results(date_recorded);
CREATE INDEX idx_discipline_results_archived ON discipline_results(is_archived);
CREATE INDEX idx_deleted_users_role ON deleted_users(role);

-- RLS Policies для дисциплин
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_users ENABLE ROW LEVEL SECURITY;

-- Политики для дисциплин (доступ для тренеров и управляющих)
CREATE POLICY "Тренеры и управляющие могут просматривать дисциплины" ON disciplines
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('coach', 'manager')
        )
    );

CREATE POLICY "Тренеры и управляющие могут создавать дисциплины" ON disciplines
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('coach', 'manager')
        )
    );

CREATE POLICY "Тренеры и управляющие могут обновлять дисциплины" ON disciplines
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('coach', 'manager')
        )
    );

-- Политики для результатов дисциплин
CREATE POLICY "Тренеры могут просматривать результаты своих учеников" ON discipline_results
    FOR SELECT USING (
        coach_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'manager'
        )
    );

CREATE POLICY "Тренеры могут добавлять результаты" ON discipline_results
    FOR INSERT WITH CHECK (
        coach_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'manager'
        )
    );

CREATE POLICY "Тренеры могут обновлять результаты" ON discipline_results
    FOR UPDATE USING (
        coach_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'manager'
        )
    );

-- Политики для удаленных пользователей
CREATE POLICY "Только управляющие могут просматривать удаленных пользователей" ON deleted_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'manager'
        )
    );

CREATE POLICY "Только управляющие могут добавлять удаленных пользователей" ON deleted_users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'manager'
        )
    );
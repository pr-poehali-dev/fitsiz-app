-- Create profiles table
CREATE TABLE IF NOT EXISTS t_p69251962_fitsiz_app.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tg_id BIGINT UNIQUE NOT NULL,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_history table
CREATE TABLE IF NOT EXISTS t_p69251962_fitsiz_app.ai_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES t_p69251962_fitsiz_app.profiles(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_tg_id ON t_p69251962_fitsiz_app.profiles(tg_id);
CREATE INDEX IF NOT EXISTS idx_ai_history_user_id ON t_p69251962_fitsiz_app.ai_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_history_created_at ON t_p69251962_fitsiz_app.ai_history(created_at DESC);
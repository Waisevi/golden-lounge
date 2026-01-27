-- 1. Таблица событий (Афиша)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    description TEXT,
    image TEXT,
    category TEXT DEFAULT 'Event',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Таблицы меню
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    menu_type TEXT NOT NULL DEFAULT 'food', -- 'food' or 'bar'
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    image TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Таблица лидов (Заявки с форм)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_type TEXT NOT NULL, -- 'vip', 'reserve', 'consultation'
    email TEXT,
    phone TEXT,
    name TEXT,
    message TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Таблица галереи
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа (публичное чтение для всего, кроме лидов)
CREATE POLICY "Allow public read for events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read for menu_categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read for menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read for gallery" ON public.gallery FOR SELECT USING (true);

-- Политика для лидов: только вставка разрешена публично
CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read for leads" ON public.leads FOR SELECT TO authenticated USING (true);

-- 5. Начальное заполнение данными (Пример)

-- Категории меню
INSERT INTO public.menu_categories (name, menu_type, "order") VALUES 
('Small Plates', 'food', 1),
('Sushi & Sashimi', 'food', 2),
('Maki Rolls', 'food', 3),
('Signature Buns & Dim Sum', 'food', 4),
('Main Dishes', 'food', 5),
('Mixology', 'bar', 6);

-- Пример событий
INSERT INTO public.events (title, date, time, description, image, category) VALUES 
('Friday Night Vibes', 'Every Friday', '10 PM - 3 AM', 'Live DJ sets featuring the best in house and deep house music.', 'images/events/friday-vibes.png', 'Exclusive Night'),
('Latin Heat Saturdays', 'Every Saturday', '9 PM - 2 AM', 'Feel the rhythm with our signature Latin night. Salsa and reggaeton.', 'images/events/latin-heat.png', 'Exclusive Night'),
('Sunset Sessions', 'Sundays', '6 PM - 11 PM', 'Chill rooftop vibes with acoustic sets and craft cocktails.', 'images/events/sunset-sessions.png', 'Exclusive Night');

-- Пример галереи (8 фото)
INSERT INTO public.gallery (image_url, alt_text, "order") VALUES 
('images/gallery/1.jpg', 'Lounge Gallery 1', 1),
('images/gallery/2.jpg', 'Lounge Gallery 2', 2),
('images/gallery/3.jpg', 'Lounge Gallery 3', 3),
('images/gallery/4.jpg', 'Lounge Gallery 4', 4),
('images/gallery/5.jpg', 'Lounge Gallery 5', 5),
('images/gallery/6.jpg', 'Lounge Gallery 6', 6),
('images/gallery/7.jpg', 'Lounge Gallery 7', 7),
('images/gallery/8.jpg', 'Lounge Gallery 8', 8);

# Загрузка VIP изображения в Supabase

## Шаги для загрузки:

1. Убедитесь, что файл `.env.local` существует в корне проекта и содержит:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Запустите скрипт загрузки:
   ```bash
   node scripts/upload-vip-image.mjs
   ```

3. Скрипт загрузит файл `public/images/gallery/vip.webp` в Supabase Storage по пути `images/gallery/vip.webp` и заменит старое изображение (если оно существует).

## Что уже сделано:

- ✅ Изображение сжато до 3.44MB в формате WebP
- ✅ Компонент `vip-room-section.tsx` обновлен для использования Supabase URL
- ✅ Скрипт загрузки готов к использованию

После загрузки изображение будет автоматически использоваться из Supabase Storage.

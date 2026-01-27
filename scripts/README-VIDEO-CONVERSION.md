# Конвертация видео в GIF/WebP

## Установка FFmpeg

Для конвертации видео в GIF или анимированный WebP нужен FFmpeg.

### macOS (через Homebrew):
```bash
brew install ffmpeg
```

Если возникают проблемы с правами:
```bash
sudo chown -R $(whoami) /opt/homebrew/Cellar
brew install ffmpeg
```

### Альтернативные способы:
- Скачать с официального сайта: https://ffmpeg.org/download.html
- Использовать MacPorts: `sudo port install ffmpeg`

## Использование скриптов

### Конвертация в GIF:
```bash
node scripts/convert-video-to-gif.mjs
```

### Конвертация в анимированный WebP (рекомендуется):
```bash
node scripts/convert-video-to-webp-animated.mjs
```

## Рекомендации

**Анимированный WebP лучше чем GIF:**
- Меньший размер файла (до 50-70% меньше)
- Лучшее качество
- Поддержка прозрачности
- Поддержка всеми современными браузерами

**Для hero видео:**
- Лучше оставить MP4, но оптимизировать (уменьшить разрешение, битрейт)
- Или использовать статичное изображение с CSS анимацией

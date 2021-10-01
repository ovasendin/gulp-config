# gulp-config

#### Gulp конфигурация для HTML верстки

- Препроцессор SASS/SCSS
- Автопрефиксер + минимизация CSS
- Настраиваемое сжатие изображений
- Конкатенация файлов scss, css, js
- Подключение jQuery
- Возможность добавления компонентов
- Создание SVG спрайта

#### Команды:

- `npm i` - установка пакетов
- `gulp` - запуск проекта (development; browser-sync, watching)
- `gulp build` - сборка проекта в папку `dist`

#### Добавление компонентов (js карусель, слайдер и пр)

- CSS компонента -> в папку `css/components`
- JS копонента -> в папку `js/components`
- Инициализацию провести в main.js

Файлы CSS сжимаются и собираются в `components.min.css`, файлы JS собираются в `main.min.js`

#### Использование SVG спрайта

Файлы `.svg` из папки `images/svg` сжимаются и собираются в `sprite.svg`, каждое изображение упаковывается в `<symbol>` с идентификатором из имени файла. На HTML странице нужный фрагмент спрайта встраивается с помощью команды `<use>`:

```html
<svg role="img" title="SVG">
  <use xlink:href="images/sprite.svg#symbol"></use>
</svg>
```

Быстрый вызов сниппета: `!svg`

#### Использование HTML шаблонов

Можно встраивать HTML шаблоны, за это отвечает скрипт `includeHTML.js`.
Шаблоны пока не участвуют в сборке `build`.

```html
<include template="./_template.html"></include>
```

Быстрый вызов сниппета: `!template`

#### Примечание

Используется шаблон `index.html` для CMS MODX.  
Обратите внимание на meta-теги `title`, `description`, `base`, `charset` - замените их на свои собственные.
